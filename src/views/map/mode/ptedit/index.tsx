import { memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { busStopPresetCN, stopAreaPresetCN, stopPositionPresetCN } from "../../../../utils/osm/presets/bus";
import { getLocationByPixel } from "../../../../store/mapview/seletor";
import { useShallow } from "zustand/shallow";
import SplitterView from "../../../../components/layout/SplitView";
import PropertyView from "../../../property";
import { BusStopEditOutlineTab } from "../../components/collection/busStop";
import { createConfirmation } from "react-confirm";
import CreateFeatureTagConfirm from "../../../../components/modal/CreateFeatureTagConfirmHook";
import SelectedOutlineTab from "../../components/collection/selected";

const MemoRightClickOnMap = memo(function (props: RightClickMenuProps & { onClose: () => void }) {
    const newBusLocation = useMapViewStore(useShallow(getLocationByPixel(props)))
    const createBusStop = useOSMMapStore(state => state.createBusStopSel)
    const createStopArea = useOSMMapStore(state => state.createStopAreaSel)
    const confirmModal = createConfirmation(CreateFeatureTagConfirm)

    const onClick = useCallback(async () => {
        props.onClose()
        const ret = await confirmModal({ title: "Create Bus stop (Preset CN)", preset: busStopPresetCN })
        if (ret?.tag) {
            console.debug("created bus stop", ret)
            if (newBusLocation) createBusStop(newBusLocation, ret.tag)
        }
    }, [props, confirmModal, newBusLocation, createBusStop])

    const createNewRelation = useCallback(async () => {
        props.onClose()
        const ret = await confirmModal({ title: "Create Stop Area (Preset CN)", preset: stopAreaPresetCN, createMembers: true })
        if (ret?.tag) {
            createStopArea(ret.tag, ret.member);
        }
    }, [confirmModal, createStopArea, props])
    return <>
        <RightClickMenu {...props} >
            <a onClick={onClick}>New bus stop</a>
            <a onClick={createNewRelation}>New stop area relation</a>
        </RightClickMenu>
    </>
})

const MemoRightClickOnFeature = memo(function (props: RightClickMenuProps & { onClose: () => void }) {
    const location = useMapViewStore(useShallow(getLocationByPixel(props)))
    const createStopPosition = useOSMMapStore(state => state.createStopPositionSel)
    const modifyFeature = useOSMMapStore(state => state.modifyFeatureMetaNC)

    const confirmModal = createConfirmation(CreateFeatureTagConfirm)
    const createPoint = useCallback(async () => {
        props.onClose()
        console.debug("clicked new stop position")
        const ret = await confirmModal({ preset: stopPositionPresetCN, title: "Create Stop position (Preset CN)" })
        if (ret?.tag) {
            console.debug("created stop position", ret)
            if (location && props.feature?.id) createStopPosition(location, ret.tag, props.feature?.id)
        }
    }, [props, confirmModal, location, createStopPosition])

    const addTagToPoint = useCallback(async () => {
        props.onClose()
        console.debug("clicked new stop position")
        if (!props.feature?.id) {
            return
        }
        const ret = await confirmModal({
            preset: stopPositionPresetCN,
            existing: useOSMMapStore.getState().meta.node[props.feature.id].tag,
            title: "Add tags to existing point (Stop position preset CN)"
        })
        if (ret?.tag) {
            console.debug("created stop position", ret)
            modifyFeature("node", props.feature.id, f => {
                f.tag = ret.tag
            })
        }
    }, [props, confirmModal, modifyFeature])

    return <>
        <RightClickMenu {...props} >
            {(props.feature?.type === "way") ?
                <a onClick={createPoint}>New stop position</a>
                : ((props.feature?.type === "node") ? <a onClick={addTagToPoint}>Set point as stop position</a> : <a>relation is not allowed here</a>)}
        </RightClickMenu>
    </>
})

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

function PtEditView({ width, height }: ViewFCProps) {
    const TABS_WIDTH = 42;
    const [newBusMenu, setNewBusMenu] = useState<RightClickMenuProps>({ x: 0, y: 0, open: false })
    const [newStopPositionMenu, setStopPositionMenu] = useState<RightClickMenuProps>({ x: 0, y: 0, open: false })

    const stateMachine = useRef(new PtEditStateMachine(
        { meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore },
        { busStop: setNewBusMenu, stopPosition: setStopPositionMenu })).current

    const tabs = useMemo(() => [{
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
    }], [width, height, stateMachine])

    const [active, setActive] = useState(0);

    return <div
        className="flex flex-row"
        style={{ height, width, maxHeight: height, maxWidth: width }}
        onContextMenu={(e) => e.preventDefault()}>
        <PtEditTabs width={TABS_WIDTH} height={height} >
            {tabs.map((tab, index) => <div className="tooltip tooltip-right mx-auto mt-1" data-tip={tab.tooltip}>
                <button onClick={() => setActive(index)} className={cn("btn btn-ghost btn-square btn-sm", index === active && "btn-active")}>{tab.icon}</button>
            </div>)}
        </PtEditTabs>
        <div className="relative" style={{ height, width: width - TABS_WIDTH }}>
            {tabs[active].stage()}
            <MemoRightClickOnMap {...newBusMenu} onClose={() => setNewBusMenu({ x: 0, y: 0, open: false })} />
            <MemoRightClickOnFeature {...newStopPositionMenu} onClose={() => setStopPositionMenu({ x: 0, y: 0, open: false })} />
        </div>
    </div>
}

function OutlineView({ width, height }: ViewFCProps) {
    const tabs = [{
        title: "Bus stop",
        tab: () => <BusStopEditOutlineTab />
    }, {
        title: "Selected",
        tab: () => <SelectedOutlineTab />
    },]

    const [active, setActive] = useState(0);

    return <div style={{ width, height }} className="flex flex-col">
        <div role="tablist" className="tabs tabs-lifted tabs-xs">
            {tabs.map((tab, index) => (<a key={index} onClick={() => setActive(index)} role="tab" className={cn("tab", index === active && "tab-active")}>{tab.title}</a>))}
        </div>
        <div className="outline-view flex flex-col bg-base-100 w-full px-1 flex-1 overflow-auto">
            {tabs[active].tab()}
        </div>
    </div>
}

function PtEditApp({ width, height }: ViewFCProps) {
    return <SplitterView width={width} height={height} axis='x' initial={(width / 4) * 3} >
        {(props) => <PtEditView {...props} />}
        {(props) => <SplitterView {...props} axis='y'>
            {(props) => <OutlineView {...props} />}
            {(props) => <PropertyView {...props} />}
        </SplitterView>}
    </SplitterView>
}

export default PtEditApp;