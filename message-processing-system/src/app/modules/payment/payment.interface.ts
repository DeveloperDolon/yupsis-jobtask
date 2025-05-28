export interface IPayment extends Document {
  trxId: number;
  amount: number;
  status: 'pending' | 'success' | 'rejected';
  attemptCount: number;
  nextAttemptAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
