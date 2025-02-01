import { bbox } from "../../../../api/osm/apiv0.6";
import { OSMV06BBoxObj } from "../../../../type/osm/meta";
import { getBoundsByScene } from "../../../../utils/geo/mapProjection";
import { MapViewStatus } from "../../../../utils/geo/types";

export async function loadBBox(
    bboxs: OSMV06BBoxObj[],
    { viewpoint, zoom, width, height }: MapViewStatus,
    baseurl: string 
): Promise<OSMV06BBoxObj | null> {
    const V = 0.0000001;
    const { left, bottom, right, top } = getBoundsByScene(viewpoint, zoom, width, height);
    const valid = (obj: OSMV06BBoxObj): boolean => {
        return obj.osm.bounds["@_minlon"] <= left + V
            && obj.osm.bounds["@_minlat"] <= bottom + V
            && obj.osm.bounds["@_maxlon"] >= right - V
            && obj.osm.bounds["@_maxlat"] >= top - V
    }
    // 如果不包含当前区域，则直接请求 bbox。
    if (!bboxs.some(valid)) {
        console.log(`osm load data, faild to get cache: ${left} ${bottom} ${right} ${top}`, viewpoint, zoom)
        console.log("state bboxs", bboxs)
        const bboxobj = await bbox(baseurl, left, bottom, right, top);
        return bboxobj
    } else {
        // 如果存在包含当前区域的 bbox，那么请求该 bbox 的 changeset
        // 当然，现在我们假设它没有更新，所以不管了，毕竟元素都已经渲染了,搞不好还被修改了，所以，直接 null
        console.log('requested bbox is already cached')
        return null
    }
}
