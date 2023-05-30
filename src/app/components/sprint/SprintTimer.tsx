import { useEffect, useState } from 'react';

interface SprintTimerProps {
  timerTime: number;
  timerOnFinishAction: () => void;
}

export function SprintTimer(props: SprintTimerProps) {
  const { timerTime, timerOnFinishAction } = props;
  const [timerRemainTime, setTimerRemainTime] = useState(timerTime);

  useEffect(() => {
    if (timerRemainTime > 0) {
      window.setTimeout(() => {
        setTimerRemainTime(timerRemainTime - 1);
      }, 1000);
    } else {
      timerOnFinishAction();
    }
  });

  return <div className="mini-game-page__timer-text">{timerRemainTime}</div>;
}
