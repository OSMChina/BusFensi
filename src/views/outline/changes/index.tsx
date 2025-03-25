import { FeatureBaseOutlineTab } from "../base/tab";
import { CreatedCollection } from "./created";
import { DeletedCollection } from "./deleted";
import { ModifiedCollection } from "./modified";

export function ChangesOutlineTab() {
    return <FeatureBaseOutlineTab>
        {({ filter }) => <CreatedCollection filter={filter} />}
        {({ filter }) => <ModifiedCollection filter={filter} />}
        {({ filter }) => <DeletedCollection filter={filter} />}
    </FeatureBaseOutlineTab>
}