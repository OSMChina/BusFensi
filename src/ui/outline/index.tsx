import useBearStoreWithUndo from "../../logic/model/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import CollectionItem from "./components/CollectionItem";
import GlobalCollection from "./components/GlobalCollection";


function OutlineView() {
    const { ptv2, highway } = useBearStoreWithUndo((state) => state.collections)

    return (
        <div className="outline-view min-h-1/2 h-1/2 max-h-1/2 w-full max-w-full flex flex-col p-1 rounded bg-base-100 overflow-x-scroll">
            <label className="input input-xs input-bordered flex items-center gap-2">
                <FontAwesomeIcon icon={faSearch} />
                <input type="text" className="grow" placeholder="Search" />
            </label>
            <div className="outline-list flex-1 overflow-scroll mt-1 rounded">
                <ul className="menu menu-xs bg-base-200">
                    <CollectionItem name="Public Transport" collecion={ptv2} />
                    <CollectionItem name="Highway" collecion={highway} />
                    <GlobalCollection name="Global" />
                </ul>
            </div>
        </div>
    );
}

export default OutlineView;
