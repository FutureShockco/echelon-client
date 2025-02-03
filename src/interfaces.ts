import type { Asset, Discussion } from "dsteem";

export interface IBlock {
  previous: string;
  timestamp: string;
  witness: string;
  transaction_merkle_root: string;
  extensions: string[];
  witness_signature: string[];
  transactions: string[];
  block_id: string;
  signing_key: string;
  transaction_ids: string[];
  blockNum: number;
}

export interface ITransaction {
  block_num: number;
  expiration: string;
  expired: boolean;
  extensions: string[];
  id: string;
  operations: string[];
  ref_block_num: number;
  ref_block_prefix: number;
  signatures?: string[];
  trx_num: number;
}

export interface IWitness {
  owner: string;
  last_confirmed_block_num: number;
  signing_key: string;
  total_missed: number;
  url: string;
  rank: number;
  activeRank: number;
}

export interface IRoundDelegate {
  signing_key: string;
  votes: string;
  last_confirmed_block_num: number;
}

export interface IMeta {
  count: number;
  pageCount: number;
  totalCount: number;
  next: string;
  previous: string;
  self: string;
  first: string;
  last: string;
}


export interface ISortParameters {
  field: string;
  type: string;
}

export interface ITimestamp {
  unix: number;
  epoch: number;
  human: string;
}

export interface IAccount {
  json_metadata: any;
  name: string;
  username: string;
  publicKey: string;
  vote: string;
}

export interface IApiResponse {
  result: any;
  error?: string;
  statusCode?: string;
  meta?: IMeta;
  data?: any[] | any;
}

export interface IApiBlockWrapper {
  data: IBlock;
}

export interface IApiBlocksWrapper {
  data: IBlock[];
  meta: IMeta;
}

export interface IApiDelegateWrapper {
  data: IWitness;
}

export interface IApiDelegatesWrapper {
  data: IWitness[];
  meta: IMeta;
}

export interface IApiRoundDelegatesWrapper {
  data: IRoundDelegate[];
}

export interface IApiBlockchainWrapper {
  data: IBlockchain;
}

export interface IBlockchain {
  block: {
    height: number;
    id: string;
  };
  supply: string;
  sbdSupply: string;
}

export interface IApiWalletsWrapper {
  data: IAccount[];
  meta: IMeta;
}

export interface IApiTransactionWrapper {
  data: ITransaction;
}

export interface IApiTransactionsWrapper {
  data: ITransaction[];
  meta: IMeta;
  length: number;
}

export interface IApiNodeConfiguration {
  [key: string]: any;
}

export interface IApiNodeConfigurationCrypto {
  [key: string]: any;
}

export interface IApiNodeStatus {
  synced: boolean;
  now: number;
  blockCount: number;
  timestamp: number;
}

export interface ICurrencyState {
  name: string;
  rate: number;
  steemrate: number;
  sbdrate: number;
  symbol: string;
  lastConversion: {
    to: string;
    timestamp: number;
    rate: number;
  };
}

export interface IDelegateState {
  delegates: string | null;
  forged: any[];
  delegatesCount: number;
}

export interface INetworkState {
  defaults: {};
  server: string | null;
  nethash: string | null;
  alias: string | null;
  addressPrefix: number;
  activeDelegates: number;
  rewardOffset: number;
  token: string | null;
  isListed: boolean;
  symbol: string | null;
  currencies: any[];
  knownAccounts: any[];
  knownSeeds: any[];
  knownRpcs: any[];
  knownApps: any[];
  properties: object;
  supply: string;
  sbdSupply: string;
  initialSupply: string;
  height: number;
  epoch: string | null;
  blocktime: number;
  hasMagistrateEnabled: boolean;
  hasHtlcEnabled: boolean;
  enabledTransactionTypes: ITransactionType[];
  enabledCurrenciesTypes: any[];
  allApps: any[];
  topApps: any[];
}

export interface IUiState {
  login: string;
  language: string;
  locale: string;
  nightMode: boolean;
  priceChartOptions: {
    enabled: boolean;
    period: string;
    type: string;
  };
  volumeChartOptions: {
    enabled: boolean;
    period: string;
    type: string;
  };
  headerType: string | null;
  menuVisible: boolean;
  blockSortParams: string | null;
  businessSortParams: string | null;
  delegateSortParams: string | null;
  transactionSortParams: string | null;
  walletSortParams: string | null;
  walletSearchSortParams: string | null;
  walletTransactionTab: string | null;
  hasAcceptedLinkDisclaimer: boolean;
}

export interface IStorePayload {
  type: string;
  value: any;
}

export interface IVTooltip {
  content: any;
  trigger?: string;
  show?: boolean;
  hideOnTargetClick?: boolean;
  delay?: any;
  classes?: string;
}

export interface ITransactionType {
  key: string;
  type: string;
  typeGroup?: number;
}

export interface ITransactionSearchParams {
  id?: string;
  type?: string;
  timestamp?: { from?: number; to?: number };
  amount?: { from?: number; to?: number };
  fee?: { from?: number };
  vendorField?: string;
}

export interface IBlockSearchParams {
  id?: string;
  generatorPublicKey?: string;
  timestamp?: { from?: number; to?: number };
  totalAmount?: { from?: number; to?: number };
  totalFee?: { from?: number; to?: number };
  reward?: { from?: number; to?: number };
  numberOfTransactions?: { from?: number; to?: number };
}

export interface IAccountSearchParams {
  address?: string;
  username?: string;
  account?: string;
  vote?: string;
  balance?: { from?: number; to?: number };
}

export interface JSONMetadata {
  name?: string;
  about?: string;
  website?: string;
  location?: string;
  cover_image?: string;
  profile_image?: string;
}

export interface AccountMetadata {
  profile?: JSONMetadata;
}

export interface Reward {
  sbd?: number;
  steem?: number;
  vests?: number;
}

export interface RewardData {
  author_reward: Reward;
  comment_benefactor_reward: Reward;
  curation_reward: Pick<Reward, 'vests'>;
  liquidity_reward: Pick<Reward, 'steem'>;
  producer_reward: Pick<Reward, 'vests'>;
  interest: Pick<Reward, 'sbd'>;
  proposal_pay: Pick<Reward, 'sbd'>;
}

export interface Post extends Discussion {
  images: any[];
  tags: any[];
}

export interface Community {
  id: number;
  name: string;
  title: string;
  about: string;
  lang: string;
  type_id: number;
  is_nsfw: boolean;
  subscribers: number;
  sum_pending: number;
  num_pending: number;
  num_authors: number;
  created_at: string;
  avatar_url: string;
  context: Record<string, any>;
  admins: string[];
  description?: string;
}