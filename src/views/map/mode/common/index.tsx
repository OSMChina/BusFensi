import { useEffect, useRef } from "react";
import { useMapViewStore } from "../../../../store/mapview";
import { CommonEditStateMachine } from "../../stateMachine/commonEdit";
import { useOSMMapStore } from "../../../../store/osmmeta";
import { useSettingsStore } from "../../../../store/settings";
import { BackgroundLayer } from "../../layer/BackgroundLayer";
import EditableLayer from "../../layer/EditableLayer";
import CommonEditToolbar from "../../components/common/CoomonEditToolbar";
import { ViewFCProps } from "../../../../type/view/props";
import SplitterView from "../../../../components/layout/SplitView";
import OutlineView from "../../../outline";
import PropertyView from "../../../property";
import PIXIStage from "../../layer/Stage";
import InfoLayer from "../../layer/InfoLayer";
import { BaseStateMachine } from "../../stateMachine/state";

function CommonEditStage({ width, height }: {
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
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={(event) => { stateMachineRef.current.transform(event) }}
            onPointerMove={(event) => { stateMachineRef.current.transform(event) }}
            onMouseUp={(event) => { stateMachineRef.current.transform(event) }}
            onWheel={(event) => { stateMachineRef.current.transform(event) }}
        >
            <BackgroundLayer
                width={width}
                height={height}
            />
            <EditableLayer
                width={width}
                height={height}
                stateMachine={stateMachineRef.current as BaseStateMachine}
            />
        </PIXIStage>
        <InfoLayer width={width} />
        <div className="slot-top absolute inset-x-0 top-0 flex flex-row align-middle justify-center" style={{ width }}>
            <CommonEditToolbar stateMachine={stateMachineRef.current} />
        </div>
    </>)
}

function CommonEditApp({ width, height }: ViewFCProps) {
    return <SplitterView width={width} height={height} axis='x' initial={(width / 4) * 3}>
        {(props) => <CommonEditStage  {...props} />}
        {(props) => <SplitterView {...props} axis='y'>
            {(props) => <OutlineView {...props} />}
            {(props) => <PropertyView {...props} />}
        </SplitterView>}
    </SplitterView>

}

export default CommonEditApp;