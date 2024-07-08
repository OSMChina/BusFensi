import { AbstractLayer } from "./AbstructLayer";

export class EditableLayer extends AbstractLayer {
    /**
     * 编辑图层，渲染道路信息和公交站点信息，以及对应的线路信息。这个图层当中的元素可以允许用户编辑
     * 
     * @param {import("pixi.js").Application} scene 
     */
    constructor(scene) {
        super(scene)
    }
}