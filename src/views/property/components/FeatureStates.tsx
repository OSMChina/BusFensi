import { useShallow } from "zustand/react/shallow"
import { FeatureRefObj } from "../../../type/osm/refobj"
import { useOSMMapStore } from "../../../store/osmmeta"

function FeatureState({ id, type }: FeatureRefObj) {
    const status = useOSMMapStore(useShallow((state) => state.meta[type][id]["@_localStates"]))
    return <div className="flex flex-wrap gap-1">
        {Object.entries(status!)
            .filter(([, value]) => value)
            .map(([key]) => (
                <span key={key} className="badge badge-info badge-xs">
                    {key}
                </span>
            ))}
    </div>
}
export default FeatureState