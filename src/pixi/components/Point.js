import { AbstractComponent } from "./AbstructComponent";
import { Sprite } from "pixi.js";
import { GlowFilter } from "pixi-filters";
import { getPixelByWGS84Locate } from "../../utils/geo/mapProjection";

export class Point extends AbstractComponent {
    /**
     * 渲染一个 Point，包括 circle 和 pin
     * 
     * @param {import("../layers/AbstractLayer").AbstractLayer} layer - pixi scene object
     * @param {String} id 
     * @param {import('../../utils/geo/types').PointWGS84} locate 
     * @param {import("./types").PointComponentStyle} style - The texture to be used for the point marker
     */
    constructor(layer, id, locate, style) {
        super(layer, id);
        this.zoom = layer.zoom;
        this._locate = locate;
        /** @type {import("./types").PointComponentStyle} */
        this._style = style;

        // Create the marker sprite with the given texture
        this.marker = new Sprite(style.marker[style.display]);
        console.log(`${this.id}`,this.marker)
        this.marker.eventMode = 'none';
        this.marker.sortableChildren = false;
        this.marker.visible = true;

        this.container.addChild(this.marker);

        if (style.icon) {
            this.icon = new Sprite(style.icon);
            this.container.addChild(this.icon);
        }

        layer.container.addChild(this.container)

        this.selected=true
    }
    /**
     * Update the component
     * 
     * @param {import('../../utils/geo/types').PointWGS84} viewpoint 
     * @param {Number} zoom 
     */
    update(viewpoint, zoom) {
        console.log(`updating ${this.id}`)
        this.updatePosition(viewpoint, zoom);
        this.updateStyle(zoom);
        this.updateHalo();
    }

    /**
     * Update the position of the container based on the locate coordinates
     * 
     * @param {import('../../utils/geo/types').PointWGS84} viewpoint 
     * @param {Number} zoom 
     */
    updatePosition(viewpoint, zoom) {
        const { x, y } = getPixelByWGS84Locate(this._locate, viewpoint, zoom, this.scene.canvas.width, this.scene.canvas.height);
        console.log(`Position of ${this.id}`, x, y, ` of viewpoint`, viewpoint, ' zoom ', zoom, ' diff of latlon', this._locate.lat - viewpoint.lat, this._locate.lon - viewpoint.lon, 'canvas', this.scene.canvas.width, this.scene.canvas.height)
        this.container.position.set(x, y);
    }

    /**
     * Update the style.
     * 
     * @param {Number} zoom 
     */
    updateStyle(zoom) {
        if (zoom < 16) {  // Hide container and everything under it
            this.visible = false;
        } else if (zoom < 17) {  // Markers drawn but smaller
            this.lod = 1;  // simplified
            this.visible = true;
            this.container.scale.set(0.8, 0.8);
            if (this.viewfields) {
                this.viewfields.renderable = false;
            }

            // Replace pinlike markers with circles at lower zoom
            this._style.display = 'circle';
            this.marker.texture = this._style.marker.circle;
            this.marker.anchor.set(0.5, 0.5);  // middle, middle
            if (this.icon) this.icon.position.set(0, 0);      // middle, middle
        } else {  // z >= 17 - Show the requested marker (circles OR pins)
            this.lod = 2;  // full
            this.visible = true;
            this.container.scale.set(1, 1);

            if (this._style.type === "pin") {
                this._style.display = 'pin';
                this.marker.texture = this._style.marker.pin;
                this.marker.anchor.set(0.5, 1);    // middle, bottom
                if (this.icon) this.icon.position.set(0, -14);    // mathematically 0,-15 is center of pin, but looks nicer moved down slightly
            } else {
                this._style.display = 'circle';
                this.marker.texture = this._style.marker.circle;
                this.marker.anchor.set(0.5, 0.5);  // middle, middle
                if (this.icon) this.icon.position.set(0, 0);      // middle, middle
            }
        }
    }

    /**
     * updateHalo
     * Show/Hide halo (requires `this.container.hitArea` to be already set up by `updateHitArea` as a supported shape)
     */
    updateHalo() {
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

    /**
     * create or update the hit box
     */
    updateHitbox() {
        if (!this.visible) return;
        // to be implimented
    }

    /** @returns {import('./types').PointComponentStyle} */
    get style() {
        return this._style;
    }
    /** @param {import('./types').PointComponentStyle} obj  */
    set style(obj) {
        this._style = obj;
        this.updateStyle();
    }
}