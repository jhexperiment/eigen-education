/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AVS
 */
export interface AVS {
  id?: string;
  owner?: string;
  operatorCount?: number;
  operators?: Operator[];
  operatorSetCount?: number;
  slashingCount?: number;
  slashings?: any[]; // TODO: Add type for slashings
  strategyCount?: number;
  strategies?: Strategy[];
  stakerCount?: number;
  metadataURI?: string;
  metadata?: Metadata;
  lastUpdateBlockNumber?: string;
  lastUpdateBlockTimestamp?: string;
}

/**
 * Operator
 */
export interface Operator {
  id?: string;
  strategies?: OperatorStrategy[];
  strategyCount?: number;
  operatorSets?: OperatorSetOperator[];
  operatorSetCount?: number;
  // stakers: OperatorStaker[];
  stakerCount?: number;
  avsCount?: number;
  // avss: AVSOperator[];
  metadataURI?: string;
  delegationApprover?: string;
  stakerOptOutWindowBlocks?: string;
  registeredBlockNumber?: string;
  registeredBlockTimestamp?: string;
  registeredTransactionHash?: string;
  slashingCount?: number;
  // slashings: Slashing[];
  // magnitudeInfos: OperatorSetMagnitudeInfo[];
  allocationDelay: string;
  pendingAllocationDelay?: string;
  pendingAllocationDelayEffectBlock?: string;
  lastUpdateBlockNumber?: string;
  lastUpdateBlockTimestamp?: string;
}

/**
 * Operator Strategy
 */
export interface OperatorStrategy {
  id?: string;
  operator?: Operator;
  strategy?: Strategy;
  totalShares?: string;
  stakerCount?: number;
  maxMagnitude?: string;
  lastUpdateBlockNumber?: string;
  lastUpdateBlockTimestamp?: string;
}

/**
 * Operator Set Operator
 */
export interface OperatorSetOperator {
  id?: string;
  // operatorSet: OperatorSet;
  operator?: Operator;
  restakedStrategies?: string[];
  // registrationStatus: RegistrationStatus;
  registeredUntilTimestamp?: string;
  // slashings: Slashing[];
  // magnitudeInfos: OperatorSetMagnitudeInfo[];
  lastUpdateBlockNumber?: string;
  lastUpdateBlockTimestamp?: string;
}

/**
 * Strategy
 */
export interface Strategy {
  id?: string;
  address?: string;
  token?: Token;
  totalShares?: string;
  operatorSetCount?: number;
  operatorCount?: number;
  stakerCount?: number;
  avsCount?: number;
  exchangeRate?: string;
  emitsExchangeRate?: boolean;
  isInDepositWhitelist?: boolean;
  withdrawalDelayBlocks?: string;
  thirdPartyTransfersForbidden?: boolean;
  whitelistBlockNumber?: string;
  whitelistBlockTimestamp?: string;
  whitelistTransactionHash?: string;
  createdAtBlockNumber?: string;
  lastUpdateBlockNumber?: string;
  lastUpdateBlockTimestamp?: string;
}

/**
 * Token
 */
export interface Token {
  id?: string;
  address?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
}

/**
 * Metadata
 */
export interface Metadata {
  name?: string;
  website?: string;
  description?: string;
  logo?: string;
  twitter?: string;
}

/**
 * Staker
 */
export interface Staker {
  id?: string;
  address?: string;
  withdrawalCount?: number;
  depositCount?: number;
  delegationCount?: number;
  operatorCount?: number;
  deposits?: Deposit[];
  withdrawals?: Withdrawal[];
}

/**
 * Deposit
 */
export interface Deposit {
  id?: string;
  token?: Token;
  strategy?: Strategy;
  shares?: string;
  blockNumber?: string;
  blockTimestamp?: string;
  transactionHash?: string;
}

/**
 * Withdrawal
 */
export interface Withdrawal {
  id?: string;
  operator?: Operator;
  shares?: string[];
  scaledShares?: string[];
  depositShares?: string[];
  shares_withdrawn?: string[];
  receiveAsTokens?: boolean;
  completed?: boolean;
  strategies?: Strategy[];
  withdrawer?: string;
  nonce?: string;
  root?: string;
  roots?: string[];
  start_blockNumber?: string;
  start_blockTimestamp?: string;
  start_transactionHash?: string;
  completed_blockNumber?: string;
  completed_blockTimestamp?: string;
  completed_transactionHash?: string;
}

/**
 * AVSS Query Response
 */
export interface AVSSQueryResponse {
  avss: AVS[];
}

/**
 * Stakers Query Response
 */
export interface StakersQueryResponse {
  stakers: Staker[];
}

/**
 * Staker Query Response
 */
export interface StakerQueryResponse {
  staker: Staker;
}

/**
 * Error Response
 */
export interface SubgraphErrorResponse extends Error {
  response?: {
    errors?: { message: string }[];
  };
}
