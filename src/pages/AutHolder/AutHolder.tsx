import { IsAuthenticated } from '@auth/auth.reducer';
import { styled } from '@mui/material';
import { HolderStatus, fetchHolder } from '@store/holder/holder.reducer';
import { ResultState } from '@store/result-status';
import { useAppDispatch } from '@store/store.model';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AutLeft from './AutLeft/Left';
import AutTunnelRight from './AutRight/Right';

const AutContainer = styled('div')(() => ({
  display: 'flex',
  height: '100%',
  backgroundColor: '#000000',
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

  return (
    <AutContainer>
      <AutLeft {...props} />
      {status === ResultState.Success && <AutTunnelRight />}
    </AutContainer>
  );
};

export default AutHolder;
