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

const Contributions = () => {
  let contribution = useSelector(SelectedContribution);
  const contributions = useSelector(AllContributions);
  const { id } = useParams<{ id: string }>();

  if (!contribution) {
    contribution = contributions.find((c) => c.id === id);
  }

  console.log(contribution);
  return (
    <>
      {contribution?.metadata?.contributionType === "open" && <OpenTask contribution={contribution} />}
      {contribution?.metadata?.contributionType === "discord" && <DiscordTask contribution={contribution} />}
      {contribution?.metadata?.contributionType === "quiz" && <QuizTask contribution={contribution} />}
    </>
   
  );
};

export default Contributions;
