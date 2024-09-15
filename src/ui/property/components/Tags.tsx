import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tag } from "../../../api/osm/type";
import { deepCopy } from "../../../utils/helper/object";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

function Tags({ tags, setTags, commitChange }: { tags: Tag[], setTags: (tags: Tag[]) => void, commitChange: () => void }) {
    const focusBeforeEdit = useRef(false)
    const tagsNew = deepCopy(tags);

    const handleKeyChange = (index: number, newKey: string) => {
        if (!focusBeforeEdit.current) {
            commitChange()
            focusBeforeEdit.current = false;
        }
        tagsNew[index]["@_k"] = newKey;
        setTags([...tagsNew]);
    };

    const handleValueChange = (index: number, newValue: string) => {
        if (!focusBeforeEdit.current) {
            commitChange()
            focusBeforeEdit.current = false;
        }
        tagsNew[index]["@_v"] = newValue;
        setTags([...tagsNew]);
    };

    const handleFocus = () => {
        // This function is called when an input get focus
        focusBeforeEdit.current = true; // Save prevoius change on focus
    };

    const handleBlur = () => {
        focusBeforeEdit.current = false;
    }

    const handleDelete = (index: number) => {
        const updatedTags = tagsNew.filter((_, i) => i !== index);
        commitChange()
        setTags(updatedTags);
    };

    const handleAdd = () => {
        commitChange()
        setTags([...tagsNew, { "@_k": "", "@_v": "" }]);
    };

    const handleSave = () => {
        commitChange()
        setTags(tagsNew);
    };

    return (
        <table className="table table-xs w-full max-w-full overflow-x-scroll">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tagsNew.map((tag, index) => (
                    <tr key={index}>
                        <td>
                            <input
                                type="text"
                                value={tag["@_k"]}
                                onFocus={handleFocus}
                                onChange={(e) => handleKeyChange(index, e.target.value)}
                                onBlur={handleBlur}
                                className="input input-bordered input-xs rounded-md border max-w-xs"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={tag["@_v"]}
                                onFocus={handleFocus}
                                onChange={(e) => handleValueChange(index, e.target.value)}
                                onBlur={handleBlur}
                                className="input input-bordered input-xs rounded-md border max-w-xs w-fit"
                            />
                        </td>
                        <td>
                            <button
                                onClick={() => handleDelete(index)}
                                className="btn btn-error btn-xs"
                            >
                                <FontAwesomeIcon icon={faDeleteLeft} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={3} className="flex gap-2">
                        <button onClick={handleSave} className="btn btn-success btn-sm">
                            Save
                        </button>
                        <button onClick={handleAdd} className="btn btn-primary btn-sm">
                            Add
                        </button>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};

export default Tags;