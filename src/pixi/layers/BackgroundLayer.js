import { AbstractLayer } from "./AbstructLayer";
import { Container } from "pixi.js";
import { DEFAULT_TILE_SIZE } from "../../utils/geo/constants";
import { convertWGS84ToAbsolutePixel } from "../../utils/geo/mapProjection";
import { BackgroundTile } from '../components/BackgroundTile'
import { settings } from "../../logic/settings/settings";
const TILE_SOURCE = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export class BackgroundLayer extends AbstractLayer {
    /**
     * 背景图层，用于根据当前画面中心经纬度和缩放比例渲染 image tiles 背景。
     * 
     * @param {import("pixi.js").Application} scene 
     */
    constructor(scene) {
        super(scene)
        /** @type {String} */
        this.source = TILE_SOURCE;
        /** @type {Container} */
        this.container = new Container();
        this.scene.stage.addChild(this.container);
        /** @type {Array<Array<Array<BackgroundTile>>>} */
        this.tiles = [];
    }

    /**
     * 
     * 在更新当前位置的时候，应当先进行移动，再去申请新的
     * 
     * @param {import('../../utils/geo/types').PointWGS84} viewpoint 
     */
    updateViewpoint(viewpoint) {
        this.viewpoint = viewpoint
        this.update()
    }

    /**
     * 
     * @param {Number} zoom 
     */
    updateZoom(zoom) {
        this.zoom = zoom
        this.update()
    }

    update() {
        console.log("rendering Background")
        const { x: xabs, y: yabs } = convertWGS84ToAbsolutePixel(this.viewpoint, this.zoom);
        const canvas = this.scene.canvas;
        const [
            xTileMin,
            yTileMin,
            xTileMax,
            yTileMax
        ] = [
            xabs - (canvas.width >> 1),
            yabs - (canvas.height >> 1),
            xabs + (canvas.width >> 1),
            yabs + (canvas.height >> 1)
        ].map(a => Math.floor(a / DEFAULT_TILE_SIZE));
        console.log("xyabs", xabs, yabs, "Tiles", xTileMin * DEFAULT_TILE_SIZE, xTileMax * DEFAULT_TILE_SIZE, yTileMin * DEFAULT_TILE_SIZE, yTileMax * DEFAULT_TILE_SIZE)
        if (this.tiles[this.zoom] === undefined) {
            this.tiles[this.zoom] = []
        }
        /** @type {Array<Array<BackgroundTile>>} */
        let tiles = this.tiles[this.zoom]
        for (let x = xTileMin; x <= xTileMax; x++) {
            if (!Array.isArray(tiles[x])) {
                tiles[x] = []
            }
            for (let y = yTileMin; y <= yTileMax; y++) {
                // console.log(`tile-${x}-${y}-${this.zoom}`)
                const tile = new BackgroundTile(this, this.zoom, x, y);
                if (!tiles[x][y]) {
                    tile.init(this.viewpoint);
                    tiles[y] = tile;
                } else {
                    tile.visible = true;
                    tile.updatePosition(this.viewpoint);
                }
            }
        }
        
        for (let  i = 0; i <= settings.view.MAX_ZOOM; i++) {
            if (i !== this.zoom && Array.isArray(this.tiles[i])) {
                this.tiles[i].forEach(item => Array.isArray(item) && item.forEach(tile => tile.visible = false))
            }
        }
    }
}