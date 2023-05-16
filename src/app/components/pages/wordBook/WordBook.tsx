import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalConstants } from '../../../../GlobalConstants';
import { IPaginatedArray } from '../../../interfaces/IPaginatedArray';
import { IWord } from '../../../interfaces/IWord';
import { WordService } from '../../../services/WordService';
import { Spinner } from '../../common/Spinner';
import { CardsContainer } from './cardsContainer/CardsContainer';
import './WordBook.scss';
import { musicPlayer2 } from '../../../services/SingleMusicPlayer2';

export default function WordBook() {
  type StateType = IPaginatedArray<IWord> | null;

  const [dataCards, setDataCards] = useState<StateType>(null);

  const navigate = useNavigate();

  const params = useParams();

  if (!params.level || !params.page) {
    navigate(`${GlobalConstants.ROUTE_WORDBOOK}/1/1`);
  }

  const level = Number(params.level ? params.level : '1');
  const page = Number(params.page ? params.page : '1');

  const { NUMBER_OF_PAGES, NUMBER_OF_GROUP_NO_AUTH_USER, ROUTE_WORDBOOK } = GlobalConstants;

  const { WORDBOOK_MUSIC_NAME, MUSIC_PATH } = GlobalConstants;

  useEffect(() => {
    WordService.getWordsByGroupAndPage(level - 1, page - 1)
      .then((data) => {
        setDataCards(data);
      })
      .catch((e) => console.error(e));
  }, [level, page]);

  const currentTrack = musicPlayer2.getCurrentPlayingTrack();
  if (!currentTrack || currentTrack.indexOf(WORDBOOK_MUSIC_NAME) < 0) {
    musicPlayer2.setVolume(0.09);
    musicPlayer2.setPlayList([`${MUSIC_PATH + WORDBOOK_MUSIC_NAME}`], true);
    musicPlayer2.play().catch(() => {});
  }

  const changePage = (btn: string) => {
    if (!dataCards) return;

    if (btn === 'prev') {
      if (page > 1) {
        navigate(`${ROUTE_WORDBOOK}/${level}/${page - 1}`);
      }
    }

    if (btn === 'next') {
      if (page < NUMBER_OF_PAGES) {
        navigate(`${ROUTE_WORDBOOK}/${level}/${page + 1}`);
      }
    }
  };

  const changeLevel = (btn: string) => {
    if (!dataCards) return;

    if (btn === 'prev') {
      if (level > 1) {
        navigate(`${ROUTE_WORDBOOK}/${level - 1}/${page}`);
      }
    }

    if (btn === 'next') {
      if (level < NUMBER_OF_GROUP_NO_AUTH_USER) {
        navigate(`${ROUTE_WORDBOOK}/${level + 1}/${page}`);
      }
    }
  };

  return (
    <div className="wordbook">
      <div className="wordbook__title">Their memories</div>
      <div className="navigation-container">
        <div className="pagination">
          <button
            className="pagination__button pagination__button_prev"
            type="button"
            aria-label="prev"
            onClick={() => changePage('prev')}
          />
          <div className="pagination__text">{`Page number ${page}/${NUMBER_OF_PAGES}`}</div>
          <button
            className="pagination__button pagination__button_next"
            type="button"
            aria-label="next"
            onClick={() => changePage('next')}
          />
        </div>
        <div className="pagination">
          <button
            className="pagination__button pagination__button_prev"
            type="button"
            aria-label="prev"
            onClick={() => changeLevel('prev')}
          />
          <div className="pagination__text">{`Depth level ${level}/${NUMBER_OF_GROUP_NO_AUTH_USER}`}</div>
          <button
            className="pagination__button pagination__button_next"
            type="button"
            aria-label="next"
            onClick={() => changeLevel('next')}
          />
        </div>
      </div>
      {dataCards ? <CardsContainer data={dataCards} /> : <Spinner />}
    </div>
  );
}
