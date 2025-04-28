import { useRef, useEffect, useMemo, useCallback, useState, memo } from "react";
import { getLocationByPixel, useMapViewStore } from "../../../../../store/mapview";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { useSettingsStore } from "../../../../../store/settings";
import PIXIStage from "../../../layer/Stage";
import { BackgroundLayer } from "../../../layer/BackgroundLayer";
import EditableLayer from "../../../layer/EditableLayer";
import InfoLayer from "../../../layer/InfoLayer";
import { BaseStateMachine } from "../../../stateMachine/state";
import { RouteAddStopStateMachine } from "../../../stateMachine/ptEdit/routeAddStop";
import MemberItem from "../../../../../components/osm/memberDrag/MemberItem";
import { Member, Tag } from "../../../../../type/osm/meta";
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
import DisplayWayConnectivity from "../../../../property/components/DisplayWayConnectivity";
import { RouteAddPathStateMachine } from "../../../stateMachine/ptEdit/routeAddPath";
import Tags from "../../../../property/components/Tags";
import { RightClickMenuProps } from "../../../../../type/view/map";
import { RightClickMenu } from "../../../components/RightCLickMenu";
import { useShallow } from "zustand/shallow";
import { RouteEditWayStateMachine } from "../../../stateMachine/ptEdit/routeEditWay";
import { UndoRedoStateMachine } from "../../../stateMachine/slice/util/UndoRedoStateMachine";
import { DrawModeStateMacine } from "../../../stateMachine/ptEdit/drawMode";

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
      createEditRoute(ret.tag, ret.member);
    }
  };

  const handleSelectRoute = (id: NumericString) => {
    setEditRoute(id);
  };

  useEffect(() => {
    const stateMachine = new UndoRedoStateMachine({ meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore })
    const keydownListener = (event: KeyboardEvent) => stateMachine.transform(event);
    document.addEventListener("keydown", keydownListener);
    return () => document.removeEventListener("keydown", keydownListener);
  }, []);

  if (route && relations[route]) {
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
    <div className="card-body h-full overflow-y-auto">
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
          <div className="space-y-4">
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
    const meta = useOSMMapStore.getState().meta;
    const validStop = stops.filter(p => meta[p["@_type"]][p["@_ref"]]);

    // Create a batch of modifications to set highlighted to true
    const highlightModifications = validStop.map(stop => ({
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
      const resetModifications = validStop.map(stop => ({
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

const RoutePathupdateActive = () => {
  const { path } = useOSMMapStore(state => state.routeEdit);
  const modifyFeatureStateBatchNC = useOSMMapStore(state => state.modifyFeatureStateBatchNC);

  useEffect(() => {
    // Create a batch of modifications to set highlighted to true
    const meta = useOSMMapStore.getState().meta;
    const validPath = path.filter(p => meta[p["@_type"]][p["@_ref"]]);
    const highlightModifications = validPath.map(p => ({
      type: p["@_type"] as FeatureTypes,
      id: p["@_ref"],
      modify: (feature: WritableDraft<Omit<FeatureState, 'selected' | 'active'>>) => {
        feature.highlighted = true;
      },
    }));

    // Apply the batch modifications
    modifyFeatureStateBatchNC(highlightModifications);

    // Cleanup function to reset the highlighted state
    return () => {
      const resetModifications = validPath.map(p => ({
        type: p["@_type"] as FeatureTypes,
        id: p["@_ref"],
        modify: (feature: WritableDraft<Omit<FeatureState, 'selected' | 'active'>>) => {
          feature.highlighted = false;
        },
      }));

      // Apply the batch modifications to reset
      modifyFeatureStateBatchNC(resetModifications);
    };
  }, [modifyFeatureStateBatchNC, path]);

  return null;
};


const RoutePathEditPanel = () => {

  const [showMembers, setShowMembers] = useState(true);  // Toggle state

  const { path } = useOSMMapStore(state => state.routeEdit)
  const setRoutePath = useOSMMapStore(state => state.setRoutePath)
  const handelEditMember = useCallback((type: "node" | "way" | "relation", ref: string, text: string) => {
    console.debug('edit', type, ref, text)
    setRoutePath(path.map(m => {
      if (m["@_type"] === type && m["@_ref"] === ref) {
        const mem = deepCopy(m)
        mem["@_role"] = text
        return mem
      }
      return m
    }))
  }, [setRoutePath, path])

  const memberItemRender = useCallback(({ member, children, index, overlay }: { member: Member; children: React.ReactNode; overlay?: true; index: number; }) => <MemberItem
    id={member["@_ref"]}
    type={member["@_type"]}
  >
    {() => {
      return <>
        <div className="w-3">
          {!overlay && <DisplayWayConnectivity member={path} index={index} />}
        </div>
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
  </MemberItem>, [handelEditMember, path])


  return <div className="absolute top-0 right-0 card min-h-16 max-h-full overflow-auto p-2 bg-base-100 min-w-96">
    <div className="flex justify-between items-center">
      <h3>Path members (click to show/hide)</h3>
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
        member={path}
        memberToId={(m) => `${m["@_type"]}-${m["@_ref"]}`}
        onDelete={(_, after) => setRoutePath(after)}
        onDragStart={() => { }}
        onDragEnd={(m) => setRoutePath(m)}
      >
        {memberItemRender}
      </MemberListSelectDelDown>
    )}
    <RoutePathupdateActive />
  </div>
}

const AddBusStopsStage = ({ width, height }: BusEditTabProps) => {
  const stateMachineRef = useRef<BaseStateMachine>(
    new RouteAddStopStateMachine({
      meta: useOSMMapStore,
      view: useMapViewStore,
      settings: useSettingsStore,
    })
  );

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => stateMachineRef.current.transform(event);
    document.addEventListener("keydown", keydownListener);
    return () => document.removeEventListener("keydown", keydownListener);
  }, []);

  return (
    <>
      <PIXIStage
        width={width}
        height={height}
        options={{ background: "#1099bb" }}
        onMouseDown={(event) => stateMachineRef.current.transform(event)}
        onPointerMove={(event) => stateMachineRef.current.transform(event)}
        onMouseUp={(event) => stateMachineRef.current.transform(event)}
        onWheel={(event) => stateMachineRef.current.transform(event)}
      >
        <BackgroundLayer width={width} height={height} />
        <EditableLayer width={width} height={height} stateMachine={stateMachineRef.current} />
      </PIXIStage>
      <InfoLayer width={width} />
      <BusStopPanel />
    </>
  );
};

const MemoRightClickOnFeature = memo(function (props: RightClickMenuProps & { onClose: () => void }) {
  const location = useMapViewStore(useShallow(getLocationByPixel(props)));

  const splitWay = useOSMMapStore(state => state.splitWay);
  const createNodeOnWay = useOSMMapStore(state => state.createNodeOnWay)

  const splitWayHandler = () => {
    if (props.feature?.id) {
      splitWay(props.feature.id)
    }
    props.onClose()
  }

  const createPoint = () => {
    if (props.feature?.id && location) {
      createNodeOnWay(location, [], props.feature.id)
    }
    props.onClose()
  }

  return <RightClickMenu {...props}>
    {props.feature?.type === "way" ? (
      <a onClick={createPoint}>New point on way</a>
    ) : props.feature?.type === "node" ? (
      <a onClick={splitWayHandler}>Split way by point</a>
    ) : (
      <a>relation is not allowed here</a>
    )}
  </RightClickMenu>
})

// Add Path Tab Component
const AddPathTab = ({ width, height }: BusEditTabProps) => {
  const stateMachineRef = useRef<BaseStateMachine>(
    new RouteAddPathStateMachine({
      meta: useOSMMapStore,
      view: useMapViewStore,
      settings: useSettingsStore,
    })
  );

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => stateMachineRef.current.transform(event);
    document.addEventListener("keydown", keydownListener);
    return () => document.removeEventListener("keydown", keydownListener);
  }, []);

  return (
    <div className="relative" style={{ width, height }}>
      <PIXIStage
        width={width}
        height={height}
        options={{ background: "#1099bb" }}
        onMouseDown={(e) => stateMachineRef.current.transform(e)}
        onPointerMove={(e) => stateMachineRef.current.transform(e)}
        onMouseUp={(e) => stateMachineRef.current.transform(e)}
        onWheel={(e) => stateMachineRef.current.transform(e)}
      >
        <BackgroundLayer width={width} height={height} />
        <EditableLayer width={width} height={height} stateMachine={stateMachineRef.current} />
      </PIXIStage>
      <InfoLayer width={width} />
      <RoutePathEditPanel />
    </div>
  );
};

// Edit Way Tab Component
const EditWayTab = ({ width, height }: BusEditTabProps) => {
  const [rightClickMenu, setRightClickMenu] = useState<RightClickMenuProps>({ x: 0, y: 0, open: false });

  const stateMachine = useRef(
    new RouteEditWayStateMachine(
      { meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore },
      { wayEditMenu: setRightClickMenu }
    )
  ).current;

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => stateMachine.transform(event);
    document.addEventListener("keydown", keydownListener);
    return () => document.removeEventListener("keydown", keydownListener);
  }, [stateMachine]);

  return (
    <div className="relative" style={{ width, height }}>
      <PIXIStage
        width={width}
        height={height}
        options={{ background: "#1099bb" }}
        onMouseDown={(e) => stateMachine.transform(e)}
        onPointerMove={(e) => stateMachine.transform(e)}
        onMouseUp={(e) => stateMachine.transform(e)}
        onWheel={(e) => stateMachine.transform(e)}
      >
        <BackgroundLayer width={width} height={height} />
        <EditableLayer width={width} height={height} stateMachine={stateMachine} />
      </PIXIStage>
      <InfoLayer width={width} />
      <MemoRightClickOnFeature {...rightClickMenu} onClose={() => setRightClickMenu({ x: 0, y: 0, open: false })} />
    </div>
  );
};

const DrawWayTab = ({ width, height }: BusEditTabProps) => {
  const [rightClickMenu, setRightClickMenu] = useState<RightClickMenuProps>({ x: 0, y: 0, open: false });

  const stateMachine = useRef(
    new DrawModeStateMacine({
      meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore
    })).current;

  useEffect(() => {
    const keydownListener = (event: KeyboardEvent) => stateMachine.transform(event);
    document.addEventListener("keydown", keydownListener);
    return () => {
      document.removeEventListener("keydown", keydownListener);
      stateMachine.clearDrawMode();
    };
  }, [stateMachine]);

  return (
    <div className="relative" style={{ width, height }}>
      <PIXIStage
        width={width}
        height={height}
        options={{ background: "#1099bb" }}
        onMouseDown={(e) => stateMachine.transform(e)}
        onPointerMove={(e) => stateMachine.transform(e)}
        onMouseUp={(e) => stateMachine.transform(e)}
        onWheel={(e) => stateMachine.transform(e)}
      >
        <BackgroundLayer width={width} height={height} />
        <EditableLayer width={width} height={height} stateMachine={stateMachine} />
      </PIXIStage>
      <InfoLayer width={width} />
      <MemoRightClickOnFeature {...rightClickMenu} onClose={() => setRightClickMenu({ x: 0, y: 0, open: false })} />
    </div>
  );
};

// Main Route Edit Component with Tabs
const EditRoutePathStage = ({ width, height }: BusEditTabProps) => {
  const tabs = [
    { label: "Add Path" },
    { label: "Edit Way" },
    { label: "Draw Way" },
  ];
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="relative" style={{ width, height }}>
      {/* DaisyUI Tabs positioned absolutely in top-left corner */}
      <div className="absolute top-1 left-1 z-10">
        <div className="tabs tabs-boxed gap-1 shadow-md">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`tab tab-sm ${activeTab === index ? "tab-active" : ""}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 0 ? (
        <AddPathTab width={width} height={height} />
      ) : (activeTab === 1 ? (
        <EditWayTab width={width} height={height} />
      ): (
        <DrawWayTab width={width} height={height} />
      ))}
    </div>
  );
};

const SaveRouteStage = () => {
  const { editing: routeId, stops, path } = useOSMMapStore(state => state.routeEdit);
  const saveEditRoute = useOSMMapStore(state => state.saveEditRoute);
  const modifyFeatureMetaNC = useOSMMapStore(state => state.modifyFeatureMetaNC);
  const setStep = useOSMMapStore(state => state.setEditStepNC);
  const meta = useOSMMapStore(state => routeId && state.meta.relation[routeId]);
  const [editedTags, setEditedTags] = useState<Tag[]>(meta?.tag || []);

  const { undo } = useOSMMapStore.temporal.getState();

  const handleSave = () => {
    saveEditRoute();
  };

  useEffect(() => {
    const stateMachine = new UndoRedoStateMachine({ meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore })
    const keydownListener = (event: KeyboardEvent) => stateMachine.transform(event);
    document.addEventListener("keydown", keydownListener);
    return () => document.removeEventListener("keydown", keydownListener);
  }, []);

  if (!meta) return <div className="p-4 bg-base-100 max-w-xl mx-auto max-h-full overflow-scroll w-full">
    <div className="alert alert-success mb-4 mx-auto">
      <span>✓ Changes have been saved</span>
    </div>

    <div className="flex gap-2 justify-end">
      <button onClick={() => undo()} className="btn btn-primary">
        Undo
      </button>
      <button onClick={() => setStep(0)} className="btn btn-primary">
        Proceed
      </button>
    </div>
  </div>

  return (
    <div className="p-4 bg-base-100 max-w-xl mx-auto max-h-full overflow-scroll w-full">
      <h2 className="text-lg font-bold mb-4">Finalize Route Edits</h2>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Route Tags</h3>
        <Tags
          tags={editedTags}
          setTags={setEditedTags}
          commitChange={() => modifyFeatureMetaNC("relation", meta["@_id"]!, r => r.tag = editedTags)}
        />
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Route Members</h3>
        <div className="bg-base-200 p-2 rounded text-xs">
          {/* 分开显示 stops 和 path */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Stops</h4>
            {stops.map((member, index) => (
              <MemberItem
                key={`${member["@_type"]}-${member["@_ref"]}-${index}`}
                id={member["@_ref"]}
                type={member["@_type"]}
                showMetaType
              />
            ))}
          </div>

          <div className="">
            <h4 className="text-sm font-medium mb-2">Path</h4>
            {path.map((member, index) => (
              <MemberItem
                key={`${member["@_type"]}-${member["@_ref"]}-${index}`}
                id={member["@_ref"]}
                type={member["@_type"]}
                showMetaType
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={handleSave}
          className="btn btn-primary"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

function ForceJump() {
  const { step } = useOSMMapStore(state => state.routeEdit);
  const setCurrentStep = useOSMMapStore(state => state.setEditStepNC);
  const meta = useOSMMapStore(state => state.routeEdit.editing && state.meta.relation[state.routeEdit.editing]);

  useEffect(() => {
    console.debug("change meta step", meta, step)
    if (!meta && step != 0) {
      setCurrentStep(0);
    }
  }, [meta, setCurrentStep, step]);

  return null;
}

const RouteEditTab = ({ width, height }: BusEditTabProps) => {
  const { step, editing } = useOSMMapStore(state => state.routeEdit);
  const setCurrentStep = useOSMMapStore(state => state.setEditStepNC);

  const handelSetStep = (nxt: number) => {
    if (editing) {
      setCurrentStep(nxt);
    } else {
      setCurrentStep(0);
    }
  }

  const stepTabs = useMemo(() => [
    {
      label: "Create or select route",
      component: <CreateOrSelectRoute />
    },
    {
      label: "Add bus stops",
      component: <AddBusStopsStage width={width} height={height - STEPS_HEIGHT} />
    },
    {
      label: "Edit route path",
      component: <EditRoutePathStage width={width} height={height - STEPS_HEIGHT} />
    },
    {
      label: "Save changes",
      component: <SaveRouteStage />
    }
  ], [width, height]);

  return (<>
    <ForceJump />
    <div style={{ width, height }}>
      <div className="relative" style={{ width, height: height - STEPS_HEIGHT }}>
        {stepTabs[step].component}
      </div>
      <div style={{ width, height: STEPS_HEIGHT }}>
        <div className="absolute bottom-0 left-0 right-0 flex flex-row pt-[8px] bg-base-200">
          <ul className="steps steps-horizontal mx-auto">
            {stepTabs.map(({ label }, index) => (
              <li
                key={index}
                onClick={() => handelSetStep(index)}
                className={cn("step cursor-pointer", index <= step ? 'step-primary' : '', !editing && "disabled")}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </>
  );
};

export default RouteEditTab;
