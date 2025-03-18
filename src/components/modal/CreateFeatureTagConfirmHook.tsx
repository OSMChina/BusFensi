import { confirmable } from "react-confirm";
import { CreateTagsConfirmation } from "./CreateFeatureTagConfirm";

const CreateFeatureTagConfirm = confirmable(CreateTagsConfirmation)
CreateFeatureTagConfirm.displayName = "CreateFeatureTagConform"

export default CreateFeatureTagConfirm;