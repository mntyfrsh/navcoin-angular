import { RpcSend } from 'src/app/rpc/rpc-send.model';
import { RpcReceive } from 'src/app/rpc/rpc-receive.model';
import { WalletService } from 'src/app/wallet/wallet.service';
import { OnInit, Injectable } from '@angular/core';
import CFProposal from '../models/CFProposal.model';
import RPCDataCFundStats from '../models/RPCCommunityFundStats.model';
import CFPaymentRequest from '../models/CFPaymentRequest.model';
import RPCCFundProposalVoteContainer from '../models/RPCCFundProposalVotes.model';
import RPCCFundPaymentRequestVote from '../models/RPCCFundPaymentRequestVote.model';
import RPCCFundPaymentRequestVoteContainer from '../models/RPCCFundPaymentRequestVoteContainer.model';
import RPCCFundProposalVote from '../models/RPCCFundProposalVote.model';

// TODO Add Caching ?

@Injectable()
export class CommunityFundService implements OnInit {
  private _proposalVotes: RPCCFundProposalVoteContainer;

  private _paymentRequestList: Array<CFPaymentRequest>;
  private _proposalList: Array<CFProposal>;
  private _communityFundStats: RPCDataCFundStats;
  private _paymentRequestVotes: RPCCFundPaymentRequestVoteContainer;

  get proposalVotes(): any {
    return this._proposalVotes;
  }

  get paymentRequestVotes(): any {
    return this._paymentRequestVotes;
  }

  get proposalList(): Array<CFProposal> {
    return this._proposalList;
  }

  getFilteredProposalList(statusFilter: Array<string>): Array<CFProposal> {
    if (!statusFilter) {
      return new Array<CFProposal>();
    } else if (statusFilter.length > 0) {
      return this._proposalList.filter(proposal =>
        statusFilter.includes(proposal.status)
      );
    } else {
      return this._proposalList;
    }
  }

  getFilteredPaymentRequestList(statusFilter): Array<CFPaymentRequest> {
    if (!statusFilter) {
      return new Array<CFPaymentRequest>();
    } else if (statusFilter.length > 0) {
      return this._paymentRequestList.filter(payReq =>
        statusFilter.includes(payReq.status)
      );
    } else {
      return this._paymentRequestList;
    }
  }

  get paymentRequestList(): Array<CFPaymentRequest> {
    return this._paymentRequestList;
  }

  get communityFundStats(): RPCDataCFundStats {
    return this._communityFundStats;
  }

  constructor(private walletService: WalletService) {}

  // Get data

  fetchProposals() {
    return new Promise((resolve, reject) => {
      const rpcData = new RpcSend('listproposals');
      this.walletService.sendRPC(rpcData).subscribe(
        (receive: RpcReceive) => {
          if (receive.type === 'SUCCESS') {
            this._proposalList = [...receive.data];
            resolve();
          } else {
            reject(`${receive.message} ${receive.code} ${[...receive.data]}`);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  fetchPaymentRequests() {
    return new Promise((resolve, reject) => {
      const rpcData = new RpcSend('listproposals');
      this.walletService.sendRPC(rpcData).subscribe(
        (receive: RpcReceive) => {
          if (receive.type === 'SUCCESS') {
            const paymentRequestList = [];
            receive.data
              .filter(proposal => proposal.paymentRequests)
              .map((proposal: CFProposal) => {
                const payReqs = proposal.paymentRequests.map(paymentRequest => {
                  paymentRequest.parentProposalHash = proposal.hash;
                  return paymentRequest;
                });
                paymentRequestList.push(...payReqs);
              });
            this._paymentRequestList = paymentRequestList;
            resolve();
          } else {
            reject(`${receive.message} ${receive.code} ${[...receive.data]}`);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  fetchCfundStats() {
    return new Promise((resolve, reject) => {
      const rpcData = new RpcSend('cfundstats');
      this.walletService.sendRPC(rpcData).subscribe(
        (receive: RpcReceive) => {
          if (receive.type === 'SUCCESS') {
            this._communityFundStats = receive.data;
            resolve();
          } else {
            reject(`${receive.message} ${receive.code} ${[...receive.data]}`);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  fetchProposalVotes() {
    return new Promise((resolve, reject) => {
      const rpcData = new RpcSend('proposalvotelist');
      this.walletService.sendRPC(rpcData).subscribe(
        (receive: RpcReceive) => {
          if (receive.type === 'SUCCESS') {
            this._proposalVotes = receive.data;
            resolve();
          } else {
            reject(`${receive.message} ${receive.code} ${[...receive.data]}`);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  fetchPaymentRequestVotes() {
    return new Promise((resolve, reject) => {
      const rpcData = new RpcSend('paymentrequestvotelist');
      this.walletService.sendRPC(rpcData).subscribe(
        (receive: RpcReceive) => {
          if (receive.type === 'SUCCESS') {
            this._paymentRequestVotes = receive.data;
            resolve();
          } else {
            reject(`${receive.message} ${receive.code} ${[...receive.data]}`);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  // Update

  updateProposalVote(proposalHash: string, vote: string) {
    return new Promise((resolve, reject) => {
      if (
        (this.proposalVotingYes(proposalHash) && vote === 'yes') ||
        (this.proposalVotingNo(proposalHash) && vote === 'no')
      ) {
        vote = 'remove';
      }
      const rpcData = new RpcSend('proposalvote', [proposalHash, vote]);
      this.walletService.sendRPC(rpcData).subscribe(
        (receive: RpcReceive) => {
          if (receive.type === 'SUCCESS') {
            resolve();
          } else {
            reject(`${receive.message} ${receive.code} ${[...receive.data]}`);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  updatePaymentRequestVote(paymentRequestHash: string, vote: string) {
    return new Promise((resolve, reject) => {
      if (
        (this.paymentRequestVotingYes(paymentRequestHash) && vote === 'yes') ||
        (this.paymentRequestVotingNo(paymentRequestHash) && vote === 'no')
      ) {
        vote = 'remove';
      }
      const rpcData = new RpcSend('paymentrequestvote', [
        paymentRequestHash,
        vote
      ]);
      this.walletService.sendRPC(rpcData).subscribe(
        (receive: RpcReceive) => {
          if (receive.type === 'SUCCESS') {
            resolve();
          } else {
            reject(
              `${receive.message} ${receive.code} ${JSON.stringify(
                receive.data
              )}`
            );
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  proposalVotingNo(proposalHash: string) {
    const vote = this._proposalVotes.no.filter(
      (proposalVote: RPCCFundProposalVote) => proposalVote.hash === proposalHash
    );
    return vote.length === 1 ? true : false;
  }

  proposalVotingYes(proposalHash: string) {
    const vote = this._proposalVotes.yes.filter(
      (proposalVote: RPCCFundProposalVote) => proposalVote.hash === proposalHash
    );
    return vote.length === 1 ? true : false;
  }

  paymentRequestVotingNo(paymentRequestHash: string) {
    const vote = this._paymentRequestVotes.no.filter(
      (paymentRequestVote: RPCCFundPaymentRequestVote) =>
        paymentRequestVote.hash === paymentRequestHash
    );
    return vote.length === 1 ? true : false;
  }

  paymentRequestVotingYes(paymentRequestHash: string) {
    const vote = this._paymentRequestVotes.yes.filter(
      (paymentRequestVote: RPCCFundPaymentRequestVote) =>
        paymentRequestVote.hash === paymentRequestHash
    );
    return vote.length === 1 ? true : false;
  }

  // Create

  createProposal(formData) {
    return new Promise((resolve, reject) => {
      const rpcData = new RpcSend('createproposal', formData);
      this.walletService.sendRPC(rpcData).subscribe(
        (receive: RpcReceive) => {
          if (receive.type === 'SUCCESS') {
            resolve();
          } else {
            reject(`${receive.message} ${receive.code} ${[...receive.data]}`);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  createPaymentRequest(formData) {
    return new Promise((resolve, reject) => {
      const rpcData = new RpcSend('createpaymentrequest', formData);
      this.walletService.sendRPC(rpcData).subscribe(
        (receive: RpcReceive) => {
          if (receive.type === 'SUCCESS') {
            resolve();
          } else {
            reject(`${receive.message} ${receive.code} ${[...receive.data]}`);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  // check

  ngOnInit(): void {}
}
