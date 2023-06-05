import './Spinner.scss';

export function Spinner(props: { isFullHeight: boolean }) {
  const { isFullHeight } = props;
  return (
    <div className={isFullHeight ? 'loading-spinner loading-spinner_full-height' : 'loading-spinner'}>
      <div className="loading-spinner__spinner" />
    </div>
  );
}
