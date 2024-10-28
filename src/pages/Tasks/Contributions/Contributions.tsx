import { memo } from "react";
import { useSelector } from "react-redux";
import {
  AllContributions,
  SelectedContribution
} from "@store/contributions/contributions.reducer";
import OpenTask from "../OpenTask/OpenTask";
import DiscordTask from "../DiscordTask/DiscordTask";
import QuizTask from "../QuizTask/QuizTask";
import { useParams } from "react-router-dom";
import useQueryContributions from "@utils/hooks/GetContributions";

const Contributions = () => {
  let contribution = useSelector(SelectedContribution);
  const contributions = useSelector(AllContributions);
  const { id } = useParams<{ id: string }>();

  if (!contribution) {
    contribution = contributions.find((c) => c.id === id);
  }
  return (
    <>
      {contribution?.contributionType === "open" && (
        <OpenTask contribution={contribution} />
      )}
      {contribution?.contributionType === "discord" && (
        <DiscordTask contribution={contribution} />
      )}
      {contribution?.contributionType === "quiz" && (
        <QuizTask contribution={contribution} />
      )}
    </>
  );
};

export default Contributions;
