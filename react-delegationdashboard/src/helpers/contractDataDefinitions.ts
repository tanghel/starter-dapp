export class ContractOverview {
  ownerAddress: string = '';
}

export class Stats {
  epoch: number;
  public constructor(epoch: number) {
    this.epoch = epoch;
  }
}
