import { ComponentProps, memo, useCallback, useEffect, useMemo, useState } from "react";
import { FeaturePreset } from "../../type/osm/presets";
import { Member, Tag } from "../../type/osm/meta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle as faCircleSolid, faTrash } from "@fortawesome/free-solid-svg-icons";
import { InsertHandeler } from "../../type/view/property/type";
import { FeatureRefObj, NumericString } from "../../type/osm/refobj";
import CreateFeatureMemberItem from "./create/CreateFeatureMemberItem";
import { faCircle } from "@fortawesome/free-regular-svg-icons/faCircle";
import { cn, deepCopy } from "../../utils/helper/object";
import InsertMember from "../../views/property/views/InsertMember";
import MemberListSelectDel from "./create/MemberListWithDel";

export interface ResultValue {
    tag: Tag[],
    member?: Member[]
}

export interface CreateNodeProps {
    preset: FeaturePreset;
    existing?: Tag[];
    onSubmit: (values: ResultValue) => void;
    open: boolean;
    title: string;
    onClose: () => void;
    createMembers?: true;
}

const RoleInput = memo(({ initialValue, onCommit, onFocus, onBlur }: Pick<ComponentProps<'input'>, "onFocus" | "onBlur"> & {
    initialValue?: string,
    onCommit: (value: string) => void
}) => {
    const [value, setValue] = useState<string>(initialValue || "");

    // 当初始值变化时同步更新本地状态
    useEffect(() => {
        setValue(initialValue || "");
    }, [initialValue]);

    return (
        <input
            className="grow"
            type="text"
            placeholder="role of member"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={e => {
                if (e.key === "Enter") {
                    e.currentTarget.blur();
                }
            }}
            onBlur={(e) => {
                if (onBlur) onBlur(e);
                onCommit(value); // 提交最终输入值
            }}
            onFocus={onFocus}
        />
    );
});


export default function CreateFeatureTags({ preset, existing, title, onSubmit, open, onClose, createMembers }: CreateNodeProps) {

    // tags edit begin::
    const [values, setValues] = useState<Record<string, string>>({});

    useEffect(() => {
        setValues(() => {
            return preset.tag.reduce((acc, item) => {
                if (!existing?.some(t => item["@_k"] === t["@_k"])) acc[item["@_k"]] = item["@_v"] || "";
                return acc;
            }, {} as Record<string, string>);
        })
    }, [existing, preset])

    const filterdPresetTags = useMemo(() =>
        preset.tag.filter(item => !existing?.some(t => item["@_k"] === t["@_k"])), [preset, existing])

    const [newTags, setNewTags] = useState<{ key: string; value: string }[]>(existing?.map(t => ({ key: t["@_k"], value: t["@_v"] })) || []);
    const [newTagKey, setNewTagKey] = useState("");

    useEffect(() => {
        const modal = document.getElementById("create-node-modal") as HTMLDialogElement;
        if (open) {
            modal?.showModal();
        } else {
            modal?.close();
        }
    }, [open]);

    const handleChange = (key: string, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const addNewTag = useCallback(() => {
        if (newTagKey.trim() !== "") {
            setNewTags((prev) => [...prev, { key: newTagKey.trim(), value: "" }]);
            setNewTagKey("");
        }
    }, [newTagKey]);

    const handleNewTagChange = (index: number, value: string) => {
        setNewTags(t => t.map((v, i) => i === index ? { ...v, value } : v));
    };

    const removeNewTag = (index: number) => {
        setNewTags(t => t.filter((_, i) => i !== index))
    }

    const TagsEdit = useMemo(() => <>
        {existing && <div className="divider">Needed preset tags</div>}

        {filterdPresetTags.map((item) => (
            <label
                key={item["@_k"]}
                className="input input-bordered input-sm flex items-center gap-x-1 tooltip tooltip-top"
                data-tip={item.description || ""}
            >
                <span className="font-semibold">
                    {item["@_k"]} {item.importance === "required" && <span className="text-red-500">*</span>}
                </span>
                <input
                    type="text"
                    placeholder={item.example || "Enter value"}
                    value={values[item["@_k"]]}
                    onChange={(e) => handleChange(item["@_k"], e.target.value)}
                    required={item.importance === "required"}
                    disabled={item.importance === "not-recommened"}
                    className="grow"
                />
                <span className="badge">{item.importance}</span>
            </label>
        ))}
        <div className="divider">{existing ? "Exsisting or created tags" : "Created tags"}</div>
        {/* New Tag Input Row */}

        {newTags.map((item, index) => <label
            key={item.key}
            className="input input-bordered input-sm flex items-center gap-x-1"
        >
            <span className="font-semibold">
                {item.key} <span className="text-red-500">*</span>
            </span>
            <input
                type="text"
                placeholder={"Enter value"}
                value={item.value}
                onChange={(e) => handleNewTagChange(index, e.target.value)}
                required
                className="grow"
            />
            {!existing && <span className="badge">created</span>}
            <button type="button" className="btn btn-xs btn-error" onClick={() => removeNewTag(index)} >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </label>
        )}
        <label className="input input-sm input-bordered flex items-center gap-2">

            <input
                type="text"
                placeholder="New tag key"
                value={newTagKey}
                onChange={(e) => setNewTagKey(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        addNewTag();
                    }
                }}
                className="grow"
            />
            <button type="button" className="btn btn-xs btn-outline" onClick={addNewTag}>
                + add tag
            </button>
        </label>
    </>, [addNewTag, existing, filterdPresetTags, newTagKey, newTags, values])
    // tags edit end::

    // members edit begin::
    const [member, setMember] = useState<Member[]>([])
    const [localActiveMember, setlocalActiveMember] = useState<FeatureRefObj | undefined>(undefined);

    const handelEditMember = useCallback((type: "node" | "way" | "relation", ref: string, text: string) => {
        console.log('edit', type, ref, text)
        setMember(member => member.map(m => {
            if (m["@_type"] === type && m["@_ref"] === ref) {
                const mem = deepCopy(m)
                mem["@_role"] = text
                return mem
            }
            return m
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
                    <RoleInput
                        initialValue={member["@_role"]}
                        onCommit={(value) => handelEditMember(member["@_type"], member["@_ref"], value)}
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

    const handleInsertTop = useCallback<InsertHandeler>((items) => {
        console.log("Insert at Top: ", items);
        setMember(member => [...itemsToMember(items), ...member])
    }, []);

    const handleInsertBottom = useCallback<InsertHandeler>((items) => {
        console.log("Insert at Bottom: ", items);
        setMember(member => [...member, ...itemsToMember(items)])
    }, [])

    const handleInsertAtActive = useCallback<InsertHandeler>((items) => {
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
    }, [handleInsertBottom, localActiveMember]);
    const MemberEdit = useMemo(() => {
        if (!createMembers) {
            return null;
        }
        return <div className="flex flex-row">
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
        </div>
    }, [createMembers, handleInsertAtActive, handleInsertBottom, handleInsertTop, member, memberItemRender, memberToId])
    // members edit end::

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const presetTags: Tag[] = Object.entries(values).filter(([, v]) => v.length).map(([k, v]) => ({ "@_k": k, "@_v": v }));
        const additionalTags: Tag[] = newTags.map((tag) => ({ "@_k": tag.key, "@_v": tag.value }));
        onSubmit({ tag: [...presetTags, ...additionalTags], member: member });
        setNewTags([]);
        setNewTagKey("");
        onClose();
    };

    return (
        <>
            <dialog id="create-node-modal" className="modal" onClose={onClose}>
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <form onSubmit={handleSubmit} className="space-y-2">
                        {TagsEdit}
                        {MemberEdit}
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => onClose()}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
