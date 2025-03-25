import { ReactNode, useMemo, useState } from "react";
import { ViewFCProps } from "../../../../type/view/props";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBusSimple } from "@fortawesome/free-solid-svg-icons/faBusSimple";
import { faRoute } from "@fortawesome/free-solid-svg-icons/faRoute";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons/faCodeCommit";
import { cn } from "../../../../utils/helper/object";
import SplitterView from "../../../../components/layout/SplitView";
import PropertyView from "../../../property";
import BusEditTab from "./tab/bus"
import RouteEditTab from "./tab/route";
import OutlineView from "../../../outline";
import { RouteMasterTab } from "./tab/routeMaster";

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
        stage: () => <RouteMasterTab width={width - TABS_WIDTH} height={height} />
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