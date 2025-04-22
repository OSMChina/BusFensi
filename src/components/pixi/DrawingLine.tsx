import { Graphics } from "@pixi/react";
import { getPixelByWGS84Locate } from "../../utils/geo/mapProjection";
import { MapState } from "../../store/mapview/initialState";

export default function DisplayDrawingLine({
  drawMode,
  viewpoint,
  zoom,
  width,
  height,
}: Pick<MapState, "drawMode" | "viewpoint" | "zoom" | "width" | "height">) {
  if (!drawMode.fromPos || !drawMode.curPos || !width || !height) return null;

  // Convert WGS84 coordinates to pixel coordinates
  const fromPixel = getPixelByWGS84Locate(
    drawMode.fromPos,
    viewpoint,
    zoom,
    width,
    height
  );
  const toPixel = getPixelByWGS84Locate(
    drawMode.curPos,
    viewpoint,
    zoom,
    width,
    height
  );

  return (
    <Graphics
      draw={(g) => {
        g.clear();
        g.lineStyle(2, 0x2196f3, 0.8); // Blue color with 80% opacity
        g.moveTo(fromPixel.x, fromPixel.y);
        g.lineTo(toPixel.x, toPixel.y);
      }}
    />
  );
}
