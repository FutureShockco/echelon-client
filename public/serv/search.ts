import { BlockService, WitnessService, AccountService, TransactionService } from "@/services";
import { IBlock, ITransaction, IWitness, IAccount } from "../interfaces";

class SearchService {
  public async walletByAddress(address: string): Promise<IAccount> {
    return AccountService.find(address);
  }

  public async delegateByQuery(query: string): Promise<IWitness> {
    return WitnessService.find(query);
  }

  public async blockByQuery(id: string): Promise<IBlock> {
    return BlockService.find(id);
  }

  public async transactionById(id: string): Promise<ITransaction> {
    return TransactionService.find(id);
  }
}

export default new SearchService();
