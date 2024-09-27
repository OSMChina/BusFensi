import { useShallow } from "zustand/react/shallow"
import useBearStoreWithUndo from "../../../logic/model/store"
import { ItemRefObj } from "../../../logic/model/type"

function FeatureState({ id, type }: ItemRefObj) {
    const status = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[`${type}s`][id]))
    return <div className="flex flex-wrap gap-1">
        {Object.entries(status)
            .filter(([, value]) => value)
            .map(([key]) => (
                <span key={key} className="badge badge-info badge-xs">
                    {key}
                </span>
            ))}
    </div>
}
export default FeatureState