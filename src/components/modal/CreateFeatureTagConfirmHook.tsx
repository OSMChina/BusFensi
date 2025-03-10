import { confirmable } from "react-confirm";
import { CreateTagsConfirmation } from "./CreateFeatureTagConfirm";

const c = confirmable(CreateTagsConfirmation)
c.displayName = "CreateFeatureTagConform"

export default c;