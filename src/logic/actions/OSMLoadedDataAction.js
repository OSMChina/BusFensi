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
    const { left, bottom, right, top } = getBoundsByScene(viewpoint, zoom, width, height);
    /** @type {(obj: import('../../api/osm/type').OSMV06BBoxObj) => Boolean} */
    const valid = obj => {
        obj.osm.bounds["@_minlon"] <= left
            && obj.osm.bounds["@_minlat"] <= bottom
            && obj.osm.bounds["@_maxlon"] >= right
            && obj.osm.bounds["@_maxlat"] >= top
    }
    // 如果不包含当前区域，则直接请求 bbox。
    if (!state.view.bboxs.some(valid)) {
        const bboxobj = await bbox(settings.osmAPI.baseurl, left, bottom, right, top);
        return bboxobj
    } else {
        // 如果存在包含当前区域的 bbox，那么请求该 bbox 的 changeset
        // 当然，现在我们假设它没有更新，所以不管了，毕竟元素都已经渲染了
        return {}
    }
}

export class OSMLoadDataAction extends AbstractAction {
    /**
     * 
     * @param {import('../../pixi/layers/EditableLayer')} layer 
     * @param {import('../../api/osm/type').OSMV06BBoxObj} data - remember to get it from loadbbox func
     */
    constructor(layer, data) {
        super();
        this.layer = layer;
        this.isBbox = true // assuming it is 
        this.data = data;
        this.type = 'osm-load-data';
    }
    do(state) {
        if (this.isBbox) {
            this._redo = { view: {
                bbox: [...state.view.bbox, this.data]
            } };
            this._undo = deepReverseDiff(state, this._redo);
            this._state = state;
            deepMerge(this._state, this._redo);
        } else {
            throw new Error('OSM differed loading is not implimented.')
        }
    }
    redo() {
        deepMerge(this._state, this._redo)
        // then call layer to update point
    }
    undo() {
        deepMerge(this._state, this._undo)
        // then call layer to update point
    }
}