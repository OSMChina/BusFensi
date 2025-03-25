import { useState } from "react";
import { ViewFCProps } from "../../type/view/props";
import { BusStopEditOutlineTab } from "./busStop";
import { ChangesOutlineTab } from "./changes";
import { RouteEditOutlineTab } from "./route";
import SelectedOutlineTab from "./selected";
import { cn } from "../../utils/helper/object";

export default function OutlineView({ width, height }: ViewFCProps) {
    const tabs = [{
        title: "Bus stop",
        tab: () => <BusStopEditOutlineTab />
    }, {
        title: "Route",
        tab: () => <RouteEditOutlineTab />
    }, {
        title: "Changes",
        tab: () => <ChangesOutlineTab />
    }, {
        title: "Selected",
        tab: () => <SelectedOutlineTab />
    },]

    const [active, setActive] = useState(0);

    return <div style={{ width, height }} className="flex flex-col">
        <div role="tablist" className="tabs tabs-lifted tabs-xs">
            {tabs.map((tab, index) => (<a key={index} onClick={() => setActive(index)} role="tab" className={cn("tab", index === active && "tab-active")}>{tab.title}</a>))}
        </div>
        <div className="outline-view flex flex-col bg-base-100 w-full px-1 flex-1 overflow-auto">
            {tabs[active].tab()}
        </div>
    </div>
}
