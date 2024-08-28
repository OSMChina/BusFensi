import OutlineView from "./outline";
import PropertyView from "./property";

export function UI() {
    return <>
        <div className="slot-top absolute inset-x-0 top-0 flex flex-row align-middle justify-center">
            slot top
        </div>

        <div className="slot-right absolute inset-y-0 right-0 w-1/5 min-w-64">
            <OutlineView />
            <PropertyView />
        </div>

        <div className="slot-bottom absolute inset-x-0 bottom-0 flex flex-row align-middle justify-center">
            slot bottom
        </div>
    </>
}