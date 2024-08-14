import { Stage, useApp } from "@pixi/react";
import { useEffect } from "react";
import BackgroundLayer from "./layers/BackgroundLayer";
import EditableLayer from "./layers/EditableLayer";
import { stateMachine } from "../logic/states/stateMachine";
import useBearStoreWithUndo from "../logic/model/store";
import { useShallow } from "zustand/react/shallow";

function PIXIAppSet() {
    const app = useApp()
    useEffect(() => {
        globalThis.__PIXI_APP__ = app;
        app.stage.hitArea = app.screen;
        return () => {
            globalThis.__PIXI_APP__ = undefined;
        }
    }, [app])

    return <></>
}

function PIXIApp() {
    const { stage, stageResizeNoTrack } = useBearStoreWithUndo(useShallow((state) => { return { stage: state.stage, stageResizeNoTrack: state.stageResizeNoTrack } }))
    const { width, height } = stage
    useEffect(() => {
        function handelReize() {
            stageResizeNoTrack({ width: window.innerWidth, height: window.innerHeight });
        }
        window.addEventListener('resize', handelReize)
        if (window.innerHeight !== height || window.innerWidth !== width) {
            stageResizeNoTrack({ width: window.innerWidth, height: window.innerHeight })
        }
        return () => {
            window.removeEventListener('resize', handelReize)
        }
    }, [stageResizeNoTrack, height, width])
    return (
        <Stage
            width={width}
            height={height}
            options={{
                background: '#1099bb'
            }}
            onPointerDown={(event) => {
                stateMachine.hookPIXIScene(event)
            }}
            onPointerMove={(event) => {
                stateMachine.hookPIXIScene(event)
            }}
            onPointerUp={(event) => {
                stateMachine.hookPIXIScene(event)
            }}
            onWheel={(event) => {
                stateMachine.hookPIXIScene(event)
            }}
        >
            <BackgroundLayer
                width={width}
                height={height}
            />
            <EditableLayer
                width={width}
                height={height}
            />
            <PIXIAppSet />
        </Stage>
    )
}

export default PIXIApp;