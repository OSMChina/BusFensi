import { Container } from "@pixi/react";
import { DEFAULT_TILE_SIZE } from "../../../utils/geo/constants";
import { convertWGS84ToAbsolutePixel } from "../../../utils/geo/mapProjection";
import { useSettingsStore } from "../../../store/settings";
import { useMapViewStore } from "../../../store/mapview";
import BackgroundTile from "../../../components/pixi/BackgroundTile";

export function BackgroundLayer(props: { width: number; height: number }) {
    const { width, height } = props;

    // Extract state using hooks (hooks must always be called at the top level)
    const tileSource = useSettingsStore((state) => state.osmAPI.TILE_SOURCE);
    const mapView = useMapViewStore();
    const { viewpoint, zoom } = mapView; // Ensure these values exist

    const generateBackgroundTiles = () => {
        const { x: xabs, y: yabs } = convertWGS84ToAbsolutePixel(viewpoint, zoom);

        const [xTileMin, yTileMin, xTileMax, yTileMax] = [
            xabs - (width >> 1),
            yabs - (height >> 1),
            xabs + (width >> 1),
            yabs + (height >> 1),
        ].map((a) => Math.floor(a / DEFAULT_TILE_SIZE));

        const backgrounds = [];
        for (let x = xTileMin; x <= xTileMax; x++) {
            for (let y = yTileMin; y <= yTileMax; y++) {
                backgrounds.push(
                    <BackgroundTile
                        key={`${x}-${y}`}
                        source={tileSource}
                        x={x}
                        y={y}
                        mapViewStatus={{ ...props, ...mapView }}
                    />
                );
            }
        }
        return backgrounds;
    };

    return <Container>{generateBackgroundTiles()}</Container>;
}
