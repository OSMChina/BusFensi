import { deepMerge, deepReverseDiff } from "../../utils/helper/object";
import { AbstractAction } from "./AbstractAction";
import { getBoundsByScene } from "../../utils/geo/mapProjection";
import { bbox } from "../../api/osm/apiv0.6";
import { settings } from "../settings/settings";

/**
 * 
 * @param {import('./type').DataState} state 
 * @param {import('../../utils/geo/types').PointWGS84} viewpoint 
 * @param {Number} zoom 
 * @param {Number} width 
 * @param {Number} height 
 * @returns {Promise<import('../../api/osm/type').OSMV06BBoxObj>}
 */
export async function loadBBox(state, viewpoint, zoom, width, height) {
    const V = 0.0000001;

    const { left, bottom, right, top } = getBoundsByScene(viewpoint, zoom, width, height);
    /** @type {(obj: import('../../api/osm/type').OSMV06BBoxObj) => Boolean} */

    const valid = obj => {
        return obj.osm.bounds["@_minlon"] <= left + V
            && obj.osm.bounds["@_minlat"] <= bottom + V
            && obj.osm.bounds["@_maxlon"] >= right - V
            && obj.osm.bounds["@_maxlat"] >= top - V
    }
    // 如果不包含当前区域，则直接请求 bbox。
    if (!state.view.bboxs.some(valid)) {
        console.log(`osm load data, faild to get cache: ${left} ${bottom} ${right} ${top}`, viewpoint, zoom)
        console.log("state bboxs", state.view.bboxs)       
        const bboxobj = await bbox(settings.osmAPI.BASEURL, left, bottom, right, top);
        return bboxobj
    } else {
        // 如果存在包含当前区域的 bbox，那么请求该 bbox 的 changeset
        // 当然，现在我们假设它没有更新，所以不管了，毕竟元素都已经渲染了
        console.log('requested bbox is already cached')
        return {}
    }
}

export class OSMLoadDataAction extends AbstractAction {
    /**
     * 
     * @param {import('../states/type').Layers} layers
     * @param {import('../../api/osm/type').OSMV06BBoxObj} data - remember to get it from loadbbox func
     */
    constructor(layers, data) {
        super();
        /** @type {import('../states/type').Layers} */
        this.layers = layers;
        this.isBbox = true // assuming it is 
        this.data = data;
        this.type = 'osm-load-data';
    }
    do(state) {
        if (this.isBbox) {
            this._redo = { view: {
                bboxs: [...state.view.bboxs, this.data]
            } };
            this._undo = deepReverseDiff(state, this._redo);
            this._state = state;
            deepMerge(this._state, this._redo);
            this.appendBbox()
        } else {
            throw new Error('OSM differed loading is not implimented.')
        }
    }
    redo() {
        deepMerge(this._state, this._redo)
        // then call layer to update point
        this.appendBbox()
    }
    undo() {
        deepMerge(this._state, this._undo)
        // then call layer to update point
        this.layers.editableLayer.removeBbox()
    }
    appendBbox() {
        this.layers.editableLayer.appendBbox(this.data)
    }
    
}