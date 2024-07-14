import { Texture } from "pixi.js"

export interface PointComponentStyle {
    type: "dot" | "pin"
    display: "circle" | "pin"
    icon?: Texture, // pixi Texture of icon
    marker: {
        circle: Texture // pixi Texture of marker
        pin: Texture
    }
    color?: number, // for display type dot, hex color
    size: number // px
    halo?: {
        color: number // hex color
        width: number
    }
}

export interface LineComponentStyle {
    stroke: {
        color: number
        width: number
    }
    fill: {
        color: number
        width: number
    }
}

export interface PolygonComponentStyle {

}