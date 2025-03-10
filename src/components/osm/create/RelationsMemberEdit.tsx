import { produce } from "immer";
import { Member } from "../../../type/osm/meta";
import { FeatureRefObj, NumericString } from "../../../type/osm/refobj";
import { InsertHandeler } from "../../../type/view/property/type";
import InsertMember from "../../../views/property/views/InsertMember";
import { useCallback, useState } from "react";
import { cn, deepCopy } from "../../../utils/helper/object";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircle as faCircleSolid } from "@fortawesome/free-solid-svg-icons";
import MemberListSelectDel from "./MemberListWithDel";
import CreateFeatureMemberItem from "./CreateFeatureMemberItem";

export default function RelationMemberEdit() {

    const [member, setMember] = useState<Member[]>([])
    const [localActiveMember, setlocalActiveMember] = useState<FeatureRefObj | undefined>(undefined);

    const handelEditMember = useCallback((type: "node" | "way" | "relation", ref: string, text: string) => {
        console.log('edit', type, ref, text)
        setMember(produce(member => {
            member = member.map(m => {
                if (m["@_type"] === type && m["@_ref"] === ref) {
                    const mem = deepCopy(m)
                    mem["@_role"] = text
                    return mem
                }
                return m
            })
            return member;
        }))
    }, [])


    const memberToId = useCallback((m: Member) => `${m["@_type"]}-${m["@_ref"]}`, [])

    const memberItemRender = useCallback(({ member, children }: { member: Member; children: React.ReactNode; overlay?: true; }) => <CreateFeatureMemberItem
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
                    <FontAwesomeIcon icon={localA ? faCircleSolid : faCircle} />
                </button>

                <label className="input input-xs input-bordered ml-1 flex items-center gap-1">
                    Role:
                    <input
                        className="grow"
                        type="text"
                        placeholder="role of member"
                        value={member["@_role"]}
                        onMouseDown={e => e.stopPropagation()}
                        onKeyDown={e => e.stopPropagation()}
                        onChange={(e) => handelEditMember(member["@_type"], member["@_ref"], e.target.value)}
                    />
                </label>
                {children}
            </>
        }}
    </CreateFeatureMemberItem>, [handelEditMember, localActiveMember])

    function handleDragStart() {
        // commitAction()
    }

    function handleDragEnd(member: Member[]) {
        setMember(() => member)
    }

    function handleDelete(after: Member[]) {
        setMember(() => after)
    }

    const itemsToMember = (items: {
        id: NumericString,
        type: "way" | "node" | "relation"
    }[]) => items.map(item => ({ '@_ref': item.id, '@_type': item.type })) // sometimes repeated members are needed

    const handleInsertTop: InsertHandeler = (items) => {
        console.log("Insert at Top: ", items);
        setMember(member => [...itemsToMember(items), ...member])
    };

    const handleInsertBottom: InsertHandeler = (items) => {
        console.log("Insert at Bottom: ", items);
        setMember(member => [...member, ...itemsToMember(items)])
    };

    const handleInsertAtActive: InsertHandeler = (items) => {
        console.log("Insert at Active: ", items);
        if (!localActiveMember) {
            handleInsertBottom(items)
        } else {
            setMember(member => {
                const membersArray = [...member];
                const insertIndex = membersArray.findIndex(m => m["@_ref"] === localActiveMember.id && m["@_type"] === localActiveMember.type);
                membersArray.splice(insertIndex + 1, 0, ...itemsToMember(items));
                return membersArray
            });
        }
    };
    return <>
        <div className="bg-base-200">
            <MemberListSelectDel
                member={member}
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
    </>
}