interface CFPaymentRequest {
  version: number;
  hash: string;
  blockHash: string;
  description: string;
  requestedAmount: number;
  notPaidYet: number;
  userPaidFee: number;
  paymentAddress: string;
  proposalDuration: number;
  votesYes: number;
  votesNo: number;
  votingCycle: number;
  status: string;
  state: number;
  parentProposalHash: string;
  stateChangedOnBlock?: string;
}

export default CFPaymentRequest;
