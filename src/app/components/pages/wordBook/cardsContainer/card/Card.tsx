/* eslint-disable react/no-danger */
import { useState } from 'react';
import { IWordAdvanced } from '../../../../../interfaces/IWordAdvanced';
import { GlobalConstants } from '../../../../../../GlobalConstants';
import { musicPlayer } from '../../../../../services/SingleMusicPlayer';
import './Card.scss';

export interface CardProps {
  wordAdvanced: IWordAdvanced;
}

export function Card(props: CardProps) {
  const { wordAdvanced } = props;

  const {
    word,
    transcription,
    textMeaning,
    textExample,
    wordTranslate,
    textMeaningTranslate,
    textExampleTranslate,
    image,
    audio,
    audioMeaning,
    audioExample,
  } = wordAdvanced.word;

  const [isEngDescriptionShown, setIsEngDescriptionShown] = useState(false);
  const [isRuDescriptionShown, setIsRuDescriptionShown] = useState(false);

  const playWordAudio = () => {
    musicPlayer.setPlayList([`${GlobalConstants.API_URL}/${audio}`]);
    musicPlayer.setVolume(0.7);
    musicPlayer.play().catch((e) => console.error(e));
  };

  const playFullAudio = () => {
    musicPlayer.setVolume(0.7);
    musicPlayer.setPlayList([
      `${GlobalConstants.API_URL}/${audio}`,
      `${GlobalConstants.API_URL}/${audioMeaning}`,
      `${GlobalConstants.API_URL}/${audioExample}`,
    ]);
    musicPlayer.play().catch(() => {});
  };

  // if (!userId) {
  //   return;
  // }

  // imageContainer.append(this.buttonSetDifficultyState, this.buttonSetLearnedState);

  // if (!this.data.userData) {
  //   return;
  // }

  // if (this.data.userData.difficulty && this.data.userData.difficulty !== 'normal') {
  //   this.isWordDifficult = true;
  //   this.buttonSetDifficultyState.classList.add('word-card__button-difficulty_true');
  // }

  // if (!this.data.userData.optional) {
  //   return;
  // }

  // const resultText = `${this.data.userData.optional.successCounter}/
  // ${this.data.userData.optional.failCounter + this.data.userData.optional.successCounter}`;

  // const gamesResultContainer = dch('div', ['word-card__games-result'], resultText);
  // imageContainer.append(gamesResultContainer);
  // this.image.classList.add('word-card__image_started');

  // if (this.data.userData.optional.isLearned) {
  //   this.image.classList.add('word-card__image_learned');
  //   this.isWordLearned = true;
  //   this.buttonSetLearnedState.classList.add('word-card__button-learned_true');
  // }

  // const buttonToggleDifficultyHandler() {
  //   const userId = TokenProvider.getUserId();
  //   if (!userId) {
  //     return;
  //   }
  //   if (!this.isWordDifficult) {
  //     UserWordService.setWorDifficultById(userId, this.data.word.id)
  //       .then((userWord) => {
  //         if (userWord) {
  //           this.isWordDifficult = true;
  //           this.buttonSetDifficultyState.classList.add('word-card__button-difficulty_true');
  //         }
  //       })
  //       .catch(() => {});
  //   } else {
  //     UserWordService.setWordNormalById(userId, this.data.word.id)
  //       .then((userWord) => {
  //         if (userWord) {
  //           this.isWordDifficult = false;
  //           this.buttonSetDifficultyState.classList.remove('word-card__button-difficulty_true');
  //         }
  //       })
  //       .catch(() => {});
  //   }
  // };

  // const buttonToggleLearnedHandler() {
  //   const userId = TokenProvider.getUserId();
  //   if (!userId) {
  //     return;
  //   }
  //   if (!this.isWordLearned) {
  //     UserWordService.addWordLearnedById(userId, this.data.word.id)
  //       .then((userWord) => {
  //         if (userWord) {
  //           this.isWordLearned = true;
  //           this.image.classList.add('word-card__image_learned');
  //           this.buttonSetLearnedState.classList.add('word-card__button-learned_true');
  //         }
  //       })
  //       .catch(() => {});
  //   } else {
  //     UserWordService.removeWordFromLearnedById(userId, this.data.word.id)
  //       .then((userWord) => {
  //         if (userWord) {
  //           this.isWordLearned = false;
  //           this.image.classList.remove('word-card__image_learned');
  //           this.buttonSetLearnedState.classList.remove('word-card__button-learned_true');
  //         }
  //       })
  //       .catch(() => {});
  //   }
  // }

  const imagePath = `${GlobalConstants.API_URL}/${image}`;

  return (
    <div className="word-card">
      <div className="word-card__image-container">
        <img className="word-card__image" src={imagePath} alt={word} />
      </div>
      <div className="word-card__text-container">
        <button
          className="word-card__button-vertical word-card__button-vertical_show"
          aria-label="Show card description"
          type="button"
          onClick={() => setIsEngDescriptionShown(!isEngDescriptionShown)}
        />
        <div className="word-card__word-english">{word}</div>
        <div className="word-card__word-transcription">{transcription}</div>
      </div>
      <button className="word-card__play-word" aria-label="Play word" type="button" onClick={playWordAudio} />
      <div
        className={`word-card__eng-description-container ${
          isEngDescriptionShown ? '' : 'word-card__eng-description-container_hidden'
        }`}
      >
        <button
          className="word-card__button-vertical word-card__button-vertical_hide"
          aria-label="Hide card description"
          type="button"
          onClick={() => setIsEngDescriptionShown(false)}
        />
        <div className="word-card__text-eng-meaning">
          <p dangerouslySetInnerHTML={{ __html: textMeaning }} />
        </div>
        <button
          className="word-card__play-full-word"
          aria-label="Play full word"
          type="button"
          onClick={playFullAudio}
        />
        <div className="word-card__text-eng-example">
          <p dangerouslySetInnerHTML={{ __html: textExample }} />
        </div>
        <button
          className="word-card__button-vertical word-card__button-vertical_show"
          aria-label="Show ru translation"
          type="button"
          onClick={() => setIsRuDescriptionShown(true)}
        />
      </div>
      <div
        className={`word-card__ru-description-container ${
          isRuDescriptionShown ? '' : 'word-card__ru-description-container_hidden'
        }`}
      >
        <button
          className="word-card__button-vertical word-card__button-vertical_hide"
          aria-label="Hide description and example on russian"
          type="button"
          onClick={() => setIsRuDescriptionShown(false)}
        />
        <div className="word-card__text-ru-word">{wordTranslate}</div>
        <div className="word-card__text-ru-meaning">
          <p dangerouslySetInnerHTML={{ __html: textMeaningTranslate }} />
        </div>
        <div className="word-card__text-ru-example">
          <p dangerouslySetInnerHTML={{ __html: textExampleTranslate }} />
        </div>
      </div>
    </div>
  );
}
