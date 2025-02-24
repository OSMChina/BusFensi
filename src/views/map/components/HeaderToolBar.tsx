import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faA } from "@fortawesome/free-solid-svg-icons/faA";
import { faDownLong } from "@fortawesome/free-solid-svg-icons/faDownLong";
import { faFileExport } from "@fortawesome/free-solid-svg-icons/faFileExport";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { useCallback, useState } from "react";
import { useMapViewStore } from "../../../store/mapview";
import { useOSMMapStore } from "../../../store/osmmeta";
import { useShallow } from "zustand/shallow";
import { useSettingsStore } from "../../../store/settings";
import { cn } from "../../../utils/helper/object";
import { exportJOSMXML } from "../../../api/osm/jsomExportV2";
import { SettingsEditModal } from "./SettingsModal";

function AutoLoadLi() {
    const [autoload, setAutoload] = useOSMMapStore(useShallow(state => ([state.autoload, state.setAutoloadNC])));
    const handleAutoLoad = useCallback(() => setAutoload(() => !autoload), [autoload, setAutoload]);

    return <li className="tooltip tooltip-left" data-tip={"Auto load OSM data on drag: " + (autoload ? "Enabled" : "Disabled")}>
        <a onClick={handleAutoLoad} className={cn(autoload && "active")}><FontAwesomeIcon icon={faA} /></a></li>
}

function LoadBBoxLi() {
    const { viewpoint, zoom, height: h, width: w } = useMapViewStore();
    const loadbbox = useOSMMapStore(useShallow(state => state.loadbbox));
    const baseURL = useSettingsStore(state => state.osmAPI.BASEURL);
    const [loadingBbox, setLoadingBbox] = useState<boolean>(false);
    const handleLoadScreen = useCallback(async () => {
        if (loadingBbox) return
        setLoadingBbox(true)
        await loadbbox({ width: w!, height: h!, zoom, viewpoint }, baseURL)
        setLoadingBbox(false)
    }, [baseURL, h, loadbbox, viewpoint, w, zoom, loadingBbox, setLoadingBbox]);

    return <li className={cn("tooltip tooltip-left", loadingBbox && "disabled")} data-tip="Load OSM data on current screen">
        <a onClick={handleLoadScreen}>{loadingBbox ? <span className="loading loading-spinner loading-xs h-[14px]"></span> : <FontAwesomeIcon icon={faDownLong} />}</a>
    </li>
}

function ExportToJSOMLi() {
    return <li className="tooltip tooltip-left" data-tip="Export with JSOM format"><a onClick={() => {
        const { meta, deletedMeta, bbox } = useOSMMapStore.getState();
        const xml = exportJOSMXML(meta, deletedMeta, bbox);
        const blob = new Blob([xml], { type: "application/xml" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "exported_data.osm";
        link.click();
        URL.revokeObjectURL(link.href);
    }}><FontAwesomeIcon icon={faFileExport} /></a></li>
}

function ChangeSettingsLi() {
    const [open, setOpen] = useState(false)
    return <>
        <li className="tooltip tooltip-left" data-tip="Change settings" onClick={() => setOpen(true)}><a><FontAwesomeIcon icon={faGear} /></a></li>
        <SettingsEditModal open={open} onClose={() => setOpen(false)} />
    </>
}

export function HeaderToolbar() {
    return <ul className="menu menu-horizontal">
        <AutoLoadLi />
        <LoadBBoxLi />
        <ExportToJSOMLi />
        <ChangeSettingsLi />
    </ul>
}