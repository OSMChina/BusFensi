import { createMapComponent } from "./map";

/**
 * 
 * @param {Element | string} element - object or CSS Selector
 * @returns {Element}
 */
export async function App(element) {
    const map = await createMapComponent();
    
    console.log(`mounting app to ${element}`)
    const app = typeof element === 'string' ? document.querySelector(element) : element;
    app.appendChild(map);
    return app;
}