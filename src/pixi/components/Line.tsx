// wait rapid to fix this issue
// @ts-ignore
import { DashLine } from '@rapideditor/pixi-dashed-line';

import { Container, Graphics, Sprite } from "@pixi/react";
import useBearStoreWithUndo from "../../logic/model/store";
import { T2Arr } from "../../utils/helper/object";
import { getPixelByWGS84Locate } from "../../utils/geo/mapProjection";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Container as PIXIContainer, Polygon as PIXIPolygon, Graphics as PIXIGraphics, LINE_JOIN as PIXILINE_JOIN, LINE_CAP as PIXILINE_CAP, DisplayObject } from "pixi.js";
import { useShallow } from "zustand/react/shallow";
import { GlowFilter } from "pixi-filters";
import { stateMachine } from "../../logic/states/stateMachine";
import { getLineCapEnum, getLineJoinEnum, getLineSegments, lineToPoly } from '../utils/rapidAdapted/helper.ts';
import { arrorowRightLongTexture } from "../textures/index.ts";
import { wayIsOneWay, wayIsSided } from "../../utils/osm/wayTypes.ts";
import { styleMatch } from "../utils/rapidAdapted/style.ts";


const ONEWAY_SPACING = 35;

function Line({ idStr, width, height, layerRef }: {
    idStr: string,
    width: number,
    height: number,
    layerRef: React.RefObject<PIXIContainer<DisplayObject>>
}) {
    const { visible, hovered, selected, highlighted } = useBearStoreWithUndo((state) => state.renderedFeatureState.ways[idStr]);
    const settings = useBearStoreWithUndo(useShallow((state) => state.settings))
    const lineMeta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.ways[idStr]));
    const { viewpoint, zoom } = useBearStoreWithUndo(useShallow((state) => {
        const { viewpoint, zoom } = state;
        return { viewpoint, zoom };
    }));

    const nodePath = useBearStoreWithUndo(useShallow((state) => {
        const lineMeta = state.renderedOSMFeatureMeta.ways[idStr];
        const nodePath = T2Arr(lineMeta.nd)
            .map(nd => state.renderedOSMFeatureMeta.nodes[nd["@_ref"]]);
        return nodePath;
    }));

    const pixPath = nodePath.map(node => getPixelByWGS84Locate(
        { lon: node["@_lon"], lat: node["@_lat"] },
        viewpoint,
        zoom,
        width,
        height
    ));

    const containerRef = useRef<PIXIContainer>(null);
    const haloRef = useRef<PIXIGraphics | null>(null)

    const style = styleMatch(T2Arr(lineMeta.tag));  // Get the matched style

    const bufdata = useMemo(() => {
        const hitWidth = Math.max(3, style?.casing?.width || 0);
        const flatPath = pixPath.flatMap(p => [p.x, p.y]);
        const hitStyle = {
            alignment: 0.5,  // middle of line
            color: 0x0,
            width: hitWidth + 10,
            alpha: 1.0,
            join: PIXILINE_JOIN.BEVEL,
            cap: PIXILINE_CAP.BUTT
        };
        return lineToPoly(flatPath, hitStyle)
    }, [pixPath, style])

    const drawOuter = useCallback((g: PIXIGraphics) => {
        g.clear();
        const outerStyle = style.casing || {};  // Get stroke style
        if (outerStyle.dash) {
            g = new DashLine(g, {
                dash: outerStyle.dash,
                color: outerStyle.color,
                width: outerStyle.width,
                alpha: outerStyle.alpha || 1.0,
                join: getLineJoinEnum(outerStyle.join),
                cap: getLineCapEnum(outerStyle.cap),
            });
        } else {
            g.lineStyle({
                color: outerStyle.color,
                width: outerStyle.width,
                alpha: outerStyle.alpha || 1.0,
                join: getLineJoinEnum(outerStyle.join),
                cap: getLineCapEnum(outerStyle.cap),
            });
        }
        // Draw the outer line
        const [first, ...rest] = pixPath;
        g.moveTo(first.x, first.y);
        rest.forEach(pixpoint => {
            g.lineTo(pixpoint.x, pixpoint.y);
        });
    }, [pixPath, style.casing]);

    const drawInner = useCallback((g: PIXIGraphics) => {
        g.clear();
        const innerStyle = style.stroke || {};  // Get fill style
        if (innerStyle.dash) {
            g = new DashLine(g, {
                dash: innerStyle.dash,
                color: innerStyle.color,
                width: innerStyle.width,
                alpha: innerStyle.alpha || 1.0,
                join: getLineJoinEnum(innerStyle.join),
                cap: getLineCapEnum(innerStyle.cap),
            });
        } else {
            g.lineStyle({
                color: innerStyle.color,
                width: innerStyle.width,
                alpha: innerStyle.alpha || 1.0,
                join: getLineJoinEnum(innerStyle.join),
                cap: getLineCapEnum(innerStyle.cap),
            });
        }
        // Draw the inner line
        const [first, ...rest] = pixPath;
        g.moveTo(first.x, first.y);
        rest.forEach(pixpoint => {
            g.lineTo(pixpoint.x, pixpoint.y);
        });
    }, [pixPath, style]);

    const createHitArea = useCallback(() => {
        if (containerRef.current && bufdata.perimeter) {
            containerRef.current.hitArea = new PIXIPolygon(bufdata.perimeter);
        }
    }, [containerRef, bufdata]);

    useEffect(() => {
        const container = containerRef.current;
        if (container !== null) {
            const updateHitbox = () => {
                createHitArea();
            };

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
                } else {
                    if (container.filters) {
                        container.filters = null;
                    }
                }

                // Select
                if (showSelect && layerRef.current) {
                    if (!haloRef.current) {
                        haloRef.current = new PIXIGraphics();
                        layerRef.current.addChild(haloRef.current);
                    }

                    const HALO_STYLE = {
                        alpha: 0.9,
                        dash: [6, 3],
                        width: 2,   // px
                        color: 0xff0000
                    };

                    haloRef.current.clear();
                    const dl = new DashLine(haloRef.current, HALO_STYLE);
                    if (bufdata) {
                        if (bufdata.outer && bufdata.inner) {
                            dl.drawPolygon(bufdata.outer);
                            dl.drawPolygon(bufdata.inner);
                        } else {
                            dl.drawPolygon(bufdata.perimeter);
                        }
                    }
                } else {
                    if (haloRef.current) {
                        haloRef.current.destroy({ children: true });
                        haloRef.current = null;
                    }
                }
            };

            updateHitbox();
            updateHalo();
        }
    }, [highlighted, hovered, selected, visible, createHitArea, bufdata, layerRef]);

    const oneway = wayIsOneWay(T2Arr(lineMeta.tag));
    const sided = wayIsSided(T2Arr(lineMeta.tag));

    return (visible && (
        <Container
            zIndex={settings.pixiRender.zIndex.LINE}
            visible={visible}
            position={{ x: 0, y: 0 }}
            ref={containerRef}
            eventMode="static"
            pointerover={(event) => {
                stateMachine.hookPIXIComponent(event, idStr, "way");
            }}
            pointerout={(event) => {
                stateMachine.hookPIXIComponent(event, idStr, "way");
            }}
            pointerdown={(event) => {
                stateMachine.hookPIXIComponent(event, idStr, "way");
            }}
            pointerup={(event) => {
                stateMachine.hookPIXIComponent(event, idStr, "way");
            }}
        >
            <Graphics draw={drawOuter} />
            <Graphics draw={drawInner} />
            {oneway && getLineSegments(pixPath.map(pix => ([pix.x, pix.y])), ONEWAY_SPACING, false, true)
                .map((segment, i) => segment.coords.map(([x, y], j) => (
                    <Sprite
                        key={`${i}-${j}`}
                        eventMode="none"
                        width={8}
                        height={8}
                        texture={arrorowRightLongTexture}
                        sortableChildren={false}
                        anchor={{ x: 0.5, y: 0.5 }}
                        position={{ x, y }}
                        rotation={segment.angle}
                        tint={0x0}
                    />
                ))).flat()}

            {sided && getLineSegments(pixPath.map(pix => ([pix.x, pix.y])), ONEWAY_SPACING, true, true)
                .map((segment, i) => segment.coords.map(([x, y], j) => (
                    <Sprite
                        key={`${i}-${j}`}
                        eventMode="none"
                        width={8}
                        height={8}
                        texture={arrorowRightLongTexture}
                        sortableChildren={false}
                        anchor={{ x: 0.5, y: 0.5 }}
                        position={{ x, y }}
                        rotation={segment.angle}
                        tint={0x0}
                    />
                ))).flat()}
        </Container>
    ));
}

export default Line;
