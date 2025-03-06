import { FeatureBaseOutlineTab } from "../base/tab";
import { ActiveCollection } from "./active";
import { SelectedCollection } from "./selected";

export default function SelectedOutlineTab() {
    return <FeatureBaseOutlineTab>
        {({ filter }) => <ActiveCollection filter={filter} />}
        {({ filter }) => <SelectedCollection filter={filter} />}
    </FeatureBaseOutlineTab>
}