import { IsAuthenticated } from '@auth/auth.reducer';
import { HolderStatus, fetchHolder } from '@store/holder/holder.reducer';
import { ResultState } from '@store/result-status';
import { useAppDispatch } from '@store/store.model';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, styled, useMediaQuery, useTheme } from '@mui/material';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// import required modules
import { Mousewheel, Pagination } from 'swiper';

import AutLeft from './AutLeft/Left';
import AutTunnelRight from './AutRight/Right';

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
  const status = useSelector(HolderStatus);
  const params = useParams<{ holderAddress: string }>();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(fetchHolder(params.holderAddress));
    }
  }, [isAuthenticated]);

  const desktop = useMediaQuery('(min-width:769px)');
  return (
    <>
      {desktop ? (
        <AutContainer>
          <AutLeft {...props} />
          {status === ResultState.Success && <AutTunnelRight />}
        </AutContainer>
      ) : (
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
          <SwiperSlide>
            <AutLeft {...props} />
          </SwiperSlide>
          {status === ResultState.Success && (
            <SwiperSlide>
              <AutTunnelRight />
            </SwiperSlide>
          )}
        </AutSwiper>
      )}
    </>
  );
};

export default AutHolder;
