import {
  BaseNFTModel,
  TaskContributionNFT,
  TaskContributionProperties
} from "@aut-labs/sdk";

export class GithubPullRequestContributionProperties extends TaskContributionProperties {
  branch: string;
  repository: string;
  organisation: string;
  constructor(data: GithubPullRequestContributionProperties) {
    super(data);
    this.branch = data.branch;
    this.repository = data.repository;
    this.organisation = data.organisation;
  }
}

export class GithubPullRequestContribution<
  T = GithubPullRequestContributionProperties
> extends TaskContributionNFT<T> {
  static getContributionNFT(
    contribution: GithubPullRequestContribution
  ): BaseNFTModel<any> {
    const taskContribution = new GithubPullRequestContribution(
      contribution
    );
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
  constructor(
    data: GithubPullRequestContribution<T> = {} as GithubPullRequestContribution<T>
  ) {
    super(data);
    this.properties = new GithubPullRequestContributionProperties(
      data.properties as GithubPullRequestContributionProperties
    ) as T;
  }
}
