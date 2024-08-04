import { DEFAULT_VIEWPOINT_WGS84, DEFAULT_ZOOM } from "../../utils/geo/constants";
export class AbstractLayer {
    /**
     * 一个 layer 应该管理一个图层（基本上是PIXI.Container）的状态，而且应该是渲染状态。
     * 从上下文获取信息来更新图层。图层的内容应当是地图的一部分，这意味着图层需要当前视野的中心点
     * 对应的地理位置，地图的缩放比例（比例尺）。
     * 同时，图层还需要当前的画布大小，从 scene 对象的 props 中获取。
     * 
     * 在编辑时应该通过图层暴露的接口来传递数据进行重绘，确保图层表现为 MVC 架构中的 View 层，即不依赖上层实现
     * 
     * @param {import("pixi.js").Application} scene - pixi scene object
     * @param {String} id
     */
    constructor(scene, id) {
        /** @type {import("pixi.js").Application} */
        this.scene = scene;
        /** @type {String} */
        this.id = id;
        /** @type {Number} */
        this.zoom = DEFAULT_ZOOM;
        /** @type {import('../../utils/geo/types').PointWGS84} */
        this.viewpoint = DEFAULT_VIEWPOINT_WGS84
    }

    /**
     * 
     * @param {import('../../utils/geo/types').PointWGS84} viewpoint
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    updateViewpoint(viewpoint) {
        throw new Error("calling abstract function")
    }

    /**
     * 
     * @param {Number} zoom
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    updateZoom(zoom) {
        throw new Error("calling abstract function")
    }

    /**
     * 渲染当前图层。可能会需要一些信息
     * 
     * @abstract
     */
    update() {
        throw new Error("calling abstract function")
    }

    /**
     * 清空当前图层的状态信息。
     * 
     * @abstract
     */
    reset() {
        throw new Error("calling abstract function")
    }
}