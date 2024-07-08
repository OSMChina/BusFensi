import { Application } from 'pixi.js';

/**
 * create map application, initing, setting up layers, then logics, finnaly return it.
 * 
 * @param {*} config - some config for pixi.js app creation
 * @returns {Promise<Application>}
 */
async function createMapPIXIApplication(config) {
    const app = new Application();
    await app.init({ background: '#1099bb', resizeTo: config.resizeTo || window, });
    // init container and layers

    // setting logics and handlers

    // finish, return
    return app;
}

export {
    createMapPIXIApplication
};