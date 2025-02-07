import { BaseContext, StoreType } from "../../../../../type/stateMachine/baseEvent";
import { CommonStateEvent } from "../../../../../type/stateMachine/commonEdit";
import { PointerWithOSMEvent } from "../../../../../type/stateMachine/commonEdit/componentEvent";
import { PointPixel, PointWGS84 } from "../../../../../utils/geo/types";
import { BaseStateMachine, StateItem } from "../../state";
import { getWGS84LocateByPixel } from "../../../../../utils/geo/mapProjection";
import { PointerOnMapViewEvent } from "../../../../../type/stateMachine/commonEdit/mapViewEvent";

interface MapViewStateContext extends BaseContext {
  startPoint?: PointPixel;
  viewpointBeforeDrag?: PointWGS84;
}

export class MapViewStateMachine extends BaseStateMachine<CommonStateEvent, MapViewStateContext> {
  idle: StateItem<CommonStateEvent>;
  mapDrag: StateItem<CommonStateEvent>;

  constructor(store: StoreType) {
    super(store);
    this.idle = new StateItem("mapview-idle");
    this.mapDrag = new StateItem("mapview-mapDrag");

    // 设置初始状态为 idle
    this.entry = this.idle;
    this.current = this.idle;
    this.accept = [this.idle];

    // 空闲 → 空闲：当滚轮滚动，zoom
    this.idle.appendNext(this.idle, {
      transform: (event) => {
        const context = this.context;
        if (event.type === 'wheel') {
          // wheel roll, zoom in or out
          const axis = (event as React.WheelEvent<HTMLCanvasElement>).deltaY < 0;
          const { zoom, setZoom } = context.store.view.getState()
          const newZoom = zoom + (axis ? 1 : -1);
          const settings = context.store.settings.getState()
          if (newZoom >= 0 && newZoom <= settings.view.MAX_ZOOM) {
            setZoom(newZoom)
          }
          return true
        }
        return false;
      }
    })

    // 空闲 → 拖拽：当 pointerdown 且不在组件上且没有按 shift 时进入拖拽状态
    this.idle.appendNext(this.mapDrag, {
      transform: (event) => {
        const context = this.context;
        if ((event as PointerWithOSMEvent).componentTarget) {
          return false;
        }
        if (event.type === "pointerdown" && !event.shiftKey) {
          const { clientX, clientY } = event as PointerOnMapViewEvent;
          context.startPoint = { x: clientX, y: clientY };
          // 保存拖拽开始前的视点
          context.viewpointBeforeDrag = context.store.view.getState().viewpoint;
          console.log("MapViewStateMachine: 开始地图拖拽", context.startPoint);
          return true;
        }
        return false;
      },
    });

    this.mapDrag.appendNext(this.mapDrag, {
      transform: (event) => {
        const context = this.context;
        if (event.type === 'pointermove') {
          const { clientX, clientY } = event as PointerOnMapViewEvent;
          const [x, y] = [clientX, clientY];
          if (typeof context.startPoint?.x !== "number" || typeof context.startPoint?.y !== "number") {
            throw new Error(`context.startPoint.x must be number when map drag`)
          }
          const [deltax, deltay] = [context.startPoint.x - x, context.startPoint.y - y];
          console.log('moving to', deltax, deltay);
          const { zoom, setViewpoint, width: _w, height: _h } = context.store.view.getState()
          const width = _w!, height = _h!;
          const vnb = context.viewpointBeforeDrag!;
          const vn = getWGS84LocateByPixel({ x: deltax + width / 2, y: deltay + height / 2 }, vnb, zoom, width, height);
          setViewpoint(vn);
          return true;
        }
        return false;
      }
    })

    // 拖拽 → 空闲：当 pointerup 或 pointerupoutside 时结束拖拽
    this.mapDrag.appendNext(this.idle, {
      transform: (event) => {
        const context = this.context;
        if (event.type === 'pointerup' || event.type === 'pointerupoutside') {
          context.startPoint = undefined
          context.viewpointBeforeDrag = undefined
          // request map data
          const { viewpoint, zoom, width: _w, height: _h } = context.store.view.getState();
          const width = _w!, height = _h!;
          const { loadbbox } = context.store.meta.getState();
          const settings = context.store.settings.getState();
          loadbbox({ width, height, zoom, viewpoint }, settings.osmAPI.BASEURL)
          return true;
        }
        return false;
      },
    });
  }
}
