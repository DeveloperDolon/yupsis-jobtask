import amqp from 'amqplib';
import { RabbitMQ } from '../../config/rabbitMq';
import { IPayment } from './payment.interface';
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
  let acknowledged = false;

  try {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      console.log(`Payment ${paymentId} not found`);
      channel.ack(msg);
      acknowledged = true;
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
          {
            expiration: delay.toString(),
            persistent: true,
          },
        );
      }

      console.log(
        `Payment ${payment.trxId} rejected. Next attempt in ${delay / 1000} seconds`,
      );
    }

    // ✅ Always ack at the end of try block
    channel.ack(msg);
    acknowledged = true;
  } catch (error) {
    console.error('Error processing payment:', error);
    if (!acknowledged) {
      try {
        channel.nack(msg);
      } catch (nackError) {
        console.error('Failed to nack message:', nackError);
      }
    }
  }
}


export async function start(): Promise<void> {
  await RabbitMQ.connect();
  const channel = RabbitMQ.getChannel();
  channel.prefetch(1);

  channel.consume(RabbitMQ.QUEUE_NAME, processPaymentMessage, { noAck: false });

  console.log('Payment processor started and waiting for messages...');
}
