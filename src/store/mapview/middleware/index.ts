import { StateCreator, StoreMutatorIdentifier, StoreMutators } from 'zustand';
import { MapViewStore } from '../store';

// 1. Define MapViewPartialState as your store type.
type MapViewPartialState = MapViewStore;

// 2. Update middleware type so that it meets Zustand’s expected constraint.
type MapViewMiddleware = [StoreMutatorIdentifier, unknown][];
type MapViewURLPersist = <M extends MapViewMiddleware, A extends MapViewPartialState, B extends [keyof StoreMutators<unknown, unknown>, unknown][]>(
    f: StateCreator<A, M, B>,
) => StateCreator<A, M, B>;

//
// Utility functions for URL search params
//
const getUrlSearchParams = () => new URLSearchParams(window.location.search);
const setURLSearchParams = (params: URLSearchParams) => {
    const newSearch = params.toString();
    const questionMark = newSearch ? '?' : '';
    window.history.replaceState(null, '', `${location.pathname}${questionMark}${newSearch}`);
};

//
// The middleware implementation: call config first, then merge URL values.
//
export const mapViewURLPersistMiddleware: MapViewURLPersist =
    (config) =>
        (set, get, api) => {
            // 1. Call the original state creator (config) to get the initial state.
            const initialState = config(set, get, api);

            // 2. Build a partial state from the URL.
            const initialStateFromURL: Partial<MapViewPartialState> = {};
            const params = getUrlSearchParams();

            const latParam = params.get('lat');
            const lonParam = params.get('lon');
            const zoomParam = params.get('zoom');

            if (latParam && lonParam) {
                initialStateFromURL.viewpoint = {
                    lat: parseFloat(latParam),
                    lon: parseFloat(lonParam),
                };
            }
            if (zoomParam) {
                initialStateFromURL.zoom = parseFloat(zoomParam);
            }

            // 3. Merge the initial state with the URL state.
            // URL values take precedence over the default state.
            const mergedState = {
                ...initialState,
                ...initialStateFromURL,
            };

            // 4. Update the store with the merged state.
            // 4. Update the store with the merged state using the proper overload.
            const typedSet = set as (
                state: MapViewPartialState | ((state: MapViewPartialState) => MapViewPartialState),
                replace: true,
                action: string
            ) => void;
            typedSet(mergedState, true, 'mapViewURLPersist/hydrate');

            // 5. Subscribe to state changes to update URL parameters when the state changes.
            api.subscribe((state, prevState) => {
                const params = getUrlSearchParams();
                let updated = false;

                if (state.viewpoint?.lat !== prevState.viewpoint?.lat) {
                    params.set('lat', state.viewpoint?.lat?.toString() || '');
                    updated = true;
                }
                if (state.viewpoint?.lon !== prevState.viewpoint?.lon) {
                    params.set('lon', state.viewpoint?.lon?.toString() || '');
                    updated = true;
                }
                if (state.zoom !== prevState.zoom) {
                    params.set('zoom', state.zoom?.toString() || '');
                    updated = true;
                }

                if (updated) {
                    setURLSearchParams(params);
                }
            });

            // Return the merged state.
            return mergedState;
        };
