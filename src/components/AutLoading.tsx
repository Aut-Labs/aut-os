import { pxToRem } from "@utils/text-size";
// @ts-ignore
import { Player } from "@lottiefiles/react-lottie-player";
import * as animationData from "../assets/aut-load.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const AutLoading = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%)`
      }}
    >
      <Player
        loop
        autoplay
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        src={animationData}
        style={{ height: pxToRem(400), width: pxToRem(400) }}
      />
    </div>
  );
};

export default AutLoading;
