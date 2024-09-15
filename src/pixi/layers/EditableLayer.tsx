import { Container } from "@pixi/react"
import useBearStoreWithUndo from "../../logic/model/store"
import { getBoundsByScene } from "../../utils/geo/mapProjection"
import { T2Arr } from "../../utils/helper/object"
import Line from "../components/Line"
import Point from "../components/Point"
import { useRef } from "react"
import { Container as PIXIContainer } from "pixi.js"


function EditableLayer({ width, height }: {
    width: number,
    height: number
}) {
    const viewpoint = useBearStoreWithUndo(state => state.viewpoint)
    const zoom = useBearStoreWithUndo(state => state.zoom)
    const { nodes, ways } = useBearStoreWithUndo(state => state.renderedOSMFeatureMeta)
    const containerRef = useRef<PIXIContainer>(null)
    const { left, bottom, right, top } = getBoundsByScene(viewpoint, zoom, width, height)
    const inBound = (lon: number, lat: number) => {
        return left <= lon && lon <= right && bottom <= lat && lat <= top
    }

    const points = []

    for (const key in nodes) {
        if (Object.prototype.hasOwnProperty.call(nodes, key)) {
            const nodeMeta = nodes[key];
            if (inBound(nodeMeta["@_lon"], nodeMeta["@_lat"])) {
                points.push(<Point idStr={key} width={width} height={height} layerRef={containerRef} />)
            }
        }
    }
    const lines = []
    for (const key in ways) {
        if (Object.prototype.hasOwnProperty.call(ways, key)) {
            const wayMeta = ways[key];
            if (T2Arr(wayMeta.nd).some(nd => {
                const nodeMeta = nodes[nd["@_ref"]]
                return inBound(nodeMeta["@_lon"], nodeMeta["@_lat"])
            })) {
                lines.push(<Line idStr={key} width={width} height={height} layerRef={containerRef} />)
            }
        }
    }

    return <Container ref={containerRef}>
        {...lines}
        {...points}
    </Container>
}

export default EditableLayer