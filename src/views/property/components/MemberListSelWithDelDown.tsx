import { UniqueIdentifier } from "@dnd-kit/core"
import { ComponentProps, ReactNode, useCallback, useMemo, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons/faDeleteLeft";
import MemberListSelect from "../../../components/osm/memberDrag/MemberListSel";
import { useOSMMapStore } from "../../../store/osmmeta";
import { Member, Nd } from "../../../type/osm/meta";
import { useSettingsStore } from "../../../store/settings";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";

export default function MemberListSelectDelDown<T extends Nd | Member>({ onDelete, member: memberOriginal, memberToId: memberToIdOriginal, ...rest }
    : Omit<ComponentProps<typeof MemberListSelect<T>>, "slotSelection"> & {
        onDelete: (prev: T[], after: T[]) => void,
    }) {

    const loadFeatureBatch = useOSMMapStore(state => state.loadFeatureBatch)
    const baseurl = useSettingsStore(state => state.osmAPI.BASEURL)
    const [loading, setLoading] = useState(false);

    // why warp? cause same mamber may appear more than once (e.g. closed way), so add a uid to them is needed
    const uidRef = useRef(1);
    const getUid = useCallback(() => (uidRef.current++), [uidRef])
    type MemberWarp = T & {
        uniqueIdentifier: number
    }

    const member = useMemo<MemberWarp[]>(() => memberOriginal.map(m => ({ ...m, uniqueIdentifier: getUid() })), [getUid, memberOriginal])
    const memberToId = useCallback((m: MemberWarp) => `${memberToIdOriginal(m)}_AT_LIST_${m.uniqueIdentifier}`, [memberToIdOriginal])

    const renderSelection = useCallback(({ selected , children}: { selected: Set<UniqueIdentifier>, children: ReactNode }) => {
        return (<div className="flex flex-row p-1 rounded">
            <div className="mr-auto">Members</div>
            <button className="btn btn-square btn-xs btn-error tooltip tooltip-bottom"
                data-tip="Remove Selected member from list"
                onMouseDown={(event) => {
                    event.stopPropagation();
                    const after = member.filter(m => !selected.has(memberToId(m)))
                    onDelete(member, after)
                }} >
                <FontAwesomeIcon icon={faDeleteLeft} />
            </button>
            <button className="btn btn-square btn-xs btn-accent tooltip tooltip-bottom"
                data-tip="Download selected member of this list"
                disabled={loading}
                onMouseDown={async (event) => {
                    event.stopPropagation();
                    setLoading(true)
                    await loadFeatureBatch(member.filter(m => selected.has(memberToId(m))).map(m => {
                        if ((m as Member)["@_type"]) {
                            return { type: (m as Member)["@_type"], id: m["@_ref"] }
                        }
                        return { type: "node", id: m["@_ref"] }
                    }), baseurl)
                    setLoading(false)
                }} >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : <FontAwesomeIcon icon={faDownload} />}
            </button>
            {children}
        </div>)
    }, [baseurl, loadFeatureBatch, member, memberToId, onDelete, loading, setLoading])

    return (<MemberListSelect
        {...rest}
        member={member}
        memberToId={(memberToId)}
        slotSelection={renderSelection}
    />);
}