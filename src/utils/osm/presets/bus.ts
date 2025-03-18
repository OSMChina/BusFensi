// see https://wiki.openstreetmap.org/wiki/Zh-hans:%E5%85%AC%E4%BA%A4
// note currently only OSM CN page's preset
import { FeaturePreset } from "../../../type/osm/presets";

export const busStopPresetCN: FeaturePreset = {
    tag: [
        {
            '@_k': 'highway',
            '@_v': 'bus_stop',
            importance: "required",
            description: "将该处定义为公交站点。最常用的标签。",
            example: "bus_stop"
        },
        {
            '@_k': 'public_transport',
            '@_v': 'platform',
            importance: "required",
            description: "用于描述该功能是一个公共交通月台，服务于公共交通路线。用于符合ptv2的标签。",
            example: "platform"
        },
        {
            '@_k': 'name',
            importance: "required",
            description: "公交站点的名称。",
            example: "海口路海游路"
        },
        {
            '@_k': 'name:zh',
            importance: "recommened",
            description: "公交站点的名称。(中文)",
            example: "海口路海游路"
        },
        {
            '@_k': 'bus',
            importance: "required",
            description: "在ptv2中注明这个站点为公交站点。",
            example: "yes"
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
            example: "16"
        },
        {
            '@_k': 'network',
            importance: "not-recommened",
            description: "公交站点的网络。可使用全称或缩写，依据附近线路标注情况确定。",
            example: "古田公交"
        },
        {
            '@_k': 'operator',
            importance: "not-recommened",
            description: "在公交站点停靠的公交车的运营公司名称。若多家运营，使用分号（;）分隔。",
            example: "济阳舜达公共交通有限公司"
        },
        {
            '@_k': 'shelter',
            importance: "recommened",
            description: "若公交站点提供候车亭则为“yes”，否则为“no”。",
            example: "no"
        },
        {
            '@_k': 'departures_board',
            importance: "recommened",
            description: "表明公交站点使用的到站显示屏/牌类型。值可为纸质时刻表、实时显示等；departures_board=no 表示无显示屏/牌。",
            example: "timetable"
        },
        {
            '@_k': 'bench',
            importance: "recommened",
            description: "若公交站点提供长凳则为“yes”，否则为“no”。",
            example: "yes"
        },
        {
            '@_k': 'bin',
            importance: "recommened",
            description: "若公交站点具备垃圾箱则为“yes”，否则为“no”。",
            example: "no"
        },
        {
            '@_k': 'tactile_paving',
            importance: "recommened",
            description: "若公交站点设有视障引导设施（提示视障人士月台边缘）则为“yes”，否则为“no”。",
            example: "no"
        },
        {
            '@_k': 'layer',
            importance: "optional",
            description: "适用于多层公交站台。对于非地面公交站点，多层信息是必需的以避免疑问。",
            example: "-1"
        },
        {
            '@_k': 'lit',
            importance: "recommened",
            description: "若公交站点夜间亮灯则为“yes”，否则为“no”。",
            example: "yes"
        },
        {
            '@_k': 'surface',
            importance: "recommened",
            description: "描述公交车站所在的地面。",
            example: "concrete"
        }
    ]
}

export const stopPositionPresetCN: FeaturePreset = {
    tag: [
        {
            '@_k': 'public_transport',
            '@_v': 'stop_position',
            importance: "required",
            description: "用于描述该功能是一个公共交通停车点。本标签是用于符合ptv2的标签。",
            example: "stop_position"
        },
        {
            '@_k': 'name',
            importance: "required",
            description: "公交站点的名称。具体描述见下文补充说明。",
            example: "食用菌市场"
        },
        {
            '@_k': 'name:zh',
            importance: "recommened",
            description: "公交站点的名称(中文)。具体描述见下文补充说明。",
            example: "食用菌市场"
        },
        {
            '@_k': 'bus',
            importance: "required",
            description: "在ptv2中注明这个站点为公交站点",
            example: "yes"
        }
    ]
}

export const stopAreaPresetCN: FeaturePreset = {
    tag: [
        {
            '@_k': 'public_transport',
            '@_v': 'stop_area',
            importance: "required",
            description: "用于描述该功能是一个停车区关系。本标签是用于符合ptv2的标签。",
            example: "stop_position"
        },
        {
            '@_k': 'name',
            importance: "required",
            description: "该站组的名称，使用主名称或推广名称，即指向同一位置的同名分站台合并于此关系中",
            example: "经十路舜耕路"
        },
        {
            '@_k': 'name:zh',
            importance: "recommened",
            description: "该站组的名称(中文)，使用主名称或推广名称，即指向同一位置的同名分站台合并于此关系中",
            example: "经十路舜耕路"
        },
        {
            '@_k': 'type',
            importance: "required",
            description: "",
            '@_v': "public_transport"
        }
    ]
}


export const routePresetCN: FeaturePreset = {
    tag: [
        // Row 1: type=route
        {
            '@_k': 'type',
            '@_v': 'route',
            importance: 'required',
            description: '将该关系定义为一条线路。',
            example: 'route'
        },
        // Row 2: Two entries for route=bus and route=trolleybus
        {
            '@_k': 'route',
            importance: 'required',
            description: '将该关系线路设为一条公交/有轨电车线路。(bus/trolleybus)',
            example: 'bus'
        },
        // Row 3: ref=*
        {
            '@_k': 'ref',
            '@_v': '*',
            importance: 'required',
            description:
                '线路编号，建议使用电显、站牌或公交官网给出的名称；建议在同一城市内，区县公交在前缀中体现区县名称，如：章丘4（未注明）、番1（已注明',
            example: '番1'
        },
        // Row 4: public_transport:version=2
        {
            '@_k': 'public_transport:version',
            '@_v': '2',
            importance: 'recommened',
            description:
                '此标签对 OSM 交通数据的用户十分有用，此标签可以让用户知道线路是根据新系统 PTv2 添加。此标签可使分析和验证更加容易。',
            example: '2'
        },
        // Row 5: operator=*
        {
            '@_k': 'operator',
            importance: 'recommened',
            description:
                '营运该线路公交公司或车队的名称。请使用规范的企业名称；若多家公司共同运营，请在两家公司之间加上“;”。',
            example: '上海松江公共交通有限公司'
        },
        // Row 6: network=*
        {
            '@_k': 'network',
            importance: 'required',
            description: '该线路所属的网络，使用该网络关系相同的名称',
            example: '黔江公交'
        },
        // Row 7: opening_hours=*
        {
            '@_k': 'opening_hours',
            importance: 'recommened',
            description:
                '公交路线的运营时间，包含首班车和末班车发车时间，登记应使用英文两字母式星期标记，并采用24小时制。',
            example:
                'Jan 1-May 31 06:00-21:45; Jun 1-Oct 7 06:00-22:15; Oct 8-Dec 31 06:00-21:45'
        },
        // Row 8: interval=*
        {
            '@_k': 'interval',
            importance: 'recommened',
            description:
                '公交车途径任意站点到达时的间隔时间，也称为发车间隔。格式可为 HH:MM:SS, H:MM:SS, HH:MM, H:MM, MM 或 M。',
            example: '00:06:30'
        },
        // Row 9: duration=*
        {
            '@_k': 'duration',
            importance: 'recommened',
            description:
                '公交线路的持续时间，从发车到抵达终点。格式为 HH:MM:SS, H:MM:SS, HH:MM, H:MM, MM 或 M。',
            example: '00:31'
        },
        // Row 10: fee=*
        {
            '@_k': 'fee',
            importance: 'recommened',
            description:
                '如果乘坐该公交需支付费用则为“yes”，选填 charge 说明乘车费用；若无需支付费用则为“no”。',
            example: 'yes+charge=3.00 CNY'
        },
        // Row 11: payment=*
        {
            '@_k': 'payment',
            importance: 'recommened',
            description:
                '详细列表请见：支付方式，常用的有 payment:cash, payment:coins, payment:ic, payment:unionpay, payment:city_union, payment:china_t-union, payment:e-cny, payment:alipay, payment:wechat, payment:mipay, payment:samsung_pay, payment:huawei_pay, payment:apple_pay。',
            example: ''
        },
        // Row 12: bicycle=*
        {
            '@_k': 'bicycle',
            importance: 'recommened',
            description: '如果该公交允许携带自行车乘车则为“yes”。',
            example: 'yes'
        },
        // Row 13: wheelchair=*
        {
            '@_k': 'wheelchair',
            importance: 'recommened',
            description:
                "如果允许使用轮椅的乘客或携带轮椅的乘客上车，请标记为 'yes'；否则标记为 'no'。",
            example: 'yes'
        },
        // Row 14: from=*
        {
            '@_k': 'from',
            importance: 'required',
            description: '公交车发车方向的位置名称，不一定是公交车站的名称。',
            example: '通常汽渡'
        },
        // Row 15: via=*
        {
            '@_k': 'via',
            importance: 'optional',
            description: '在双向环线或起终点名称相同的线路中注明中间站点。',
            example: '涞寅路绿庭尚城'
        },
        // Row 16: to=*
        {
            '@_k': 'to',
            importance: 'required',
            description:
                '公交线路目的地的名称，通常显示在公交车顶部作为终到站。',
            example: '北官厅'
        },
        // Row 17: name=*
        {
            '@_k': 'name',
            importance: 'required',
            description:
                '建议使用格式：<前缀><编号>路: <起点站> => <终点站>，详情参考相关标准。',
            example: 'K37路: 解放桥东 -> 铁厂北路公交车场'
        },
        {
            '@_k': 'name:zh',
            importance: 'recommened',
            description:
                '建议使用格式：<前缀><编号>路: <起点站> => <终点站>，详情参考相关标准。',
            example: 'K37路: 解放桥东 -> 铁厂北路公交车场'
        },
        // Row 18: official_name=*
        {
            '@_k': 'official_name',
            importance: 'optional',
            description:
                '用于描述官方地图上所用公交路线的名称。大多数线路仅供参考，因此请勿使用此标记。',
            example: '虹桥枢纽10路区间'
        },
        // Row 19: colour=*
        {
            '@_k': 'colour',
            importance: 'optional',
            description:
                '官方地图上公交线路的颜色，使用十六进制或 HTML 颜色代码。',
            example: '#58912F'
        },
        // Row 20: roundtrip=*
        {
            '@_k': 'roundtrip',
            importance: 'optional',
            description:
                "指定关系是否为环路。对于大多数线路，该值为 'no'.",
            example: 'no'
        },
        // Row 21: description=*
        {
            '@_k': 'description',
            importance: 'optional',
            description:
                '其他关于该线路的未尽事宜，可以在此用中文表述，如：春节期间线路有变动、本地公交卡7折优惠',
            example: '济南公交刷卡标准折扣'
        }
    ]
};
