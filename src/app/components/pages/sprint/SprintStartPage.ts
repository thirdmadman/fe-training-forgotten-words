import './SprintStartPage.scss';

export function SprintStartPage() {
  // gameDescription: HTMLElement;

  // startButton: HTMLElement;

  // group: number;

  // page: number;

  // arrayAnswers: IGameAnswer[];

  // title: HTMLElement;

  // mainContainer: HTMLElement;

  // buttonsContainer: HTMLElement;

  // buttonContainerText: HTMLElement;

  // levelBtnContainer: HTMLElement;

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // onStartGame = (group: number, page: number) => {};

  // constructor(group: number, page: number) {
  //   super();
  //   this.group = group;
  //   this.page = page;
  //   this.arrayAnswers = [];
  //   this.title = dch('h2', ['sprint-page__title'], 'MEANING RESOLVING');
  //   this.gameDescription = dch(
  //     'div',
  //     ['sprint-page__text'],
  //     `Your time is limited.<br>
  //     Make decisions - is it correct match of word meaning.`,
  //   );

  //   this.startButton = dch('button', ['sprint-page__button'], 'START RESOLVING');
  //   this.startButton.addEventListener('click', () => {
  //     this.onStartGame(this.group, this.page);
  //   });

  //   this.buttonsContainer = dch('div', ['button-container']);
  //   this.buttonContainerText = dch('p', ['button-container__text'], 'Choose your level of depth');
  //   this.levelBtnContainer = dch('div', ['level-button-container']);

  //   const getRandomInt = (min: number, max: number) => {
  //     const minAggregated = Math.ceil(min);
  //     const maxAggregated = Math.floor(max);
  //     return Math.floor(Math.random() * (maxAggregated - minAggregated + 1)) + minAggregated;
  //   };

  //   if (this.group < 0 && this.page < 0) {
  //     this.group = 0;
  //     this.page = 0;

  //     for (let i = 0; i < GlobalConstants.NUMBER_OF_GROUP_NO_AUTH_USER; i += 1) {
  //       const levelBtn = dch('button', ['level-button'], `${i + 1}`);
  //       this.levelBtnContainer.append(levelBtn);

  //       levelBtn.addEventListener('click', () => {
  //         this.group = i;
  //         this.page = getRandomInt(0, GlobalConstants.NUMBER_OF_PAGES - 1);

  //         Array.from(this.levelBtnContainer.children).forEach((node) =>
  // node.classList.remove('level-button-active'));

  //         levelBtn.classList.add('level-button-active');
  //       });
  //     }

  //     this.buttonsContainer.append(
  //       this.buttonContainerText,
  //       this.levelBtnContainer,
  //     );
  //   }

  //   this.buttonsContainer.append(
  //     this.startButton,
  //   );

  //   this.mainContainer = dch('div', ['sprint-page__main'], '', this.title, this.gameDescription);
  //   this.rootNode = dch('div', ['sprint-page'], '', this.mainContainer, this.buttonsContainer);
  // }
  return '';
}
