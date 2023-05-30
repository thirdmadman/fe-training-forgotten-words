import { useEffect, useState } from 'react';

interface SprintTimerProps {
  timerTime: number;
  timerOnFinishAction: () => void;
}

interface SprintTimerState {
  timerRemainTime: number;
}

export function SprintTimer(props: SprintTimerProps) {
  const { timerTime, timerOnFinishAction } = props;
  const initialState = {
    timerRemainTime: timerTime,
  };
  const [state, setState] = useState<SprintTimerState>(initialState);
  const { timerRemainTime } = state;

  useEffect(() => {
    if (timerRemainTime > 0) {
      window.setTimeout(() => {
        setState({
          timerRemainTime: timerRemainTime - 1,
        });
      }, 1000);
    } else {
      timerOnFinishAction();
    }
  });

  return <div className="mini-game-page__timer-text">{timerRemainTime}</div>;
}
