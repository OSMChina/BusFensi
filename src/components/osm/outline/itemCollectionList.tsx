import { ReactNode } from "react";

export function ItemCollection({
    children // should be ItemUI
}: {
    children: ReactNode;
}) {
    return (
        <ul className="menu menu-xs">
            {children}
        </ul>
    );
}
