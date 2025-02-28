import { ReactNode, useCallback, useEffect, useState } from "react";
import { useMapViewStore } from "../../../../store/mapview";
import { useOSMMapStore } from "../../../../store/osmmeta";
import { useSettingsStore } from "../../../../store/settings";
import { BackgroundLayer } from "../../layer/BackgroundLayer";
import { ViewFCProps } from "../../../../type/view/props";
import PIXIStage from "../../layer/Stage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBusSimple } from "@fortawesome/free-solid-svg-icons/faBusSimple";
import { faRoute } from "@fortawesome/free-solid-svg-icons/faRoute";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons/faCodeCommit";
import { RightClickMenu } from "../../components/RightCLickMenu";
import { PtEditStateMachine } from "../../stateMachine/ptEdit";
import { cn } from "../../../../utils/helper/object";
import { RightClickMenuProps } from "../../../../type/view/map";
import EditableLayer from "../../layer/EditableLayer";
import { BaseStateMachine } from "../../stateMachine/state";
import InfoLayer from "../../layer/InfoLayer";
import CreateFeatureTags from "../../../../components/osm/CreateFeatureTags";
import { busStopPresetCN, stopPositionPresetCN } from "../../../../utils/osm/presets/bus";
import { Tag } from "../../../../type/osm/meta";

function RightClickNewBusStop(props: RightClickMenuProps & { onClose: () => void }) {
    const [open, setOpen] = useState(false);
    const onSubmit = useCallback((tags: Tag[]) => {
        console.debug("created bus stop", tags)
    }, [])
    return <>
        <RightClickMenu {...props} >
            <a onClick={() => {
                props.onClose()
                setOpen(true)
            }}>New bus stop</a>
        </RightClickMenu>
        <CreateFeatureTags title="Create Bus stop (Preset CN)" open={open} onClose={() => setOpen(false)} preset={busStopPresetCN} onSubmit={onSubmit} />
    </>
}

function RightClickNewStopPosition(props: RightClickMenuProps & { onClose: () => void }) {
    const [open, setOpen] = useState(false);
    const onSubmit = useCallback((tags: Tag[]) => {
        console.debug("created stop position on Way", props.feature, tags)
    }, [props.feature])

    return <>
        <RightClickMenu {...props} >
            <a onClick={() => {
                props.onClose()
                setOpen(true)
            }}>New stop position</a>
        </RightClickMenu>
        <CreateFeatureTags title="Create Stop position (Preset CN)" open={open} onClose={() => setOpen(false)} preset={stopPositionPresetCN} onSubmit={onSubmit} />

    </>
}

function PtEditStage({ width, height, stateMachine }: {
    width: number,
    height: number,
    stateMachine: PtEditStateMachine
}) {
    useEffect(() => {
        const keydownListener = (event: KeyboardEvent) => stateMachine.transform(event)
        document.addEventListener("keydown", keydownListener)
        return () => document.removeEventListener("keydown", keydownListener)
    }, [stateMachine])
    return (<>
        <PIXIStage
            width={width}
            height={height}
            options={{ background: '#1099bb' }}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={(event) => { stateMachine.transform(event) }}
            onPointerMove={(event) => { stateMachine.transform(event) }}
            onMouseUp={(event) => { stateMachine.transform(event) }}
            onWheel={(event) => { stateMachine.transform(event) }}
        >
            <BackgroundLayer
                width={width}
                height={height}
            />
            <EditableLayer
                width={width}
                height={height}
                stateMachine={stateMachine as BaseStateMachine}
            />
        </PIXIStage>
        <InfoLayer width={width} />
    </>)
}

function PtEditTabs({ width, height, children }: { width: number, height: number, children: ReactNode }) {
    return <div className="bg-base-100 border-r-2 border-r-base-300 flex flex-col"
        style={{ width, height, maxWidth: width, maxHeight: height }}
    >
        {children}
    </div>
}

function PTEditApp({ width, height }: ViewFCProps) {
    const TABS_WIDTH = 42;
    const [newBusMenu, setNewBusMenu] = useState<RightClickMenuProps>({ x: 0, y: 0, open: false })
    const [newStopPositionMenu, setStopPositionMenu] = useState<RightClickMenuProps>({ x: 0, y: 0, open: false })

    const [stateMachine] = useState(new PtEditStateMachine(
        { meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore },
        { busStop: setNewBusMenu, stopPosition: setStopPositionMenu }))

    const tabs = [{
        tooltip: "Bus stop edit tab",
        icon: <FontAwesomeIcon icon={faBusSimple} />,
        stage: () => <PtEditStage
            width={width - TABS_WIDTH} height={height}
            stateMachine={stateMachine} />
    }, {
        tooltip: "Route edit tab",
        icon: <FontAwesomeIcon icon={faRoute} />,
        stage: () => <div className="p-2">Route Edit Placeholder</div>
    }, {
        tooltip: "Edit bus relation",
        icon: <FontAwesomeIcon icon={faCodeCommit} />,
        stage: () => <div className="p-2">Bus Relation Edit Placeholder</div>
    }]

    const [active, setActive] = useState(0);

    return <div
        className="flex flex-row"
        style={{ height, width, maxHeight: height, maxWidth: width }}>
        <PtEditTabs width={TABS_WIDTH} height={height} >
            {tabs.map((tab, index) => <div className="tooltip tooltip-right mx-auto mt-1" data-tip={tab.tooltip}>
                <button onClick={() => setActive(index)} className={cn("btn btn-ghost btn-square btn-sm", index === active)}>{tab.icon}</button>
            </div>)}
        </PtEditTabs>
        <div className="relative" style={{ height, width: width - TABS_WIDTH }}>
            {tabs[active].stage()}
            <RightClickNewBusStop {...newBusMenu} onClose={() => setNewBusMenu({ x: 0, y: 0, open: false })} />
            <RightClickNewStopPosition {...newStopPositionMenu} onClose={() => setStopPositionMenu({ x: 0, y: 0, open: false })} />
        </div>
    </div>
}

export default PTEditApp;