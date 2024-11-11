import { useShallow } from "zustand/react/shallow";
import useBearStoreWithUndo from "../../logic/model/store";
import { stateMachine } from "../../logic/states/stateMachine";
import { deepCopy } from "../../utils/helper/object";
import { exportJOSMXML } from "../../api/osm/jsomExport";
import { useState } from "react";


export default function Toolbar() {
    const {
        createLocalWayAction,
        createLocalRelationAction,
        deleteNodeAction,
        deleteWayAndSubNdAction,
        deleteRelationAction,
        PIXIComponentSelectClearAction,
        PIXIComponentSelectAction,
        updateSettingsAction,
        selectedComponent,
        renderedOSMFeatureMeta,
        deletedOSMFeatureMeta,
        bboxs,
        settings
    } = useBearStoreWithUndo(useShallow((state) => state))

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSettings, setNewSettings] = useState(settings)


    const handelCreateWay = () => {
        const tmpWayId = createLocalWayAction(selectedComponent.filter(item => item.type === "node").map(item => ({ '@_ref': item.id })))
        PIXIComponentSelectAction("way", tmpWayId, false);
    }
    const handelCreateRelation = () => {
        const tmpoRealtionId = createLocalRelationAction(selectedComponent.map(item => ({ '@_ref': item.id, '@_type': item.type })))
        PIXIComponentSelectAction("relation", tmpoRealtionId, false);
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

    const handleSaveSettings = () => {
        updateSettingsAction(newSettings);
        setIsModalOpen(false);
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
        <button
            className="btn btn-sm join-item"
            onMouseDown={() => setIsModalOpen(true)}
        >
            Change Settings
        </button>
        {
            isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Change Settings</h3>

                        {/* OSM API Settings */}
                        <div className="py-4">
                            <label className="label">
                                <span className="label-text">OSM API Base URL</span>
                            </label>
                            <input
                                type="text"
                                value={newSettings.osmAPI.BASEURL}
                                onChange={(e) => setNewSettings({
                                    ...newSettings,
                                    osmAPI: { ...newSettings.osmAPI, BASEURL: e.target.value }
                                })}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="py-4">
                            <label className="label">
                                <span className="label-text">OSM API Tile Source</span>
                            </label>
                            <input
                                type="text"
                                value={newSettings.osmAPI.TILE_SOURCE}
                                onChange={(e) => setNewSettings({
                                    ...newSettings,
                                    osmAPI: { ...newSettings.osmAPI, TILE_SOURCE: e.target.value }
                                })}
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* View Settings */}
                        <div className="py-4">
                            <label className="label">
                                <span className="label-text">Max Zoom Level</span>
                            </label>
                            <input
                                type="number"
                                value={newSettings.view.MAX_ZOOM}
                                onChange={(e) => setNewSettings({
                                    ...newSettings,
                                    view: { ...newSettings.view, MAX_ZOOM: parseFloat(e.target.value) }
                                })}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={handleSaveSettings}>Save</button>
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )
        }
    </div>

}