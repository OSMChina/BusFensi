import { Tag } from "../../../api/osm/type";
import { deepCopy } from "../../../utils/helper/object";

function Tags({ tags, setTags, commitChange }: { tags: Tag[], setTags: (tags: Tag[]) => void, commitChange: () => void }) {
    const tagsNew = deepCopy(tags);

    const handleKeyChange = (index: number, newKey: string) => {
        tagsNew[index]["@_k"] = newKey;
        setTags([...tagsNew]);
    };

    const handleValueChange = (index: number, newValue: string) => {
        tagsNew[index]["@_v"] = newValue;
        setTags([...tagsNew]);
    };

    const handleBlur = () => {
        // This function is called when an input loses focus
        commitChange(); // Save changes on blur
    };
    const handleDelete = (index: number) => {
        const updatedTags = tagsNew.filter((_, i) => i !== index);
        setTags(updatedTags);
        commitChange()
    };

    const handleAdd = () => {
        setTags([...tagsNew, { "@_k": "", "@_v": "" }]);
        commitChange()
    };

    const handleSave = () => {
        setTags(tagsNew);
        commitChange()
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
                                onChange={(e) => handleKeyChange(index, e.target.value)}
                                onBlur={handleBlur}
                                className="input input-bordered input-xs p-2 rounded-md border max-w-xs"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={tag["@_v"]}
                                onChange={(e) => handleValueChange(index, e.target.value)}
                                onBlur={handleBlur}
                                className="input input-bordered input-xs p-2 rounded-md border max-w-xs w-fit"
                            />
                        </td>
                        <td>
                            <button
                                onClick={() => handleDelete(index)}
                                className="btn btn-error btn-sm"
                            >
                                Delete
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