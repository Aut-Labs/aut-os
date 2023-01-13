import { Player } from "@lottiefiles/react-lottie-player";
import * as animationData from "../assets/load-id.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const AutLoadingNew = () => {
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
        style={{ height: "400px", width: "400px" }}
      />
    </div>
  );
};

export default AutLoadingNew;
