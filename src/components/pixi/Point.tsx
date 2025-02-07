// @ts-expect-error wait rapid to implement type
import { DashLine } from '@rapideditor/pixi-dashed-line';

import { Container, Sprite } from "@pixi/react";
import { busStopTexture, circleTexture, locationPinTexture } from "./textures";
import { getPixelByWGS84Locate } from "../../utils/geo/mapProjection";
import { GlowFilter } from "pixi-filters";
import React, { useEffect, useRef } from "react";
import { Container as PIXIContainer, Circle as PIXICircle, Graphics as PIXIGraphics, Rectangle as PIXIRectangle, DisplayObject } from "pixi.js";
import { isBusStop } from "../../utils/osm/nodeType";
import { T2Arr } from "../../utils/helper/object";
import { MapViewStatus } from '../../utils/geo/types';
import { Node } from '../../type/osm/meta';
import { FeatureState } from '../../logic/model/type';

type PointProps = React.ComponentProps<typeof Container> & {
    node: Node,
    mapViewStatus: MapViewStatus,
    status: FeatureState,
    layerRef: React.RefObject<PIXIContainer<DisplayObject>>,
}

function Point({
    node,
    mapViewStatus: { width, height, viewpoint, zoom },
    status: { visible: _v, hovered, selected, highlighted },
    layerRef,
    ...containerProps }: PointProps) {
    const visible = zoom >= 16 && _v;

    const containerRef = useRef<PIXIContainer>(null)
    const haloRef = useRef<PIXIGraphics | null>(null)
    const busStop = isBusStop(T2Arr(node.tag))
    const typeDisplay: "dot" | "pin" = "dot"
    const display = (typeDisplay !== "dot" && zoom >= 17) ? "pin" : "dot";
    const position = getPixelByWGS84Locate(
        { lon: node["@_lon"], lat: node["@_lat"] },
        viewpoint,
        zoom,
        width,
        height
    )

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const updateHitbox = () => {
                if (!visible) return;

                const MINSIZE = 20;
                const rect = container.getLocalBounds().clone();

                if (display === "dot") {
                    let radius = rect.width / 2;
                    if (radius < MINSIZE / 2) {
                        radius = MINSIZE / 2;
                    }
                    radius = radius + 2;  // pad a bit more

                    const circle = new PIXICircle(0, 0, radius);
                    container.hitArea = circle;
                } else {
                    if (rect.width < MINSIZE) {
                        rect.pad((MINSIZE - rect.width) / 2, 0);
                    }
                    if (rect.height < MINSIZE) {
                        rect.pad(0, (MINSIZE - rect.height) / 2);
                    }
                    rect.pad(4); // pad a bit more

                    container.hitArea = rect;
                }
            };

            const updateHalo = () => {
                const showHover = (visible && hovered);
                const showHighlight = (visible && highlighted);
                const showSelect = (visible && selected);

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

                if (showSelect && layerRef.current) {
                    console.log("show select")
                    if (!haloRef.current) {
                        haloRef.current = new PIXIGraphics();
                        layerRef.current.addChild(haloRef.current);
                    }

                    const HALO_STYLE = {
                        alpha: 0.9,
                        dash: [6, 3],
                        width: 3,   // px
                        color: 0xff0000
                    };

                    haloRef.current.clear();

                    const shape = container.hitArea;
                    if (shape instanceof PIXICircle) {
                        new DashLine(haloRef.current, HALO_STYLE).drawCircle(shape.x + position.x, shape.y + position.y, shape.radius, 20);
                        console.log(haloRef.current)
                    } else if (shape instanceof PIXIRectangle) {
                        new DashLine(haloRef.current, HALO_STYLE).drawRect(shape.x + position.x, shape.y + position.y, shape.width, shape.height);
                    }
                } else {
                    if (haloRef.current) {
                        haloRef.current.destroy({ children: true });
                        haloRef.current = null;
                    }
                }
            }

            updateHitbox();
            updateHalo();
        }

    }, [zoom, highlighted, hovered, visible, display, selected, layerRef, position]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const updateStyle = () => {
                if (zoom < 16) {  // Hide container and everything under it
                    //setStatusVisible(false)
                } else if (zoom < 17) {  // Markers drawn but smaller
                    //setStatusVisible(true)
                    container.scale.set(0.8, 0.8);
                } else {  // z >= 17 - Show the requested marker (circles OR pins)
                    //setStatusVisible(true)
                    container.scale.set(1, 1);
                }
            }
            updateStyle()
        }
    }, [zoom])
    if (zoom < 16) {
        return null;
    }
    return (<Container
        {...containerProps}
        position={position}
        visible={visible}
        ref={containerRef}
    >
        <Sprite
            eventMode="none"
            sortableChildren={false}
            visible={true}
            texture={display === "dot" ? circleTexture : locationPinTexture}
            anchor={display === "dot" ? { x: 0.5, y: 0.5 } : { x: 0.5, y: 1 }}
            width={busStop ? 16 : 8}
            height={busStop ? 16 : 8}
        />
        {busStop && <Sprite
            eventMode="none"
            texture={busStopTexture}
            anchor={display === "dot" ? { x: 0.5, y: 0.5 } : { x: 0.5, y: 1 }}
            width={11}
            height={11}
        />}

    </Container>)
}

export default Point;