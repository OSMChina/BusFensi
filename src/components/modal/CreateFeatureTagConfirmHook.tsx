import { CreateTagsConfirmation } from "./CreateFeatureTagConfirm";
import { useCallback, useState } from "react";
import { confirmable, createConfirmation } from "react-confirm";

const CreateFeatureTagConfirm = confirmable(CreateTagsConfirmation)
CreateFeatureTagConfirm.displayName = "CreateFeatureTagConform"

export default CreateFeatureTagConfirm;

export function useConfirmWithOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const confirmModal = useCallback(createConfirmation(CreateFeatureTagConfirm), []);

    const confirm = useCallback(async (props: any) => {
        setIsOpen(true);
        const result = await confirmModal(props);
        setIsOpen(false);
        return result;
    }, [confirmModal]);

    return [confirm, isOpen] as const;
}
