import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FilterFunc } from "../../../../../type/view/outline/type";
import { BusStopCollection } from "./busStop";
import { StopAreaCollection } from "./stopArea";
import { StopPositionCollection } from "./stopPosition";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { useState } from "react";

export function BusStopEditOutline() {
    const [searchTerm, setSearchTerm] = useState("");

    const searchFilter: FilterFunc = (meta, type) =>
        searchTerm === "" || `${type}-${JSON.stringify(meta)}`.includes(searchTerm)

    return <>
        <label className="input input-xs input-bordered flex items-center gap-2 w-full mt-1 mx-auto">
            <FontAwesomeIcon icon={faSearch} />
            <input
                type="text"
                className="grow"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </label>
        <div className="outline-list flex-1 rounded">
            <ul className="menu menu-xs">
                <BusStopCollection filter={searchFilter} />
                <StopPositionCollection filter={searchFilter} />
                <StopAreaCollection filter={searchFilter} />
            </ul>
        </div>
    </>
}