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
import InsertMember from "./InsertMember";
import { InsertHandeler } from "../type";
import { FeatureTypes } from "../../../api/osm/type";

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
    const [localActiveMember, setlocalActiveMember] = useState<string | null>(null);
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

    const itemsToMember = (items: {
        id: string,
        type: FeatureTypes
    }[]) => items.filter(item => !T2Arr(meta.member).some(m => item.id === m["@_ref"])).map(item => ({ '@_ref': item.id, '@_type': item.type }))

    const handleInsertTop: InsertHandeler = (items) => {
        console.log("Insert at Top: ", items);
        modifyRelationNoCommit(id, {
            member: [...itemsToMember(items), ...T2Arr(meta.member)]
        })
        commitAction()
    };

    const handleInsertBottom: InsertHandeler = (items) => {
        console.log("Insert at Bottom: ", items);
        modifyRelationNoCommit(id, {
            member: [...T2Arr(meta.member), ...itemsToMember(items)]
        })
        commitAction()
    };

    const handleInsertAtActive: InsertHandeler = (items) => {
        console.log("Insert at Active: ", items);
        if (!localActiveMember) {
            handleInsertBottom(items)
        } else {
            const membersArray = [...T2Arr(meta.member)];
            const insertIndex = membersArray.findIndex(m => m["@_ref"] === localActiveMember);
            membersArray.splice(insertIndex + 1, 0, ...itemsToMember(items));
            modifyRelationNoCommit(id, {
                member: membersArray
            });
            commitAction();
        }
    };

    return (
        <div className="p-2 overflow-scroll">
            <h3 className="text-base font-semibold mb-2">Relation {meta["@_id"]}</h3>
            <FeatureState id={id} />
            <Attributes meta={meta} />
            <Tags tags={T2Arr(meta.tag)}
                setTags={(tags) => { const metaNew = deepCopy(meta); metaNew.tag = tags; modifyRelationNoCommit(id, metaNew) }}
                commitChange={commitAction}
            />
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
                                    <MemberListItem
                                        id={id}
                                        onDel={handleDelete}
                                        select={{
                                            activeId: localActiveMember,
                                            setter: (id) => (id === localActiveMember ? setlocalActiveMember(null) : setlocalActiveMember(id))
                                        }}
                                        type="node" />
                                </Draggable>
                            );
                        } else if (member["@_type"] === "way") {
                            return (
                                <Draggable id={id} key={id}>
                                    <MemberListItem
                                        id={id}
                                        onDel={handleDelete}
                                        select={{
                                            activeId: localActiveMember,
                                            setter: (id) => (id === localActiveMember ? setlocalActiveMember(null) : setlocalActiveMember(id))
                                        }}
                                        type="way" />
                                </Draggable>
                            );
                        } else {
                            return (
                                <Draggable id={id} key={id}>
                                    <MemberListItem
                                        id={id}
                                        onDel={handleDelete}
                                        select={{
                                            activeId: localActiveMember,
                                            setter: (id) => (id === localActiveMember ? setlocalActiveMember(null) : setlocalActiveMember(id))
                                        }}
                                        type="relation" />
                                </Draggable>
                            )
                        }
                    })}
                </SortableContext>
                <DragOverlay>
                    {(activeId && activeType) ? <MemberListItem id={activeId} type={activeType} onDel={() => { }} /> : null}
                </DragOverlay>
            </DndContext>
            <div className="absolute right-64 bottom-0">
                <InsertMember
                    handelInsertTop={handleInsertTop}
                    handelIntertBottom={handleInsertBottom}
                    handelInsertAtActive={handleInsertAtActive}
                />
            </div>
        </div>
    );
}


export default RelationProperty