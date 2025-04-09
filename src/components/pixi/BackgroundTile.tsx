import { Sprite } from "@pixi/react"

import { adjustAbsolutePixelToLocal } from "../../utils/geo/mapProjection";
import { MapViewStatus, PointPixel } from "../../utils/geo/types";
import { DEFAULT_TILE_SIZE } from "../../utils/geo/constants";

function getTileLink(source: string, x: number, y: number, zoom: number) {
    return source
        .replace('{z}', String(zoom))
        .replace('{x}', String(x))
        .replace('{y}', String(y));
}

function BackgourndTile({ source, x, y, scale = 1, mapViewStatus: { zoom, width, height, viewpoint } }: {
    source: string,
    x: number,
    y: number,
    scale?: number,
    mapViewStatus: MapViewStatus
}) {
    const zoomIntegerPart = Math.trunc(zoom)
    const link = getTileLink(source, x, y, zoomIntegerPart);
    const absPix: PointPixel = { x: x * DEFAULT_TILE_SIZE * scale, y: y * DEFAULT_TILE_SIZE * scale };
    const position = adjustAbsolutePixelToLocal(absPix, viewpoint, zoom, width, height);

    // + 0.004 to avoid gaps between tiles
    return (<Sprite
        scale={scale + 0.004} 
        image={link}
        position={position}
    />)
}

export default BackgourndTile