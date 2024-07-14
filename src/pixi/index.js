import { Application } from 'pixi.js';
import { EditableLayer } from './layers/EditableLayer';

/**
 * create map application, initing, setting up layers, then logics, finnaly return it.
 * 
 * @param {*} config - some config for pixi.js app creation
 * @param {Element} map
 * @returns {Promise<Application>}
 */
async function createMapPIXIApplication(config, map) {
    const app = new Application();

    await app.init({ background: '#1099bb', width: window.innerWidth, height:window.innerHeight });
    console.log('on init', app.stage.width, app.stage.height, window.innerWidth, window.innerHeight )

    globalThis.__PIXI_APP__ = app;  
    map.appendChild(app.canvas)
    await new Promise(resolve => setTimeout(resolve, 100)); // A small delay to ensure resizing
    console.log('on init', app.canvas.width, app.canvas.height, window.innerWidth, window.innerHeight )
    // init container and layers
    const editableLayer = new EditableLayer(app);
    editableLayer.render();
    // setting logics and handlers

    // finish, return
    return app;
}

export {
    createMapPIXIApplication
};