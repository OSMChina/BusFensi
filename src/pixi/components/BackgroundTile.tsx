import { Sprite } from "@pixi/react"
import { DEFAULT_TILE_SIZE } from "../../utils/geo/constants";
import useBearStoreWithUndo from "../../logic/model/store";
import { adjustAbsolutePixelToLocal } from "../../utils/geo/mapProjection";

function getTileLink(source: string, x: number, y: number, zoom: number) {
    return source
        .replace('{z}', String(zoom))
        .replace('{x}', String(x))
        .replace('{y}', String(y));
}

function BackgourndTile({ source, x, y, zoom, width, height }: {
    source: string,
    x: number,
    y: number,
    zoom: number,
    width: number,
    height: number
}) {
    const link = getTileLink(source, x, y, zoom)
    const viewpoint = useBearStoreWithUndo(state => state.viewpoint)
    const absPix = { x: x * DEFAULT_TILE_SIZE, y: y * DEFAULT_TILE_SIZE }
    return <Sprite
        image={link}
        position={adjustAbsolutePixelToLocal(absPix, viewpoint, zoom, width, height)}
    />
}

export default BackgourndTile