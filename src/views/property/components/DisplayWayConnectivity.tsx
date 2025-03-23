import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons/faArrowsUpDown";
import { useOSMMapStore } from "../../../store/osmmeta";
import { Member, Nd } from "../../../type/osm/meta";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons/faArrowUp";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons/faArrowDown";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ndEq(n1: Nd, n2: Nd) {
    return n1["@_ref"] === n2["@_ref"];
}

export default function DisplayWayConnectivity({ member, index }: { member: Member[], index: number }) {
    const way = useOSMMapStore(state => state.meta.way)
    const cur = way[member[index]["@_ref"]];
    const pre = way[member[index - 1]?.["@_ref"]] || undefined;
    const nxt = way[member[index + 1]?.["@_ref"]] || undefined;
    const preCon = pre && cur && ndEq(pre.nd[pre.nd.length - 1], cur.nd[0])
    const nxtCon = nxt && cur && ndEq(cur.nd[cur.nd.length - 1], nxt.nd[0]);
    if (preCon && nxtCon) {
        return (
            <div className="tooltip tooltip-bottom" data-tip="Connected to both sides">
                <FontAwesomeIcon icon={faArrowsUpDown} />
            </div>
        );
    } else if (preCon) {
        return (
            <div className="tooltip tooltip-bottom" data-tip="Connected to previous way">
                <FontAwesomeIcon icon={faArrowUp} />
            </div>
        );
    } else if (nxtCon) {
        return (
            <div className="tooltip tooltip-bottom" data-tip="Connected to next way">
                <FontAwesomeIcon icon={faArrowDown} />
            </div>
        );
    } else {
        return (
            <div className="tooltip tooltip-bottom" data-tip="Not connected to any way, or not downloaded">
                <FontAwesomeIcon icon={faMinus} />
            </div>
        );
    }
}
