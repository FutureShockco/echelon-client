//import ApiService from "@/services/api";
import { paginationLimit } from "@/constants";
import client from "@/helpers/client";
import type { AccountMetadata, RewardData } from "@/interfaces";
import { PrivateKey, type Account, type ExtendedAccount } from "dsteem";
import ApiService from "@/services/api";

class AccountService {
  public async find(username: string) {
    return new Promise<ExtendedAccount>(async (resolve, reject) => {
      const [account] = await client.database.getAccounts([username]);
      let parsedMetadata: AccountMetadata = {};
      if (typeof account.json_metadata === 'string') {
        try {
          parsedMetadata = JSON.parse(account.json_metadata) as AccountMetadata;
        } catch (error) {
          console.error('Error parsing json_metadata:', error);
          reject(error)
        }
      }
      const userAccount: ExtendedAccount = {
        ...account,
        json_metadata: parsedMetadata,
      } as ExtendedAccount;

      resolve(userAccount);
    });
  }

  public async isPostingKeyValid(username: string, privateKeyStr: string): Promise<boolean> {
    try {
      const [account] = await client.database.getAccounts([username]);
      if (!account) {
        console.error('Account not found');
        return false;
      }
      const publicPostingKeyFromAccount = account.posting.key_auths[0][0];
      const privateKey = PrivateKey.fromString(privateKeyStr);
      const publicKeyFromPrivateKey = privateKey.createPublic().toString();
      return publicKeyFromPrivateKey === publicPostingKeyFromAccount;
    } catch (error) {
      console.error('Error validating posting key:', error);
      return false;
    }
  }

  public async findMany(addresses: string[]) {
    const allaccounts: Account[] = [];
    const response = await client.database.getAccounts(addresses) as unknown as Account[];
    response.forEach((element: Account) => {
      try {
        element.json_metadata = JSON.parse(element.json_metadata);
      } catch (error) { }
      if (
        element.json_metadata
      )
        allaccounts.push(element);
    });
    return allaccounts;
  }

  public async getRewards(username: string) {
    return new Promise<RewardData[]>(async (resolve) => {
      const data: RewardData[] = []
      const end = new Date().getTime()
      const lastWeek = Math.floor(new Date(end - 7 * 24 * 60 * 60 * 1000).getTime() / 1000)
      const lastMonth = Math.floor(new Date(end - 30 * 24 * 60 * 60 * 1000).getTime() / 1000)
      const allTime = await ApiService.getFromSDS(`rewards_api/getAllRewardsSums/${username}/1-${end}`);
      const monthly = await ApiService.getFromSDS(`rewards_api/getAllRewardsSums/${username}/${lastMonth}-${end}`);
      const weekly = await ApiService.getFromSDS(`rewards_api/getAllRewardsSums/${username}/${lastWeek}-${end}`);
      data.push(allTime.result as RewardData)
      data.push(monthly.result as RewardData)
      data.push(weekly.result as RewardData)
      resolve(data);
    })
  }
}

export default new AccountService();
