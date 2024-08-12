import { Container } from "@pixi/react";
import useBearStoreWithUndo from "../../logic/model/store";
import { settings } from "../../logic/settings/settings";
import { DEFAULT_TILE_SIZE } from "../../utils/geo/constants";
import { convertWGS84ToAbsolutePixel } from "../../utils/geo/mapProjection";
import BackgourndTile from "../components/BackgroundTile";


function BackgroundLayer({ width, height }:{
    width: number,
    height: number
}) {
    const viewpoint = useBearStoreWithUndo(state => state.viewpoint)
    const zoom = useBearStoreWithUndo(state => state.zoom);
    const { x: xabs, y: yabs } = convertWGS84ToAbsolutePixel(viewpoint, zoom)
    const [
        xTileMin,
        yTileMin,
        xTileMax,
        yTileMax
    ] = [
        xabs - (width >> 1),
        yabs - (height >> 1),
        xabs + (width >> 1),
        yabs + (height >> 1)
    ].map(a => Math.floor(a / DEFAULT_TILE_SIZE));

    const backgrounds = [];
    for (let x = xTileMin; x <= xTileMax; x++) {
      for (let y = yTileMin; y <= yTileMax; y++) {
        backgrounds.push(<BackgourndTile source={settings.osmAPI.TILE_SOURCE} x={x} y={y} zoom={zoom} width={width} height={height} />);
      }
    }

    return <Container>
        {...backgrounds}
    </Container>
}

export default BackgroundLayer;