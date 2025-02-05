import { useShallow } from "zustand/react/shallow";
import { deepCopy } from "../../../utils/helper/object";
import { exportJOSMXML } from "../../../api/osm/jsomExportV2";
import { useState } from "react";
import { useOSMMapStore } from "../../../store/osmmeta";
import { CommonEditStateMachine } from "../stateMachine/commonEdit";
import { useSettingsStore } from "../../../store/settings";

export default function CommonEditToolbar({ stateMachine }: {
    stateMachine: CommonEditStateMachine
}) {
    const {
        createLocalWay,
        createLocalRelation,
        deleteFeature,
        selectFeature,
        clearSelect,
        selectedRef,
        meta,
        bbox,
        deletedMeta,
    } = useOSMMapStore(useShallow((state) => state));

    const { updateSettingsAction, ...settings } = useSettingsStore()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSettings, setNewSettings] = useState(settings);

    const handleCreateWay = () => {
        // 选中节点转换为 { '@_ref': id } 的形式
        const nodeRefs = selectedRef
            .filter((item) => item.type === "node")
            .map((item) => ({ '@_ref': item.id }));
        const tmpWayId = createLocalWay(nodeRefs);
        selectFeature("way", tmpWayId, false);
    };

    const handleCreateRelation = () => {
        const memberRefs = selectedRef.map((item) => ({
            '@_ref': item.id,
            '@_type': item.type,
        }));
        const tmpRelationId = createLocalRelation(memberRefs);
        selectFeature("relation", tmpRelationId, false);
    };

    const handleDeleteSelected = () => {
        const selTmp = deepCopy(selectedRef);
        clearSelect();
        selTmp.forEach((item) => {
            if (item.type === "node" || item.type === "way" || item.type === "relation") {
                deleteFeature(item.type, item.id);
            } else {
                throw new Error(`Type not found ${item.type} for id ${item.id}`);
            }
        });
    };

    const handleExport = () => {
        const xml = exportJOSMXML(meta, deletedMeta, bbox);
        const blob = new Blob([xml], { type: "application/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "exported_data.osm";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleSaveSettings = () => {
        updateSettingsAction(newSettings);
        setIsModalOpen(false);
    };

    return (
        <div className="join">
            <button
                className="btn btn-sm join-item"
                onMouseDown={() => stateMachine.transform({ type: "add-node" })}
            >
                Create Node
            </button>
            <button
                className="btn btn-sm join-item"
                onMouseDown={() => stateMachine.transform({ type: "add-node-on-way" })}
            >
                Create node on way
            </button>
            <button
                className="btn btn-sm join-item"
                onMouseDown={() => stateMachine.transform({ type: "split-way" })}
            >
                Split way
            </button>
            <button className="btn btn-sm join-item" onMouseDown={handleCreateWay}>
                Create way with select
            </button>
            <button className="btn btn-sm join-item" onMouseDown={handleCreateRelation}>
                Create relation with select
            </button>
            <button className="btn btn-sm join-item" onMouseDown={handleDeleteSelected}>
                Delete selected
            </button>
            <button className="btn btn-sm join-item" onMouseDown={handleExport}>
                export josm
            </button>
            <button
                className="btn btn-sm join-item"
                onMouseDown={() => setIsModalOpen(true)}
            >
                Change Settings
            </button>
            {isModalOpen && (
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
                                onChange={(e) =>
                                    setNewSettings({
                                        ...newSettings,
                                        osmAPI: { ...newSettings.osmAPI, BASEURL: e.target.value },
                                    })
                                }
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
                                onChange={(e) =>
                                    setNewSettings({
                                        ...newSettings,
                                        osmAPI: { ...newSettings.osmAPI, TILE_SOURCE: e.target.value },
                                    })
                                }
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
                                onChange={(e) =>
                                    setNewSettings({
                                        ...newSettings,
                                        view: {
                                            ...newSettings.view,
                                            MAX_ZOOM: parseFloat(e.target.value),
                                        },
                                    })
                                }
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="modal-action">
                            <button className="btn" onClick={handleSaveSettings}>
                                Save
                            </button>
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
