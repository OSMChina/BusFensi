import { Container, Graphics } from "@pixi/react";
import useBearStoreWithUndo from "../../logic/model/store";
import { settings } from "../../logic/settings/settings";
import { T2Arr } from "../../utils/helper/object";
import { getPixelByWGS84Locate } from "../../utils/geo/mapProjection";
import { useCallback, useEffect, useRef } from "react";
import PIXI from "pixi.js";
import { useShallow } from "zustand/react/shallow";
import { GlowFilter } from "pixi-filters";

function Line({ idStr, width, height }: {
    idStr: string,
    width: number,
    height: number
}) {
    const { visible, hovered, selected, highlighted } = useBearStoreWithUndo((state) => state.renderedFeatureState[idStr]);
    const lineMeta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.ways[idStr]))
    const { viewpoint, zoom } = useBearStoreWithUndo(useShallow((state) => {
        const { viewpoint, zoom } = state;
        return { viewpoint, zoom }
    }))
    const nodePath = useBearStoreWithUndo(useShallow((state) => {
        const lineMeta = state.renderedOSMFeatureMeta.ways[idStr];
        const nodePath = T2Arr(lineMeta.nd)
            .map(nd => state.renderedOSMFeatureMeta.nodes[nd["@_ref"]])
        return nodePath;
    }))
    const pixPath = nodePath.map(node => getPixelByWGS84Locate(
        { lon: node["@_lon"], lat: node["@_lat"] },
        viewpoint,
        zoom,
        width,
        height
    ))
    const containerRef = useRef<PIXI.Container>(null)
    const drawOuter = useCallback((g: PIXI.Graphics) => {
        g.clear();
        g.lineStyle(9, 0xffd900)
        // paint stroke
        const [first, ...rest] = pixPath
        g.moveTo(first.x, first.y);
        rest.forEach(pixpoint => {
            g.lineTo(pixpoint.x, pixpoint.y)
        });
    }, [pixPath])
    const drawInner = useCallback((g: PIXI.Graphics) => {
        g.clear();
        g.lineStyle(5, 0xff3300)
        // paint fill
        const [first, ...rest] = pixPath
        g.moveTo(first.x, first.y);
        rest.forEach(pixpoint => {
            g.lineTo(pixpoint.x, pixpoint.y)
        });
    }, [pixPath])

    useEffect(() => {
        const container = containerRef.current
        if (container !== null) {

            const updateHitbox = () => { }

            const updateHalo = () => {
                const showHover = (visible && hovered);
                const showSelect = (visible && selected);
                const showHighlight = (visible && highlighted);

                // Hover
                if (showHover) {
                    if (!container.filters) {
                        const glow = new GlowFilter({ distance: 15, outerStrength: 3, color: 0xffff00 });
                        glow.resolution = 2;
                        container.filters = [glow];
                    }
                } else if (showHighlight) {
                    if (!container.filters) {
                        const glow = new GlowFilter({ distance: 15, outerStrength: 3, color: 0x7092ff });
                        glow.resolution = 2;
                        container.filters = [glow];
                    }
                } else if (showSelect) {
                    if (!container.filters) {
                        const glow = new GlowFilter({ distance: 15, outerStrength: 3, color: 0xffff00 });
                        glow.resolution = 2;
                        container.filters = [glow];
                    }
                } else {
                    if (container.filters) {
                        container.filters = null;
                    }
                }
            }

            updateHitbox()
            updateHalo()
        }

    }, [nodePath, viewpoint, zoom, width, height, idStr, highlighted, hovered, selected, visible, lineMeta])

    return (visible && <Container
        zIndex={settings.pixiRender.zIndex.LINE}
        visible={visible}
        position={{ x: 0, y: 0 }}
        ref={containerRef}
    >
        <Graphics
            draw={drawOuter}
        />
        <Graphics
            draw={drawInner}
        />
    </Container>)
}

export default Line;