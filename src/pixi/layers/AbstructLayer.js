
export class AbstractLayer {
    /**
     * 一个 layer 应该管理一个图层（基本上是PIXI.Container）的状态，而且应该是渲染状态，从上下文获取信息来更新图层。图层应当是地图的一部分。
     * 
     * @param {import("pixi.js").Application} scene - pixi scene object
     * @param {String} id
     */
    constructor(scene, id) {
        this.scene = scene;
        this.id = id;
    }
}