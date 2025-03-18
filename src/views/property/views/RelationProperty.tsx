import { useShallow } from "zustand/react/shallow";
import Tags from "../components/Tags";
import Attributes from "../components/Attributes";
import { T2Arr, cn, deepCopy } from "../../../utils/helper/object";
import FeatureState from "../components/FeatureStates";
import MemberItem from "../../../components/osm/memberDrag/MemberItem";
import { useCallback, useState } from "react";
import InsertMember from "./InsertMember";
import { FeatureRefObj as ItemRefObj } from "../../../type/osm/refobj"
import { InsertHandeler } from "../../../type/view/property/type";
import { useOSMMapStore } from "../../../store/osmmeta";
import { NumericString } from "../../../type/osm/refobj";
import MemberListSelectDel from "../components/MemberListSelWithDelDown";
import { Member } from "../../../type/osm/meta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle as faCircelSolid } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons/faCircle";
import { getName } from "../../../utils/osm/nodeType";
import RoleInput from "../../../components/osm/member/RoleInput";


function RelationProperty({ id }: { id: NumericString }) {
    const meta = useOSMMapStore(useShallow((state) => state.meta.relation[id]));
    const modifyFeatureMetaNC = useOSMMapStore((state) => state.modifyFeatureMetaNC)
    const commitAction = useOSMMapStore(state => state.commit)
    const [localActiveMember, setlocalActiveMember] = useState<ItemRefObj | undefined>(undefined);

    const handelEditMember = useCallback((type: "node" | "way" | "relation", ref: string, text: string) => {
        console.debug('edit', type, ref, text)
        commitAction()
        modifyFeatureMetaNC("relation", id, r => {
            r.member = T2Arr(meta.member).map(m => {
                if (m["@_type"] === type && m["@_ref"] === ref) {
                    const mem = deepCopy(m)
                    mem["@_role"] = text
                    return mem
                }
                return m
            })
        })
    }, [commitAction, id, meta.member, modifyFeatureMetaNC])

    const memberToId = useCallback((m: Member) => `${m["@_type"]}-${m["@_ref"]}`, [])


    const memberItemRender = useCallback(({ member, children }: { member: Member; children: React.ReactNode; overlay?: true; }) => <MemberItem
        id={member["@_ref"]}
        type={member["@_type"]}
    >
        {() => {
            const localA = localActiveMember?.id === member["@_ref"] && localActiveMember.type === member["@_type"]
            return <>
                <button className={cn("btn btn-square btn-xs tooltip tooltip-bottom", localA && "btn-accent")}
                    data-tip="Mark as local active place to insert"
                    onMouseDown={(event) => {
                        event.stopPropagation();
                        if (localA) {
                            setlocalActiveMember(undefined)
                        } else {
                            setlocalActiveMember({ id: member["@_ref"], type: member["@_type"] })
                        }
                    }}>
                    <FontAwesomeIcon icon={localA ? faCircelSolid : faCircle} />
                </button>

                <label className="input input-xs input-bordered ml-1 flex items-center gap-1">
                    Role:
                    <RoleInput
                        initialValue={member["@_role"]}
                        onCommit={(value) => handelEditMember(member["@_type"], member["@_ref"], value)}
                    />
                </label>
                {children}
            </>
        }}
    </MemberItem>, [handelEditMember, localActiveMember])

    if (!meta) {
        return null
    }

    function handleDragStart() {
        commitAction()
    }

    function handleDragEnd(member: Member[]) {
        modifyFeatureMetaNC("relation", id, r => {
            r.member = member
        })
    }

    function handleDelete(after: Member[]) {
        commitAction()
        modifyFeatureMetaNC("relation", id, r => {
            r.member = after
        })
    }

    const itemsToMember = (items: {
        id: NumericString,
        type: "way" | "node" | "relation"
    }[]) => items.map(item => ({ '@_ref': item.id, '@_type': item.type })) // sometimes repeated members are needed

    const handleInsertTop: InsertHandeler = (items) => {
        console.log("Insert at Top: ", items);
        commitAction()
        modifyFeatureMetaNC("relation", id, r => {
            r.member = [...itemsToMember(items), ...T2Arr(r.member)]
        })
    };

    const handleInsertBottom: InsertHandeler = (items) => {
        console.log("Insert at Bottom: ", items);
        commitAction()
        modifyFeatureMetaNC("relation", id, r => {
            r.member = [...T2Arr(r.member), ...itemsToMember(items)]
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
            modifyFeatureMetaNC("relation", id, r => {
                r.member = membersArray
            });
        }
    };

    return (
        <div className="p-2 overflow-scroll">
            <h3 className="text-base font-semibold mb-2">[Relation] {getName(meta.tag) || meta["@_id"]}</h3>
            <FeatureState id={id} type="relation" />
            <Attributes meta={meta} />
            <Tags tags={T2Arr(meta.tag)}
                setTags={(tags) => { modifyFeatureMetaNC("relation", id, r => r.tag = tags) }}
                commitChange={commitAction}
            />
            <div className="flex flex-row relative">
                <div className="bg-base-200">
                    <MemberListSelectDel
                        member={meta.member}
                        memberToId={memberToId}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDelete={(_, after) => handleDelete(after)}
                    >
                        {memberItemRender}
                    </MemberListSelectDel>
                </div>
                <div className="">
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