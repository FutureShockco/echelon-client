// src/global-plugins.ts

import type { Account, ExtendedAccount } from 'dsteem';
import moment from 'moment';
import numeral from 'numeral';
import type { App } from 'vue';
import { useAppStore } from './stores/app';


export function setupGlobalMethods(app: App) {
  app.config.globalProperties.$formatReputation = (reputation: string | number): number => {
    if (reputation == null) return Number(reputation);
    reputation = parseInt(reputation.toString());
    let rep = String(reputation);
    let neg = rep.charAt(0) === "-";
    rep = neg ? rep.substring(1) : rep;
    let str = rep;
    let leadingDigits = parseInt(str.substring(0, 4));
    let log = Math.log(leadingDigits) / Math.log(10);
    let n = str.length - 1;
    let out = n + (log - Math.floor(log)); // Use Math.floor for integer part of log
    if (isNaN(out)) out = 0;
    out = Math.max(out - 9, 0);
    out = (neg ? -1 : 1) * out;
    out = out * 9 + 25;
    out = parseInt(out.toString());
    return out;
  },
    // app.config.globalProperties.$readableSteemPower = (account: any, precision: number) {
    //     if (account && (account.vesting_shares || account.delegated || account.received_vesting_shares)) {
    //       let SP = 0;
    //       SP = SP + Number(this.$vestToSteemPower(account.vesting_shares.split(" ")[0]));
    //       SP = SP - Number(this.$vestToSteemPower(account.delegated_vesting_shares.split(" ")[0]));
    //       SP = SP + Number(this.$vestToSteemPower(account.received_vesting_shares.split(" ")[0]));
    //       return parseFloat(SP.toString()).toFixed(precision);
    //     }
    //   },
    app.config.globalProperties.$amount = (value: number | undefined): any => {
      return numeral(value).format('0.[000]a')
    },
    app.config.globalProperties.$vestToSteem = (vestingShares: number | undefined): any => {
      const appStore = useAppStore();
      const total_vesting_fund_steem = appStore.dynamicProperties?.total_vesting_fund_steem as string
      const totalVestingFund = Number(total_vesting_fund_steem.split(" ")[0])
      const total_vesting_shares = appStore.dynamicProperties?.total_vesting_shares as string
      const totalVestingShares = Number(total_vesting_shares.split(" ")[0])
      if (vestingShares)
        return totalVestingFund * vestingShares / totalVestingShares;
      else return 0
    },
    app.config.globalProperties.$getVotingPower = (account: Account): any => {
      return account.delegated_vesting_shares;
    },
    app.config.globalProperties.$timeFromNow = (date: string): any => {
      return moment(date).fromNow()
    }
}
