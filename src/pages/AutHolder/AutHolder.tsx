import { HolderStatus, HolderData } from '@store/holder/holder.reducer';
import { ResultState } from '@store/result-status';
import { useAppDispatch } from '@store/store.model';
import { useSelector } from 'react-redux';
import { styled, useMediaQuery, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { AutShareDialog } from '@components/AutShare';
import { setOpenShare } from '@store/ui-reducer';
import { DautPlaceholder } from '@components/DautPlaceholder';
import AutLeft from './AutLeft/Left';
import AutTunnelRight from './AutRight/Right';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const AutContainer = styled('div')(() => ({
  display: 'flex',
  height: '100%',
}));
const AutSwiper = styled(Swiper)(({ theme }) => ({
  height: '100%',
  '.swiper-pagination-bullet': {
    backgroundColor: theme.palette.background.paper,
  },
}));

const AutHolder = (props) => {
  const dispatch = useAppDispatch();
  const { openShare } = useSelector((state: any) => state.ui);
  const status = useSelector(HolderStatus);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const holderData = useSelector(HolderData);

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
          {status === ResultState.Success && <AutTunnelRight />}
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
          <DautPlaceholder hide={status === ResultState.Loading} horizontal="center" vertical="bottom" />
        </>
      )}
    </>
  );
};

export default AutHolder;
