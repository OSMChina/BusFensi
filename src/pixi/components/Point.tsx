import { Container, Sprite } from "@pixi/react";
import useBearStoreWithUndo from "../../logic/model/store"
import { stateMachine } from "../../logic/states/stateMachine";
import { busStopTexture, circleTexture, locationPinTexture } from "../textures";
import { settings } from "../../logic/settings/settings";
import { getPixelByWGS84Locate } from "../../utils/geo/mapProjection";
import { GlowFilter } from "pixi-filters";
import { useEffect, useRef } from "react";
import { Container as PIXIContainer, Circle as PIXICircle } from "pixi.js";
import { useShallow } from "zustand/react/shallow";
import { isBusStop } from "../../utils/osm/nodeType";
import { T2Arr } from "../../utils/helper/object";

function Point(
    { idStr, width, height }: {
        idStr: string,
        width: number,
        height: number
    }) {
    const PIXIComponentVisibleNoCommit = useBearStoreWithUndo((state) => state.PIXIComponentVisibleNoCommit)
    const viewpoint = useBearStoreWithUndo((state) => state.viewpoint)
    const zoom = useBearStoreWithUndo((state) => state.zoom)
    const node = useBearStoreWithUndo((state) => state.renderedOSMFeatureMeta.nodes[idStr])
    const { visible, hovered, selected, highlighted } = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState.nodes[idStr]));

    const busStop = isBusStop(T2Arr(node.tag))
    const typeDisplay: "dot" | "pin" = "dot"
    const display = (typeDisplay !== "dot" && zoom >= 17) ? "pin" : "dot";
    const containerRef = useRef<PIXIContainer>(null)

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

            updateHitbox();
            updateHalo();
        }
    }, [zoom, highlighted, hovered, selected, visible, display]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {

            const updateStyle = () => {
                if (zoom < 16) {  // Hide container and everything under it
                    PIXIComponentVisibleNoCommit("node", idStr, false)
                } else if (zoom < 17) {  // Markers drawn but smaller
                    PIXIComponentVisibleNoCommit("node", idStr, true)
                    container.scale.set(0.8, 0.8);
                } else {  // z >= 17 - Show the requested marker (circles OR pins)
                    PIXIComponentVisibleNoCommit("node", idStr, true)
                    container.scale.set(1, 1);
                }
            }

            updateStyle()
        }
    }, [PIXIComponentVisibleNoCommit, zoom, containerRef, idStr])

    return (visible && <Container
        zIndex={settings.pixiRender.zIndex.POINT}
        eventMode="static"
        pointerdown={(event) => {
            stateMachine.hookPIXIComponent(event, idStr, "node")
        }}
        pointerup={(event) => {
            stateMachine.hookPIXIComponent(event, idStr, "node")
        }}
        pointerover={(event) => {
            stateMachine.hookPIXIComponent(event, idStr, "node")
        }}
        pointerout={(event) => {
            stateMachine.hookPIXIComponent(event, idStr, "node")
        }}
        position={getPixelByWGS84Locate(
            { lon: node["@_lon"], lat: node["@_lat"] },
            viewpoint,
            zoom,
            width,
            height
        )}
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
        />
        }

    </Container>)
}

export default Point;