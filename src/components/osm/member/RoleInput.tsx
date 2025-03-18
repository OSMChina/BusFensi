import { memo, useEffect, useState } from "react";

const RoleInput = memo(({ initialValue, onCommit }: {
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
                e.stopPropagation()
            }}
            onBlur={() => {
                onCommit(value); // 提交最终输入值
            }}
        />
    );
});
export default RoleInput