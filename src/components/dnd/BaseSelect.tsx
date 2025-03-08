import { UniqueIdentifier } from "@dnd-kit/core"
import { ReactNode, useEffect, useMemo, useState } from "react"

export default function BaseListSelect<T>({ member, memberToId, children, slotSelection }
    : {
        title?: ReactNode,
        member: T[],
        memberToId: (member: T) => UniqueIdentifier,
        children: (props: { member: T[], memberToId: (member: T) => UniqueIdentifier, slot: (props: { m: T }) => ReactNode }) => ReactNode
        slotSelection: (props: { selected: Set<UniqueIdentifier> }) => ReactNode
    }) {
    // Use a Set to track selected member IDs for constant-time operations
    const [selected, setSelected] = useState<Set<UniqueIdentifier>>(new Set());

    useEffect(() => {
        setSelected((prevSelected) => {
            const newSelected = new Set<UniqueIdentifier>();
            member.forEach((m) => {
                if (prevSelected.has(memberToId(m))) {
                    newSelected.add(memberToId(m))
                }
            })
            return newSelected;
        });
    }, [member, memberToId])


    const selectAll = () => {
        if (selected.size === member.length) {
            setSelected(new Set())
        } else {
            setSelected(new Set(member.map(memberToId)))
        }
    }

    const itemSelectionSlot = useMemo(() => {
        // Toggle the selection of a member
        const toggleSelection = (id: UniqueIdentifier) => {
            setSelected((prevSelected) => {
                const newSelected = new Set(prevSelected);
                if (newSelected.has(id)) {
                    newSelected.delete(id);
                } else {
                    newSelected.add(id);
                }
                return newSelected;
            });
        };
        return ({ m }: { m: T }) => <>
            <input
                type="checkbox"
                className="checkbox ml-2"
                checked={selected.has(memberToId(m))}
                onChange={() => toggleSelection(memberToId(m))}
            />
        </>
    }, [selected, memberToId])

    return (
        <div>
            <div className="w-full flex flex-row p-1 rounded border bg-base-200">
                {slotSelection({ selected })}
                <input type="checkbox"
                    checked={selected.size === member.length}
                    onChange={selectAll}
                    className="checkbox ml-2" />
            </div>
            {/* Example rendering of a member list */}
            {children({ member, memberToId, slot: itemSelectionSlot })}
        </div>
    );
}
