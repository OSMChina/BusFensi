import { UniqueIdentifier } from "@dnd-kit/core"
import { ComponentProps, ReactNode, useCallback } from "react"
import DragList from "../../dnd/DragList";
import BaseListSelect from "../../dnd/BaseSelect";

function DragListChild<T>({ member: m, isDragOverlay: overlay, slot, children }: {
    member: T;
    isDragOverlay?: true;
    slot: (props: { m: T }) => ReactNode, children: (props: {
        member: T;
        children: ReactNode;
        overlay?: true;
    }) => ReactNode
}) {
    return <>
        {children({
            member: m,
            children: slot({ m }),
            overlay
        })}
    </>
}

export default function MemberListSelect<T>({ member, memberToId, children, slotSelection, ...rest }
    : Omit<ComponentProps<typeof DragList<T>>, "children"> & {
        children: (props: { member: T, children: ReactNode, overlay?: true }) => ReactNode
        slotSelection: (props: { selected: Set<UniqueIdentifier> }) => ReactNode
    }) {
    // Use a Set to track selected member IDs for constant-time operations

    const renderSel = useCallback(({ member, memberToId, slot }: {
        member: T[];
        memberToId: (member: T) => UniqueIdentifier;
        slot: (props: { m: T }) => ReactNode;
    }) => <DragList
        {...rest}
        member={member}
        memberToId={memberToId}
    >
            {(props) => <DragListChild {...props} slot={slot}>{children}</DragListChild>}
        </DragList>, [children, rest])

    return (<BaseListSelect
        member={member}
        memberToId={memberToId}
        slotSelection={slotSelection}
    >
        {/* Example rendering of a member list */}
        {renderSel}
    </BaseListSelect>
    );
}

