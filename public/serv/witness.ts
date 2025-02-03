import { ApiService, AccountService, RoundService } from "@/services";
import { roundFromHeight } from "@/utils";
import store from "@/store";
import { IApiDelegateWrapper, IApiDelegatesWrapper, IApiWalletsWrapper, IWitness } from "../interfaces";
import { apiLimit, paginationLimit } from "@/constants";
import steem from "steem";

function readableSteemPower(account: any, precision: number) {
  if (account && (account.vesting_shares || account.delegated || account.received_vesting_shares)) {
    let SP = 0;
    SP = SP + Number(vestToSteemPower(account.vesting_shares.split(" ")[0]));
    account.proxied_vsf_votes.forEach((element) => {
      if (Number(element) > 0) SP = SP + Number(vestToSteemPower(Number(element)) / 1000000);
    });
    return Number(parseFloat(SP.toString()).toFixed(precision));
  }
}

function vestToSteemPower(vest: number) {
  if (
    store.state["network"] &&
    store.state["network"].properties &&
    store.state["network"].properties.total_vesting_fund_steem &&
    vest
  ) {
    const globals = store.state["network"].properties;
    const totalSteem = parseFloat(globals.total_vesting_fund_steem.split(" ")[0]);
    const totalVests = parseFloat(globals.total_vesting_shares.split(" ")[0]);
    const SP = totalSteem * (vest / totalVests);
    return Number(parseFloat(SP.toString()).toFixed(2));
  }
}
class WitnessService {
  public async fetchEveryDelegate(): Promise<IWitness[]> {
    const response = steem.api.getWitnessesByVoteAsync(null, 200);
    return response;
  }

  public async all(page = 1, limit: number = paginationLimit): Promise<IApiDelegatesWrapper> {
    const response = (await ApiService.get("delegates", {
      params: {
        page,
        limit,
      },
    })) as IApiDelegatesWrapper;

    return response;
  }

  public async voterCount(publicKey: string, excludeLowBalances = true): Promise<number> {
    const response = (await AccountService.search(
      {
        vote: publicKey,
        balance: {
          from: excludeLowBalances ? 1e7 : 0,
        },
      },
      1,
      1,
    )) as IApiWalletsWrapper;

    return response.meta.totalCount;
  }

  public async find(query: string): Promise<IWitness> {
    const response = steem.api.getWitnessByAccountAsync(query);
    return response;
  }

  public async active(): Promise<IWitness[]> {
    const response = await steem.api.getWitnessesByVoteAsync(null, 200);
    return response;
  }

  public async witnessVotes(query: string): Promise<any> {
    const step = 100;
    let response = await steem.api.callAsync("database_api.list_witness_votes", {
      start: [query, ""],
      limit: 100,
      order: "by_witness_account",
    });
    let allVotes = [];
    let votes = response.votes.filter((w) => w.witness === query).map((x) => x.account);
    allVotes = allVotes.concat(votes);
    while (votes.length === step) {
      const startFrom = votes[votes.length - 1];
      // eslint-disable-next-line
        response = await steem.api.callAsync('database_api.list_witness_votes',{start:[query,startFrom], limit:step, order:"by_witness_account"})
      votes = response.votes.filter((w) => w.witness === query).map((x) => x.account);
      allVotes = allVotes.concat(votes);
    }
    const accounts = await steem.api.getAccountsAsync(allVotes);
    let totalSp = 0;
    accounts.forEach((element) => {
      element.sp = readableSteemPower(element, 2);
      totalSp = totalSp + element.sp;
    });
    accounts.sort(function(a, b) {
      return b.sp - a.sp;
    });
    return { accounts, totalSp };
  }

  public async standby(): Promise<IWitness[]> {
    const activeDelegates = store.getters["network/activeDelegates"];

    const response = (await ApiService.get("delegates", {
      params: {
        offset: activeDelegates,
        limit:
          activeDelegates < paginationLimit
            ? paginationLimit + (paginationLimit - (activeDelegates % paginationLimit))
            : paginationLimit - (activeDelegates % paginationLimit),
      },
    })) as IApiDelegatesWrapper;

    return response.data;
  }

  public async resigned(): Promise<IWitness[]> {
    const response = await this.allResigned();
    return response.data;
  }

  public async allResigned(page = 1, limit: number = paginationLimit): Promise<IApiDelegatesWrapper> {
    const response = (await ApiService.get("delegates", {
      params: {
        type: "resigned",
        page,
        limit,
      },
    })) as IApiDelegatesWrapper;

    return response;
  }

  public async activeDelegatesCount(): Promise<number> {
    const response = steem.api.getWitnessCountAsync();
    return response;
  }

  public async minerQueue(): Promise<number> {
    const response = steem.api.getMinerQueueAsync();
    return response;
  }
}

export default new WitnessService();
