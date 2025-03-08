import { Children, isValidElement, ReactElement } from "react";
import { RightClickMenuProps } from "../../../type/view/map";

export function RightClickMenu({ x, y, open, children }: RightClickMenuProps &{
    children: ReactElement | ReactElement[]
}) {
    if (!open) {
        return null;
    }
    return <ul className="absolute rounded-lg bg-base-100 menu shadow p-0" style={{ top: y, left: x }}>
        {Children.map(children, (child, index) => {
            if (!isValidElement(child)) { return null; }
            if (child.type === 'a') {
                return <li key={index}>{child}</li>; // Render only valid <a> children in <li>
            } else {
                return <li key={index}><a>{child}</a></li>;
            }
        })}
    </ul>
}