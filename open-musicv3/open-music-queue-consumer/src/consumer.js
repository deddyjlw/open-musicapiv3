require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsongsService = require('./PlaylistsongsService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const init = async () => {
  const playlistsongsService = new PlaylistsongsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsongsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:songs', {
    durable: true,
  });

  channel.consume('export:songs', listener.listen, { noAck: true });
};

init();
