import { ReactNode } from "react";
import { FeatureTypes } from "../../../type/osm/refobj";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleDot,
    faRoad,
    faSitemap,
    faQuestion,
    faPlus,
    faEdit,
    faTrash
} from '@fortawesome/free-solid-svg-icons';

interface ItemBaseProps {
    featuretype: FeatureTypes; // "node" | "way" | "relation"
    metatype?: string;
    fullname?: string;
    id: string,
    created?: boolean;
    deleted?: boolean;
    modified?: boolean;
    children?: ReactNode;
}

export function ItemBaseDisplay({
    featuretype,
    metatype,
    fullname,
    id,
    created,
    deleted,
    modified,
    children // action buttons, aligned to right
}: ItemBaseProps) {
    // Map feature type to a Font Awesome icon
    let featureIcon;
    switch (featuretype) {
        case "node":
            featureIcon = faCircleDot;
            break;
        case "way":
            featureIcon = faRoad;
            break;
        case "relation":
            featureIcon = faSitemap;
            break;
        default:
            featureIcon = faQuestion;
    }

    return (
        <>
            {/* Feature type icon */}
            <span><FontAwesomeIcon icon={featureIcon} /></span>

            {/* Title and optional metatype */}
            <span className={"font-semibold"} >{fullname || '[untitled]'}</span>
            {metatype && <span className="badge badge-xs h-fit badge-outline text-nowrap">{metatype}</span>}
            <div className="badge badge-xs h-fit badge-outline">{id}</div>

            {/* Status badges */}
            <div className="flex space-x-1">
                {created && (
                    <div className="badge badge-xs badge-success tooltip tooltip-bottom" data-tip="Created">
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                )}
                {modified && (
                    <div className="badge badge-xs badge-warning tooltip tooltip-bottom" data-tip="Modified">
                        <FontAwesomeIcon icon={faEdit} />
                    </div>
                )}
                {deleted && (
                    <div className="badge badge-xs badge-error tooltip tooltip-bottom" data-tip="Deleted">
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                )}
            </div>

            {/* Action buttons or additional controls */}
            <span className="flex items-center ml-auto">
                {children}
            </span>
        </>
    );

}

export default function ItemBase(props: ItemBaseProps) {
    return <li> <span className="flex select-text justify-between items-center rounded">
        <ItemBaseDisplay {...props} />
    </span></li>
}
