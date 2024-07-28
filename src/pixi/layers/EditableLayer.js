import { Point } from "../components/Point";
import { AbstractLayer } from "./AbstructLayer";
import { circleTexture, locationPinTexture } from "../textures";
import { Container } from "pixi.js";
import { Line } from "../components/Line";

export class EditableLayer extends AbstractLayer {
    /**
     * 编辑图层，渲染道路信息和公交站点信息，以及对应的线路信息。这个图层当中的元素可以允许用户编辑
     * 
     * @param {import("pixi.js").Application} scene 
     */
    constructor(scene) {
        super(scene)
        /** @type {Container} */
        this.container = new Container();
        this.scene.stage.addChild(this.container);
    }
    render() {
        this.testrender()
    }
    /**
     * This is just a test function and will be removed in future
     */
    testrender() {
        const ZOOM = 16;
        const point1 = {
            lon: 148.4105574,
            lat: 12.4899798
        }
        const point2 = {
            lon: 148.4100123,
            lat: 12.5018624
        }
        const point3 = {
            lon: 148.4104673,
            lat: 12.4957513
        };
        const viewpoint = {
            lon: 148.4105574,
            lat: 12.4899798
        }

        // test the line
        const line = new Line(this, 'line1', [point1, point3, point2]);
        line.update(viewpoint, ZOOM);
        /** @type {import('../components/types').PointComponentStyle} */
        const style = {
            type: 'pin',
            display: 'pin',
            marker: {
                circle: circleTexture,
                pin: locationPinTexture
            },
            size: 8,
            color: 0xffffff
        };

        console.log(circleTexture, locationPinTexture, 'and size of app', this.scene.stage.width, this.scene.stage.height, 'size of window', window.innerWidth, window.innerHeight)
        /** @type {Array<Point>} */
        const renderedPoints = [
            new Point(this, 'p1', point1, style),
            new Point(this, 'p2', point2, style),
            new Point(this, 'p3', point3, style),
            new Point(this, 'view', viewpoint, style)
        ];
        renderedPoints.forEach(point => {
            point.update(viewpoint, ZOOM);
        })

        
    }
}  