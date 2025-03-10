import { confirmable, ConfirmDialog } from "react-confirm";
import SimpleConfirmation, { BaseProps } from "./SimpleConfirm";

const confirm = confirmable(SimpleConfirmation as ConfirmDialog<BaseProps, boolean>)
confirm.displayName = "ConfirmableSimpleConfirmation"
export default confirm