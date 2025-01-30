import { OSMMapStore } from "../../store";
import { WritableDraft } from "immer"

export function commitHelper(state: WritableDraft<OSMMapStore>) {
    state.commitCounter++;
}
