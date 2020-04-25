// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface allTransactions {
  transactions: Transaction[];
  balance: Balance;
}

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

interface postTransaction {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
  created_at: Date;
  updated_at: Date;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<postTransaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoriesRepository = getRepository(Category);

    const {
      balance,
    }: allTransactions = await transactionsRepository.getBalance();

    const findCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Saldo insuficiente para realizar esta operação');
    }

    if (!findCategory) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);
    }

    const definitiveCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: definitiveCategory,
    });

    await transactionsRepository.save(transaction);

    const postTransaction = {
      id: transaction.id,
      title: transaction.title,
      value: transaction.value,
      type: transaction.type,
      category: transaction.category.title,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
    };

    return postTransaction;
  }
}

export default CreateTransactionService;
