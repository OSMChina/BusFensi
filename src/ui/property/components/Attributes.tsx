/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, Way, Relation } from "../../../api/osm/type";

function Attributes({ meta }: { meta: Node | Way | Relation }) {
    return (
        <ul className="space-y-2">
            {Object.keys(meta)
                .filter(
                    (key) =>
                        Object.prototype.hasOwnProperty.call(meta, key) && key.startsWith("@_")
                )
                .map((key) => (
                    <li key={key} className="flex justify-between p-2 bg-base-200 rounded-md shadow-sm">
                        <span className="font-semibold">{key.substring(2)}</span>
                        <span className="ml-2 text-base-content">{(meta as any)[key]}</span>
                    </li>
                ))}
        </ul>
    );
}

export default Attributes