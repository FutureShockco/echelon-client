import ApiService from "@/services/api";
import { IApiBlockWrapper, IApiBlocksWrapper, IBlock, IBlockSearchParams } from "../interfaces";
import { paginationLimit } from "@/constants";
import steem from "steem";


class BlockService {
  public async latest(): Promise<IBlock[]> {
    const response = await steem.api.getDynamicGlobalPropertiesAsync();
    const blocks = [];
    for (let i = response.last_irreversible_block_num - 20; i < response.last_irreversible_block_num; i++) {
      const block = await steem.api.getBlockAsync(i);
      block.id = i;
      blocks.push(block);
    }

    return blocks.reverse();
  }

  public async last(): Promise<IBlock> {
    const response = await steem.api.getDynamicGlobalPropertiesAsync();
    const block = await steem.api.getBlockAsync(response.last_irreversible_block_num);
    block.id = response.last_irreversible_block_num;
    return block;
  }

  public async find(id: string): Promise<IBlock> {
    const response = await steem.api.getBlockAsync(id);
    response.blockNum = id;
    return response;
  }

  public async paginate(page: number, limit = paginationLimit): Promise<IApiBlocksWrapper> {
    const response = (await ApiService.get("blocks", {
      params: {
        page,
        limit,
      },
    })) as IApiBlocksWrapper;

    return response;
  }

  public async byAddress(address: string, page: number, limit = paginationLimit): Promise<IApiBlocksWrapper> {
    const response = (await ApiService.get(`witnesses/${address}/blocks`, {
      params: {
        page,
        limit,
      },
    })) as IApiBlocksWrapper;

    return response;
  }

  public async findPrevious(height: number): Promise<IBlock> {
    const response = await steem.api.getBlockAsync(height - 1);
    response.blockNum = height - 1;
    return response;
  }

  public async findNext(height: number): Promise<IBlock> {
    const searchheight = Number(height) + 1;
    const response = await steem.api.getBlockAsync(searchheight);
    response.blockNum = searchheight;
    return response;
  }

  public async search(body: IBlockSearchParams, page = 1, limit: number = paginationLimit): Promise<IApiBlocksWrapper> {
    const response = await steem.api.getBlockAsync(body.id);
    response.blockNum = body.id;
    return response;
  }
}

export default new BlockService();
