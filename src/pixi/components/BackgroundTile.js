import { Assets, Sprite } from "pixi.js";
import { AbstractComponent } from "./AbstructComponent";
import { adjustAbsolutePixelToLocal } from "../../utils/geo/mapProjection";

import { DEFAULT_TILE_SIZE } from "../../utils/geo/constants";

/**
 * Function to load a tile with custom User-Agent using fetch API
 * See OSM Tile Usage Policy: https://operations.osmfoundation.org/policies/tiles/
 * 
 * @param {String} source 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} zoom 
 * @returns {string} - object url
 */
function getTileLink(source, x, y, zoom) {
    return source
        .replace('{z}', zoom)
        .replace('{x}', x)
        .replace('{y}', y); 
}

export class BackgroundTile extends AbstractComponent {
    /**
     * 地图 tile 组件，在图层上渲染一小块地图
     * 
     * @param {import("../layers/BackgroundLayer").BackgroundLayer} layer - pixi scene object
     * @param {Number} zoom - a number of zoom level
     * @param {Number} x - 当前 zoom 在地图分割后的 x, 不是坐标
     * @param {Number} y - 当前 zoom 在地图分割后的 y, 不是坐标
     */
    constructor(layer, zoom, x, y) {
        super(layer, -1)
        this.type = "background"
        this.zoom = zoom
        this.x = x
        this.y = y
    }

    async init(viewpoint) {
        const link = getTileLink(this.layer.source, this.x, this.y, this.zoom)
        const texture = await Assets.load(link);
        this.sprite = new Sprite(texture);
        this.container.addChild(this.sprite);
        this.layer.container.addChild(this.container);
        this.updatePosition(viewpoint);
    }

    updatePosition(viewpoint) {
        const absPix = {x: this.x * DEFAULT_TILE_SIZE, y: this.y * DEFAULT_TILE_SIZE}
        const {x, y} = adjustAbsolutePixelToLocal(absPix, viewpoint, this.zoom, this.scene.canvas.width, this.scene.canvas.height);
        this.container.position.set(x, y);
        //console.log("tile", this.id, "absPix", absPix, "viewpoint", viewpoint, "to position", x, y)

    }

}