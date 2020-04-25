import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface allTransactions {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<allTransactions> {
    const income = (await this.find()).reduce((total, elemento) => {
      if (elemento.type === 'income') {
        return (total += elemento.value);
      }
      return total;
    }, 0);

    const outcome = (await this.find()).reduce((total, elemento) => {
      if (elemento.type === 'outcome') {
        return (total += elemento.value);
      }
      return total;
    }, 0);

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    const transactions = await this.find();

    const allTransactions = {
      transactions,
      balance,
    };

    return allTransactions;
  }
}

export default TransactionsRepository;
