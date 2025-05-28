import * as amqp from 'amqplib';
import type { Connection, Channel } from 'amqplib';

export class RabbitMQ {
  private static connection: Connection | null = null;
  private static channel: Channel | null = null;

  public static readonly QUEUE_NAME = 'payment_processing';
  public static readonly RETRY_QUEUE_NAME = 'payment_retry';

  public static async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect('amqp://localhost');

      if (!this.connection) {
        throw new Error('Failed to establish RabbitMQ connection');
      }
      this.channel = await this.connection.createChannel();

      await this.channel!.assertQueue(this.QUEUE_NAME, { durable: true });

      await this.channel!.assertQueue(this.RETRY_QUEUE_NAME, {
        durable: true,
        deadLetterExchange: '',
        deadLetterRoutingKey: this.QUEUE_NAME,
      });

      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      process.exit(1);
    }
  }

  public static getChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    return this.channel;
  }

  public static async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}
