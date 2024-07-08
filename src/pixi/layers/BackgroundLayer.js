import { AbstractLayer } from "./AbstructLayer";

export class BackgroundLayer extends AbstractLayer {
    /**
     * 背景图层，用于根据当前画面中心经纬度和缩放比例渲染 image tiles 背景。
     * 
     * @param {import("pixi.js").Application} scene 
     */
    constructor(scene) {
        super(scene)
    }
}