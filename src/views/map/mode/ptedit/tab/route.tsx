import { useRef, useEffect, useMemo, useCallback, useState } from "react";
import { useMapViewStore } from "../../../../../store/mapview";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { useSettingsStore } from "../../../../../store/settings";
import PIXIStage from "../../../layer/Stage";
import { BackgroundLayer } from "../../../layer/BackgroundLayer";
import EditableLayer from "../../../layer/EditableLayer";
import InfoLayer from "../../../layer/InfoLayer";
import { BaseStateMachine } from "../../../stateMachine/state";
import { RouteAddStopStateMachine } from "../../../stateMachine/ptEdit/routeAddStop";
import MemberItem from "../../../../../components/osm/memberDrag/MemberItem";
import { Member } from "../../../../../type/osm/meta";
import { cn, deepCopy } from "../../../../../utils/helper/object";
import { FeatureState, FeatureTypes, NumericString } from "../../../../../type/osm/refobj";
import { isRoute } from "../../../../../utils/osm/relationType";
import { getName } from "../../../../../utils/osm/nodeType";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faExclamationTriangle, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ItemBaseDisplay } from "../../../../../components/osm/outline/itemBase";
import { createConfirmation } from "react-confirm";
import { routePresetCN } from "../../../../../utils/osm/presets/bus";
import CreateFeatureTagConfirm from "../../../../../components/modal/CreateFeatureTagConfirmHook";
import MemberListSelectDelDown from "../../../../property/components/MemberListSelWithDelDown";
import RoleInput from "../../../../../components/osm/member/RoleInput";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { WritableDraft } from "immer";

const STEPS_HEIGHT = 72

interface BusEditTabProps {
  width: number;
  height: number;
}

const CreateOrSelectRoute = () => {
  const createEditRoute = useOSMMapStore((state) => state.createEditRoute);
  const setEditRoute = useOSMMapStore((state) => state.setEditRoute);
  const cancelEditRoute = useOSMMapStore(state => state.cancelEditRoute);
  const route = useOSMMapStore((state) => state.routeEdit.editing)
  const relations = useOSMMapStore((state) => state.meta.relation) || {};
  const confirmModal = createConfirmation(CreateFeatureTagConfirm);

  const handleCreateRoute = async () => {
    const ret = await confirmModal({ title: "Create Bus stop (Preset CN)", preset: routePresetCN });
    if (ret?.tag) {
      console.debug("created route", ret);
      createEditRoute([{ "@_k": "type", "@_v": "bus_route" }], []);
    }
  };

  const handleSelectRoute = (id: NumericString) => {
    setEditRoute(id);
  };


  if (route) {
    const relation = relations[route];
    const routeName = getName(relation.tag) || "[no name]";

    return <div className="bg-base-100 max-w-xl h-full mx-auto py-4">
      Selected Route:
      <div className="flex flex-row gap-2 text-base items-center">
        <ItemBaseDisplay
          featuretype="relation"
          fullname={routeName}
          id={relation["@_id"]}
          created={Number(relation["@_id"]) < 0}
          modified={relation["@_action"] === "modify"}
          deleted={relation["@_action"] === "delete"}
        >
          <button
            onClick={cancelEditRoute}
            className="btn btn-error btn-square btn-sm"
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>

        </ItemBaseDisplay>
      </div>
      Please jump to step 2
    </div>
  }

  return <div className="bg-base-100 max-w-xl h-full mx-auto">
    <div className="card-body">
      <h2 className="card-title text-lg mb-4">Create or Select Route</h2>
      <button
        className="btn btn-primary w-full mb-6"
        onClick={handleCreateRoute}
      >
        Create New Route
        <FontAwesomeIcon icon={faPlus} className="h-5 w-5 ml-2" />
      </button>

      <div className="divider mb-4">OR</div>

      <div className="space-y-4">
        <h3 className="font-medium text-base">Existing Routes</h3>
        {Object.keys(relations).length === 0 ? (
          <div className="alert alert-info">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="stroke-current shrink-0 h-6 w-6"
            />
            <span>No routes available</span>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {Object.values(relations).filter(r => isRoute(r.tag)).map(relation => {
              const routeName = getName(relation.tag) || "[no name]";
              return (<div key={relation["@_id"]} className="flex items-center px-4 py-2 gap-2 text-sm bg-white rounded hover:bg-base-300">
                <ItemBaseDisplay
                  featuretype="relation"
                  fullname={routeName}
                  id={relation["@_id"]}
                  created={Number(relation["@_id"]) < 0}
                  modified={relation["@_action"] === "modify"}
                  deleted={relation["@_action"] === "delete"}
                >
                  <button
                    onClick={() => handleSelectRoute(relation["@_id"])}
                    className="btn btn-primary btn-square btn-sm"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </ItemBaseDisplay>
              </div>);
            })}
          </div>
        )}
      </div>
    </div>
  </div>
};

const BusStopUpdateActive = () => {
  const { stops } = useOSMMapStore(state => state.routeEdit);
  const modifyFeatureStateBatchNC = useOSMMapStore(state => state.modifyFeatureStateBatchNC);

  useEffect(() => {
    // Create a batch of modifications to set highlighted to true
    const highlightModifications = stops.map(stop => ({
      type: stop["@_type"] as FeatureTypes,
      id: stop["@_ref"],
      modify: (feature: WritableDraft<Omit<FeatureState, 'selected' | 'active'>>) => {
        feature.highlighted = true;
      },
    }));

    // Apply the batch modifications
    modifyFeatureStateBatchNC(highlightModifications);

    // Cleanup function to reset the highlighted state
    return () => {
      const resetModifications = stops.map(stop => ({
        type: stop["@_type"] as FeatureTypes,
        id: stop["@_ref"],
        modify: (feature: WritableDraft<Omit<FeatureState, 'selected' | 'active'>>) => {
          feature.highlighted = false;
        },
      }));

      // Apply the batch modifications to reset
      modifyFeatureStateBatchNC(resetModifications);
    };
  }, [modifyFeatureStateBatchNC, stops]);

  return null;
};

const BusStopPanel = () => {

  const [showMembers, setShowMembers] = useState(true);  // Toggle state

  const { stops } = useOSMMapStore(state => state.routeEdit)
  const setStops = useOSMMapStore(state => state.setRouteStop)
  const handelEditMember = useCallback((type: "node" | "way" | "relation", ref: string, text: string) => {
    console.debug('edit', type, ref, text)
    setStops(stops.map(m => {
      if (m["@_type"] === type && m["@_ref"] === ref) {
        const mem = deepCopy(m)
        mem["@_role"] = text
        return mem
      }
      return m
    }))
  }, [setStops, stops])

  const memberItemRender = useCallback(({ member, children }: { member: Member; children: React.ReactNode; overlay?: true; }) => <MemberItem
    id={member["@_ref"]}
    type={member["@_type"]}
  >
    {() => {
      return <>
        <label className="input input-xs input-bordered ml-1 flex items-center gap-1">
          Role:
          <RoleInput
            initialValue={member["@_role"]}
            onCommit={(value) => handelEditMember(member["@_type"], member["@_ref"], value)}
          />
        </label>
        {children}
      </>
    }}
  </MemberItem>, [handelEditMember])


  return <div className="absolute top-0 right-0 card min-h-16 max-h-full overflow-auto p-2 bg-base-100 min-w-96">
    <div className="flex justify-between items-center">
      <h3>Bus stops members (click to show/hide)</h3>
      <button
        onClick={() => setShowMembers(!showMembers)}
        className="btn btn-sm btn-ghost btn-circle"
        aria-label={showMembers ? "Collapse" : "Expand"}
      >
        <FontAwesomeIcon
          icon={showMembers ? faChevronUp : faChevronDown}
          className="w-4 h-4"
        />
      </button>
    </div>
    {showMembers && (
      <MemberListSelectDelDown
        member={stops}
        memberToId={(m) => `${m["@_type"]}-${m["@_ref"]}`}
        onDelete={(_, after) => setStops(after)}
        onDragStart={() => { }}
        onDragEnd={(m) => setStops(m)}
      >
        {memberItemRender}
      </MemberListSelectDelDown>
    )}
    <BusStopUpdateActive />
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

  const { step, editing } = useOSMMapStore(state => state.routeEdit)
  const setCurrentStep = useOSMMapStore(state => state.setEditStepNC)

  const stepTabs = useMemo(() => [{
    label: "Create or select route",
    stage: <CreateOrSelectRoute />
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
        {step === 1 && <BusStopPanel />}
      </div>
      <div style={{ width, height: STEPS_HEIGHT }}>
        <div className="absolute bottom-0 left-0 right-0 flex flex-row pt-[8px] bg-base-200">
          <ul className="steps steps-horizontal mx-auto">
            {stepTabs.map(({ label }, index) => (
              <li
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn("step cursor-pointer", index <= step ? 'step-primary' : '', !editing && "disabled")}
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
