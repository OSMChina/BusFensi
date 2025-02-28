// see https://wiki.openstreetmap.org/wiki/Zh-hans:%E5%85%AC%E4%BA%A4
// note currently only OSM CN page's preset
import { NodePreset } from "../../../type/osm/presets";

export const busStopPresetCN: NodePreset = {
    tag: [
        {
            '@_k': 'highway',
            '@_v': 'bus_stop',
            importance: "required",
            description: "将该处定义为公交站点。最常用的标签。",
            example: "highway=bus_stop"
        },
        {
            '@_k': 'public_transport',
            '@_v': 'platform',
            importance: "required",
            description: "用于描述该功能是一个公共交通月台，服务于公共交通路线。用于符合ptv2的标签。",
            example: "public_transport=platform"
        },
        {
            '@_k': 'name',
            importance: "required",
            description: "公交站点的名称。",
            example: "name=海口路海游路"
        },
        {
            '@_k': 'bus',
            importance: "required",
            description: "在ptv2中注明这个站点为公交站点。",
            example: "bus=yes"
        },
        {
            '@_k': 'ref',
            importance: "optional",
            description: "公交站点的参考代码。（常用于内部定位和维护）",
            example: "ref=3154"
        },
        {
            '@_k': 'local_ref',
            importance: "recommened",
            description: "公交站点的参考代码。如果公交站台有大量公交车停靠，每个小站点可有独立 local_ref。",
            example: "local_ref=16"
        },
        {
            '@_k': 'network',
            importance: "not-recommened",
            description: "公交站点的网络。可使用全称或缩写，依据附近线路标注情况确定。",
            example: "network=古田公交"
        },
        {
            '@_k': 'operator',
            importance: "not-recommened",
            description: "在公交站点停靠的公交车的运营公司名称。若多家运营，使用分号（;）分隔。",
            example: "operator=济阳舜达公共交通有限公司"
        },
        {
            '@_k': 'shelter',
            importance: "recommened",
            description: "若公交站点提供候车亭则为“yes”，否则为“no”。",
            example: "shelter=no"
        },
        {
            '@_k': 'departures_board',
            importance: "recommened",
            description: "表明公交站点使用的到站显示屏/牌类型。值可为纸质时刻表、实时显示等；departures_board=no 表示无显示屏/牌。",
            example: "departures_board=timetable"
        },
        {
            '@_k': 'bench',
            importance: "recommened",
            description: "若公交站点提供长凳则为“yes”，否则为“no”。",
            example: "bench=yes"
        },
        {
            '@_k': 'bin',
            importance: "recommened",
            description: "若公交站点具备垃圾箱则为“yes”，否则为“no”。",
            example: "bin=no"
        },
        {
            '@_k': 'tactile_paving',
            importance: "recommened",
            description: "若公交站点设有视障引导设施（提示视障人士月台边缘）则为“yes”，否则为“no”。",
            example: "tactile_paving=no"
        },
        {
            '@_k': 'layer',
            importance: "optional",
            description: "适用于多层公交站台。对于非地面公交站点，多层信息是必需的以避免疑问。",
            example: "layer=-1"
        },
        {
            '@_k': 'lit',
            importance: "recommened",
            description: "若公交站点夜间亮灯则为“yes”，否则为“no”。",
            example: "lit=yes"
        },
        {
            '@_k': 'surface',
            importance: "recommened",
            description: "描述公交车站所在的地面。",
            example: "surface=concrete"
        }
    ]
}

export const stopPositionPresetCN: NodePreset = {
    tag: [
        {
            '@_k': 'public_transport',
            '@_v': 'stop_position',
            importance: "required",
            description: "用于描述该功能是一个公共交通停车点。本标签是用于符合ptv2的标签。",
            example: "public_transport=stop_position"
        },
        {
            '@_k': 'name',
            importance: "required",
            description: "公交站点的名称。具体描述见下文补充说明。",
            example: "name=食用菌市场"
        },
        {
            '@_k': 'bus',
            importance: "required",
            description: "在ptv2中注明这个站点为公交站点",
            example: "bus=yes"
        }
    ]
}