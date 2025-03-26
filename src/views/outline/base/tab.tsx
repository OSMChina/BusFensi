import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FilterFunc, OutlineCollectionProps } from "../../../type/view/outline/type";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { ReactElement, useState } from "react";
import { T2Arr } from "../../../utils/helper/object";

type renderProps = (props: OutlineCollectionProps) => ReactElement

export function FeatureBaseOutlineTab({ children }: {
    children: renderProps | renderProps[]
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const searchFilter: FilterFunc = (meta, type) =>
        searchTerm === "" || `${type}-${JSON.stringify(meta)}`.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())

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
        <div className="outline-list flex-1 rounded overflow-scroll">
            <ul className="menu menu-xs">
                {T2Arr(children).map((child,index) =><div key={index}> {child({ filter: searchFilter })}</div>)}
            </ul>
        </div>
    </>
}