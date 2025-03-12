import { memo, useRef, useState, useEffect } from "react";
import { useMapViewStore } from "../../../../../store/mapview";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { useSettingsStore } from "../../../../../store/settings";
import PIXIStage from "../../../layer/Stage";
import { BackgroundLayer } from "../../../layer/BackgroundLayer";
import EditableLayer from "../../../layer/EditableLayer";
import InfoLayer from "../../../layer/InfoLayer";
import { PtEditStateMachine } from "../../../stateMachine/ptEdit";
import { BaseStateMachine } from "../../../stateMachine/state";
import { RightClickMenuProps } from "../../../../../type/view/map";
import { getLocationByPixel } from "../../../../../store/mapview/seletor";
import { useShallow } from "zustand/shallow";
import { createConfirmation } from "react-confirm";
import CreateFeatureTagConfirm from "../../../../../components/modal/CreateFeatureTagConfirmHook";
import { busStopPresetCN, stopAreaPresetCN, stopPositionPresetCN } from "../../../../../utils/osm/presets/bus";
import { RightClickMenu } from "../../../components/RightCLickMenu";

// Right-click menu for the map (bus stop)
const MemoRightClickOnMap = memo(function (props: RightClickMenuProps & { onClose: () => void }) {
    const newBusLocation = useMapViewStore(useShallow(getLocationByPixel(props)));
    const createBusStop = useOSMMapStore(state => state.createBusStopSel);
    const createStopArea = useOSMMapStore(state => state.createStopAreaSel);
    const confirmModal = createConfirmation(CreateFeatureTagConfirm);

    const onClick = async () => {
        props.onClose();
        const ret = await confirmModal({ title: "Create Bus stop (Preset CN)", preset: busStopPresetCN });
        if (ret?.tag) {
            console.debug("created bus stop", ret);
            if (newBusLocation) createBusStop(newBusLocation, ret.tag);
        }
    };

    const createNewRelation = async () => {
        props.onClose();
        const ret = await confirmModal({
            title: "Create Stop Area (Preset CN)",
            preset: stopAreaPresetCN,
            createMembers: true
        });
        if (ret?.tag) {
            createStopArea(ret.tag, ret.member);
        }
    };

    return (
        <RightClickMenu {...props}>
            <a onClick={onClick}>New bus stop</a>
            <a onClick={createNewRelation}>New stop area relation</a>
        </RightClickMenu>
    );
});

// Right-click menu for features (stop positions)
const MemoRightClickOnFeature = memo(function (props: RightClickMenuProps & { onClose: () => void }) {
    const location = useMapViewStore(useShallow(getLocationByPixel(props)));
    const createStopPosition = useOSMMapStore(state => state.createStopPositionSel);
    const modifyFeature = useOSMMapStore(state => state.modifyFeatureMetaNC);
    const confirmModal = createConfirmation(CreateFeatureTagConfirm);

    const createPoint = async () => {
        props.onClose();
        const ret = await confirmModal({
            preset: stopPositionPresetCN,
            title: "Create Stop position (Preset CN)"
        });
        if (ret?.tag && location && props.feature?.id) {
            createStopPosition(location, ret.tag, props.feature.id);
        }
    };

    const addTagToPoint = async () => {
        props.onClose();
        if (!props.feature?.id) return;
        const ret = await confirmModal({
            preset: stopPositionPresetCN,
            existing: useOSMMapStore.getState().meta.node[props.feature.id].tag,
            title: "Add tags to existing point (Stop position preset CN)"
        });
        if (ret?.tag) {
            modifyFeature("node", props.feature.id, f => {
                f.tag = ret.tag;
            });
        }
    };

    return (
        <RightClickMenu {...props}>
            {props.feature?.type === "way" ? (
                <a onClick={createPoint}>New stop position</a>
            ) : props.feature?.type === "node" ? (
                <a onClick={addTagToPoint}>Set point as stop position</a>
            ) : (
                <a>relation is not allowed here</a>
            )}
        </RightClickMenu>
    );
});

interface BusEditTabProps {
    width: number;
    height: number;
}

const BusEditTab = ({ width, height }: BusEditTabProps) => {
    // State for managing right-click menus
    const [newBusMenu, setNewBusMenu] = useState<RightClickMenuProps>({ x: 0, y: 0, open: false });
    const [newStopPositionMenu, setStopPositionMenu] = useState<RightClickMenuProps>({ x: 0, y: 0, open: false });

    // Create the state machine with callbacks to control menus
    const stateMachine = useRef(
        new PtEditStateMachine(
            { meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore },
            { busStop: setNewBusMenu, stopPosition: setStopPositionMenu }
        )
    ).current;

    useEffect(() => {
        const keydownListener = (event: KeyboardEvent) => stateMachine.transform(event);
        document.addEventListener("keydown", keydownListener);
        return () => document.removeEventListener("keydown", keydownListener);
    }, [stateMachine]);

    return (
        <div className="relative" style={{ width, height }}>
            <PIXIStage
                width={width}
                height={height}
                options={{ background: "#1099bb" }}
                onMouseDown={(event) => stateMachine.transform(event)}
                onPointerMove={(event) => stateMachine.transform(event)}
                onMouseUp={(event) => stateMachine.transform(event)}
                onWheel={(event) => stateMachine.transform(event)}
            >
                <BackgroundLayer width={width} height={height} />
                <EditableLayer width={width} height={height} stateMachine={stateMachine as BaseStateMachine} />
            </PIXIStage>
            <InfoLayer width={width} />
            <MemoRightClickOnMap {...newBusMenu} onClose={() => setNewBusMenu({ x: 0, y: 0, open: false })} />
            <MemoRightClickOnFeature {...newStopPositionMenu} onClose={() => setStopPositionMenu({ x: 0, y: 0, open: false })} />
        </div>
    );
}

export default BusEditTab;
