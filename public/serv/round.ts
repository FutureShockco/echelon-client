import ApiService from "@/services/api";
import { IRoundDelegate, IApiRoundDelegatesWrapper } from "../interfaces";
import steem from "steem";

class RoundService {
  public async delegates(round: number): Promise<IRoundDelegate[]> {
    if (round < 1) {
      return [];
    }

    const response = steem.api.getActiveWitnessesAsync();
    return response;
  }
}

export default new RoundService();
