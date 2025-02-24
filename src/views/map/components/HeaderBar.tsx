import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "../../../utils/helper/object";
import { faA } from "@fortawesome/free-solid-svg-icons/faA";
import { faDownLong } from "@fortawesome/free-solid-svg-icons/faDownLong";
import { faFileExport } from "@fortawesome/free-solid-svg-icons/faFileExport";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { ReactElement } from "react";

export function HeaderBar({ height, leftSlot }: { height: number, leftSlot: ReactElement }) {
    return <nav className={cn(
        "navbar bg-base-100 overflow-auto"
    )} style={{ height, maxHeight: height, minHeight: height }}>
        <div className="flex-1">
            {leftSlot}
        </div>
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
                <li className="tooltip tooltip-left" data-tip="Auto load OSM data on drag"><a><FontAwesomeIcon icon={faA} /></a></li>
                <li className="tooltip tooltip-left" data-tip="Load OSM data on current screen"><a><FontAwesomeIcon icon={faDownLong} /></a></li>
                <li className="tooltip tooltip-left" data-tip="Export with JSOM format"><a><FontAwesomeIcon icon={faFileExport} /></a></li>
                <li className="tooltip tooltip-left" data-tip="Change settings"><a><FontAwesomeIcon icon={faGear} /></a></li>
            </ul>
        </div>
    </nav>
}