/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { GlobalConstants } from '../../../../GlobalConstants';
import { ButtonConfirm } from './ButtonConfirm';
import './MiniGameStart.scss';

interface MiniGameStartProps {
  title: string;
  description: string | JSX.Element;
  buttonText: string;
  onStart: (level: number, group: number) => void;
}

interface MiniGameStartState {
  level: number;
  page: number;
}

export function MiniGameStart(props: MiniGameStartProps) {
  const { title, description, buttonText, onStart } = props;

  const initialState = {
    level: -1,
    page: -1,
  };

  const [state, setState] = useState<MiniGameStartState>(initialState);

  const { level, page } = state;

  const handleOnStart = () => {
    onStart(level, page);
  };

  const getSelectorButtons = (isLevelSelector: boolean, numberOfButtons: number) => {
    const buttonNumbers = Array(numberOfButtons)
      .fill(0)
      .map((el, i) => i);

    const getButtons = (buttonNumber: number) => {
      let buttonClassName = 'selector-container__button';

      if (isLevelSelector) {
        buttonClassName += ' selector-container__button_level';
        if (buttonNumber === level) {
          buttonClassName += ' selector-container__button_active';
        }
      } else {
        buttonClassName += ' selector-container__button_page';
        if (buttonNumber === page) {
          buttonClassName += ' selector-container__button_active';
        }
      }

      const onClick = (number: number) => {
        if (isLevelSelector) {
          setState({ ...state, level: number });
        } else {
          setState({ ...state, page: number });
        }
      };

      return (
        <button type="button" className={buttonClassName} onClick={() => onClick(buttonNumber)} key={buttonNumber}>
          {buttonNumber + 1}
        </button>
      );
    };

    return buttonNumbers.map((number) => getButtons(number));
  };

  const getLevelButtons = (levelsNumber: number) => getSelectorButtons(true, levelsNumber);

  const getPageButtons = (pagesNumber: number) => getSelectorButtons(false, pagesNumber);

  const getSelectorElement = (selectorTitle: string, buttons: Array<JSX.Element>) => (
    <div className="button-container">
      <p className="button-container__text">{selectorTitle}</p>
      <div className="selector-container">{buttons}</div>
    </div>
  );

  const getLevelSelector = () => {
    const buttons = getLevelButtons(GlobalConstants.NUMBER_OF_GROUP_NO_AUTH_USER);
    return getSelectorElement('Choose your level of depth', buttons);
  };

  const getPageSelector = () => {
    const buttons = getPageButtons(GlobalConstants.NUMBER_OF_PAGES);
    return getSelectorElement('Choose your page', buttons);
  };

  const showSelector = () => {
    if (level === -1) {
      return getLevelSelector();
    }
    return getPageSelector();
  };

  const showButton = () => {
    if (level > -1 && page > -1) {
      return <ButtonConfirm text={buttonText} onClick={handleOnStart} />;
    }
    return '';
  };

  return (
    <>
      <div className="mini-game-page__main">
        <h2 className="mini-game-page__title">{title}</h2>
        <div className="mini-game-page__text">{description}</div>
      </div>
      {showSelector()}
      {showButton()}
    </>
  );
}
