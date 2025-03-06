import { BusStopCollection } from "./busStop";
import { StopAreaCollection } from "./stopArea";
import { StopPositionCollection } from "./stopPosition";
import { FeatureBaseOutlineTab } from "../base/tab";

export function BusStopEditOutlineTab() {
    return <FeatureBaseOutlineTab>
        {({ filter }) => <BusStopCollection filter={filter} />}
        {({ filter }) => <StopPositionCollection filter={filter} />}
        {({ filter }) => <StopAreaCollection filter={filter} />}
    </FeatureBaseOutlineTab>
}