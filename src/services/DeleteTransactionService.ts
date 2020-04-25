// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(transaction_id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    await transactionsRepository.delete(transaction_id);

    throw new AppError('', 204);
  }
}

export default DeleteTransactionService;
