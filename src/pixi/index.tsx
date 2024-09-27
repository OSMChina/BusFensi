import { Stage, useApp } from "@pixi/react";
import { useEffect } from "react";
import BackgroundLayer from "./layers/BackgroundLayer";
import EditableLayer from "./layers/EditableLayer";
import { stateMachine } from "../logic/states/stateMachine";
import useBearStoreWithUndo from "../logic/model/store";
import { useShallow } from "zustand/react/shallow";
import { Application } from "pixi.js";

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

function PIXIApp({ width, height }: {
    width: number,
    height: number
}) {
    const stageResizeNoTrack = useBearStoreWithUndo(useShallow(state => state.stageStateNoTrack))
    useEffect(() => {
        stageResizeNoTrack({ width: width, height: height })
    }, [width, height, stageResizeNoTrack])
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