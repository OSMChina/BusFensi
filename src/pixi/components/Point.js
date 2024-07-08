import { AbstractComponent } from "./AbstructComponent";


export class Point extends AbstractComponent {
    /**
     * 渲染一个点。
     * 
     * @param {import("../layers/AbstructLayer").AbstractLayer} layer - pixi scene object
     * @param {String} id 
     * @param {Number} zoom - a number of zoom level
     * @param {Number} x - EPSG:3857
     * @param {Number} y - EPSG:3857
     */
    constructor(layer, id, zoom, x, y) {
        super(layer, id)
        this.zoom = zoom
        this.x = x
        this.y = y
    }
}