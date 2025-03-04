import { createContext, ReactNode, useContext, useState, ReactElement } from "react";

interface ModalContextType {
    openModal: (content: ReactElement) => Promise<any>;
    closeModal: (result: any) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * useModal: 自定义 Hook，方便获取 openModal 和 closeModal 方法
 */
export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

interface ModalProviderProps {
    children: ReactNode;
}

/**
 * ModalProvider: 抽象模态提供者，统一管理模态显示逻辑
 */
export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [modalContent, setModalContent] = useState<ReactElement | null>(null);
    const [promiseResolver, setPromiseResolver] = useState<((result: any) => void) | null>(null);

    /**
     * openModal: 打开模态，接收任意 React 节点，并返回 Promise
     */
    const openModal = (content: ReactElement): Promise<any> => {
        return new Promise((resolve) => {
            // 保存传入的内容和 Promise 的 resolve 方法
            setModalContent(content);
            setPromiseResolver(() => resolve);
        });
    };

    /**
     * closeModal: 关闭模态，并返回结果
     */
    const closeModal = (result: any): void => {
        if (promiseResolver) {
            promiseResolver(result);
        }
        setModalContent(null);
        setPromiseResolver(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {modalContent && (
                <dialog open className="modal modal-open">
                    <div className="modal-box">
                        {modalContent}
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            )}
        </ModalContext.Provider>
    );
};