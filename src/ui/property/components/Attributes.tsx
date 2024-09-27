/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, Way, Relation } from "../../../api/osm/type";

function Attributes({ meta }: { meta: Node | Way | Relation }) {
    return (
        <ul className="menu menu-xs bg-200 rounded-box">
            {Object.keys(meta)
                .filter(
                    (key) =>
                        Object.prototype.hasOwnProperty.call(meta, key) && key.startsWith("@_")
                )
                .map((key) => (
                    <li key={key}>
                        <span>
                            <span className="font-semibold">{key.substring(2)}</span>
                            <span className="ml-auto text-base-content">{(meta as any)[key]}</span>
                        </span>
                    </li>
                ))}
        </ul>
    );
}

export default Attributes