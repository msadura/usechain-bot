export type DepositStatus =
  | 'Pending'
  | 'pending_review'
  | 'pending_fail'
  | 'pending_review_fail'
  | 'reject'
  | 'success'
  | 'wallet_processing';

export type Deposit = {
  status: DepositStatus;
  type: string;
  //...rest
};
