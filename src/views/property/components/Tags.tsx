import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tag } from "../../../type/osm/meta";
import { deepCopy } from "../../../utils/helper/object";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { ComponentProps, memo, useEffect, useState } from "react";

const TagInput = memo(({ initialValue, onCommit, ...rest }: Pick<ComponentProps<'input'>, "className" | "placeholder" | "type"> & {
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
            {...rest}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={e => {
                if (e.key === "Enter") {
                    e.currentTarget.blur();
                }
                e.stopPropagation()
            }}
            onBlur={() => {
                onCommit(value); // 提交最终输入值
            }}
        />
    );
});


function Tags({ tags, setTags, commitChange }: { tags: Tag[], setTags: (tags: Tag[]) => void, commitChange: () => void }) {
    const tagsNew = deepCopy(tags);

    const handleKeyChange = (index: number, newKey: string) => {
        commitChange()
        tagsNew[index]["@_k"] = newKey;
        setTags([...tagsNew]);
    };

    const handleValueChange = (index: number, newValue: string) => {
        commitChange()
        tagsNew[index]["@_v"] = newValue;
        setTags([...tagsNew]);
    };

    const handleDelete = (index: number) => {
        const updatedTags = tagsNew.filter((_, i) => i !== index);
        commitChange()
        setTags(updatedTags);
    };

    const handleAdd = () => {
        commitChange()
        setTags([...tagsNew, { "@_k": "", "@_v": "" }]);
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
                            <TagInput
                                type="text"
                                initialValue={tag["@_k"]}
                                onCommit={(v) => handleKeyChange(index, v)}
                                className="input input-bordered input-xs rounded-md border max-w-xs"
                            />
                        </td>
                        <td>
                            <TagInput
                                type="text"
                                initialValue={tag["@_v"]}
                                onCommit={(v) => handleValueChange(index, v)}
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