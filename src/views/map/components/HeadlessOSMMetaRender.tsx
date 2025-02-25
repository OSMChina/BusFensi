import { ReactNode, useCallback, useMemo } from "react";
import { FeatureMetaGroup } from "../../../type/osm/refobj";
import { MapViewStatus } from "../../../utils/geo/types";
import { getBoundsByScene } from "../../../utils/geo/mapProjection";
import { Node, Way } from "../../../type/osm/meta";
import { Container } from "@pixi/react";

type HeadlessRenderProps = React.ComponentProps<typeof Container> & {
    view: MapViewStatus,
    meta: Pick<FeatureMetaGroup, "node" | "way">,
    pointRenderer: (node: Node, index: number) => ReactNode,
    wayRenderer: (way: Way, index: number) => ReactNode,
}

export function HeadlessMetaRender({
    view: { width, height, viewpoint, zoom },
    meta: { node, way },
    pointRenderer,
    wayRenderer,
    ...props
}: HeadlessRenderProps) {
    const { left, bottom, right, top } = useMemo(
        () => getBoundsByScene(viewpoint, zoom, width, height),
        [viewpoint, zoom, width, height])

    const inBound = useCallback(({ '@_lon': lon, '@_lat': lat }: Node) => {
        return left <= lon && lon <= right && bottom <= lat && lat <= top
    }, [left, bottom, right, top])

    if (zoom < 16) {
        return null;
    }

    return <Container {...props}>
        {Object.values(way).filter(w => w.nd.map(nd => node[nd["@_ref"]]).some(inBound))
            .map(wayRenderer)}
        {Object.values(node).filter(inBound)
            .map(pointRenderer)}
    </Container>
}