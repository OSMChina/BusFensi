import { RouteCollection } from "./route";
import { RouteMasterCollection } from "./routemaster";
import { FeatureBaseOutlineTab } from "../base/tab";

export function RouteEditOutlineTab() {
    return <FeatureBaseOutlineTab>
        {({ filter }) => <RouteCollection filter={filter} />}
        {({ filter }) => <RouteMasterCollection filter={filter} />}
    </FeatureBaseOutlineTab>
}