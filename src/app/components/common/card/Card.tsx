/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';
import { IWordAdvanced } from '../../../interfaces/IWordAdvanced';
import { GlobalConstants } from '../../../../GlobalConstants';
import { musicPlayer } from '../../../services/SingleMusicPlayer';
import './Card.scss';
import { TokenProvider } from '../../../services/TokenProvider';
import { UserWordService } from '../../../services/UserWordService';
import DataLocalStorageProvider from '../../../services/DataLocalStorageProvider';
import { Spinner } from '../spinner/Spinner';

export interface CardProps {
  wordAdvanced: IWordAdvanced;
}

interface CardState {
  isEngDescriptionShown: boolean;
  isRuDescriptionShown: boolean;
  isWordDifficult: boolean;
  isWordLearned: boolean;
  isImageLoaded: boolean;
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

  const initialState = {
    isEngDescriptionShown: false,
    isRuDescriptionShown: false,
    isWordDifficult: false,
    isWordLearned: false,
    isImageLoaded: false,
  };

  const [state, setState] = useState<CardState>(initialState);

  const { isEngDescriptionShown, isRuDescriptionShown, isWordDifficult, isWordLearned, isImageLoaded } = state;

  const userConfigs = DataLocalStorageProvider.getData();

  const soundsVolumeMultiplier = userConfigs.userConfigs.soundsLevel;

  const playWordAudio = () => {
    musicPlayer.setPlayList([`${GlobalConstants.API_URL}/${audio}`]);
    musicPlayer.setVolume(0.7 * soundsVolumeMultiplier);
    musicPlayer.play().catch((e) => console.error(e));
  };

  const playFullAudio = () => {
    musicPlayer.setVolume(0.7 * soundsVolumeMultiplier);
    musicPlayer.setPlayList([
      `${GlobalConstants.API_URL}/${audio}`,
      `${GlobalConstants.API_URL}/${audioMeaning}`,
      `${GlobalConstants.API_URL}/${audioExample}`,
    ]);
    musicPlayer.play().catch((e) => console.error(e));
  };

  const isLearnStarted = Boolean(wordAdvanced.userData?.optional);

  const getGameResult = () => {
    const successCounter = wordAdvanced.userData?.optional?.successCounter;
    const failCounter = wordAdvanced.userData?.optional.failCounter;
    if (successCounter !== undefined && failCounter !== undefined) {
      if (successCounter > 0 || failCounter > 0) {
        const resultText = `${successCounter}/${failCounter + successCounter}`;
        return <div className="word-card__games-result">{resultText}</div>;
      }
    }
    return '';
  };

  const buttonToggleDifficultyHandler = () => {
    const isExpired = TokenProvider.checkIsExpired();
    const userId = TokenProvider.getUserId();

    if (isExpired || !userId) {
      return;
    }

    if (!isWordDifficult) {
      UserWordService.setWorDifficultById(userId, wordAdvanced.word.id)
        .then((userWord) => {
          if (userWord) {
            setState({
              ...state,
              isWordDifficult: true,
            });
          }
        })
        .catch((e) => console.error(e));
    } else {
      UserWordService.setWordNormalById(userId, wordAdvanced.word.id)
        .then((userWord) => {
          if (userWord) {
            setState({
              ...state,
              isWordDifficult: false,
            });
          }
        })
        .catch((e) => console.error(e));
    }
  };

  const buttonToggleLearnedHandler = () => {
    const isExpired = TokenProvider.checkIsExpired();
    const userId = TokenProvider.getUserId();

    if (isExpired || !userId) {
      return;
    }

    if (!isWordLearned) {
      UserWordService.addWordLearnedById(userId, wordAdvanced.word.id)
        .then((userWord) => {
          if (userWord) {
            setState({
              ...state,
              isWordLearned: true,
            });
          }
        })
        .catch((e) => console.error(e));
    } else {
      UserWordService.removeWordFromLearnedById(userId, wordAdvanced.word.id)
        .then((userWord) => {
          if (userWord) {
            setState({
              ...state,
              isWordLearned: false,
            });
          }
        })
        .catch((e) => console.error(e));
    }
  };

  const buttonSetDifficultyState = (
    <button
      type="button"
      aria-label="button-difficulty"
      className={
        isWordDifficult
          ? 'word-card__button-difficulty word-card__button-difficulty_true'
          : 'word-card__button-difficulty'
      }
      onClick={() => buttonToggleDifficultyHandler()}
    />
  );

  const buttonSetLearnedState = (
    <button
      type="button"
      aria-label="button-learned"
      className={
        isWordLearned ? 'word-card__button-learned word-card__button-learned_true' : 'word-card__button-learned'
      }
      onClick={() => buttonToggleLearnedHandler()}
    />
  );

  const showUserButtons = () => {
    const isExpired = TokenProvider.checkIsExpired();
    const userId = TokenProvider.getUserId();

    if (isExpired || !userId) {
      return '';
    }

    return (
      <>
        {buttonSetDifficultyState}
        {buttonSetLearnedState}
        {getGameResult()}
      </>
    );
  };

  const imagePath = `${GlobalConstants.API_URL}/${image}`;

  let imageStyles = isLearnStarted ? 'word-card__image word-card__image_started' : 'word-card__image';
  imageStyles += isWordLearned ? ' word-card__image_learned' : '';
  imageStyles += isImageLoaded ? '' : ' word-card__image_is-loading';

  useEffect(() => {
    setState((prevState: CardState) => ({
      ...prevState,
      isWordLearned: Boolean(wordAdvanced.userData?.optional.isLearned),
      isWordDifficult: Boolean(wordAdvanced.userData?.difficulty !== 'normal'),
    }));
  }, [wordAdvanced]);

  return (
    <div className="word-card">
      <div className="word-card__image-container">
        <img
          className={imageStyles}
          src={imagePath}
          alt={word}
          onLoad={() => setState({ ...state, isImageLoaded: true })}
        />
        {!isImageLoaded && <Spinner isFullHeight={false} />}
        {showUserButtons()}
      </div>
      <div className="word-card__text-container">
        <button
          className="word-card__button-vertical word-card__button-vertical_show"
          aria-label="Show card description"
          type="button"
          onClick={() => setState({ ...state, isEngDescriptionShown: !isEngDescriptionShown })}
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
          onClick={() => setState({ ...state, isEngDescriptionShown: false })}
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
          onClick={() => setState({ ...state, isRuDescriptionShown: true })}
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
          onClick={() => setState({ ...state, isRuDescriptionShown: false })}
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
