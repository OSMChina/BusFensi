import { useRef, useEffect, useMemo, useCallback } from "react";
import { useMapViewStore } from "../../../../../store/mapview";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { useSettingsStore } from "../../../../../store/settings";
import PIXIStage from "../../../layer/Stage";
import { BackgroundLayer } from "../../../layer/BackgroundLayer";
import EditableLayer from "../../../layer/EditableLayer";
import InfoLayer from "../../../layer/InfoLayer";
import { BaseStateMachine } from "../../../stateMachine/state";
import { RouteAddStopStateMachine } from "../../../stateMachine/ptEdit/routeAddStop";
import BusRouteMemberListDelDel from "../../../components/routeEdit/BusRouteMemberListDelDel";
import MemberItem from "../../../../../components/osm/memberDrag/MemberItem";
import { Member } from "../../../../../type/osm/meta";
const STEPS_HEIGHT = 72

interface BusEditTabProps {
    width: number;
    height: number;
}

const BusStopPanel = () => {
    const { stops } = useOSMMapStore(state => state.routeEdit)
    const setStops = useOSMMapStore(state => state.setRouteStop)

    const memberItemRender = useCallback(({ member, children }: { member: Member; children: React.ReactNode; overlay?: true; }) => <MemberItem
        id={member["@_ref"]}
        type={member["@_type"]}
    >
        {() => children}
    </MemberItem>, [])


    return <div className="absolute top-0 right-0 card min-h-64 max-h-full overflow-scroll p-2 bg-base-100 w-96">
        <BusRouteMemberListDelDel
            member={stops}
            title="Bus stops members"
            memberToId={(m) => `${m["@_type"]}-${m["@_ref"]}`}
            onDelete={(_, after) => setStops(after)}
            onDragStart={() => { }}
            onDragEnd={(m) => setStops(m)}
        >
            {memberItemRender}
        </BusRouteMemberListDelDel>
    </div>
}

const RouteEditTab = ({ width, height }: BusEditTabProps) => {
    // State for managing right-click menus
    // Create the state machine with callbacks to control menus
    const stateMachineRef = useRef(
        new RouteAddStopStateMachine(
            { meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore },
        )
    );

    useEffect(() => {
        const keydownListener = (event: KeyboardEvent) => stateMachineRef.current.transform(event);
        document.addEventListener("keydown", keydownListener);
        return () => document.removeEventListener("keydown", keydownListener);
    }, [stateMachineRef]);

    const { step } = useOSMMapStore(state => state.routeEdit)
    const setCurrentStep = useOSMMapStore(state => state.setEditStepNC)

    const stepTabs = useMemo(() => [{
        label: "Create or select route",
        stage: <div>create or select</div>
    }, {
        label: "Add bus stops"
    }, {
        label: "Edit route path"
    }, {
        label: "Save changes",
        stage: <div>save</div>
    }], [])

    return (
        <div style={{ width, height }}>
            <div className="relative" style={{ width, height: height - STEPS_HEIGHT }}>
                {stepTabs[step].stage
                    ? stepTabs[step].stage
                    : <><PIXIStage
                        width={width}
                        height={height}
                        options={{ background: "#1099bb" }}
                        onMouseDown={(event) => stateMachineRef.current.transform(event)}
                        onPointerMove={(event) => stateMachineRef.current.transform(event)}
                        onMouseUp={(event) => stateMachineRef.current.transform(event)}
                        onWheel={(event) => stateMachineRef.current.transform(event)}
                    >
                        <BackgroundLayer width={width} height={height} />
                        <EditableLayer width={width} height={height} stateMachine={stateMachineRef.current as BaseStateMachine} />
                    </PIXIStage>
                        <InfoLayer width={width} /></>}
                <BusStopPanel />
            </div>
            <div style={{ width, height: STEPS_HEIGHT }}>
                <div className="absolute bottom-0 left-0 right-0 flex flex-row pt-[8px] bg-base-200">
                    <ul className="steps steps-horizontal mx-auto">
                        {stepTabs.map(({ label }, index) => (
                            <li
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`step cursor-pointer ${index <= step ? 'step-primary' : ''}`}
                            >
                                {label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default RouteEditTab;
