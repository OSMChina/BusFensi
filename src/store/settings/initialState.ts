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
            POINT: number,
            MASK: number
        }
    },
    appearance: {
        theme: 'light' | 'dark' | 'system'
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
            POINT: 20,
            MASK: 30
        }
    },
    appearance: {
        theme: 'system' // Default to system preference
    }
};