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
import FeatureRelation from "../components/FeatureRelaion";
import { T2Arr, deepCopy } from "../../../utils/helper/object";
import FeatureState from "../components/FeatureStates";
import MemberListItem from "../components/MemberListItem";
import { useState } from "react";
import Draggable from "../components/Dragable";

function WayProperty({ id }: { id: string }) {
    const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.ways[id]));
    const modifyWayNoCommit = useBearStoreWithUndo((state) => state.modifyWayNoCommit);
    const commitAction = useBearStoreWithUndo(state => state.commitAction);
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
    const items = T2Arr(meta.nd).map((nd) => ({ id: nd["@_ref"], nd: nd }));

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        setActive({ activeId: active.id as string, activeType: "node" });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);

            modifyWayNoCommit(id, {
                nd: arrayMove(items, oldIndex, newIndex).map(item => item.nd)
            });
            commitAction();
        }

        setActive({ activeId: undefined, activeType: undefined });
    }

    function handleDelete(idsub: string) {
        modifyWayNoCommit(id, {
            nd: items.filter((item) => item.id !== idsub).map(item => item.nd)
        })
    }

    return (
        <div className="p-2 overflow-scroll">
            <h3 className="text-base font-semibold mb-2">Way {meta["@_id"]}</h3>
            <FeatureState id={id} />
            <Attributes meta={meta} />
            <Tags tags={T2Arr(meta.tag)} setTags={(tags) => { const metaNew = deepCopy(meta); metaNew.tag = tags; modifyWayNoCommit(id, metaNew) }} commitChange={commitAction} />
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
                    {items.map(({ id }) => (
                        <Draggable id={id} key={id}>
                            <MemberListItem id={id} onDel={handleDelete} type="node" />
                        </Draggable>
                    ))}
                </SortableContext>
                <DragOverlay>
                    {(activeId && activeType) ? <MemberListItem id={activeId} type={activeType} onDel={() => { }} /> : null}
                </DragOverlay>
            </DndContext>
            <FeatureRelation id={id} type="way" />
        </div>
    );
}

export default WayProperty;
