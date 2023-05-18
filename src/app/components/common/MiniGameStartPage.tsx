/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { GlobalConstants } from '../../../GlobalConstants';
import './MiniGameStartPage.scss';

interface MiniGameStartPageProps {
  title: string;
  description: string | JSX.Element;
  buttonText: string;
  onStart: (level: number, group: number) => void;
}

export function MiniGameStartPage(props: MiniGameStartPageProps) {
  const { title, description, buttonText, onStart } = props;

  const [level, setLevel] = useState(-1);
  const [page, setPage] = useState(-1);

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
          setLevel(number);
        } else {
          setPage(number);
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

  return (
    <div className="mini-game-page">
      <div className="mini-game-page__main">
        <h2 className="mini-game-page__title">{title}</h2>
        <div className="mini-game-page__text">{description}</div>
      </div>
      {showSelector()}
      <button type="button" className="mini-game-page__button" onClick={handleOnStart}>
        {buttonText}
      </button>
    </div>
  );
}
