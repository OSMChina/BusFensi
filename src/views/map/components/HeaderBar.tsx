import { ReactElement } from "react";
import { HeaderToolbar } from "./HeaderToolBar";

export function HeaderBar({ height, leftSlot }: { height: number, leftSlot: ReactElement }) {

    return <nav className="navbar bg-base-100 overflow-auto" style={{ height, maxHeight: height, minHeight: height }}>
        <div className="flex-1">
            {leftSlot}
        </div>
        <div className="flex-none">
            <HeaderToolbar/>
        </div>
    </nav>
}