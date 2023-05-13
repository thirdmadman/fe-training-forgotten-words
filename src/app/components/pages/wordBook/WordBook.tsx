import { useEffect, useState } from 'react';
import { GlobalConstants } from '../../../../GlobalConstants';
import { IPaginatedArray } from '../../../interfaces/IPaginatedArray';
import { IWord } from '../../../interfaces/IWord';
import { WordService } from '../../../services/WordService';
import { Spinner } from '../../common/Spinner';
import { CardsContainer } from './cardsContainer/CardsContainer';
import './WordBook.scss';

export default function WordBook() {
  type StateType = IPaginatedArray<IWord> | null;

  const [dataCards, setDataCards] = useState<StateType>(null);

  useEffect(() => {
    WordService.getWordsByGroupAndPage(0, 0)
      .then((data) => {
        setDataCards(data);
      })
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="wordbook">
      <div className="wordbook__title">Their memories</div>
      <div className="navigation-container">
        <div className="pagination">
          <button className="pagination__button pagination__button_prev" type="button" aria-label="prev" />
          <div className="pagination__text">{`Page number ${1}/${GlobalConstants.NUMBER_OF_PAGES}`}</div>
          <button className="pagination__button pagination__button_next" type="button" aria-label="next" />
        </div>
        <div className="pagination">
          <button className="pagination__button pagination__button_prev" type="button" aria-label="prev" />
          <div className="pagination__text">{`Depth level ${1}/${GlobalConstants.NUMBER_OF_GROUP_NO_AUTH_USER}`}</div>
          <button className="pagination__button pagination__button_next" type="button" aria-label="next" />
        </div>
      </div>
      {dataCards ? <CardsContainer data={dataCards} /> : <Spinner />}
    </div>
  );
}
