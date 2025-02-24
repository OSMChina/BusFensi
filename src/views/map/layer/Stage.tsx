import { Stage, useApp } from "@pixi/react";
import { ReactNode, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { Application } from "pixi.js";
import { useMapViewStore } from "../../../store/mapview";

declare global {
    // eslint-disable-next-line no-var
    var __PIXI_APP__: Application | undefined;
}

function PIXIAppSet() {
    const app = useApp();
    const setStage = useMapViewStore(state => state.setStageApp)
    useEffect(() => {
        globalThis.__PIXI_APP__ = app;
        app.stage.hitArea = app.screen;
        setStage(app)
        return () => {
            globalThis.__PIXI_APP__ = undefined;
            setStage(undefined)
        };
    }, [app, setStage]);

    return null;
}

type PIXIStageProps = React.ComponentProps<typeof Stage> & {
    width: number,
    height: number,
    children: ReactNode,
}

function PIXIStage({ width, height, children, ...props }: PIXIStageProps) {
    const stageResizeNoTrack = useMapViewStore(useShallow(state => state.setStage))
    useEffect(() => {
        stageResizeNoTrack(width, height)
    }, [width, height, stageResizeNoTrack])
    return (<Stage
        width={width}
        height={height}
        options={{ background: '#1099bb' }}
        {...props}
    >
        {children}
        <PIXIAppSet />
    </Stage>)
}


export default PIXIStage;