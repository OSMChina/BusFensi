import { BaseContext, StoreType } from "../../../../../type/stateMachine/baseEvent";
import { PointerWithOSMEvent } from "../../../../../type/stateMachine/commonEdit/componentEvent";
import { PointPixel, PointWGS84 } from "../../../../../utils/geo/types";
import { BaseStateMachine, StateItem } from "../../state";
import { getWGS84LocateByPixel } from "../../../../../utils/geo/mapProjection";
import { PointerOnMapViewEvent } from "../../../../../type/stateMachine/commonEdit/mapViewEvent";
import { AllStateMachineEvents } from "../../../../../type/stateMachine/allEvents";
import { MOUSE } from "../../../../../utils/mouse/moueBtn";

interface MapViewStateContext extends BaseContext {
  startPoint?: PointPixel;
  viewpointBeforeDrag?: PointWGS84;
}

interface DispatchedEventsHandlers {
  rightClickHandeler: (event: React.MouseEvent<HTMLCanvasElement>) => void
}

export class MapViewStateMachine extends BaseStateMachine<AllStateMachineEvents, MapViewStateContext> {
  idle: StateItem;
  rightMousedown: StateItem;
  mapDrag: StateItem;

  constructor(store: StoreType, handlers?: DispatchedEventsHandlers) {
    super(store);
    this.idle = new StateItem("mapview-idle");
    this.mapDrag = new StateItem("mapview-mapDrag");
    this.rightMousedown = new StateItem("mapview-right-mousedown");

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
          const wheelEvent = event as React.WheelEvent<HTMLCanvasElement>;
          const { zoom, setZoom } = context.store.view.getState()
          const settings = context.store.settings.getState()
          const scrollDelta = wheelEvent.deltaY;
          const zoomFactor = Math.pow(2, -scrollDelta * 0.0002); // Smaller factor for smoother zoom
          const newZoom = zoom * zoomFactor;
  
          // Clamp zoom within bounds
          if (newZoom >= 0 && newZoom < settings.view.MAX_ZOOM + 0.99) {
            setZoom(newZoom);
          }
  
          return true
        }
        return false;
      }
    })

    // 空闲 → 拖拽：当 mousedown 且不在组件上且没有按 shift 时进入拖拽状态
    this.idle.appendNext(this.mapDrag, {
      transform: (event) => {
        const context = this.context;
        if ((event as PointerWithOSMEvent).componentTarget) {
          return false;
        }
        if (event.type === "mousedown" && !event.shiftKey && (event as PointerOnMapViewEvent).button === MOUSE.LEFT) {
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

    this.idle.appendNext(this.rightMousedown, {
      transform: (event) => {
        if ((event as PointerWithOSMEvent).componentTarget) {
          return false;
        }
        if (event.type === "mousedown" && !event.shiftKey && (event as PointerOnMapViewEvent).button === MOUSE.RIGHT) {
          const { clientX, clientY } = event as PointerOnMapViewEvent;
          this.context.startPoint = { x: clientX, y: clientY };
          // 保存拖拽开始前的视点
          this.context.viewpointBeforeDrag = this.context.store.view.getState().viewpoint;
          return true;
        }
        return false;
      }
    })

    this.rightMousedown.appendNext(this.idle, {
      transform: (event) => {
        if (event.type === "mouseup") {
          if (handlers) {
            handlers.rightClickHandeler(event as React.MouseEvent<HTMLCanvasElement>);
          }
          this.context.startPoint = undefined
          this.context.viewpointBeforeDrag = undefined
          return true;
        }
        return false;
      }
    })

    const mapDragTransform = (event: AllStateMachineEvents) => {
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

    this.rightMousedown.appendNext(this.mapDrag, {
      transform: mapDragTransform
    })

    this.mapDrag.appendNext(this.mapDrag, {
      transform: mapDragTransform
    })

    // 拖拽 → 空闲：当 mouseup 或 mouseupoutside 时结束拖拽
    this.mapDrag.appendNext(this.idle, {
      transform: (event) => {
        const context = this.context;
        if (event.type === 'mouseup' || event.type === 'mouseupoutside') {
          context.startPoint = undefined
          context.viewpointBeforeDrag = undefined
          if (context.store.meta.getState().autoload) {
            // request map data
            const { viewpoint, zoom, width: _w, height: _h } = context.store.view.getState();
            const width = _w!, height = _h!;
            const { loadbbox } = context.store.meta.getState();
            const settings = context.store.settings.getState();
            loadbbox({ width, height, zoom, viewpoint }, settings.osmAPI.BASEURL)
          }
          return true;
        }
        return false;
      },
    });
  }
}
