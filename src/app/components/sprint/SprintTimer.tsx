import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setRemainTime } from '../../redux/features/mini-game/timer/timerSlice';
import { RootState } from '../../store';

interface SprintTimerProps {
  timerTime: number;
  timerOnFinishAction: () => void;
}
export function SprintTimer(props: SprintTimerProps) {
  const { timerTime, timerOnFinishAction } = props;
  const timerRemainTime = useAppSelector((state: RootState) => state.timer.timerRemainTime);
  const isMenuHidden = useAppSelector((state: RootState) => state.menu.isHidden);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (timerRemainTime === -1) {
      dispatch(setRemainTime(timerTime));
    } else if (timerRemainTime > 0 && isMenuHidden) {
      window.setTimeout(() => dispatch(setRemainTime(timerRemainTime - 1)), 1000);
    } else {
      timerOnFinishAction();
    }
  });

  return <div className="mini-game-page__timer-text">{timerRemainTime}</div>;
}
