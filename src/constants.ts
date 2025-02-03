import type { ITransactionType } from "./interfaces";
import { CoreTransaction } from "./enums";
export const URI_QRCODE_SCHEME_PREFIX = "";

export const transactionTypes: ITransactionType[] = [
  { key: "TRANSFER", type: CoreTransaction.TRANSFER, },
  { key: "COMMENT", type: CoreTransaction.COMMENT, },
  { key: "DELETE_COMMENT", type: CoreTransaction.DELETE_COMMENT, },
  { key: "ACCOUNT_UPDATE", type: CoreTransaction.ACCOUNT_UPDATE, },
  { key: "ACCOUNT_UPDATE2", type: CoreTransaction.ACCOUNT_UPDATE2, },
  { key: "ACCOUNT_CLAIM", type: CoreTransaction.ACCOUNT_CLAIM, },
  { key: "ACCOUNT_CREATE", type: CoreTransaction.ACCOUNT_CREATE, },
  { key: "CUSTOM_JSON", type: CoreTransaction.CUSTOM_JSON, },
  { key: "VOTE", type: CoreTransaction.VOTE, },
  { key: "CLAIM_REWARD_BALANCE", type: CoreTransaction.CLAIM_REWARD_BALANCE, },
  { key: "CURATION_REWARD", type: CoreTransaction.CURATION_REWARD, },
  { key: "DELEGATE_VESTING_SHARES", type: CoreTransaction.DELEGATE_VESTING_SHARES },
  { key: "ACCOUNT_WITNESS_VOTE", type: CoreTransaction.ACCOUNT_WITNESS_VOTE, },
  { key: "WITHDRAW_VESTING", type: CoreTransaction.WITHDRAW_VESTING, },
  { key: "TRANSFER_TO_SAVINGS", type: CoreTransaction.TRANSFER_TO_SAVINGS, },
  { key: "TRANSFER_TO_VESTING", type: CoreTransaction.TRANSFER_TO_VESTING, },
  { key: "LIMIT_ORDER_CREATE", type: CoreTransaction.LIMIT_ORDER_CREATE, },
  { key: "LIMIT_ORDER_CANCEL", type: CoreTransaction.LIMIT_ORDER_CANCEL, },
];

export const apiLimit = 100;
export const paginationLimit = 25;