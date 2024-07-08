import { AbstractLayer } from "./AbstructLayer";

export class InfoLayer extends AbstractLayer {
    /**
     * 信息图层，用于显示地图元信息，比如比例尺。
     * 
     * @param {import("pixi.js").Application} scene 
     */
    constructor(scene) {
        super(scene)
    }
}