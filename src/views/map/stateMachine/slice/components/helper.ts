import { FeatureRefObj } from "../../../../../type/osm/refobj"
import { BaseContext } from "../../../../../type/stateMachine/baseEvent"
import { getWGS84LocateByPixel, getPixelByWGS84Locate } from "../../../../../utils/geo/mapProjection"
export interface ComponentStateContext extends BaseContext {
  componentTarget?: FeatureRefObj
}
export function getLocalPosistion(x: number, y: number, context: BaseContext): { x: number, y: number } {
  const { stage } = context.store.view.getState()
  const rect = stage!.view.getBoundingClientRect!();
  const canvasX = x - rect.x;
  const canvasY = y - rect.y;
  console.debug("getLocalPosistion, x y", x, y, " convert to ", canvasX, canvasY)
  return {
    x: canvasX,
    y: canvasY
  }
}

export const doComponentDragging = (x: number, y: number, context: ComponentStateContext): void => {
  const { height, width, viewpoint, zoom, stage } = context.store.view.getState()
  if (!height || !width || !stage) { return }
  const rect = stage.view.getBoundingClientRect!();
  const canvasX = x - rect.x;
  const canvasY = y - rect.y;
  const { modifyFeatureMetaNC } = context.store.meta.getState()
  const location = getWGS84LocateByPixel({ x: canvasX, y: canvasY }, viewpoint, zoom, width, height);
  const newpixPoint = getPixelByWGS84Locate(location, viewpoint, zoom, width, height);
  console.log("on component drag", { x: x, y: y }, { x: canvasX, y: canvasY }, newpixPoint)
  if (context.componentTarget?.id && context.componentTarget.type === "node") {
    const { type, id } = context.componentTarget
    modifyFeatureMetaNC(type, id, feature => { feature["@_lon"] = location.lon; feature["@_lat"] = location.lat })
  } else {
    throw new Error(`context.componentTarget should not be ${JSON.stringify(context.componentTarget)} at point move`)
  }
};
