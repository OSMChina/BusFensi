import { ReactElement } from "react";
import { HeaderToolbar } from "./HeaderToolBar";
import { ThemeToggleButton } from "../../../../components/layout/ThemeToggleBtn";

function ThemeToggle() {
    return (
      <div className="tooltip tooltip-left mx-2" data-tip="Toggle theme">
        <ThemeToggleButton className="btn-sm" />
      </div>
    );
  }
  

export function HeaderBar({ height, leftSlot }: { height: number, leftSlot: ReactElement }) {

    return <nav className="navbar p-0 bg-base-100 overflow-hidden border-b-2 border-b-base-300" style={{ height, maxHeight: height, minHeight: height }}>
        <div className="flex-1">
            {leftSlot}
        </div>
        <div className="flex-none">
            <HeaderToolbar/>
            <ThemeToggle />
        </div>
    </nav>
}