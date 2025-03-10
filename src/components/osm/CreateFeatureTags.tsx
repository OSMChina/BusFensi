import { useEffect, useMemo, useState } from "react";
import { NodePreset } from "../../type/osm/presets";
import { Tag } from "../../type/osm/meta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface CreateNodeProps {
    preset: NodePreset;
    existing?: Tag[];
    onSubmit: (values: Tag[]) => void;
    open: boolean;
    title: string;
    onClose: () => void;
}

export default function CreateFeatureTags({ preset, existing, title, onSubmit, open, onClose }: CreateNodeProps) {
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

    const addNewTag = () => {
        if (newTagKey.trim() !== "") {
            setNewTags((prev) => [...prev, { key: newTagKey.trim(), value: "" }]);
            setNewTagKey("");
        }
    };

    const handleNewTagChange = (index: number, value: string) => {
        setNewTags(t => t.map((v, i) => i === index ? { ...v, value } : v));
    };

    const removeNewTag = (index: number) => {
        setNewTags(t => t.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const presetTags: Tag[] = Object.entries(values).filter(([, v]) => v.length).map(([k, v]) => ({ "@_k": k, "@_v": v }));
        const additionalTags: Tag[] = newTags.map((tag) => ({ "@_k": tag.key, "@_v": tag.value }));
        onSubmit([...presetTags, ...additionalTags]);
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
