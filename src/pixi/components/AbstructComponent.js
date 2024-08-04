import { Container } from "pixi.js";

export class AbstractComponent {
    /**
     * 地图中的组件。组件是图层中的基本元素。一般来说会通过控制一些 Pixi Graphic 或者 Sprite 对象来渲染元素。
     * 定位类似 DOM Element， 提供的 API 也可以参考
     * 
     * @param {import("../layers/AbstructLayer").AbstractLayer} layer - pixi scene object
     * @param {Number} id 
     */
    constructor(layer, id) {
        /** @type {String} */
        this.type = "abstract"

        /** @type {import("../layers/AbstructLayer").AbstractLayer} */
        this.layer = layer;
        /** @type {import("pixi.js").Application} */
        this.scene = layer.scene;
        /** @type {Number}  -1 means not a osm feature so dont have id */
        this.id = id;

        /** @type {Container} */
        this.container = new Container();

        // propties below
        /** @type {Boolean} */
        this._active = false
        /** @type {Boolean} */
        this._selected = false
        /** @type {Boolean} */
        this._hovered = false;
        /** @type {Boolean} */
        this._highlighted = false;

        /** @type {*} */
        this._style = null;
    }

    /** @returns {Boolean} */
    get visible() {
        return this.container.visible;
    }
    /** @param {Boolean} val  */
    set visible(val) {
        if (val === this.container.visible) return;  // no change
        this.container.visible = val;
        this.updateHalo();
    }

    /** @returns {Boolean} */
    get active() {
        return this._active;
    }
    /** @param {Boolean} val  */
    set active(val) {
        if (val === this._active) return;  // no change
        this._active = val;

        if (this.container) {
            this.container.eventMode = (this._allowInteraction && !this._active) ? 'static' : 'none';
        }
    }

    /** @returns {Boolean} */
    get selected() {
        return this._selected;
    }
    /** @param {Boolean} val  */
    set selected(val) {
        if (val == this._selected) return;
        this._selected = val;
    }

    /** @returns {Boolean} */
    get hovered() {
        return this._hovered;
    }
    /** @param {Boolean} val  */
    set hovered(val) {
        if (val === this._hovered) return;
        this._hovered = val;
    }

    /** @returns {Boolean} */
    get highlighted() {
        return this._highlighted;
    }
    /** @param {Boolean} val  */
    set highlighted(val) {
        if (val === this._highlighted) return;
        this._highlighted = val;
    }

    /** @returns {*} */
    get style() {
        return this._style;
    }
    /** @param {*} obj  */
    set style(obj) {
        this._style = obj;
    }

    /**
     * update
     * Every Feature should have an `update()` function that redraws components.
     * Override in a subclass with needed logic.
     * @param {import('../../utils/geo/types').PointWGS84} viewpoint 
     * @param {Number} zoom 
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    update(viewpoint, zoom) {
        throw new Error("calling abstract function")
    }
    /**
     * destroy the whole ccomponent
     */
    destroy() {
        this.container.destroy()
    }
}