import { createMapPIXIApplication } from '../../pixi/index';

/**
 * creates the map component
 * 
 * @param {*} config 
 * @returns {Promise<Element>} - a div with map pixi application mounted
 */
export async function createMapComponent(config) {
    const map = document.createElement('div');
    map.classList = ['mapbox'];

    const app = await createMapPIXIApplication(config);

    map.appendChild(app.canvas);
    return map;
}

export { createMapComponent };