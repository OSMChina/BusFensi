import { ComponentProps, ReactNode, useState } from "react"
import { ItemCollection } from "../../../components/osm/outline/itemCollectionList"
import { FeatureItem } from "./item"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight"
import { Node, Relation, Way } from "../../../type/osm/meta"
import { FilterFunc } from "../../../type/view/outline/type"
import { faX } from "@fortawesome/free-solid-svg-icons/faX"
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus"

export function FeatureList({ node, way, relation, filter, ...props }: {
    node?: Node[]
    way?: Way[]
    relation?: Relation[]
    filter?: FilterFunc,
} & Omit<ComponentProps<typeof FeatureItem>, "meta" | "type">) {
    filter = filter || (() => true);
    return <ItemCollection>
        {(node || []).filter(f => filter(f, "node")).map(n => <FeatureItem {...props} key={n["@_id"]} meta={n} type="node" />)}
        {(way || []).filter(f => filter(f, "way")).map(w => <FeatureItem {...props} key={w["@_id"]} meta={w} type="way" />)}
        {(relation || []).filter(f => filter(f, "relation")).map(r => <FeatureItem {...props} key={r["@_id"]} meta={r} type="relation" />)}
    </ItemCollection>
}

export function FeatureCollection({ name, defaultOpen, forceOpen, forceClose, children }: {
    children: ReactNode,
    defaultOpen?: boolean,
    forceOpen?: boolean,
    forceClose?: boolean,
    name: string
}) {
    const [collapsed, setCollapsed] = useState(!defaultOpen);
    const toggleCollapse: React.MouseEventHandler = (e) => {
        e.stopPropagation(); // nonsence here currently
        if (!(forceClose || forceOpen)) setCollapsed(!collapsed);
    };
    const show = forceOpen ? true : (forceClose ? false : !collapsed)
    return (
        <li className="outline-list-item">
            <span className={`flex flex-row`} onClick={toggleCollapse} >
                <FontAwesomeIcon icon={(forceOpen ? faMinus : (forceClose ? faX : (!show ? faChevronRight : faChevronDown)))} />
                <FontAwesomeIcon icon={faBars} className="ml-1" />
                <span className="ml-0 mr-auto">{name}</span>
            </span>
            {show && children}
        </li>
    );
}