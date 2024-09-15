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
import { useRef, useState } from "react";
import Draggable from "../components/Dragable";
import InsertMember from "./InsertMember";
import { InsertHandeler } from "../type";
import { ItemRefObj } from "../../../logic/model/type";

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
    const [localActiveMember, setlocalActiveMember] = useState<ItemRefObj | undefined>(undefined);
    interface ActiveObj {
        activeId?: string,
        activeType?: "node" | "way" | "relation"
    }

    const [{ activeId, activeType }, setActive] = useState<ActiveObj>({ activeId: undefined, activeType: undefined });
    const focusBeforeEdit = useRef(false)
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
            modifyRelationNoCommit(id, {
                member: arrayMove(items, oldIndex, newIndex).map(item => item.member)
            })
        }

        setActive({ activeId: undefined, activeType: undefined });
    }

    function handleDelete(itemSub: ItemRefObj) {
        commitAction()
        modifyRelationNoCommit(id, {
            member: items.filter((item) => item.id !== `${itemSub.type}-${itemSub.id}`).map(item => item.member)
        })
    }

    const itemsToMember = (items: {
        id: string,
        type: "way" | "node" | "relation"
    }[]) => items
        .filter(item =>
            !T2Arr(meta.member)
                .some(m => item.id === m["@_ref"] && item.type === m["@_type"]))
        .map(item => ({ '@_ref': item.id, '@_type': item.type }))

    const handleInsertTop: InsertHandeler = (items) => {
        console.log("Insert at Top: ", items);
        commitAction()
        modifyRelationNoCommit(id, {
            member: [...itemsToMember(items), ...T2Arr(meta.member)]
        })
    };

    const handleInsertBottom: InsertHandeler = (items) => {
        console.log("Insert at Bottom: ", items);
        commitAction()
        modifyRelationNoCommit(id, {
            member: [...T2Arr(meta.member), ...itemsToMember(items)]
        })
    };

    const handleInsertAtActive: InsertHandeler = (items) => {
        console.log("Insert at Active: ", items);
        if (!localActiveMember) {
            handleInsertBottom(items)
        } else {
            const membersArray = [...T2Arr(meta.member)];
            const insertIndex = membersArray.findIndex(m => m["@_ref"] === localActiveMember.id && m["@_type"] === localActiveMember.type);
            membersArray.splice(insertIndex + 1, 0, ...itemsToMember(items));
            commitAction();
            modifyRelationNoCommit(id, {
                member: membersArray
            });
        }
    };

    const handelEditMember = (type: "node" | "way" | "relation", ref: string, text: string) => {
        console.log('edit', type, ref, text)
        if (focusBeforeEdit.current) {
            focusBeforeEdit.current = false;
            commitAction()
        }
        modifyRelationNoCommit(id, {
            member: T2Arr(meta.member).map(m => {
                if (m["@_type"] === type && m["@_ref"] === ref) {
                    const mem = deepCopy(m)
                    mem["@_role"] = text
                    return mem
                }
                return m
            })
        })
    }
    const handelEditMemberFocus = () => {
        focusBeforeEdit.current = true
    }

    const handelEditMemberBlur = () => {
        focusBeforeEdit.current = false
    }

    return (
        <div className="p-2 overflow-scroll">
            <h3 className="text-base font-semibold mb-2">Relation {meta["@_id"]}</h3>
            <FeatureState id={id} type="relation" />
            <Attributes meta={meta} />
            <Tags tags={T2Arr(meta.tag)}
                setTags={(tags) => { const metaNew = deepCopy(meta); metaNew.tag = tags; modifyRelationNoCommit(id, metaNew) }}
                commitChange={commitAction}
            />
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
                            {items.map(({ id, member }) => {
                                return (
                                    <Draggable id={id} key={id}>
                                        <MemberListItem
                                            id={member["@_ref"]}
                                            onDel={handleDelete}
                                            select={{
                                                active: localActiveMember,
                                                setter: (item) => (item === localActiveMember ? setlocalActiveMember(undefined) : setlocalActiveMember(item))
                                            }}
                                            edit={{
                                                text: member["@_role"] || '',
                                                setter: (text) => handelEditMember(member["@_type"], member["@_ref"], text),
                                                onFocus: handelEditMemberFocus,
                                                onBlur: handelEditMemberBlur
                                            }}
                                            type={member["@_type"]} />
                                    </Draggable>
                                );
                            })}
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
        </div>
    );
}


export default RelationProperty