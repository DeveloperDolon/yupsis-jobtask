import { RabbitMQ } from '../../config/rabbitMq';
import catchAsync from '../../utiils/catchAsync';
import sendResponse from '../../utiils/sendResponse';
import { Payment } from './payment.model';

const addPayment = catchAsync(async (req, res) => {
  try {
    const { trxId, amount } = req.body;
    const payment = new Payment({ trxId, amount });
    await payment.save();

    const channel = RabbitMQ.getChannel();
    channel.sendToQueue(
      RabbitMQ.QUEUE_NAME,
      Buffer.from(payment._id.toString()),
    );

    return sendResponse(res, {
      success: true,
      message: 'Payment added successful!',
      statusCode: 201,
      data: payment,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: 400,
      data: {},
    });
  }
});

export const PaymentController = { addPayment };
