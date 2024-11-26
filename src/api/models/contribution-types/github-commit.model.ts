import {
  BaseNFTModel,
  TaskContributionNFT,
  TaskContributionProperties
} from "@aut-labs/sdk";

export class GithubCommitContributionProperties extends TaskContributionProperties {
  branch: string;
  repository: string;
  organisation: string;
  constructor(data: GithubCommitContributionProperties) {
    super(data);
    this.branch = data.branch;
    this.repository = data.repository;
    this.organisation = data.organisation;
  }
}

export class GithubCommitContribution<
  T = GithubCommitContributionProperties
> extends TaskContributionNFT<T> {
  static getContributionNFT(
    contribution: GithubCommitContribution
  ): BaseNFTModel<any> {
    const taskContribution = new GithubCommitContribution(contribution);
    return {
      name: taskContribution.name,
      description: taskContribution.description,
      properties: {
        branch: taskContribution.properties.branch,
        repository: taskContribution.properties.repository,
        organisation: taskContribution.properties.organisation
      }
    } as BaseNFTModel<any>;
  }
  constructor(data: GithubCommitContribution<T> = {} as GithubCommitContribution<T>) {
    super(data);
    this.properties = new GithubCommitContributionProperties(
      data.properties as GithubCommitContributionProperties
    ) as T;
  }
  contributionType? = "Commit";
}
