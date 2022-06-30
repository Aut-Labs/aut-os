import { pxToRem } from '@utils/text-size';
import Lottie from 'react-lottie';
import * as animationData from '../assets/aut-load.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const AutLoading = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%)`,
      }}
    >
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default AutLoading;
