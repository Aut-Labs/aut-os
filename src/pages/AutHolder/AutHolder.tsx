import { IsAuthenticated } from '@auth/auth.reducer';
import { HolderStatus, fetchHolder, HolderData } from '@store/holder/holder.reducer';
import { ResultState } from '@store/result-status';
import { useAppDispatch } from '@store/store.model';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { styled, useMediaQuery } from '@mui/material';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// import required modules
import { Mousewheel, Pagination } from 'swiper';

import { AutShareDialog } from '@components/AutShare';
import { setOpenShare } from '@store/ui-reducer';
import AutLeft from './AutLeft/Left';
import AutTunnelRight from './AutRight/Right';
import AutToolBar from './AutLeft/AutToolBar';

const AutContainer = styled('div')(() => ({
  display: 'flex',
  height: '100%',
  backgroundColor: '#000000',
}));
const AutSwiper = styled(Swiper)(({ theme }) => ({
  height: '100%',
  '.swiper-pagination-bullet': {
    backgroundColor: theme.palette.background.paper,
  },
}));

const AutHolder = (props) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(IsAuthenticated);
  const { openShare } = useSelector((state: any) => state.ui);
  const status = useSelector(HolderStatus);
  const params = useParams<{ holderAddress: string }>();
  const desktop = useMediaQuery('(min-width:1024px)');
  const holderData = useSelector(HolderData);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(fetchHolder(params.holderAddress));
    }
  }, [isAuthenticated]);

  const handleClose = () => {
    dispatch(setOpenShare(false));
  };

  const url = `https://my.aut.id/${holderData?.name}`;

  return (
    <>
      <AutShareDialog
        open={openShare}
        url={url}
        hideCloseBtn={false}
        title="Show off your ĀutID  🙌"
        description={
          <>
            Hello, friend 🖖
            <br />
            <br />
            This is my ĀutID - and it’s the first identity I can truly own.
            <br />
            I will shape it, and it will grow with me & the Communities I commit to.
            <br />
            <br />
            Follow my journey - and see you on the āuter space 🪐
            <br />
            {url}
          </>
        }
        twitterProps={{
          // eslint-disable-next-line max-len
          title: `Hello, friend 🖖 This is my ĀutID - and it’s the first identity I can truly own. I will shape it, and it will grow with me & the Communities I commit to. Follow my journey - and see you on the āuter space 🪐`,
          hashtags: ['Aut', 'DAO', 'Blockchain'],
        }}
        onClose={handleClose}
      />
      {desktop ? (
        <AutContainer>
          <AutLeft {...props} />
          {/* {status === ResultState.Success && <AutTunnelRight />} */}
        </AutContainer>
      ) : (
        <>
          <AutSwiper
            direction="horizontal"
            slidesPerView={1}
            spaceBetween={30}
            mousewheel
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {status === ResultState.Success && (
              <SwiperSlide>
                <AutTunnelRight />
              </SwiperSlide>
            )}
            <SwiperSlide>
              <AutLeft {...props} />
            </SwiperSlide>
          </AutSwiper>
          {!desktop && <AutToolBar hideLogo />}
        </>
      )}
    </>
  );
};

export default AutHolder;
