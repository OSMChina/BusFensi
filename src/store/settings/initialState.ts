export interface SettingsState {
    osmAPI: {
        BASEURL: string,
        TILE_SOURCE: string // 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    view: {
        MAX_ZOOM: number
    },
    pixiRender: {
        zIndex: {
            LINE: number,
            POINT: number
        }
    }
};

export const initialState: SettingsState = {
    osmAPI: {
        BASEURL: 'https://api.openstreetmap.org',
        TILE_SOURCE: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    view: {
        MAX_ZOOM: 19
    },
    pixiRender: {
        zIndex: {
            LINE: 10,
            POINT: 20
        }
    }
};