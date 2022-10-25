import { Box, styled, SvgIcon, useMediaQuery, useTheme } from '@mui/material';
import { ReactComponent as ShareIcon } from '@assets/ShareIcon.svg';
import { pxToRem } from '@utils/text-size';
import { useSelector } from 'react-redux';
import { HolderData } from '@store/holder/holder.reducer';
import { useState } from 'react';
import { setOpenShare } from '@store/ui-reducer';
import { useAppDispatch } from '@store/store.model';
import { QRCode } from 'react-qrcode-logo';
import { ipfsCIDToHttpUrl } from '@api/storage.api';
import { browserName, isIOS } from 'react-device-detect';

const CardZoom = styled<any>('img')(({ theme }) => ({
  borderRadius: 0,
  border: '1px solid white',
  // background: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  position: 'relative',
  width: 'calc(100% - 40px)',
  height: 'calc(100% - 40px)',
  margin: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  // backgroundColor: '#141414',
  '@keyframes zoom-in-zoom-out': {
    '0%': {
      transform: 'scale(1, 1)',
    },
    '10%': {
      transform: 'scale(1.025, 1.025)',
    },
    '20%': {
      transform: 'scale(1, 1)',
    },
    '100%': {
      transform: 'scale(1, 1)',
    },
  },
  animation: `zoom-in-zoom-out 12s linear infinite`,
  animationDirection: 'normal',
  animationDelay: '6s',

  [theme.breakpoints.down('md')]: {
    width: 'calc(100% - 20px)',
    height: 'calc(100% - 20px)',
    margin: '10px',
  },
}));

const CardBack = styled('div')(({ theme }) => ({
  borderRadius: 0,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  position: 'relative',
  width: 'calc(100% - 40px)',
  height: 'calc(100% - 40px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignContent: 'center',
  // backgroundColor: '#141414',

  [theme.breakpoints.down('md')]: {
    width: 'calc(100% - 20px)',
    height: 'calc(100% - 20px)',
  },
}));

const AutRightContainer = styled('div')(({ theme }) => ({
  width: '50%',
}));
const AutRightMobileContainer = styled('div')(({ theme }) => ({
  width: '100%',
}));

const AutIdCard = ({ avatar }) => {
  return (
    <CardZoom xmlns="http://www.w3.org/1999/xhtml" src={avatar}>
      {/* <img
        alt="id"
        style={{
          width: '100%',
          height: '100%',
        }}
        src={avatar}
      /> */}
    </CardZoom>
  );
};

const getCenter = ({ pWidth = 0, pHeight = 0, width = 0, height = 0 }) => {
  return {
    x: (pWidth - width) / 2,
    y: (pHeight - height) / 2,
  };
};

const AutQRCode = ({ link, size }) => {
  return (
    <CardBack>
      <QRCode value={link} bgColor="transparent" fgColor="white" size={size} />
    </CardBack>
  );
};

const AutTunnelRight = () => {
  const dispatch = useAppDispatch();
  const holderData = useSelector(HolderData);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);
  const [isFlipped, setFlipped] = useState(false);
  const isSafari = browserName === 'Safari';

  const handleClickFlip = (event) => {
    event.stopPropagation();
    setFlipped(!isFlipped);
  };

  const handleClickOpen = () => {
    dispatch(setOpenShare(true));
  };

  return (
    <>
      {desktop ? (
        <AutRightContainer>
          <>
            <SvgIcon
              sx={{
                height: pxToRem(80),
                width: pxToRem(80),
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: pxToRem(20),
                fill: 'white',
                cursor: 'pointer',
              }}
              component={ShareIcon}
              onClick={handleClickOpen}
            />
          </>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            height={window.innerHeight}
            viewBox="0 0 960 1075"
          >
            <defs>
              <linearGradient id="linear-gradient" x2="1" y1="0.5" y2="0.5" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="#009fe3" />
                <stop offset="0.08" stopColor="#0399de" />
                <stop offset="0.19" stopColor="#0e8bd3" />
                <stop offset="0.3" stopColor="#2072bf" />
                <stop offset="0.41" stopColor="#3a50a4" />
                <stop offset="0.53" stopColor="#5a2583" />
                <stop offset="0.71" stopColor="#453f94" />
                <stop offset="0.88" stopColor="#38519f" />
                <stop offset="1" stopColor="#3458a4" />
              </linearGradient>
              <clipPath id="clip-path">
                <path
                  fill="#fff"
                  stroke="#707070"
                  strokeWidth="1"
                  d="M0 0H440V694H0z"
                  data-name="Rectangle 2934"
                  transform="translate(.292 -.372)"
                />
              </clipPath>
              <filter id="Rectangle_2301" width="458" height="712" x="257" y="287" filterUnits="userSpaceOnUse">
                <feOffset dx="6" dy="6" />
                <feGaussianBlur result="blur" stdDeviation="3" />
                <feFlood floodOpacity="0.545" />
                <feComposite in2="blur" operator="in" />
                <feComposite in="SourceGraphic" />
              </filter>
              <linearGradient id="linear-gradient-9" x1="0.061" x2="1.127" y1="0.343" y2="0.658" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-10" x1="0.063" x2="1.133" y1="0.343" y2="0.658" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-11" x1="-0.128" x2="1.167" y1="0.299" y2="0.619" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-12" x1="-0.137" x2="1.178" y1="0.298" y2="0.617" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-13" x1="-0.142" x2="0.952" y1="0.416" y2="0.559" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-14" x1="-0.156" x2="0.951" y1="0.418" y2="0.556" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-15" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-16" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-17" x2="1" y1="0.5" y2="0.5" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="#0059a6" />
                <stop offset="0.1" stopColor="#0556a1" />
                <stop offset="0.22" stopColor="#134f93" />
                <stop offset="0.35" stopColor="#2c427d" />
                <stop offset="0.49" stopColor="#4e315e" />
                <stop offset="0.53" stopColor="#5a2c54" />
                <stop offset="0.67" stopColor="#353e75" />
                <stop offset="0.8" stopColor="#184c90" />
                <stop offset="0.92" stopColor="#0655a0" />
                <stop offset="1" stopColor="#0059a6" />
              </linearGradient>
              <linearGradient id="linear-gradient-19" x1="0" x2="1" y1="0.5" y2="0.5" xlinkHref="#linear-gradient-17" />
              <linearGradient id="linear-gradient-20" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-21" x1="0" x2="1" y1="0.5" y2="0.5" xlinkHref="#linear-gradient-17" />
              <linearGradient id="linear-gradient-22" x1="0" x2="1" y1="0.5" y2="0.5" xlinkHref="#linear-gradient-17" />
              <linearGradient id="linear-gradient-23" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-24" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-25" x1="0" x2="1" y1="0.5" y2="0.5" xlinkHref="#linear-gradient-17" />
              <linearGradient id="linear-gradient-26" x1="0" x2="1.001" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-28" x1="0" x2="1.001" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-29" x1="-2.59" x2="-2.575" y1="-1.483" y2="-1.483" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-35" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-39" x1="0" y1="0.501" y2="0.501" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-40" x1="0" x2="0.999" y1="0.5" y2="0.5" xlinkHref="#linear-gradient-17" />
              <linearGradient id="linear-gradient-43" x1="0" y1="0.501" y2="0.501" xlinkHref="#linear-gradient" />
              <clipPath id="clip-Tunnel_Card">
                <path d="M0 0H960V1075H0z" />
              </clipPath>
            </defs>
            <g clipPath="url(#clip-Tunnel_Card)" data-name="Tunnel &amp; Card">
              <path fill="#fff" d="M0 0H960V1075H0z" />
              <path d="M0 0H963V1081H0z" data-name="Rectangle 3389" />
              <g data-name="Group 12377" transform="translate(-956.615)">
                <g data-name="Group 12376">
                  <path fill="none" stroke="#fff" strokeWidth="1" d="M0 865L0 0" data-name="Line 4" transform="translate(1098.5 71.5)" />
                  <path fill="none" stroke="#fff" strokeWidth="1" d="M0 865L0 0" data-name="Line 5" transform="translate(1782.5 71.5)" />
                  <path fill="none" stroke="#fff" strokeWidth="1" d="M0 680L0 0" data-name="Line 6" transform="translate(1182.5 175.5)" />
                  <path fill="none" stroke="#fff" strokeWidth="1" d="M0 680L0 0" data-name="Line 7" transform="translate(1696.5 175.5)" />
                  <path fill="none" stroke="#fff" strokeWidth="1" d="M0 444L414 0" data-name="Line 8" transform="translate(969.5 636.5)" />
                  <path fill="none" stroke="#fff" strokeWidth="1" d="M106 0L0 0" data-name="Line 9" transform="translate(1383.5 636.5)" />
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    d="M435 441L0 0"
                    data-name="Line 10"
                    transform="translate(1485.5 639.5)"
                  />
                  <path fill="none" stroke="#fff" strokeWidth="1" d="M0 0L514 0" data-name="Line 11" transform="translate(1182.5 175.5)" />
                  <path fill="none" stroke="#fff" strokeWidth="1" d="M0 0L684 0" data-name="Line 12" transform="translate(1098.5 71.5)" />
                  <g data-name="Layer 1" transform="rotate(-180 552.192 470.147)">
                    <g data-name="Group 4">
                      <path fill="#bfbfbf" d="M0 0l8.24 256.518 3.53 309.789-3.53 302.487z" data-name="Path 10" />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 184.373v120.052L10 460.39v408.4L1.77 570.266V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g data-name="Layer 1" transform="rotate(-180 484.193 535.739)">
                    <g data-name="Group 4">
                      <path fill="#bfbfbf" d="M0 0l8.24 316.361 3.53 382.06-3.53 373.057z" data-name="Path 10" />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 227.385v148.06L10 567.8v503.682L1.77 703.3V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g data-name="Layer 1" transform="rotate(-180 552.192 468.5)">
                    <g data-name="Group 4">
                      <path fill="#bfbfbf" d="M0 0l8.24 255.545 3.53 308.614L8.24 865.5z" data-name="Path 10" />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 183.673v119.6L10 458.644V865.5L1.77 568.1V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g data-name="Layer 1" transform="rotate(-180 591.192 427.75)">
                    <g data-name="Group 4">
                      <path fill="#bfbfbf" d="M0 0l8.24 200.775 3.53 242.47L8.24 680z" data-name="Path 10" />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 144.307v93.965L10 360.344V680L1.77 446.343V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g data-name="Layer 1" transform="rotate(-180 894.192 468.5)">
                    <g data-name="Group 4">
                      <path fill="#bfbfbf" d="M0 0l8.24 255.545 3.53 308.614L8.24 865.5z" data-name="Path 10" />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 183.673v119.6L10 458.644V865.5L1.77 568.1V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g data-name="Layer 1" transform="rotate(-180 851.192 427.75)">
                    <g data-name="Group 4">
                      <path fill="#bfbfbf" d="M0 0l8.24 200.775 3.53 242.47L8.24 680z" data-name="Path 10" />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 144.307v93.965L10 360.344V680L1.77 446.343V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g data-name="Layer 1" transform="rotate(-90 577.213 -497.829)">
                    <g data-name="Group 4">
                      <path fill="#bfbfbf" d="M0 0l8.24 215.2 3.53 259.885-3.53 253.757z" data-name="Path 10" />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 154.672v100.714L10 386.227v342.615L1.77 478.4V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                  <g data-name="Layer 1" transform="rotate(-90 666.737 -484.353)">
                    <g data-name="Group 4">
                      <path fill="#bfbfbf" d="M0 0l8.24 162.774 3.53 196.577L8.24 551.3z" data-name="Path 10" />
                      <path
                        fill="url(#linear-gradient)"
                        d="M1.77 0l5.07 116.994v76.18L10 292.141V551.3L1.77 361.863V0z"
                        data-name="Path 11"
                      />
                    </g>
                  </g>
                </g>
              </g>
              <g clipPath="url(#clip-path)" data-name="Mask Group 2" transform="translate(259.708 290.372)">
                <g filter="url(#Rectangle_2301)" transform="translate(-259.71 -290.37)">
                  <g data-name="Rectangle 2301" transform="translate(260 290)">
                    <foreignObject
                      {...((isSafari || isIOS) && {
                        x: (window.innerWidth / 2 - 440) / 2,
                        y: (window.innerHeight - 695) / 2 + 100,
                        height: window.innerHeight / 1.25,
                        width: window.innerWidth / 4,
                      })}
                      {...(!isSafari &&
                        !isIOS && {
                          height: '695',
                          width: '440',
                        })}
                    >
                      <AutIdCard avatar={ipfsCIDToHttpUrl(holderData?.image as string)} />
                    </foreignObject>
                  </g>
                </g>
              </g>
            </g>
          </svg> */}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            height={window.innerHeight}
            viewBox="0 0 960 1075"
          >
            <defs>
              <linearGradient id="linear-gradient" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="#009fe3" />
                <stop offset="0.08" stopColor="#0399de" />
                <stop offset="0.19" stopColor="#0e8bd3" />
                <stop offset="0.3" stopColor="#2072bf" />
                <stop offset="0.41" stopColor="#3a50a4" />
                <stop offset="0.53" stopColor="#5a2583" />
                <stop offset="0.71" stopColor="#453f94" />
                <stop offset="0.88" stopColor="#38519f" />
                <stop offset="1" stopColor="#3458a4" />
              </linearGradient>
              <clipPath id="clip-path">
                <rect
                  id="Rectangle_2934"
                  data-name="Rectangle 2934"
                  width="440"
                  height="694"
                  transform="translate(0.292 -0.372)"
                  fill="#fff"
                  stroke="#707070"
                  strokeWidth="1"
                />
              </clipPath>
              <linearGradient id="linear-gradient-9" x1="0.061" y1="0.343" x2="1.127" y2="0.658" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-10" x1="0.063" y1="0.343" x2="1.133" y2="0.658" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-11" x1="-0.128" y1="0.299" x2="1.167" y2="0.619" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-12" x1="-0.137" y1="0.298" x2="1.178" y2="0.617" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-13" x1="-0.142" y1="0.416" x2="0.952" y2="0.559" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-14" x1="-0.156" y1="0.418" x2="0.951" y2="0.556" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-15" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-16" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-17" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="#0059a6" />
                <stop offset="0.1" stopColor="#0556a1" />
                <stop offset="0.22" stopColor="#134f93" />
                <stop offset="0.35" stopColor="#2c427d" />
                <stop offset="0.49" stopColor="#4e315e" />
                <stop offset="0.53" stopColor="#5a2c54" />
                <stop offset="0.67" stopColor="#353e75" />
                <stop offset="0.8" stopColor="#184c90" />
                <stop offset="0.92" stopColor="#0655a0" />
                <stop offset="1" stopColor="#0059a6" />
              </linearGradient>
              <linearGradient id="linear-gradient-19" x1="0" y1="0.5" x2="1" y2="0.5" xlinkHref="#linear-gradient-17" />
              <linearGradient id="linear-gradient-20" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-21" x1="0" y1="0.5" x2="1" y2="0.5" xlinkHref="#linear-gradient-17" />
              <linearGradient id="linear-gradient-22" x1="0" y1="0.5" x2="1" y2="0.5" xlinkHref="#linear-gradient-17" />
              <linearGradient id="linear-gradient-23" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-24" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-25" x1="0" y1="0.5" x2="1" y2="0.5" xlinkHref="#linear-gradient-17" />
              <linearGradient id="linear-gradient-26" x1="0" y1="0.5" x2="1.001" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-28" x1="0" y1="0.5" x2="1.001" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-29" x1="-2.59" y1="-1.483" x2="-2.575" y2="-1.483" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-35" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-39" x1="0" y1="0.501" y2="0.501" xlinkHref="#linear-gradient" />
              <linearGradient id="linear-gradient-40" x1="0" y1="0.5" x2="0.999" y2="0.5" xlinkHref="#linear-gradient-17" />
              <linearGradient id="linear-gradient-43" x1="0" y1="0.501" y2="0.501" xlinkHref="#linear-gradient" />
            </defs>
            <g id="Group_12569" data-name="Group 12569" transform="translate(-956.615 0)">
              <path id="Line_4" data-name="Line 4" d="M.5,865h-1V0h1Z" transform="translate(1098.5 71.5)" fill="#fff" />
              <path id="Line_5" data-name="Line 5" d="M.5,865h-1V0h1Z" transform="translate(1782.5 71.5)" fill="#fff" />
              <path id="Line_6" data-name="Line 6" d="M.5,680h-1V0h1Z" transform="translate(1182.5 175.5)" fill="#fff" />
              <path id="Line_7" data-name="Line 7" d="M.5,680h-1V0h1Z" transform="translate(1696.5 175.5)" fill="#fff" />
              <path
                id="Line_8"
                data-name="Line 8"
                d="M.366,444.341l-.731-.682,414-444,.731.682Z"
                transform="translate(969.5 636.5)"
                fill="#fff"
              />
              <path id="Line_9" data-name="Line 9" d="M106,.5H0v-1H106Z" transform="translate(1383.5 636.5)" fill="#fff" />
              <path
                id="Line_10"
                data-name="Line 10"
                d="M434.644,441.351l-435-441,.712-.7,435,441Z"
                transform="translate(1485.5 639.5)"
                fill="#fff"
              />
              <path id="Line_11" data-name="Line 11" d="M514,.5H0v-1H514Z" transform="translate(1182.5 175.5)" fill="#fff" />
              <path id="Line_12" data-name="Line 12" d="M684,.5H0v-1H684Z" transform="translate(1098.5 71.5)" fill="#fff" />
              <g id="Layer_1" data-name="Layer 1" transform="translate(1104.385 940.294) rotate(-180)">
                <g id="Group_4" data-name="Group 4">
                  <path id="Path_10" data-name="Path 10" d="M0,0,8.24,256.518l3.53,309.789L8.24,868.794Z" fill="#bfbfbf" />
                  <path
                    id="Path_11"
                    data-name="Path 11"
                    d="M1.77,0,6.84,184.373V304.425L10,460.39v408.4L1.77,570.266V0Z"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g id="Layer_1-2" data-name="Layer 1" transform="translate(968.385 1071.478) rotate(-180)">
                <g id="Group_4-2" data-name="Group 4">
                  <path id="Path_10-2" data-name="Path 10" d="M0,0,8.24,316.361l3.53,382.06L8.24,1071.478Z" fill="#bfbfbf" />
                  <path
                    id="Path_11-2"
                    data-name="Path 11"
                    d="M1.77,0,6.84,227.385v148.06L10,567.8v503.682L1.77,703.3V0Z"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g id="Layer_1-3" data-name="Layer 1" transform="translate(1104.385 937) rotate(-180)">
                <g id="Group_4-3" data-name="Group 4">
                  <path id="Path_10-3" data-name="Path 10" d="M0,0,8.24,255.545l3.53,308.614L8.24,865.5Z" fill="#bfbfbf" />
                  <path
                    id="Path_11-3"
                    data-name="Path 11"
                    d="M1.77,0,6.84,183.673v119.6L10,458.644V865.5L1.77,568.1V0Z"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g id="Layer_1-4" data-name="Layer 1" transform="translate(1182.385 855.5) rotate(-180)">
                <g id="Group_4-4" data-name="Group 4">
                  <path id="Path_10-4" data-name="Path 10" d="M0,0,8.24,200.775l3.53,242.47L8.24,680Z" fill="#bfbfbf" />
                  <path
                    id="Path_11-4"
                    data-name="Path 11"
                    d="M1.77,0,6.84,144.307v93.965L10,360.344V680L1.77,446.343V0Z"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g id="Layer_1-5" data-name="Layer 1" transform="translate(1788.385 937) rotate(-180)">
                <g id="Group_4-5" data-name="Group 4">
                  <path id="Path_10-5" data-name="Path 10" d="M0,0,8.24,255.545l3.53,308.614L8.24,865.5Z" fill="#bfbfbf" />
                  <path
                    id="Path_11-5"
                    data-name="Path 11"
                    d="M1.77,0,6.84,183.673v119.6L10,458.644V865.5L1.77,568.1V0Z"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g id="Layer_1-6" data-name="Layer 1" transform="translate(1702.385 855.5) rotate(-180)">
                <g id="Group_4-6" data-name="Group 4">
                  <path id="Path_10-6" data-name="Path 10" d="M0,0,8.24,200.775l3.53,242.47L8.24,680Z" fill="#bfbfbf" />
                  <path
                    id="Path_11-6"
                    data-name="Path 11"
                    d="M1.77,0,6.84,144.307v93.965L10,360.344V680L1.77,446.343V0Z"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g id="Layer_1-7" data-name="Layer 1" transform="translate(1075.042 79.385) rotate(-90)">
                <g id="Group_4-7" data-name="Group 4">
                  <path id="Path_10-7" data-name="Path 10" d="M0,0,8.24,215.2l3.53,259.885L8.24,728.842Z" fill="#bfbfbf" />
                  <path
                    id="Path_11-7"
                    data-name="Path 11"
                    d="M1.77,0,6.84,154.672V255.386L10,386.227V728.842L1.77,478.4V0Z"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g id="Layer_1-8" data-name="Layer 1" transform="translate(1151.09 182.385) rotate(-90)">
                <g id="Group_4-8" data-name="Group 4">
                  <path id="Path_10-8" data-name="Path 10" d="M0,0,8.24,162.774l3.53,196.577L8.24,551.3Z" fill="#bfbfbf" />
                  <path
                    id="Path_11-8"
                    data-name="Path 11"
                    d="M1.77,0,6.84,116.994v76.18L10,292.141V551.3L1.77,361.863V0Z"
                    fill="url(#linear-gradient)"
                  />
                </g>
              </g>
              <g id="Mask_Group_2" data-name="Mask Group 2" transform="translate(1215.708 263.372)" clipPath="url(#clip-path)">
                <foreignObject
                  {...((isSafari || isIOS) && {
                    x: (window.innerWidth / 2 - 440) / 2,
                    y: (window.innerHeight - 695) / 2 + 100,
                    height: window.innerHeight / 1.25,
                    width: window.innerWidth / 4,
                  })}
                  {...(!isSafari &&
                    !isIOS && {
                      height: '695',
                      width: '440',
                    })}
                >
                  <AutIdCard avatar={ipfsCIDToHttpUrl(holderData?.image as string)} />
                </foreignObject>
              </g>
            </g>
          </svg>
        </AutRightContainer>
      ) : (
        <AutRightMobileContainer>
          <>
            <>
              {/* <AutToolBar
                hideWebComponent={!desktop}
                webComponentPosition={{
                  horizontal: 'center',
                  vertical: 'bottom',
                }}
              /> */}
            </>
            <SvgIcon
              sx={{
                height: pxToRem(40),
                width: pxToRem(40),
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: pxToRem(20),
                fill: 'white',
                cursor: 'pointer',
              }}
              component={ShareIcon}
              onClick={handleClickOpen}
            />
          </>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: pxToRem(50),
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="375.722"
              height="439.391"
              viewBox="0 0 375.722 439.391"
            >
              <defs>
                <linearGradient id="linear-gradient" x2="1" y1="0.5" y2="0.5" gradientUnits="objectBoundingBox">
                  <stop offset="0" stopColor="#009fe3" />
                  <stop offset="0.08" stopColor="#0399de" />
                  <stop offset="0.19" stopColor="#0e8bd3" />
                  <stop offset="0.3" stopColor="#2072bf" />
                  <stop offset="0.41" stopColor="#3a50a4" />
                  <stop offset="0.53" stopColor="#5a2583" />
                  <stop offset="0.71" stopColor="#453f94" />
                  <stop offset="0.88" stopColor="#38519f" />
                  <stop offset="1" stopColor="#3458a4" />
                </linearGradient>
                <clipPath id="clip-path">
                  <path
                    fill="#fff"
                    stroke="#707070"
                    strokeWidth="1"
                    d="M0 0H206V325H0z"
                    data-name="Rectangle 3377"
                    transform="translate(-.06 -.325)"
                  />
                </clipPath>
                <linearGradient id="linear-gradient-3" x1="0.061" x2="1.127" y1="0.343" y2="0.658" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-4" x1="0.063" x2="1.133" y1="0.343" y2="0.658" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-5" x1="-0.128" x2="1.167" y1="0.299" y2="0.619" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-6" x1="-0.137" x2="1.178" y1="0.298" y2="0.617" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-7" x1="-0.142" x2="0.952" y1="0.416" y2="0.559" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-8" x1="-0.156" x2="0.951" y1="0.418" y2="0.556" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-9" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-10" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-11" x2="1" y1="0.5" y2="0.5" gradientUnits="objectBoundingBox">
                  <stop offset="0" stopColor="#0059a6" />
                  <stop offset="0.1" stopColor="#0556a1" />
                  <stop offset="0.22" stopColor="#134f93" />
                  <stop offset="0.35" stopColor="#2c427d" />
                  <stop offset="0.49" stopColor="#4e315e" />
                  <stop offset="0.53" stopColor="#5a2c54" />
                  <stop offset="0.67" stopColor="#353e75" />
                  <stop offset="0.8" stopColor="#184c90" />
                  <stop offset="0.92" stopColor="#0655a0" />
                  <stop offset="1" stopColor="#0059a6" />
                </linearGradient>
                <linearGradient id="linear-gradient-13" x1="0" x2="1" y1="0.5" y2="0.5" xlinkHref="#linear-gradient-11" />
                <linearGradient id="linear-gradient-14" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-15" x1="0" x2="1" y1="0.5" y2="0.5" xlinkHref="#linear-gradient-11" />
                <linearGradient id="linear-gradient-16" x1="0" x2="1" y1="0.5" y2="0.5" xlinkHref="#linear-gradient-11" />
                <linearGradient id="linear-gradient-17" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-18" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-19" x1="0" x2="1" y1="0.5" y2="0.5" xlinkHref="#linear-gradient-11" />
                <linearGradient id="linear-gradient-20" x1="0" x2="1.001" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-22" x1="0" x2="1.001" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-23" x1="-2.59" x2="-2.575" y1="-1.483" y2="-1.483" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-29" x1="0" y1="0.5" y2="0.5" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-33" x1="0" y1="0.501" y2="0.501" xlinkHref="#linear-gradient" />
                <linearGradient id="linear-gradient-34" x1="0" x2="0.999" y1="0.5" y2="0.5" xlinkHref="#linear-gradient-11" />
                <linearGradient id="linear-gradient-37" x1="0" y1="0.501" y2="0.501" xlinkHref="#linear-gradient" />
              </defs>
              <g data-name="Group 12379" transform="translate(-.134 -112.45)">
                <path fill="#fff" d="M.5 404.557h-1V0h1z" data-name="Line 30" transform="translate(348.36 114.268)" />
                <path fill="#fff" d="M.5 318.033h-1V0h1z" data-name="Line 32" transform="translate(308.139 162.908)" />
                <path
                  fill="#fff"
                  d="M.366 173.325l-.731-.682L160.884-.341l.731.682z"
                  data-name="Line 33"
                  transform="translate(.5 378.516)"
                />
                <path fill="#fff" d="M49.576.5H0v-1h49.576z" data-name="Line 34" transform="translate(161.75 378.516)" />
                <path
                  fill="#fff"
                  d="M165.689 168.932L-.356.351l.712-.7L166.4 168.23z"
                  data-name="Line 35"
                  transform="translate(209.455 379.919)"
                />
                <g data-name="Layer 1" transform="rotate(-180 175.556 259.53)">
                  <g data-name="Group 4">
                    <path fill="#bfbfbf" d="M0 0l3.854 119.517L5.5 263.855 3.854 404.791z" data-name="Path 10" />
                    <path
                      fill="url(#linear-gradient)"
                      d="M0 0l2.371 85.9v55.935l1.478 72.667v190.289L0 265.7V0z"
                      data-name="Path 11"
                      transform="translate(.828)"
                    />
                  </g>
                </g>
                <g data-name="Layer 1" transform="rotate(-180 155.446 240.47)">
                  <g data-name="Group 4">
                    <path fill="#bfbfbf" d="M0 0l3.854 93.9L5.5 207.3 3.854 318.033z" data-name="Path 10" />
                    <path
                      fill="url(#linear-gradient)"
                      d="M0 0l2.371 67.492v43.947l1.478 57.093v149.5L0 208.753V0z"
                      data-name="Path 11"
                      transform="translate(.828)"
                    />
                  </g>
                </g>
                <g clipPath="url(#clip-path)" fill="transparent" data-name="Mask Group 5" transform="translate(83.463 203.998)">
                  <path d="M0 0H206V325H0z" data-name="Rectangle 3376" transform="translate(-.06 -.325)" />
                  <g stroke="#fff" strokeWidth="1" data-name="Rectangle 3376" transform="translate(-.06 -.325)">
                    <foreignObject
                      {...((isSafari || isIOS) && {
                        x: (375.722 - 206) / 2,
                        y: (439.391 - 325) / 2 + 50,
                        height: '325',
                        width: '206',
                      })}
                      {...(!isSafari &&
                        !isIOS && {
                          height: '325',
                          width: '206',
                        })}
                    >
                      <AutIdCard avatar={ipfsCIDToHttpUrl(holderData?.image as string)} />
                    </foreignObject>
                  </g>
                </g>
                <path fill="#fff" d="M.5 404.557h-1V0h1z" data-name="Line 29" transform="translate(28.456 114.268)" />
                <path fill="#fff" d="M.5 318.033h-1V0h1z" data-name="Line 31" transform="translate(67.743 162.908)" />
                <path fill="#fff" d="M240.4.5H0v-1h240.4z" data-name="Line 36" transform="translate(67.743 162.908)" />
                <path fill="#fff" d="M319.9.5H0v-1h319.9z" data-name="Line 37" transform="translate(28.456 114.268)" />
                <g data-name="Layer 1" transform="rotate(-180 15.605 260.3)">
                  <g data-name="Group 4">
                    <path fill="#bfbfbf" d="M0 0l3.854 119.972L5.5 264.859 3.854 406.332z" data-name="Path 10" />
                    <path
                      fill="url(#linear-gradient)"
                      d="M0 0l2.371 86.23v56.148l1.478 72.944v191.01L0 266.711V0z"
                      data-name="Path 11"
                      transform="translate(.828)"
                    />
                  </g>
                </g>
                <g data-name="Layer 1" transform="rotate(-180 15.605 259.53)">
                  <g data-name="Group 4">
                    <path fill="#bfbfbf" d="M0 0l3.854 119.517L5.5 263.855 3.854 404.791z" data-name="Path 10" />
                    <path
                      fill="url(#linear-gradient)"
                      d="M0 0l2.371 85.9v55.935l1.478 72.667v190.289L0 265.7V0z"
                      data-name="Path 11"
                      transform="translate(.828)"
                    />
                  </g>
                </g>
                <g data-name="Layer 1" transform="rotate(-180 33.844 240.47)">
                  <g data-name="Group 4">
                    <path fill="#bfbfbf" d="M0 0l3.854 93.9L5.5 207.3 3.854 318.033z" data-name="Path 10" />
                    <path
                      fill="url(#linear-gradient)"
                      d="M0 0l2.371 67.492v43.947l1.478 57.093v149.5L0 208.753V0z"
                      data-name="Path 11"
                      transform="translate(.828)"
                    />
                  </g>
                </g>
                <g data-name="Layer 1" transform="rotate(-90 67.72 50.235)">
                  <g data-name="Group 4">
                    <path fill="#bfbfbf" d="M0 0l3.854 100.646L5.5 222.193 3.854 340.876z" data-name="Path 10" />
                    <path
                      fill="url(#linear-gradient)"
                      d="M0 0l2.371 72.34v47.1l1.478 61.194v160.24L0 223.747V0z"
                      data-name="Path 11"
                      transform="translate(.828)"
                    />
                  </g>
                </g>
                <g data-name="Layer 1" transform="rotate(-90 109.59 56.537)">
                  <g data-name="Group 4">
                    <path fill="#bfbfbf" d="M0 0l3.854 76.129L5.5 168.067l-1.646 89.771z" data-name="Path 10" />
                    <path
                      fill="url(#linear-gradient)"
                      d="M0 0l2.371 54.718v35.629l1.478 46.287v121.204L0 169.242V0z"
                      data-name="Path 11"
                      transform="translate(.828)"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </Box>
        </AutRightMobileContainer>
      )}
    </>
  );
};

export default AutTunnelRight;
