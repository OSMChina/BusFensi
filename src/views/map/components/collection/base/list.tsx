import { ReactNode, useState } from "react"
import { ItemCollection } from "../../../../../components/osm/outline/itemCollectionList"
import { FeatureItem } from "./item"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight"
import { Node, Relation, Way } from "../../../../../type/osm/meta"
import { FilterFunc } from "../../../../../type/view/outline/type"

export function FeatureList({ node, way, relation, filter }: {
    node?: Node[]
    way?: Way[]
    relation?: Relation[]
    filter?: FilterFunc
}) {
    filter = filter || (() => true);
    return <ItemCollection>
        {(node || []).filter(f => filter(f, "node")).map(n => <FeatureItem key={n["@_id"]} meta={n} type="node" />)}
        {(way || []).filter(f => filter(f, "way")).map(w => <FeatureItem key={w["@_id"]} meta={w} type="way" />)}
        {(relation || []).filter(f => filter(f, "relation")).map(r => <FeatureItem key={r["@_id"]} meta={r} type="relation" />)}
    </ItemCollection>
}

export function FeatureCollection({ name, children }: {
    children: () => ReactNode,
    name: string
}) {
    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapse: React.MouseEventHandler = (e) => {
        e.stopPropagation(); // prevent selecting when collapsing
        setCollapsed(!collapsed);
    };
    return (
        <li className="outline-list-item">
            <span className={`flex flex-row`} onClick={toggleCollapse} >
                <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronDown} />
                <FontAwesomeIcon icon={faBars} className="ml-1" />
                <span className="ml-0 mr-auto">{name}</span>
            </span>
            {!collapsed && children()}
        </li>
    );
}