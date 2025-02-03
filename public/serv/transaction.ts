import ApiService from "@/services/api";
import { IApiTransactionsWrapper, ITransaction, ITransactionSearchParams } from "../interfaces";
import { paginationLimit } from "@/constants";
import steem from "steem";
import axios from "axios";
class TransactionService {
  public async latest(limit: number = paginationLimit): Promise<ITransaction[]> {
    const response = await steem.api.getDynamicGlobalPropertiesAsync();
    const block = await steem.api.getBlockAsync(response.head_block_number);
    return block.transactions;
  }
  
  public async latestIrreversible(limit: number = paginationLimit): Promise<ITransaction[]> {
    const response = await steem.api.getDynamicGlobalPropertiesAsync();
    const block = await steem.api.getBlockAsync(response.last_irreversible_block_num);
    return block.transactions;
  }

  public async latestTransactions(limit: number = paginationLimit): Promise<ITransaction[]> {
    const response = await steem.api.getDynamicGlobalPropertiesAsync();
    let blocktransactions = []
    let block;
       block = await steem.api.getBlockAsync(response.head_block_number);
       blocktransactions = blocktransactions.concat(block.transactions)
       block = await steem.api.getBlockAsync(response.head_block_number-1);
       blocktransactions = blocktransactions.concat(block.transactions)
       block = await steem.api.getBlockAsync(response.head_block_number-2);
       blocktransactions = blocktransactions.concat(block.transactions)
    return blocktransactions;
  }

  public async find(id: string): Promise<ITransaction> {
    const result = await axios("https://sds.steemworld.org/transactions_api/getTransactionById/" + id);
    const response = await steem.api.getBlockAsync(result.data.result.block_num);
    response.transactions[response.transaction_ids.indexOf(id)].blockNum = result.data.block;
    return response.transactions[response.transaction_ids.indexOf(id)];
  }

  public async filterByType(
    page: number,
    type: number,
    typeGroup?: number,
    limit: number = paginationLimit,
  ): Promise<IApiTransactionsWrapper> {
    const params: any = {
      orderBy: "timestamp:desc",
      page,
      limit,
    };

    if (type !== -1) {
      params.type = type;
    }

    if (typeGroup) {
      params.typeGroup = typeGroup;
    }

    const response = (await ApiService.get("transactions", {
      params,
    })) as IApiTransactionsWrapper;

    return response;
  }

  public async search(
    body: ITransactionSearchParams,
    page = 1,
    limit: number = paginationLimit,
  ): Promise<IApiTransactionsWrapper> {
    const result = await axios("https://api.steemscan.com/" + body);
    const response = await steem.api.getBlockAsync(result.data.block);
    response.transactions[response.transaction_ids.indexOf(body)].blockNum = result.data.block;
    return response.transactions[response.transaction_ids.indexOf(body)];
  }

  public async allByAddress(name: string, page = 1, limit = paginationLimit): Promise<IApiTransactionsWrapper> {
    const response = (await steem.api.getAccountHistoryAsync(name, -1, 100)) as IApiTransactionsWrapper;
    return response;
  }

  public async sentByAddress(
    name: string,
    page = 1,
    limit: number = paginationLimit,
  ): Promise<IApiTransactionsWrapper> {
    const response = (await steem.api.getAccountHistoryAsync(name, -1, 20)) as IApiTransactionsWrapper;
    return response;
  }

  public async receivedByAddress(
    name: string,
    page = 1,
    limit: number = paginationLimit,
  ): Promise<IApiTransactionsWrapper> {
    const response = (await steem.api.getAccountHistoryAsync(name, -1, 20)) as IApiTransactionsWrapper;
    return response;
  }

  public async sentByAddressCount(senderId: string): Promise<number> {
    const response = (await steem.api.getAccountHistoryAsync(senderId, -1, 100)) as IApiTransactionsWrapper;
    return response.length;
  }

  public async receivedByAddressCount(recipientId: string): Promise<number> {
    const response = (await steem.api.getAccountHistoryAsync(recipientId, -1, 100)) as IApiTransactionsWrapper;
    return response.length;
  }
}

export default new TransactionService();
