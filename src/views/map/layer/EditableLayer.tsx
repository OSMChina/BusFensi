import { Container } from "@pixi/react"
import { getBoundsByScene } from "../../../utils/geo/mapProjection"
import { useCallback, useMemo, useRef } from "react"
import { Container as PIXIContainer } from "pixi.js"
import Line from "../../../components/pixi/Line"
import Point from "../../../components/pixi/Point"
import { useMapViewStore } from "../../../store/mapview"
import { useOSMMapStore } from "../../../store/osmmeta"
import { NumericString } from "../../../type/osm/refobj"
import { useShallow } from "zustand/shallow"
import { CommonEditStateMachine } from "../stateMachine/commonEdit"
import { PointerWithOSMEvent } from "../../../type/stateMachine/commonEdit/componentEvent"
import { Node } from "../../../type/osm/meta"

type PointWarpProps = Pick<React.ComponentProps<typeof Point>, "mapViewStatus" | "layerRef"> & {
    id: NumericString,
    stateMachine: CommonEditStateMachine
}

function PointWrap({ id, stateMachine, ...props }: PointWarpProps) {
    const [node, status] = useOSMMapStore(useShallow(
        (state) => [state.meta.node[id], state.meta.node[id]["@_localStates"]]))
    return <Point
        {...props}
        node={node}
        status={status!}
        eventMode="static"
        pointerdown={(event) => stateMachine.transform({ ...event, componentTarget: { id, type: "node" } } as PointerWithOSMEvent)}
        pointerup={(event) => stateMachine.transform({ ...event, componentTarget: { id, type: "node" } } as PointerWithOSMEvent)}
        pointerover={(event) => stateMachine.transform({ ...event, componentTarget: { id, type: "node" } } as PointerWithOSMEvent)}
        pointerout={(event) => stateMachine.transform({ ...event, componentTarget: { id, type: "node" } } as PointerWithOSMEvent)}
    />
}

type LineWarpProps = Pick<React.ComponentProps<typeof Line>, "mapViewStatus" | "layerRef"> & {
    id: NumericString,
    stateMachine: CommonEditStateMachine
}

function LineWarp({ id, stateMachine, ...props }: LineWarpProps) {
    const [way, status, node] = useOSMMapStore(useShallow(
        (state) => [state.meta.way[id], state.meta.way[id]["@_localStates"], state.meta.node]))
    const nodePath = useMemo(() => way.nd.map(nd => node[nd["@_ref"]]), [node, way.nd])
    return <Line
        {...props}
        line={way}
        nodePath={nodePath}
        status={status!}
        eventMode="static"
        pointerover={(event) => stateMachine.transform({ ...event, componentTarget: { id, type: "way" } } as PointerWithOSMEvent)}
        pointerout={(event) => stateMachine.transform({ ...event, componentTarget: { id, type: "way" } } as PointerWithOSMEvent)}
        pointerdown={(event) => stateMachine.transform({ ...event, componentTarget: { id, type: "way" } } as PointerWithOSMEvent)}
        pointerup={(event) => stateMachine.transform({ ...event, componentTarget: { id, type: "way" } } as PointerWithOSMEvent)}
    />
}

function EditableLayer({ width, height, stateMachine }: {
    width: number,
    height: number,
    stateMachine: CommonEditStateMachine
}) {
    const [viewpoint, zoom] = useMapViewStore(useShallow(state => ([state.viewpoint, state.zoom])))
    const { node, way } = useOSMMapStore(state => state.meta)
    const containerRef = useRef<PIXIContainer>(null)
    const { left, bottom, right, top } = getBoundsByScene(viewpoint, zoom, width, height)
    const inBound = useCallback(({ '@_lon': lon, '@_lat': lat }: Node) => {
        return left <= lon && lon <= right && bottom <= lat && lat <= top
    }, [left, bottom, right, top])

    if (zoom < 16) {
        return null;
    }

    return <Container ref={containerRef}>
        {Object.values(way).filter(w => w.nd.map(nd => node[nd["@_ref"]]).some(inBound))
            .map(w => <LineWarp
                id={w["@_id"]}
                key={w["@_id"]}
                stateMachine={stateMachine}
                mapViewStatus={{ width, height, viewpoint, zoom }}
                layerRef={containerRef}
            />)}
        {Object.values(node).filter(inBound)
            .map(n => <PointWrap
                id={n["@_id"]}
                key={n["@_id"]}
                stateMachine={stateMachine}
                mapViewStatus={{ width, height, viewpoint, zoom }}
                layerRef={containerRef}
            />)}
    </Container>
}

export default EditableLayer