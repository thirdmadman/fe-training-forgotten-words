import { GlobalConstants } from '../../../GlobalConstants';
import { IResultData } from '../../interfaces/IResultData';
import { musicPlayer } from '../../services/SingleMusicPlayer';
import './StatisticPage.scss';

interface StatisticPageProps {
  title: string;
  resultData: Array<IResultData>;
  answerChain: number;
}

export function StatisticPage(props: StatisticPageProps) {
  const { title, resultData, answerChain } = props;

  const correctAnswers = resultData.filter((answer) => answer.isCorrect);
  const inCorrectAnswers = resultData.filter((answer) => !answer.isCorrect);

  const playAudio = (audio: string) => {
    musicPlayer.setPlayList([audio]);
    musicPlayer.play().catch((e) => console.error(e));
  };

  // useEffect(() => {
  //   resultData.forEach((result) => {
  //     const userId = TokenProvider.getUserId();

  //     if (userId && !TokenProvider.checkIsExpired()) {
  //       UserWordService.setWordStatistic(userId, result.questionData.id, result.isCorrect).catch((e) =>
  //         console.error(e),
  //       );
  //     }
  //   });
  // }, []);

  const creteResultCard = (result: IResultData) => {
    const { questionData } = result;
    const audioWordData = `${GlobalConstants.DEFAULT_API_URL}/${questionData.audio}`;

    return (
      <div className="button-word" key={questionData.id}>
        <div className="button-word__text">
          <p className="button-word__text-item">{questionData.wordTranslate}</p>
          <p className="button-word__text-item">{questionData.word}</p>
        </div>
        <button
          type="button"
          className="button-word__audio-btn"
          aria-label="audio"
          onClick={() => playAudio(audioWordData)}
        />
      </div>
    );
  };

  return (
    <div className="result-page">
      <h3 className="result-page__title">{title}</h3>
      <div className="result-page__subtitle">results</div>
      <p className="result-page__chain-text">The longest answer Chain: {answerChain}</p>
      <div className="title-container">
        <div className="result-words__title">correct</div>
        <div className="result-words__title count">{correctAnswers.length}</div>
      </div>
      <div className="result-words-container">{correctAnswers.map((answer) => creteResultCard(answer))}</div>
      <div className="title-container">
        <div className="result-words__title">incorrect</div>
        <div className="result-words__title count">{inCorrectAnswers.length}</div>
      </div>
      <div className="result-words-container">{inCorrectAnswers.map((answer) => creteResultCard(answer))}</div>
    </div>
  );
}