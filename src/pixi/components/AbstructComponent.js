export class AbstractComponent {
    /**
     * 地图中的组件。组件是图层中的基本元素。一般来说会通过控制一些 Pixi Graphic 或者 Sprite 对象来渲染元素。
     * 
     * @param {import("../layers/AbstructLayer").AbstractLayer} layer - pixi scene object
     * @param {String} id 
     */
    constructor(layer, id) {
        this.layer = layer;
        this.scene = layer.scene
        this.id = id
    }
}