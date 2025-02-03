import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { Community, IApiResponse } from "../interfaces";

const sdsNode = "https://sds0.steemworld.org"
const steemBridge = "https://api.steemit.com"

class ApiService {
  public async getFromSDS(url: string, config: AxiosRequestConfig = {}): Promise<IApiResponse> {
    return new Promise(async (resolve) => {
      const response = await axios.get(`${sdsNode}/${url}`, config);
      if (response.data.error) {
        return Promise.reject(new Error(`Error GET ${url} : ${JSON.stringify(response)}`));
      }
      resolve(response.data);
    })
  }

  public async getFromBridge<T extends 'list_communities' | 'get_community'>(method: T, params: { sort?: string, name?: string | undefined, observer?: string | null }): Promise<T extends 'list_communities' ? Community[] : Community> {
    return new Promise(async (resolve) => {
      const requestData = {
        jsonrpc: "2.0",
        method: "bridge." + method,
        params: params,
        id: 1
      };
      const response = await axios.post(steemBridge, requestData);
      if (response.data.error) {
        return Promise.reject(new Error(`Error GET ${steemBridge} : ${JSON.stringify(response)}`));
      }
      resolve(response.data.result);
    })
  }
}

export default new ApiService();
