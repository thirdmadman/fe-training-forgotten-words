import { IResultData } from '../../interfaces/IResultData';
import './StatisticPage.scss';

interface StatisticPageProps {
  title: string;
  resultData: Array<IResultData>;
  answerChain: number;
}

export function StatisticPage(props: StatisticPageProps) {
  // resultData: IResultData[];

  // resultContainer: HTMLElement;

  // date: string;

  // statisticContainer: HTMLElement;

  // title: HTMLElement;

  // correctWordsContainer: HTMLElement;

  // inCorrectWordsContainer: HTMLElement;

  // constructor(resultData: IResultData[], answerChain: number) {
  //   super();
  //   this.resultData = resultData;
  //   this.title = dch('h3', ['result-page__title'], 'MEANING RESOLVING');
  //   const subTitle = dch('div', ['result-page__subtitle'], 'results');
  //   const rightResult = this.resultData.filter((el) => el.isCorrect).length;
  //   const wrongResult = this.resultData.length - rightResult;
  //   const rightCount = dch('div', ['result-words__title', 'count'], `${rightResult}`);
  //   const wrongCount = dch('div', ['result-words__title', 'count'], `${wrongResult}`);
  //   const rightTitle = dch('div', ['result-words__title'], 'correct');
  //   const wrongTitle = dch('div', ['result-words__title'], 'incorrect');
  //   const rightTitleContainer = dch('div', ['title-container'], '', rightTitle, rightCount);
  //   const wrongTitleContainer = dch('div', ['title-container'], '', wrongTitle, wrongCount);
  //   this.correctWordsContainer = dch('div', ['result-words-container'], '');
  //   this.inCorrectWordsContainer = dch('div', ['result-words-container'], '');

  //   this.resultData.forEach((item) => {
  //     const userId = TokenProvider.getUserId();

  //     if (userId && !TokenProvider.checkIsExpired()) {
  //       UserWordService.setWordStatistic(userId, item.questionData.id, item.isCorrect)
  //         .catch((e) => console.error(e));
  //     }

  //     const word = dch(
  //       'p',
  //       ['button-word__text-item'],
  //       `${item.questionData.wordTranslate}`,
  //     );
  //     const wordTranslate = dch(
  //       'p',
  //       ['button-word__text-item'],
  //       `${item.questionData.word}`,
  //     );
  //     const buttonWordText = dch(
  //       'div',
  //       ['button-word__text'],
  //       '',
  //       word,
  //       wordTranslate,
  //     );
  //     const buttonWordAudio = dch(
  //       'button',
  //       ['button-word__audio-btn'],
  //     );
  //     const audioWordData = `${GlobalConstants.DEFAULT_API_URL}/${item.questionData.audio}`;
  //     buttonWordAudio.onclick = () => {
  //       this.playAudio(audioWordData);
  //     };
  //     const buttonWord = dch('div', ['button-word'], '', buttonWordText, buttonWordAudio);

  //     if (item.isCorrect) {
  //       this.correctWordsContainer.append(buttonWord);
  //     } else {
  //       this.inCorrectWordsContainer.append(buttonWord);
  //     }
  //   });

  //   this.statisticContainer = dch('p', ['result-page__chain-text'], `The longest answer Chain: ${answerChain}`);
  //   this.resultContainer = dch('div', ['result-container']);
  //   this.rootNode = dch(
  //     'div',
  //     ['result-page'],
  //     '',
  //     this.title,
  //     subTitle,
  //     this.statisticContainer,
  //     rightTitleContainer,
  //     this.correctWordsContainer,
  //     wrongTitleContainer,
  //     this.inCorrectWordsContainer,
  //   );
  //   this.date = this.formatDate(new Date());
  // }

  // playAudio = (audio: string) => {
  //   musicPlayer.setPlayList([audio]);
  //   musicPlayer.play()
  //     .catch((e) => console.error(e));
  // };

  // formatDate = (date: Date) => date.toLocaleDateString('ru-RU', {
  //   day: 'numeric',
  //   month: 'numeric',
  //   year: 'numeric',
  // });

  const { title, resultData, answerChain } = props;

  const correctAnswers = resultData.filter((answer) => answer.isCorrect);
  const inCorrectAnswers = resultData.filter((answer) => !answer.isCorrect);

  const creteResultCard = (result: IResultData) => {
    const { questionData } = result;

    return (
      <div className="button-word" key={questionData.id}>
        <div className="button-word__text">
          <p className="button-word__text-item">{questionData.wordTranslate}</p>
          <p className="button-word__text-item">{questionData.word}</p>
        </div>
        <button type="button" className="button-word__audio-btn" aria-label="audio" />
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
