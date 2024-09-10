import { Container, Graphics } from "@pixi/react";
import useBearStoreWithUndo from "../../logic/model/store";
import { settings } from "../../logic/settings/settings";
import { T2Arr } from "../../utils/helper/object";
import { getPixelByWGS84Locate } from "../../utils/geo/mapProjection";
import { useCallback, useEffect, useRef } from "react";
import { Container as PIXIContainer, Polygon as PIXIPolygon, Graphics as PIXIGraphics, LINE_JOIN as PIXILINE_JOIN, LINE_CAP as PIXILINE_CAP } from "pixi.js";
import { useShallow } from "zustand/react/shallow";
import { GlowFilter } from "pixi-filters";
import { stateMachine } from "../../logic/states/stateMachine";
import { lineToPoly } from '../utils/helper.ts'

function Line({ idStr, width, height }: {
    idStr: string,
    width: number,
    height: number
}) {
    const { visible, hovered, selected, highlighted } = useBearStoreWithUndo((state) => state.renderedFeatureState.ways[idStr]);
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
    const containerRef = useRef<PIXIContainer>(null)
    const drawOuter = useCallback((g: PIXIGraphics) => {
        g.clear();
        g.lineStyle(9, 0xffd900)
        // paint stroke
        const [first, ...rest] = pixPath
        g.moveTo(first.x, first.y);
        rest.forEach(pixpoint => {
            g.lineTo(pixpoint.x, pixpoint.y)
        });
    }, [pixPath])
    const drawInner = useCallback((g: PIXIGraphics) => {
        g.clear();
        g.lineStyle(5, 0xff3300)
        // paint fill
        const [first, ...rest] = pixPath
        g.moveTo(first.x, first.y);
        rest.forEach(pixpoint => {
            g.lineTo(pixpoint.x, pixpoint.y)
        });
    }, [pixPath])


    const createHitArea = useCallback(() => {
        const hitWidth = 3
        const flatPath = pixPath.flatMap(p => [p.x, p.y])
        const hitStyle = {
            alignment: 0.5,  // middle of line
            color: 0x0,
            width: hitWidth + 10,
            alpha: 1.0,
            join: PIXILINE_JOIN.BEVEL,
            cap: PIXILINE_CAP.BUTT
        };
        // Create the polygon hit area
        const bufdata = lineToPoly(flatPath, hitStyle);
        console.log(bufdata)
        if (containerRef.current && bufdata.perimeter) {
            containerRef.current.hitArea = new PIXIPolygon(bufdata.perimeter);
            // const g = new PIXIGraphics()
            // g.beginFill(0x5d0015);
            // g.drawPolygon(
            //     bufdata.perimeter
            // );
            // g.endFill();
            // containerRef.current.addChild(g)
        }
    }, [pixPath]);


    useEffect(() => {
        const container = containerRef.current
        if (container !== null) {

            const updateHitbox = () => {
                createHitArea()
            }

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

    }, [nodePath, viewpoint, zoom, width, height, idStr, highlighted, hovered, selected, visible, lineMeta, createHitArea])

    return (visible && <Container
        zIndex={settings.pixiRender.zIndex.LINE}
        visible={visible}
        position={{ x: 0, y: 0 }}
        ref={containerRef}
        eventMode="static"
        pointerover={(event) => {
            console.log("line !")

            stateMachine.hookPIXIComponent(event, idStr, "way")
        }}
        pointerout={(event) => {
            stateMachine.hookPIXIComponent(event, idStr, "way")
        }}
        pointerdown={(event) => {
            console.log("line down")
            stateMachine.hookPIXIComponent(event, idStr, "way")
        }}
        pointerup={(event) => {
            stateMachine.hookPIXIComponent(event, idStr, "way")
        }}
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