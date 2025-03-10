
import { useEffect, useRef } from 'react';
import { ConfirmDialog, ConfirmDialogProps } from 'react-confirm';

export interface BaseProps {
  title?: string;
  message?: string;
};

type Props = ConfirmDialogProps<BaseProps, boolean>;

function SimpleConfirmDialogContent({ show, proceed, title, message }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (dialogElement) {
      if (show) {
        dialogElement.showModal();
      } else {
        dialogElement.close();
      }
    }
  }, [show]);

  const handleCancel = () => {
    proceed(false);
  };

  const handleConfirm = () => {
    console.debug("clicking delete ok: ");
    proceed(true);
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={handleCancel}
    >
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg mb-2">{title}</h3>}
        <p>{message}</p>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-md"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
          >
            OK
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
const SimpleConfirmation: ConfirmDialog<BaseProps, boolean> = (props) => (<SimpleConfirmDialogContent {...props} />);

export default SimpleConfirmation