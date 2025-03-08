import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { ReactNode, useCallback, useMemo, useState } from "react";
import Draggable from "./Dragable";
import { faGripVertical } from '@fortawesome/free-solid-svg-icons/faGripVertical';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function DragList<T>({ memberToId, member, onDragEnd, onDragStart, children }: {
    memberToId: (member: T) => UniqueIdentifier,
    member: T[],
    onDragStart: (member: T) => void,
    onDragEnd: (member: T[]) => void,
    children: (props: { member: T, isDragOverlay?: true }) => ReactNode;
}) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeMember, setActiveMember] = useState<T>();

    const items = useMemo(
        () => member.map(m => ({ id: memberToId(m), member: m })),
        [member, memberToId])

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        console.debug("drag memeber start:", active)
        const member = items.find((item) => item.id === active.id)?.member
        if (!member) {
            throw new Error(`in Drag list got invalid active object ${JSON.stringify(active)}`)
        }
        setActiveMember(member);
        onDragStart(member)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        console.debug("drag memeber end:", active, over)

        if (over && active.id !== over.id) {
            // id of drag list
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            onDragEnd(arrayMove(items, oldIndex, newIndex).map(item => item.member))
        }
        setActiveMember(undefined);
    }

    const renderItems = useCallback(({ id, member }: { id: UniqueIdentifier; member: T; }) => {
        return (
            <Draggable id={id} key={id}>
                {children({ member })}
            </Draggable>
        );
    }, [children])

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                {items.map(renderItems)}
            </SortableContext>
            <DragOverlay>
                {activeMember ? <div className="flex bg-base-200 rounded-sm pl-1">
                    <button className="btn btn-ghost btn-xs my-auto"><FontAwesomeIcon icon={faGripVertical} /></button>
                    {children({ member: activeMember, isDragOverlay: true })}
                </div> : null}
            </DragOverlay>
        </DndContext>
    );
}

export default DragList