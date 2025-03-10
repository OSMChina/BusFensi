import { UniqueIdentifier } from "@dnd-kit/core"
import { ComponentProps, ReactNode, useCallback, useMemo, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons/faDeleteLeft";
import MemberListSelect from "../../../components/osm/memberDrag/MemberListSel";
import { Member, Nd } from "../../../type/osm/meta";

export default function MemberListSelectDel<T extends Nd | Member>({ onDelete, member: memberOriginal, memberToId: memberToIdOriginal, ...rest }
    : Omit<ComponentProps<typeof MemberListSelect<T>>, "slotSelection" | "children"> & {
        onDelete: (prev: T[], after: T[]) => void,
        children: (props: { member: T; children: React.ReactNode; overlay?: true; }) => ReactNode
    }) {

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
            {children}
        </div>)
    }, [member, memberToId, onDelete])

    return (<MemberListSelect
        {...rest}
        member={member}
        memberToId={(memberToId)}
        slotSelection={renderSelection}
    />);
}