import { useEffect, useRef } from "react";
import { useMapViewStore } from "../../../../store/mapview";
import { CommonEditStateMachine } from "../../stateMachine/commonEdit";
import { useOSMMapStore } from "../../../../store/osmmeta";
import { useSettingsStore } from "../../../../store/settings";
import { BackgroundLayer } from "../../layer/BackgroundLayer";
import { ViewFCProps } from "../../../../type/view/props";
import PIXIStage from "../../layer/Stage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBusSimple } from "@fortawesome/free-solid-svg-icons/faBusSimple";
import { faRoute } from "@fortawesome/free-solid-svg-icons/faRoute";
import { faCodeCommit } from "@fortawesome/free-solid-svg-icons/faCodeCommit";

function PtEditStage({ width, height }: {
    width: number,
    height: number
}) {
    const stateMachineRef = useRef(new CommonEditStateMachine({ meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore }))
    useEffect(() => {
        const keydownListener = (event: KeyboardEvent) => stateMachineRef.current.transform(event)
        document.addEventListener("keydown", keydownListener)
        return () => document.removeEventListener("keydown", keydownListener)
    }, [])
    return (<>
        <PIXIStage
            width={width}
            height={height}
            options={{ background: '#1099bb' }}
            onPointerDown={(event) => { stateMachineRef.current.transform(event) }}
            onPointerMove={(event) => { stateMachineRef.current.transform(event) }}
            onPointerUp={(event) => { stateMachineRef.current.transform(event) }}
            onWheel={(event) => { stateMachineRef.current.transform(event) }}
        >
            <BackgroundLayer
                width={width}
                height={height}
            />
        </PIXIStage>
    </>)
}

function PtEditTabs({ width, height }: { width: number, height: number }) {
    return <div className="bg-base-100 border-r-2 border-r-base-300 flex flex-col"
        style={{ width, height, maxWidth: width, maxHeight: height }}
    >
        <div className="tooltip tooltip-right mx-auto mt-1" data-tip="Bus stop edit tab">
            <button className="btn btn-ghost btn-square btn-sm"><FontAwesomeIcon icon={faBusSimple} /></button>
        </div>
        <div className="tooltip tooltip-right mx-auto mt-1" data-tip="Route edit tab">
            <button className="btn btn-ghost btn-square btn-sm"><FontAwesomeIcon icon={faRoute} /></button>
        </div>
        <div className="tooltip tooltip-right mx-auto mt-1" data-tip="Edit bus relation tab">
            <button className="btn btn-ghost btn-square btn-sm"><FontAwesomeIcon icon={faCodeCommit} /></button>
        </div>
    </div>
}

function PTEditApp({ width, height }: ViewFCProps) {
    const TABS_WIDTH = 42;

    return <div
        className="flex flex-row"
        style={{ height, width, maxHeight: height, maxWidth: width }}>
        <PtEditTabs width={TABS_WIDTH} height={height} />
        <PtEditStage width={width - TABS_WIDTH} height={height} />
    </div>

}

export default PTEditApp;