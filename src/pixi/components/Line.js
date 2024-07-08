import { AbstractComponent } from "./AbstructComponent";


export class Line extends AbstractComponent {
    /**
     * 渲染一条线，注意有宽度，高亮和阴影，使用 PIXI Graphic
     * 
     * @param {import("../layers/AbstructLayer").AbstractLayer} layer - pixi scene object
     * @param {String} id 
     * @param {Number} zoom - a number of zoom level
     */
    constructor(layer, id, zoom) {
        super(layer, id)
        this.zoom = zoom
    }
}