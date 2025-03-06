/**
 * 
 */

import { useShallow } from "zustand/react/shallow";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { T2Arr, deepCopy } from "../../../utils/helper/object";
import MemberListItem from "../components/MemberListItem";
import { useRef, useState } from "react";
import Draggable from "../components/Dragable";
import InsertMember from "./InsertMember";
import { FeatureRefObj as ItemRefObj } from "../../../type/osm/refobj"
import { InsertHandeler } from "../../../type/view/property/type";
import { useOSMMapStore } from "../../../store/osmmeta";
import { NumericString } from "../../../type/osm/refobj";

function DragList<T({ id,  }: { id: NumericString }) {
    const meta = useOSMMapStore(useShallow((state) => state.meta.relation[id]));
    const modifyFeatureMetaNC = useOSMMapStore((state) => state.modifyFeatureMetaNC)
    const commitAction = useOSMMapStore(state => state.commit)
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    interface ActiveObj {
        activeId?: NumericString,
        activeType?: "node" | "way" | "relation"
    }

    const [{ activeId, activeType }, setActive] = useState<ActiveObj>({ activeId: undefined, activeType: undefined });
    if (!meta) {
        return null
    }
    const items = T2Arr(meta.member).map((member) => ({ id: `${member["@_type"]}-${member["@_ref"]}`, member: member }))

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        console.log("drag memeber start:", active)
        const member = items.find((item) => item.id === active.id)?.member
        setActive({ activeId: member?.["@_ref"], activeType: member?.["@_type"] });
        commitAction()
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        console.log("drag memeber end:", active, over)

        if (over && active.id !== over.id) {
            // id of drag list
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            modifyFeatureMetaNC("relation", id, r => {
                r.member = arrayMove(items, oldIndex, newIndex).map(item => item.member)
            })
        }

        setActive({ activeId: undefined, activeType: undefined });
    }

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
                            {items.map(({ id, member }) => {
                                return (
                                    <Draggable id={id} key={id}>
                                    </Draggable>
                                );
                            })}
                        </SortableContext>
                        <DragOverlay>
                            {(activeId && activeType) ? <MemberListItem id={activeId} type={activeType} onDel={() => { }} /> : null}
                        </DragOverlay>
                    </DndContext>
    );
}


export default RelationProperty