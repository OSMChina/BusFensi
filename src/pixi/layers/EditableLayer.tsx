import { Container } from "@pixi/react"
import useBearStoreWithUndo from "../../logic/model/store"
import { getBoundsByScene } from "../../utils/geo/mapProjection"
import { T2Arr } from "../../utils/helper/object"
import Line from "../components/Line"
import Point from "../components/Point"


function EditableLayer({ width, height }: {
    width: number,
    height: number
}) {
    const viewpoint = useBearStoreWithUndo(state => state.viewpoint)
    const zoom = useBearStoreWithUndo(state => state.zoom)
    const { nodes, ways } = useBearStoreWithUndo(state => state.renderedOSMFeatureMeta)

    const { left, bottom, right, top } = getBoundsByScene(viewpoint, zoom, width, height)
    const inBound = (lon: number, lat: number) => {
        return left <= lon && lon <= right && bottom <= lat && lat <= top
    }

    const points = []

    for (const key in nodes) {
        if (Object.prototype.hasOwnProperty.call(nodes, key)) {
            const nodeMeta = nodes[key];
            if (inBound(nodeMeta["@_lon"], nodeMeta["@_lat"])) {
                points.push(<Point idStr={key} width={width} height={height} />)
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
                lines.push(<Line idStr={key} width={width} height={height} />)
            }
        }
    }

    return <Container>
        {...lines}
        {...points}
    </Container>
}

export default EditableLayer