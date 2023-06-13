import './buttonConfirm.scss';

interface ButtonConfirmProps {
  text: string;
  onClick: () => void;
  optionsClasses?: string[];
}

export function ButtonConfirm({ text, onClick, optionsClasses = [] }: ButtonConfirmProps) {
  return (
    <button
      type="button"
      className={optionsClasses.reduce((acc, cur) => `${acc} ${cur}`, 'button-confirm')}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
