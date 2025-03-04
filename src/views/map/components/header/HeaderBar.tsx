import { ReactElement } from "react";
import { HeaderToolbar } from "./HeaderToolBar";

export function HeaderBar({ height, leftSlot }: { height: number, leftSlot: ReactElement }) {

    return <nav className="navbar p-0 bg-base-100 overflow-auto border-b-2 border-b-base-300" style={{ height, maxHeight: height, minHeight: height }}>
        <div className="flex-1">
            {leftSlot}
        </div>
        <div className="flex-none">
            <HeaderToolbar/>
        </div>
    </nav>
}