export interface AccountType {
  address: string;
  balance: string;
  nonce: number;
  code?: string;
}

export interface ContractType {
  name: string;
  gasLimit: number;
  data: string;
}

export interface StatCardType {
  title?: string;
  value?: string;
  valueUnit?: string;
  svg?: string;
  color?: string;
  percentage?: string;
  tooltipText?: string;
  children?: any;
}

export interface ActionModalType {
  balance?: string;
  show: boolean;
  title: string;
  description: string;
  handleClose: () => void;
  handleContinue: (value: string) => void;
}


export interface ProposalCardType {
  actionId?: number;
  title?: string;
  value?: string;
  canSign?: boolean;
  canUnsign?: boolean;
  canPerformAction?: boolean;
  canDiscardAction?: boolean;
}