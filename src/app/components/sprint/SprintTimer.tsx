import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRemainTime } from '../../redux/features/timer/timerSlice';
import { RootState } from '../../store';

interface SprintTimerProps {
  timerTime: number;
  timerOnFinishAction: () => void;
}
export function SprintTimer(props: SprintTimerProps) {
  const { timerTime, timerOnFinishAction } = props;
  const timerRemainTime = useSelector((state: RootState) => state.timerReducer.timerRemainTime);
  const dispatch = useDispatch();

  useEffect(() => {
    if (timerRemainTime === -1) {
      dispatch(setRemainTime(timerTime));
    } else if (timerRemainTime > 0) {
      window.setTimeout(() => dispatch(setRemainTime(timerRemainTime - 1)), 1000);
    } else {
      timerOnFinishAction();
    }
  });

  return <div className="mini-game-page__timer-text">{timerRemainTime}</div>;
}
