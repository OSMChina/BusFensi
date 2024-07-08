import { AbstractComponent } from "./AbstructComponent";

export class Polygon extends AbstractComponent {
    /**
     * 地图 tile 组件，在图层上渲染一小块地图
     * 
     * @param {import("../layers/AbstructLayer").AbstractLayer} layer - pixi scene object
     * @param {String} id 
     * @param {Number} zoom - a number of zoom level
     */
    constructor(layer, id, zoom) {
        super(layer, id)
        this.source = source
        this.zoom = zoom
    }
}