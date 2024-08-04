import { AbstractComponent } from "./AbstructComponent";
import { Graphics } from "pixi.js";
import { GlowFilter } from "pixi-filters";
import { getPixelByWGS84Locate } from "../../utils/geo/mapProjection";
import { settings } from "../../logic/settings/settings";
import { deepCopy } from "../../utils/helper/object";

export class Line extends AbstractComponent {
    /**
     * 渲染一条线，注意有宽度和阴影，使用 PIXI Graphic。一条线由一连串的点(path)来表示，
     * 还可以提供线段(segment)的抽象来方便一些逻辑
     * 
     * @param {import("../layers/AbstructLayer").AbstractLayer} layer - pixi scene object
     * @param {import("../../api/osm/type").Way} meta 
     * @param {Array<import("./Point").Point>} path 
     */
    constructor(layer, meta, path) {
        super(layer, meta["@_id"])
        this.type = "line"
        this.zoom = layer.zoom;

        /** @type {Graphics} */
        this.graphics = new Graphics();

        this.graphics.eventMsegmente = 'none';
        this.graphics.sortableChildren = false;
        this.container.addChild(this.graphics);
        
        /** @type {Array<import("./Point").Point>} */
        this.path = path;

        this.container.zIndex = settings.pixiRender.zIndex.LINE;
        layer.container.addChild(this.container);

    }

    /** @returns {{import("../../utils/geo/types").PointWGS84}} */
    get _basePoint() {
        if (this.__basepoint === undefined) {
            this.__basepoint = deepCopy(this.path[0].locate);
        }
        return this.__basepoint;
    }

    /**
     * 
     * @param {import('../../utils/geo/types').PointWGS84} viewpoint 
     * @param {Number} zoom 
     */
    update(viewpoint, zoom) {
        this.pixPath = this.path
            .map(point => {
                const location = point.locate
                return getPixelByWGS84Locate(location, this._basePoint, zoom);
            })
        this.updatePosition(viewpoint, zoom);
        this.updateStyle();
        this.updateHalo();
    }
    /**
     * Update the position of the container based on the locate coordinates
     * act as shift action. 
     * 
     * @param {import('../../utils/geo/types').PointWGS84} viewpoint 
     * @param {Number} zoom 
     */
    updatePosition(viewpoint, zoom) {
        const { x, y } = getPixelByWGS84Locate(this._basePoint, viewpoint, zoom, this.scene.canvas.width, this.scene.canvas.height);
        this.container.position.set(x, y);
        //console.log('base position of ', this.id, x, y)
    }

    /**
     * Upon update style, draw or redraw this component
     * 
     * @param {Number} zoom 
     */
    updateStyle() {
        const pixPath = this.pixPath;
        this.graphics.clear();
        //console.log(`on draw ${this.id}`, pixPath)
        // paint stroke
        this.graphics.moveTo(0, 0);
        pixPath.forEach(pixpoint => {
            this.graphics.lineTo(pixpoint.x, pixpoint.y)
        });
        this.graphics.stroke({ width: 9, color: 0xffd900 })
        // paint fill
        this.graphics.moveTo(0, 0);
        pixPath.forEach(pixpoint => this.graphics.lineTo(pixpoint.x, pixpoint.y));
        this.graphics.stroke({ width: 5, color: 0xff3300 });


    }

    updateHalo() {
        // this is a temporary implyment, will draw halo for each segment in future
        const showHover = (this.visible && this.hovered);
        const showSelect = (this.visible && this.selected);
        const showHighlight = (this.visible && this.highlighted);

        // Hover
        if (showHover) {
            if (!this.container.filters) {
                const glow = new GlowFilter({ distance: 15, outerStrength: 3, color: 0xffff00 });
                glow.resolution = 2;
                this.container.filters = [glow];
            }
        } else if (showHighlight) {
            if (!this.container.filters) {
                const glow = new GlowFilter({ distance: 15, outerStrength: 3, color: 0x7092ff });
                glow.resolution = 2;
                this.container.filters = [glow];
            }
        } else if (showSelect) {
            if (!this.container.filters) {
                const glow = new GlowFilter({ distance: 15, outerStrength: 3, color: 0xffff00 });
                glow.resolution = 2;
                this.container.filters = [glow];
            }
        } else {
            if (this.container.filters) {
                super.container.filters = null;
            }
        }
    }
    updateHitBox() {

    }
}