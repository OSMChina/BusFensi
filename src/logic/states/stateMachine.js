import { defaultState } from './stateGraph';
class StateMachine {
    constructor() {
        /** @type {import('./type').State} */
        this.current = defaultState;
        /** @type {{ backgroundLayer:import('../../pixi/layers/BackgroundLayer').BackgroundLayer, editableLayer:import('../../pixi/layers/EditableLayer').EditableLayer}} */
        this.layers = null;
        /** @type {import('pixi.js').Application} */
        this.scene = null;
        /** @type {import('../../pixi/components/AbstructComponent').AbstractComponent} */
        this.target = null;
        /** @type {import('./type').Bucket} stores some info needed between states */
        this.bucket = {}
    }
    /**
     * must be called when pixi layer inited
     * 
     * @param {import('./type').Layers} layers 
     */
    init(layers, scene) {
        this.layers = layers
        this.scene = scene
    }
    hookPIXIComponent(event, target) {
        this.target = target;
        this.transform(event)
    }
    hookPIXIScene(event) {
        this.transform(event);
    }
    transform(event) {
        for (let i = 0; i < this.current.nxt.length; i++) {
            const {state, transfer} = this.current.nxt[i];
            if (transfer(event)) {
                this.current = state;
                return;
            }
        }
        if (!this.current.retain(event)) {
            this.current = defaultState;
        }
    }
}

export const stateMachine = new StateMachine();