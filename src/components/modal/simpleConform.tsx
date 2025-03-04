import { useModal } from "./modalProvider";

interface ConfirmOptions {
  title?: string;
  message?: string;
}

/**
 * useConfirm: 返回一个 confirm 函数，调用后显示确认对话框并返回 Promise<boolean>
 */
export const useConfirm = (): ((options: ConfirmOptions) => Promise<boolean>) => {
  const { openModal, closeModal } = useModal();

  return ({ title, message = "" }: ConfirmOptions): Promise<boolean> => {
    return openModal(<div className="modal modal-open">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        <p>{message}</p>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={() => closeModal(true)}>
            OK
          </button>
          <button className="btn" onClick={() => closeModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>);
  };
};
