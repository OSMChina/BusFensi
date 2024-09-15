import { defaultState } from './stateGraph';
import { State, Bucket } from './type';
import { FederatedEvent } from 'pixi.js';

class StateMachine {
    current: State;
    targetId: string | null;
    targetType: "node" | "way" | "relation" | null;
    bucket: Bucket;
    shiftKey: boolean
    constructor() {
        this.current = defaultState;
        this.targetId = null;
        this.targetType = null;
        this.bucket = {
            mapDrag: null,
            componentTarget: undefined,
            componentDrag: null
        };
        this.shiftKey = false
        document.addEventListener('keydown', (e) => {
            this.shiftKey = e.shiftKey
            this.transform(e)
        })
        document.addEventListener('keyup', (e) => {
            this.shiftKey = e.shiftKey
            this.transform(e)
        })
    }

    /**
     * Hook PIXI component
     */
    hookPIXIComponent(event: FederatedEvent, targetId: string, targetType: "node" | "way" | "relation") {
        this.targetId = targetId;
        this.targetType = targetType;
        this.transform(event);
    }

    /**
     * Hook PIXI scene
     * 
     */
    hookPIXIScene(event: unknown) {
        this.transform(event);
    }

    /**
     * 
     */
    hookCustomEvent(event: unknown) {
        this.transform(event)
    }
    /**
     * Transform state based on the event
     * 
     */
    transform(event: unknown) {
        for (let i = 0; i < this.current.nxt.length; i++) {
            const { state, transfer } = this.current.nxt[i];
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
