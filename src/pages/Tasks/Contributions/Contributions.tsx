import { useMemo } from "react";
import OpenTask from "../OpenTask/OpenTask";
import QuizTask from "../QuizTask/QuizTask";
import { useParams } from "react-router-dom";
import useQueryContributions from "@utils/hooks/GetContributions";
import { OpenTaskContribution } from "@api/models/contribution-types/open-task.model";
import { QuizTaskContribution } from "@api/models/contribution-types/quiz.model.model";
import useQueryContributionCommits from "@utils/hooks/useQueryContributionCommits";
import { useWalletConnector } from "@aut-labs/connector";

const Contributions = () => {
  const { state } = useWalletConnector();
  const { id } = useParams<{ id: string }>();
  const { data, loading: isLoading } = useQueryContributions({
    variables: {
      skip: 0,
      take: 1000,
      where: {
        id
      }
    }
  });

  const { data: commits, loading: isLoadingCommits } =
    useQueryContributionCommits({
      skip: !state?.address,
      variables: {
        skip: 0,
        take: 1000,
        where: {
          who: state?.address?.toLowerCase(),
          contribution_: {
            id
          }
        }
      }
    });

  const commit = useMemo(() => {
    if (commits) {
      return commits[0];
    }
    return null;
  }, [commits]);

  const contributionTemplate = useMemo(() => {
    const contribution = data?.[0];
    if (!contribution) return null;
    if (contribution instanceof OpenTaskContribution) {
      return <OpenTask contribution={contribution} commit={commit} />;
    } else if (contribution instanceof QuizTaskContribution) {
      return <QuizTask contribution={contribution} commit={commit} />;
    } else {
      return "Contribution type not supported";
    }
  }, [data, commit]);

  return <>{contributionTemplate}</>;
};

export default Contributions;
