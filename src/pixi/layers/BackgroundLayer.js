import { AbstractLayer } from "./AbstructLayer";
import { Container } from "pixi.js";
import { DEFAULT_TILE_SIZE } from "../../utils/geo/constants";
import { convertWGS84ToAbsolutePixel } from "../../utils/geo/mapProjection";
import { BackgroundTile } from '../components/BackgroundTile'

export class BackgroundLayer extends AbstractLayer {
    /**
     * 背景图层，用于根据当前画面中心经纬度和缩放比例渲染 image tiles 背景。
     * 
     * @param {import("pixi.js").Application} scene 
     */
    constructor(scene) {
        super(scene)
        /** @type {Container} */
        this.container = new Container();
        this.scene.stage.addChild(this.container);
    }

    render() {
        this.testrender()
    }
    testrender() {
        console.log("rendering Background")
        const ZOOM = 16;
        const viewpoint = {
            lon: 148.4105574,
            lat: 12.4899798
        }

        // now, decide tiles!
        const { x: xabs, y: yabs } = convertWGS84ToAbsolutePixel(viewpoint, ZOOM);
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

        console.log("xyabs", xabs, yabs, "Tiles", xTileMin, xTileMax, yTileMin, yTileMax)
        /** @type {Array<Array<BackgroundTile>>} */
        let tiles =[];
        for (let x = xTileMin; x <= xTileMax; x++) {
            tiles.push([])
            for (let y = yTileMin; y <= yTileMax; y++) {
                console.log(`tile-${x}-${y}-${ZOOM}`)
                const tile = new BackgroundTile(this, `tile-${x}-${y}-${ZOOM}`, ZOOM, x, y);
                tile.init(viewpoint);
                tiles[tiles.length - 1].push(tile);
            }
        }
    }
}