import { RabbitMQ } from '../config/rabbitMq';
import { Payment } from '../modules/payment/payment.model';

export async function initialize(): Promise<void> {
  await RabbitMQ.connect();

  function generateRandomTransaction(): { trxId: number; amount: number } {
    const trxId = Math.floor(Math.random() * 1000);
    const amount = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;
    return { trxId, amount };
  }

  setInterval(async () => {
    try {
      const trx = generateRandomTransaction();
      const payment = new Payment(trx);
      await payment.save();

      const channel = RabbitMQ.getChannel();
      channel.sendToQueue(
        RabbitMQ.QUEUE_NAME,
        Buffer.from(payment._id.toString()),
      );

      console.log('New transaction added:', trx);
    } catch (error) {
      console.error('Error generating transaction:', error);
    }
  }, 1000);
}
