import { Sprite } from "@pixi/react"

import { adjustAbsolutePixelToLocal } from "../../utils/geo/mapProjection";
import { PointPixel, PointWGS84 } from "../../utils/geo/types";
import { DEFAULT_TILE_SIZE } from "../../utils/geo/constants";

function getTileLink(source: string, x: number, y: number, zoom: number) {
    return source
        .replace('{z}', String(zoom))
        .replace('{x}', String(x))
        .replace('{y}', String(y));
}

function BackgourndTile({ source, x, y, zoom, width, height, viewpoint }: {
    source: string,
    x: number,
    y: number,
    viewpoint: PointWGS84,
    zoom: number,
    width: number,
    height: number
}) {
    const link = getTileLink(source, x, y, zoom);
    const absPix: PointPixel = { x: x * DEFAULT_TILE_SIZE, y: y * DEFAULT_TILE_SIZE };
    const position = adjustAbsolutePixelToLocal(absPix, viewpoint, zoom, width, height);
    return (<Sprite
        image={link}
        position={position}
    />)
}

export default BackgourndTile