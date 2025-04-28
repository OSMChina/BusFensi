import { useMemo, useRef } from "react"
import { Container as PIXIContainer } from "pixi.js"
import Line from "../../../components/pixi/Line"
import Point from "../../../components/pixi/Point"
import { useMapViewStore } from "../../../store/mapview"
import { useOSMMapStore } from "../../../store/osmmeta"
import { NodesObj } from "../../../type/osm/refobj"
import { PointerWithOSMEvent } from "../../../type/stateMachine/commonEdit/componentEvent"
import HeadlessMetaRender from "../components/HeadlessOSMMetaRender"
import { Node, Way } from "../../../type/osm/meta"
import { BaseStateMachine } from "../stateMachine/state"
import SelectionRect from "../../../components/pixi/SelectRect"
import DisplayDrawingLine from "../../../components/pixi/DrawingLine"

type PointWarpProps = Pick<React.ComponentProps<typeof Point>, "mapViewStatus" | "layerRef"> & {
    node: Node,
    stateMachine: BaseStateMachine,
    modalOpen?: boolean
}

function PointWrap({ node, stateMachine, modalOpen, ...props }: PointWarpProps) {
    const status = node["@_localStates"], id = node["@_id"]
    return <Point
        {...props}
        node={node}
        status={status!}
        eventMode="static"
        mousedown={(event) =>!modalOpen&& stateMachine.transform({ ...event, componentTarget: { id, type: "node" } } as PointerWithOSMEvent)}
        mouseup={(event) => !modalOpen&& stateMachine.transform({ ...event, componentTarget: { id, type: "node" } } as PointerWithOSMEvent)}
        pointerover={(event) =>!modalOpen&&  stateMachine.transform({ ...event, componentTarget: { id, type: "node" } } as PointerWithOSMEvent)}
        pointerout={(event) => !modalOpen&& stateMachine.transform({ ...event, componentTarget: { id, type: "node" } } as PointerWithOSMEvent)}
    />
}

type LineWarpProps = Pick<React.ComponentProps<typeof Line>, "mapViewStatus" | "layerRef"> & {
    way: Way,
    node: NodesObj,
    stateMachine: BaseStateMachine,
    modalOpen?: boolean
}

function LineWarp({ way, node, stateMachine, modalOpen, ...props }: LineWarpProps) {
    const status = way["@_localStates"], id = way["@_id"];
    const nodePath = useMemo(() => way.nd.map(nd => node[nd["@_ref"]]), [node, way.nd])
    return <Line
        {...props}
        line={way}
        nodePath={nodePath}
        status={status!}
        eventMode="static"
        pointerover={(event) => !modalOpen && stateMachine.transform({ ...event, componentTarget: { id, type: "way" } } as PointerWithOSMEvent)}
        pointerout={(event) =>!modalOpen && stateMachine.transform({ ...event, componentTarget: { id, type: "way" } } as PointerWithOSMEvent)}
        mousedown={(event) => !modalOpen && stateMachine.transform({ ...event, componentTarget: { id, type: "way" } } as PointerWithOSMEvent)}
        mouseup={(event) =>!modalOpen && stateMachine.transform({ ...event, componentTarget: { id, type: "way" } } as PointerWithOSMEvent)}
    />
}

function EditableLayer({ width, height, stateMachine, modalOpen }: {
    width: number,
    height: number,
    stateMachine: BaseStateMachine,
    modalOpen?: boolean
}) {
    const mapview = useMapViewStore()
    const {viewpoint, zoom, selectionRect} = mapview;
    const { node, way } = useOSMMapStore(state => state.meta)
    const containerRef = useRef<PIXIContainer>(null)

    return <>
        <HeadlessMetaRender
            view={{ viewpoint, zoom, width, height }}
            meta={{ node, way }}
            ref={containerRef}
            wayRenderer={w => <LineWarp
                way={w}
                node={node}
                key={w["@_id"]}
                stateMachine={stateMachine}
                mapViewStatus={{ width, height, viewpoint, zoom }}
                layerRef={containerRef}
                modalOpen={modalOpen}
            />}
            pointRenderer={n => <PointWrap
                node={n}
                key={n["@_id"]}
                stateMachine={stateMachine}
                mapViewStatus={{ width, height, viewpoint, zoom }}
                layerRef={containerRef}
                modalOpen={modalOpen}
            />}
        />
        <SelectionRect selectionRect={selectionRect} />
        <DisplayDrawingLine {...mapview} />
    </>
}

export default EditableLayer