import { ReactNode, useMemo, useState } from "react";
import { ViewFCProps } from "../../../../type/view/props";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBusSimple } from "@fortawesome/free-solid-svg-icons/faBusSimple";
import { faRoute } from "@fortawesome/free-solid-svg-icons/faRoute";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons/faCodeCommit";
import { cn } from "../../../../utils/helper/object";
import SplitterView from "../../../../components/layout/SplitView";
import PropertyView from "../../../property";
import { BusStopEditOutlineTab } from "../../components/collection/busStop";
import SelectedOutlineTab from "../../components/collection/selected";
import BusEditTab from "./tab/bus"
import RouteEditTab from "./tab/route";
import { RouteEditOutlineTab } from "../../components/collection/route";
import { ChangesOutlineTab } from "../../components/collection/changes";

function PtEditTabs({ width, height, children }: { width: number, height: number, children: ReactNode }) {
    return <div className="bg-base-100 border-r-2 border-r-base-300 flex flex-col"
        style={{ width, height, maxWidth: width, maxHeight: height }}
    >
        {children}
    </div>
}

function PtEditView({ width, height }: ViewFCProps) {
    const TABS_WIDTH = 42;

    const tabs = useMemo(() => [{
        tooltip: "Bus stop edit tab",
        icon: <FontAwesomeIcon icon={faBusSimple} />,
        stage: () => <BusEditTab
            width={width - TABS_WIDTH} height={height}
        />
    }, {
        tooltip: "Route edit tab",
        icon: <FontAwesomeIcon icon={faRoute} />,
        stage: () => <RouteEditTab width={width - TABS_WIDTH} height={height} />
    }, {
        tooltip: "Edit bus relation",
        icon: <FontAwesomeIcon icon={faCodeCommit} />,
        stage: () => <div className="p-2">Bus Relation Edit Placeholder</div>
    }], [width, height])

    const [active, setActive] = useState(0);

    return <div
        className="flex flex-row"
        style={{ height, width, maxHeight: height, maxWidth: width }}
        onContextMenu={(e) => e.preventDefault()}>
        <PtEditTabs width={TABS_WIDTH} height={height} >
            {tabs.map((tab, index) => <div className="tooltip tooltip-right mx-auto mt-1" data-tip={tab.tooltip}>
                <button onClick={() => setActive(index)} className={cn("btn btn-ghost btn-square btn-sm", index === active && "btn-active")}>{tab.icon}</button>
            </div>)}
        </PtEditTabs>
        <div className="relative" style={{ height, width: width - TABS_WIDTH }}>
            {tabs[active].stage()}
        </div>
    </div>
}

function OutlineView({ width, height }: ViewFCProps) {
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

function PtEditApp({ width, height }: ViewFCProps) {
    return <SplitterView width={width} height={height} axis='x' initial={(width / 4) * 3} >
        {(props) => <PtEditView {...props} />}
        {(props) => <SplitterView {...props} axis='y'>
            {(props) => <OutlineView {...props} />}
            {(props) => <PropertyView {...props} />}
        </SplitterView>}
    </SplitterView>
}

export default PtEditApp;