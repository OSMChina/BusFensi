import { AbstractComponent } from "./AbstructComponent";

export class BackgroundTile extends AbstractComponent {
    /**
     * 地图 tile 组件，在图层上渲染一小块地图
     * 
     * @param {import("../layers/AbstructLayer").AbstractLayer} layer - pixi scene object
     * @param {String} id 
     * @param {String} source - a format string for tile source
     * @param {Number} zoom - a number of zoom level
     * @param {Number} x - 当前 zoom 在地图分割后的 x, 不是坐标
     * @param {Number} y - 当前 zoom 在地图分割后的 y, 不是坐标
     */
    constructor(layer, id, source, zoom, x, y) {
        super(layer, id)
        this.source = source
        this.zoom = zoom
    }
}