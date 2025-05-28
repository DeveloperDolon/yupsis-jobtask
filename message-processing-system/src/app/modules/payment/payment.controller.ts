import { Model, model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>({
  trxId: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'success', 'rejected'],
    default: 'pending',
  },
  attemptCount: { type: Number, default: 0 },
  nextAttemptAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Payment: Model<IPayment> = model<IPayment>(
  'Payment',
  paymentSchema,
);
