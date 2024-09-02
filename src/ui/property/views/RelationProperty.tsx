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

import useBearStoreWithUndo from "../../../logic/model/store";
import Tags from "../components/Tags";
import Attributes from "../components/Attributes";
import { T2Arr, deepCopy } from "../../../utils/helper/object";
import FeatureState from "../components/FeatureStates";
import MemberListItem from "../components/MemberListItem";
import { useState } from "react";
import Draggable from "../components/Dragable";

function RelationProperty({ id }: { id: string }) {
    const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.relations[id]));
    const modifyRelationNoCommit = useBearStoreWithUndo((state) => state.modifyRelationNoCommit)
    const commitAction = useBearStoreWithUndo(state => state.commitAction)
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    interface ActiveObj {
        activeId?: string,
        activeType?: "node" | "way" | "relation"
    }

    const [{ activeId, activeType }, setActive] = useState<ActiveObj>({ activeId: undefined, activeType: undefined });
    const items = T2Arr(meta.member).map((member) => ({ id: member["@_ref"], member: member }))

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        console.log("drag memeber start:", active)
        setActive({ activeId: active.id as string, activeType: items.find((item) => item.id === active.id)?.member["@_type"] });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        console.log("drag memeber end:", active, over)

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);

            modifyRelationNoCommit(id, {
                member: arrayMove(items, oldIndex, newIndex).map(item => item.member)
            })
            commitAction()
        }

        setActive({ activeId: undefined, activeType: undefined });
    }

    function handleDelete(idsub: string) {
        modifyRelationNoCommit(id, {
            member: items.filter((item) => item.id !== idsub).map(item => item.member)
        })
    }

    return (
        <div className="p-4 border rounded-lg bg-base-100 shadow-md">
            <h3 className="text-xl font-semibold mb-4">Relation {meta["@_id"]}</h3>
            <FeatureState id={id} />
            <Attributes meta={meta} />
            <Tags tags={T2Arr(meta.tag)} setTags={(tags) => { const metaNew = deepCopy(meta); metaNew.tag = tags; modifyRelationNoCommit(id, metaNew) }} commitChange={commitAction} />
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
                        if (member["@_type"] === "node") {
                            return (
                                <Draggable id={id} key={id}>
                                    <MemberListItem id={id} onDel={handleDelete} type="node" />
                                </Draggable>
                            );
                        } else if (member["@_type"] === "way") {
                            return (
                                <Draggable id={id} key={id}>
                                    <MemberListItem id={id} onDel={handleDelete} type="way" />
                                </Draggable>
                            );
                        } else {
                            return (
                                <Draggable id={id} key={id}>
                                    <MemberListItem id={id} onDel={handleDelete} type="relation" />
                                </Draggable>
                            )
                        }
                    })}
                </SortableContext>
                <DragOverlay>
                    {(activeId && activeType) ? <MemberListItem id={activeId} type={activeType} onDel={() => { }} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}


export default RelationProperty