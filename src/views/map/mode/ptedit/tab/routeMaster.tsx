import { useMemo, useCallback, useEffect } from "react";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { FeatureTypes, NumericString } from "../../../../../type/osm/refobj";
import { getName } from "../../../../../utils/osm/nodeType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { createConfirmation } from "react-confirm";
import CreateFeatureTagConfirm from "../../../../../components/modal/CreateFeatureTagConfirmHook";
import { routeMasterPresetCN } from "../../../../../utils/osm/presets/bus";
import MemberListSelectDelDown from "../../../../property/components/MemberListSelWithDelDown";
import MemberItem from "../../../../../components/osm/memberDrag/MemberItem";
import { Member } from "../../../../../type/osm/meta";
import { ViewFCProps } from "../../../../../type/view/props";
import { getSelectedMaster } from "../../../../../store/osmmeta/selector";
import { FeatureCollection, FeatureList } from "../../../../outline/base/list";
import { FeatureBaseOutlineTab } from "../../../../outline/base/tab";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import Tags from "../../../../property/components/Tags";
import { UndoRedoStateMachine } from "../../../stateMachine/slice/util/UndoRedoStateMachine";
import { useMapViewStore } from "../../../../../store/mapview";
import { useSettingsStore } from "../../../../../store/settings";

export function RouteMasterTab({ width, height }: ViewFCProps) {
    const selectedMaster = useOSMMapStore(getSelectedMaster);
    const setSelectedMaster = useOSMMapStore(state => state.setSelectedMaster);
    const clearSelectedMaster = useOSMMapStore(state => state.clearSelectedMaster);
    const relations = useOSMMapStore(state => state.meta.relation);
    const createRelation = useOSMMapStore(state => state.createLocalRelation);
    const modifyFeature = useOSMMapStore(state => state.modifyFeatureMetaNC);
    const commit = useOSMMapStore(state => state.commit);
    const confirmModal = useMemo(() => createConfirmation(CreateFeatureTagConfirm), []);

    // Get existing route masters
    const routeMasters = useMemo(() =>
        Object.values(relations).filter(r =>
            r.tag?.some(t => t['@_k'] === 'type' && t['@_v'] === 'route_master')
        ), [relations]);

    // Get available routes
    const routes = useMemo(() =>
        Object.values(relations).filter(r =>
            r.tag?.some(t => t['@_k'] === 'type' && t['@_v'] === 'route')
        ), [relations]);

    const handleCreateMaster = useCallback(async () => {
        const result = await confirmModal({
            title: "Create Route Master",
            preset: routeMasterPresetCN,
        });

        if (result?.tag) {
            const newId = createRelation([]);
            modifyFeature("relation", newId, (rel) => {
                rel.tag = result.tag;
            });
            setSelectedMaster(newId);
        }
    }, [confirmModal, createRelation, modifyFeature, setSelectedMaster]);

    const addRouteToMaster = useCallback((routeId: NumericString) => {
        if (!selectedMaster) return;

        modifyFeature("relation", selectedMaster, (master) => {
            if (!master.member.some(m => m["@_ref"] === routeId)) {
                master.member.push({
                    "@_type": "relation",
                    "@_ref": routeId,
                    "@_role": "route"
                });
            }
        });
    }, [selectedMaster, modifyFeature]);

    const handleMasterSelect = useCallback((masterId: NumericString) => {
        setSelectedMaster(masterId);
    }, [setSelectedMaster]);

    const handleMasterDeselect = useCallback(() => {
        clearSelectedMaster();
    }, [clearSelectedMaster]);

    const handleMemberReorder = useCallback((reorderedMembers: Member[]) => {
        if (!selectedMaster) return;
        modifyFeature("relation", selectedMaster, (master) => {
            master.member = reorderedMembers;
        });
    }, [selectedMaster, modifyFeature]);

    const handleMemberDelete = useCallback((_prev: Member[], after: Member[]) => {
        if (!selectedMaster) return;
        modifyFeature("relation", selectedMaster, (master) => {
            master.member = after;
        });
    }, [selectedMaster, modifyFeature]);

    useEffect(() => {
        const stateMachine = new UndoRedoStateMachine({ meta: useOSMMapStore, view: useMapViewStore, settings: useSettingsStore })
        const keydownListener = (event: KeyboardEvent) => stateMachine.transform(event);
        document.addEventListener("keydown", keydownListener);
        return () => document.removeEventListener("keydown", keydownListener);
    }, []);

    return (
        <div className="p-4 bg-base-100 flex flex-col gap-4"
            style={{ width, height }}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Route Masters</h2>
                <button
                    onClick={handleCreateMaster}
                    className="btn btn-primary btn-sm"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    New Route Master
                </button>
            </div>

            <div className="flex gap-4 flex-1 overflow-hidden">
                {/* Route Master List */}
                <div className="w-1/2 bg-base-200 p-4 rounded-box h-full max-h-full flex flex-col">
                    <FeatureBaseOutlineTab>
                        {({ filter }) => <FeatureCollection forceOpen name="route masters" defaultOpen>
                            <FeatureList
                                relation={Object.values(routeMasters)}
                                showMetaType
                                filter={filter}
                            >
                                {({ meta }) => (
                                    <button
                                        className="btn btn-ghost btn-xs ml-2 tooltip tooltip-bottom"
                                        data-tip="Select as edting route master"
                                        onClick={() => handleMasterSelect(meta["@_id"])}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                )}
                            </FeatureList>
                        </FeatureCollection>}
                        {({ filter }) => <FeatureCollection name="available-routes" defaultOpen>
                            <FeatureList
                                relation={Object.values(routes)}
                                showMetaType
                                filter={filter}
                            >
                                {({ meta }) => (
                                    <button
                                        onClick={() => addRouteToMaster(meta["@_id"])}
                                        className="btn btn-ghost btn-xs ml-2 btn-smtooltip tooltip-bottom"
                                        data-tip="Append to editing"
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                )}
                            </FeatureList>
                        </FeatureCollection>}
                    </FeatureBaseOutlineTab>
                </div>

                {/* Selected Master Details */}
                <div className="overflow-scroll bg-base-200 p-4 rounded-box h-full max-h-full">
                    {selectedMaster ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold">
                                    {getName(relations[selectedMaster].tag) || "Unnamed Master"}
                                </h3>
                                <button
                                    onClick={handleMasterDeselect}
                                    className="btn btn-ghost btn-sm"
                                >
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>
                            </div>

                            <Tags tags={relations[selectedMaster].tag || []}
                                setTags={(tags) => modifyFeature("relation", selectedMaster, r => {
                                    r.tag = tags;
                                })}
                                commitChange={commit}
                            />

                            <div className="mb-4">
                                <h4 className="font-medium mb-2">Member Routes</h4>
                                <MemberListSelectDelDown
                                    member={relations[selectedMaster].member}
                                    memberToId={m => `${m["@_type"]}-${m["@_ref"]}`}
                                    onDelete={handleMemberDelete}
                                    onDragStart={() => { }}
                                    onDragEnd={handleMemberReorder}
                                >
                                    {({ member, children }) => (
                                        <MemberItem
                                            id={member["@_ref"]}
                                            type={member["@_type"] as FeatureTypes}
                                            showMetaType
                                        >
                                            {() => children}
                                        </MemberItem>
                                    )}
                                </MemberListSelectDelDown>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500">
                            Select or create a route master to begin
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}