import amqp from 'amqplib';
import { RabbitMQ } from "../../config/rabbitMq";
import { IPayment } from "./payment.interface";
import { Payment } from './payment.model';

export function netfeeCustomerRecharge(payment: IPayment): void {
  console.log(
    `Processing successful payment: ${payment.trxId}, Amount: ${payment.amount}`,
  );
}

export function getRetryDelay(attemptCount: number): number {
  const delays: Record<number, number> = {
    1: 2 * 60 * 1000,
    2: 5 * 60 * 1000,
    3: 10 * 60 * 1000,
    4: 20 * 60 * 1000,
    5: 30 * 60 * 1000,
  };

  return delays[attemptCount] || 60 * 60 * 1000; 
}

export async function processPaymentMessage(
  msg: amqp.ConsumeMessage | null,
): Promise<void> {
  if (!msg) return;

  const channel = RabbitMQ.getChannel();
  const paymentId = msg.content.toString();

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      console.log(`Payment ${paymentId} not found`);
      channel.ack(msg);
      return;
    }

    console.log(
      `Processing payment ID: ${payment.trxId}, Attempt: ${payment.attemptCount + 1}`,
    );

    const randomNum = Math.floor(Math.random() * 1000);

    if (payment.trxId === randomNum) {
      payment.status = 'success';
      payment.updatedAt = new Date();
      await payment.save();

      netfeeCustomerRecharge(payment);
      console.log(`Payment ${payment.trxId} processed successfully!`);
      channel.ack(msg);
    } else {
      payment.attemptCount += 1;
      payment.status = 'rejected';

      const delay = getRetryDelay(payment.attemptCount);
      payment.nextAttemptAt = new Date(Date.now() + delay);
      payment.updatedAt = new Date();

      await payment.save();

      
      if (delay > 0) {
        channel.sendToQueue(
          RabbitMQ.RETRY_QUEUE_NAME,
          Buffer.from(payment._id.toString()),
          { expiration: delay.toString() },
        );
      }

      console.log(
        `Payment ${payment.trxId} rejected. Next attempt in ${delay / 1000} seconds`,
      );
      channel.ack(msg);
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    channel.nack(msg); 
  }
}


export async function start(): Promise<void> {
  await RabbitMQ.connect();
  const channel = RabbitMQ.getChannel();

  
  channel.consume(RabbitMQ.QUEUE_NAME, processPaymentMessage, { noAck: false });

  console.log('Payment processor started and waiting for messages...');
}
