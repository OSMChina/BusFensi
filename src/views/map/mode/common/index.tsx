import { Stage, useApp } from "@pixi/react";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { Application } from "pixi.js";
import { useMapViewStore } from "../../../../store/mapview";
import { CommonEditStateMachine } from "../../stateMachine/commonEdit";
import { useOSMMapStore } from "../../../../store/osmmeta";
import { useSettingsStore } from "../../../../store/settings";
import { BackgroundLayer } from "../../layer/BackgroundLayer";
import EditableLayer from "../../layer/EditableLayer";
import CommonEditToolbar from "../../components/CoomonEditToolbar";

declare global {
    // eslint-disable-next-line no-var
    var __PIXI_APP__: Application | undefined;
}

function PIXIAppSet() {
    const app = useApp();
    useEffect(() => {
        globalThis.__PIXI_APP__ = app;
        app.stage.hitArea = app.screen;
        return () => {
            globalThis.__PIXI_APP__ = undefined;
        };
    }, [app]);

    return null;
}

function CommonEditApp({ width, height }: {
    width: number,
    height: number
}) {
    const stageResizeNoTrack = useMapViewStore(useShallow(state => state.setStage))
    const stateMachineRef = useRef(new CommonEditStateMachine({ meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore }))
    useEffect(() => {
        stageResizeNoTrack(width, height)
    }, [width, height, stageResizeNoTrack])
    useEffect(() => {
        const keydownListener = (event: KeyboardEvent) => stateMachineRef.current.transform(event)
        document.addEventListener("keydown", keydownListener)
        return () => document.removeEventListener("keydown", keydownListener)
    }, [])
    return (<>
        <Stage
            width={width}
            height={height}
            options={{ background: '#1099bb' }}
            onPointerDown={(event) => { stateMachineRef.current.transform(event) }}
            onPointerMove={(event) => { stateMachineRef.current.debouncedTransform(event) }}
            onPointerUp={(event) => { stateMachineRef.current.transform(event) }}
            onWheel={(event) => { stateMachineRef.current.transform(event) }}
        >
            <BackgroundLayer
                width={width}
                height={height}
            />
            <EditableLayer
                width={width}
                height={height}
                stateMachine={stateMachineRef.current}
            />
            <PIXIAppSet />
        </Stage>
        <div className="slot-top absolute inset-x-0 top-0 flex flex-row align-middle justify-center" style={{ width }}>
            <CommonEditToolbar stateMachine={stateMachineRef.current} />
        </div>
        <div className="slot-bottom absolute inset-x-0 bottom-0 flex flex-row align-middle justify-center" style={{ width }}>
            <span className="text-base-content bg-base-300 px-2 rounded">data©openstreetmap contributor</span>
        </div>
    </>)
}

export default CommonEditApp;