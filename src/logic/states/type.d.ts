import { AbstractComponent } from "../../pixi/components/AbstructComponent"
import { BackgroundLayer } from "../../pixi/layers/BackgroundLayer"
import { EditableLayer } from "../../pixi/layers/EditableLayer"

export interface State {
    /**
     * Name of state
     */
    type: String,
    /**
     * 判断是否停留在当前状态的时候会跑一遍这个函数，可能会处理一些逻辑
     */
    retain: (event: Event) => Boolean,
    /**
     * posibble state to transfer 
     */
    nxt: Array<{
        state: State,
        /**
         * 是否可以转移到此状态。同时也会处理一些其他变更，比如生成 Action
         * 会保证仅仅由前趋结点 nxt 记录中 transfer 而来
         */
        transfer: (event: Event) => Boolean,
    }>
}

export interface Layers {
    backgroundLayer: BackgroundLayer
    editableLayer: EditableLayer
}

export interface Bucket {
    mapDrag: {
        x: number
        y: number
    }
    componentTarget: AbstractComponent
    componentDrag: {
        x: number
        y: number
    }
}