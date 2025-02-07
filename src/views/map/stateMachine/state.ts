import { BaseContext, BaseEvent, StoreType } from "../../../type/stateMachine/baseEvent";
import { Debouncer } from "../../../utils/helper/object";

export type StateTransformFun<EventType = BaseEvent> = (event: EventType) => boolean;

interface EpsilonTransition<T> {
    isEpsilon: true;
    state: StateItem<T>;
}
interface NonEpsilonTransition<T> {
    isEpsilon?: false;
    transform: StateTransformFun<T>;
    state: StateItem<T>;
}
type Transition<T> = EpsilonTransition<T> | NonEpsilonTransition<T>;

interface EpsilonOptions {
    isEpsilon: true;
    transform?: never;
}
interface NonEpsilonOptions<T> {
    isEpsilon?: false;
    transform: (event: T) => boolean;
}
type AppendOptions<T> = EpsilonOptions | NonEpsilonOptions<T>;

export class StateItem<T = BaseEvent> {
    name: string;
    next: Transition<T>[] = [];

    constructor(name: string) {
        this.name = name;
    }

    appendNext(state: StateItem<T> | BaseStateMachine<T>, options: AppendOptions<T>): void {
        const targetState = state instanceof StateItem ? state : state.entry!;
        if (options.isEpsilon) {
            this.next.push({ isEpsilon: true, state: targetState });
        } else {
            if (!options.transform) {
                throw new Error("Non-ε transition requires a transform function.");
            }
            this.next.push({ isEpsilon: false, transform: options.transform, state: targetState });
        }
    }
}

export class BaseStateMachine<T = BaseEvent, U extends BaseContext = BaseContext> {
    name: string;
    entry?: StateItem<T>;
    current?: StateItem<T>;
    accept?: StateItem<T>[];
    debouncer: Debouncer;
    static DEBOUNCE_DELAY = 20;
    context: U;

    constructor(store: StoreType) {
        this.name = "base";
        this.context = { store } as U;
        this.debouncer = new Debouncer();
    }

    appendNext(state: StateItem<T> | BaseStateMachine<T>, options: AppendOptions<T>): void {
        this.accept!.forEach((s) => s.appendNext(state, options));
    }

    computeEpsilonClosure(state: StateItem<T>): StateItem<T>[] {
        const closure: Set<StateItem<T>> = new Set();
        const stack: StateItem<T>[] = [state];

        while (stack.length) {
            const cur = stack.pop()!;
            if (!closure.has(cur)) {
                closure.add(cur);
                for (const { state: nextState, isEpsilon } of cur.next) {
                    if (isEpsilon) {
                        stack.push(nextState);
                    }
                }
            }
        }
        return Array.from(closure);
    }

    transform(event: T): void {
        const closure = this.computeEpsilonClosure(this.current!);
        for (const state of closure) {
            for (const transition of state.next) {
                if (!transition.isEpsilon && transition.transform(event)) {
                    this.current = transition.state;
                    return;
                }
            }
        }
    }

    debouncedTransform(event: T): void {
        this.debouncer.debounce(this.transform.bind(this), BaseStateMachine.DEBOUNCE_DELAY, (event as BaseEvent).type, true)(event);
    }
}