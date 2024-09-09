import { useShallow } from "zustand/react/shallow"
import useBearStoreWithUndo from "../../../logic/model/store"

function FeatureState({ id }: { id: string }) {
    const status = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]))
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