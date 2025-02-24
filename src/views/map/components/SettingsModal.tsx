import { useState } from "react";
import { useSettingsStore } from "../../../store/settings";
import { cn } from "../../../utils/helper/object";

export function SettingsEditModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const { updateSettingsAction, ...settings } = useSettingsStore()
    const [newSettings, setNewSettings] = useState(settings);
    const handleSaveSettings = () => {
        updateSettingsAction(newSettings);
        onClose();
    };

    return <div className={cn("modal", open && "modal-open")}>
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
                <button className="btn btn-ghost" onClick={onClose}>
                    Cancel
                </button>
                <button className="btn" onClick={handleSaveSettings}>
                    Save
                </button>
            </div>
        </div>
    </div>
}