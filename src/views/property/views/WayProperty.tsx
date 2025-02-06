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

import Tags from "../components/Tags";
import Attributes from "../components/Attributes";
import FeatureRelation from "../components/FeatureRelaion";
import { T2Arr } from "../../../utils/helper/object";
import FeatureState from "../components/FeatureStates";
import MemberListItem from "../components/MemberListItem";
import { useState } from "react";
import Draggable from "../components/Dragable";
import { ItemRefObj } from "../../../logic/model/type";
import InsertMember from "./InsertMember";
import { useOSMMapStore } from "../../../store/osmmeta";
import { NumericString } from "../../../type/osm/refobj";
import { InsertHandeler } from "../../../type/view/property/type";

function WayProperty({ id }: { id: NumericString }) {
    const meta = useOSMMapStore(useShallow((state) => state.meta.way[id]));
    const modifyFeatureMetaNC = useOSMMapStore((state) => state.modifyFeatureMetaNC);
    const commitAction = useOSMMapStore(state => state.commit);
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
    const [localActiveNd, setLocalActive] = useState<ItemRefObj | undefined>(undefined)
    if (!meta) {
        return null
    }
    const items = T2Arr(meta.nd).map((nd) => ({ id: nd["@_ref"], nd: nd })); // only have node type so id is always unique

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        setActive({ activeId: active.id as NumericString, activeType: "node" });
        commitAction();
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);
            modifyFeatureMetaNC("way", id, w => {
                w.nd = arrayMove(items, oldIndex, newIndex).map(item => item.nd)
            });
        }

        setActive({ activeId: undefined, activeType: undefined });
    }

    function handleDelete(itemSub: ItemRefObj) {
        if (itemSub.type !== "node") {
            throw new Error(`non node child in way ${JSON.stringify(meta)}`)
        }
        modifyFeatureMetaNC("way", id, w => {
            w.nd = items.filter((item) => item.id !== itemSub.id).map(item => item.nd)
        })
    }

    const itemsToNd = (items: {
        id: NumericString,
        type: "way" | "node" | "relation"
    }[]) => items.filter(item => !T2Arr(meta.nd).some(m => item.id === m["@_ref"])).map(item => ({ '@_ref': item.id }))

    const handleInsertTop: InsertHandeler = (items) => {
        console.log("Insert at Top: ", items);
        commitAction()
        modifyFeatureMetaNC("way", id, w => {
            w.nd = [...itemsToNd(items), ...T2Arr(meta.nd)]
        })
    };

    const handleInsertBottom: InsertHandeler = (items) => {
        console.log("Insert at Bottom: ", items);
        commitAction()
        modifyFeatureMetaNC("way", id, w => {
            w.nd = [...T2Arr(meta.nd), ...itemsToNd(items)]
        })
    };

    const handleInsertAtActive: InsertHandeler = (items) => {
        console.log("Insert at Active: ", items);
        if (!localActiveNd) {
            handleInsertBottom(items)
        } else {
            const ndArray = [...T2Arr(meta.nd)];
            const insertIndex = ndArray.findIndex(m => m["@_ref"] === localActiveNd.id);
            ndArray.splice(insertIndex + 1, 0, ...itemsToNd(items));
            commitAction();
            modifyFeatureMetaNC("way", id, w => {
                w.nd = ndArray
            });
        }
    };

    return (
        <div className="p-2 overflow-scroll">
            <h3 className="text-base font-semibold mb-2">Way {meta["@_id"]}</h3>
            <FeatureState id={id} type="way" />
            <Attributes meta={meta} />
            <Tags tags={T2Arr(meta.tag)} setTags={(tags) => { modifyFeatureMetaNC("way", id, w => w.tag = tags) }} commitChange={commitAction} />
            <div className="flex flex-row">
                <div>
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
                                    <MemberListItem id={id} onDel={handleDelete} type="node" select={{ active: localActiveNd, setter: setLocalActive }} />
                                </Draggable>
                            ))}
                        </SortableContext>
                        <DragOverlay>
                            {(activeId && activeType) ? <MemberListItem id={activeId} type={activeType} onDel={() => { }} /> : null}
                        </DragOverlay>
                    </DndContext>
                </div>
                <div className="relative bottom-0 right-0">
                    <InsertMember
                        handelInsertTop={handleInsertTop}
                        handelIntertBottom={handleInsertBottom}
                        handelInsertAtActive={handleInsertAtActive}
                    />
                </div>
            </div>
            <FeatureRelation id={id} type="way" />
        </div>
    );
}

export default WayProperty;
