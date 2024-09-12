import { useShallow } from "zustand/react/shallow";
import useBearStoreWithUndo from "../../logic/model/store";
import { stateMachine } from "../../logic/states/stateMachine";
import { deepCopy } from "../../utils/helper/object";
import { exportJOSMXML } from "../../api/osm/jsomExport";

export default function Toolbar() {
    const {
        createLocalWayAction,
        createLocalRelationAction,
        deleteNodeAction,
        deleteWayAndSubNdAction,
        deleteRelationAction,
        PIXIComponentSelectClearAction,
        selectedComponent,
        renderedOSMFeatureMeta,
        deletedOSMFeatureMeta,
        bboxs
    } = useBearStoreWithUndo(useShallow((state) => state))

    const handelCreateWay = () => {
        createLocalWayAction(selectedComponent.filter(item => item.type === "node").map(item => ({ '@_ref': item.id })))
    }
    const handelCreateRelation = () => {
        createLocalRelationAction(selectedComponent.map(item => ({ '@_ref': item.id, '@_type': item.type })))
    }
    const handelDeleteSelected = () => {
        const selTmp = deepCopy(selectedComponent)
        PIXIComponentSelectClearAction()
        selTmp.forEach(item => {
            if (item.type === "node") {
                deleteNodeAction(item.id)
            } else if (item.type === "way") {
                deleteWayAndSubNdAction(item.id)
            } else if (item.type === "relation") {
                deleteRelationAction(item.id)
            } else {
                throw new Error(`Type not found ${item.type} for id ${item.id}`)
            }
        })
    }

    const handleExport = () => {
        const xml = exportJOSMXML(renderedOSMFeatureMeta, deletedOSMFeatureMeta, bboxs);
        // Create a Blob from the XML string
        const blob = new Blob([xml], { type: 'application/xml' });

        // Create a download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'exported_data.osm'; // Set the file name

        // Programmatically click the link to trigger the download
        link.click();

        // Cleanup the object URL after the download
        URL.revokeObjectURL(link.href);
    };

    return <div className="join">
        <button
            className="btn btn-sm join-item"
            onMouseDown={() => stateMachine.hookCustomEvent({ type: 'add-node' })}
        >
            Create Node
        </button>
        <button
            className="btn btn-sm join-item"
            onMouseDown={() => stateMachine.hookCustomEvent({ type: 'add-node-on-way' })}
        >
            Create node on way
        </button>
        <button
            className="btn btn-sm join-item"
            onMouseDown={() => stateMachine.hookCustomEvent({ type: 'split-way' })}
        >
            Split way
        </button>
        <button
            className="btn btn-sm join-item"
            onMouseDown={handelCreateWay}
        >
            Create way with select
        </button>
        <button
            className="btn btn-sm join-item"
            onMouseDown={handelCreateRelation}
        >
            Create relation with select
        </button>
        <button
            className="btn btn-sm join-item"
            onMouseDown={handelDeleteSelected}
        >
            Delete selected
        </button>
        <button
            className="btn btn-sm join-item"
            onMouseDown={handleExport}
        >
            export josm
        </button>
    </div>

}