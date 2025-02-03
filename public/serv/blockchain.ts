import steem from "steem";

class BlockchainService {
  public async properties(): Promise<{ current_supply; current_sbd_supply; head_block_number; time }> {

    const response = await steem.api.getDynamicGlobalPropertiesAsync();
    const reward_fund = await steem.api.getRewardFundAsync("post");
    reward_fund.reward_balance = Number(reward_fund.reward_balance.replace('STEEM',''))
    reward_fund.recent_claims = Number(reward_fund.recent_claims)

    const median_history = await steem.api.getCurrentMedianHistoryPriceAsync();
    response.reward_fund = reward_fund;
    response.median_history = median_history;
    response.median_history.price = Number(median_history.base.split(" ")[0]) / Number(median_history.quote.split(" ")[0]);
    return response;
  }
}

export default new BlockchainService();
