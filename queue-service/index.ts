import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import { connect } from 'amqplib';
import { createConsumer } from './consumer';
import { setServiceName, logger } from '@common/utils/logger';
import dotenv from 'dotenv'



// Load env variables
dotenv.config({ path: '../.env' });

setServiceName('queue-service');

const app = express();
app.use(json());
const PORT = process.env.QUEUE_SERVICE_PORT || 3006;

// 1️⃣ Init MongoDB connection
const initMongo = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  // You can also use your shared getDbConnection util here
  return mongoose.createConnection(uri, {
    // @ts-ignore (if you need these options)
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

// 2️⃣ Init RabbitMQ (only returns the channel now)
const initRabbitMQ = async () => {
  const connection = await connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672');
  const channel = await connection.createChannel();
  await channel.assertQueue('transaction_queue', { durable: true });
  logger.info('RabbitMQ connection established');
  return channel;
};

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'Queue service is running' });
});

app.listen(PORT, async () => {
  logger.info(`Queue service running on port ${PORT}`);

  // initialize both MQ and Mongo
  const [channel, mongoConn] = await Promise.all([
    initRabbitMQ(),
    initMongo()
  ]);

  // 3️⃣ Pass both to your consumer
  createConsumer(channel, mongoConn);
});
