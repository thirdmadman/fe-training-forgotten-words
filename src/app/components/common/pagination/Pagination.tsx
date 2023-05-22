import './pagination.scss';

interface PaginationProps {
  onPreviousAction: () => void;
  onNextAction: () => void;
  text: string;
}

export function Pagination(props: PaginationProps) {
  const { onPreviousAction, onNextAction, text } = props;

  return (
    <div className="pagination">
      <button
        className="pagination__button pagination__button_prev"
        type="button"
        aria-label="prev"
        onClick={onPreviousAction}
      />
      <div className="pagination__text">{text}</div>
      <button
        className="pagination__button pagination__button_next"
        type="button"
        aria-label="next"
        onClick={onNextAction}
      />
    </div>
  );
}
