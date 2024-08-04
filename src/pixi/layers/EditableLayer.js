import { Point } from "../components/Point";
import { AbstractLayer } from "./AbstructLayer";
import { circleTexture, locationPinTexture } from "../textures";
import { Container } from "pixi.js";
import { Line } from "../components/Line";
import { getBoundsByScene } from "../../utils/geo/mapProjection";

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
        this.container.sortableChildren = true
        this.scene.stage.addChild(this.container);
        /** @type {Map<Number, AbstractComponent>} */
        this.features = new Map();
        /** @type {Map<Number, Number>} */
        this.refNodeToWay = new Map()
    }

    /**
     * 
     * @param {import('../../utils/geo/types').PointWGS84} viewpoint 
     */
    updateViewpoint(viewpoint) {
        this.viewpoint = viewpoint
        this.update()
    }

    /**
     * 
     * @param {Number} zoom 
     */
    updateZoom(zoom) {
        this.zoom = zoom
        this.update()
    }

    /**
     * 更新当前的所有元素
     */
    update() {
        const { left, bottom, right, top } = getBoundsByScene(this.viewpoint, this.zoom, this.scene.canvas.width, this.scene.canvas.height);
        const inBound = (lon, lat) => {
            return left <= lon && lon <= right && bottom <= lat && lat <= top
        }
        this.features.forEach((component) => {
            component.visible = false;
        })

        this.features.forEach((component) => {
            if (component.type === "point") {
                const { lon, lat } = component.locate;
                if (inBound(lon, lat)) {
                    component.visible = true;
                    component.update(this.viewpoint, this.zoom)
                } else {
                    component.visible = false;
                }
            } else if (component.type === "line") {
                if (component.path.some(point => inBound(point.locate.lon, point.locate.lat))) {
                    component.visible = true;
                    component.update(this.viewpoint, this.zoom)
                } else {
                    component.visible = false;
                }
            }
        })
    }
    
    /**
     * 
     * @param {Number} id 
     * @param {import("../../utils/geo/types").PointWGS84} locate 
     */
    updatePointLocation(id, locate) {
        if (!this.features.has(id)) {
            throw new Error(`Feature id ${id} not found`)
        }
        const component = this.features.get(id)
        if (component.type === 'point') {
            component.locate = locate;
            component.update(this.viewpoint, this.zoom)
            const wayId = this.refNodeToWay.get(id);
            console.log('settting', component , "to", locate, "and way", this.features.get(wayId).path)

            this.features.get(wayId).update(this.viewpoint, this.zoom);
        }
    }

    /**
     * Append point to container. if exist, delete it
     * 
     * @param {import('../../api/osm/type').Node} node 
     */
    appendPoint(node) {
        if (this.features.has(node["@_id"])) {
            return // ignore
        }
        // assuming not pin
        const isPin = false;

        /** @type {import('../components/types').PointComponentStyle} */
        const style = {
            type: isPin ? 'pin' : 'dot',
            display: isPin ? 'pin' : 'dot',
            marker: {
                circle: circleTexture,
                pin: locationPinTexture
            },
            size: 8,
            color: 0xffffff
        };
        const point = new Point(this, style, node);
        this.features.set(node["@_id"], point)
    }

    /**
     * 
     * @param {import('../../api/osm/type').Way} way 
     */
    appendLine(way) {
        if (this.features.has(way["@_id"])) {
            return
        }
        way.nd.forEach(nd => this.refNodeToWay.set(nd["@_ref"], way["@_id"]))
        const path = []
        way.nd.forEach(nd => path.push(this.features.get(nd["@_ref"])))
        const line = new Line(this, way, path);
        this.features.set(way["@_id"], line);
    }

    /**
     * 渲染 bbox 中获得的新 feature 。
     * 
     * @param {import('../../api/osm/type').OSMV06BBoxObj} bbox 
     */
    appendBbox(bbox) {
        console.log("get bbox", bbox)
        // eslint-disable-next-line no-unused-vars
        const { node, way, relation } = bbox.osm;
        // 渲染点 
        (Array.isArray(node) ? node : [node]).forEach(node => {
            this.appendPoint(node);
        });
        // 渲染线，仅考虑道路。
        (Array.isArray(way) ? way : [way]).forEach(way => {
            if (way.tag
                && (Array.isArray(way.tag) ? way.tag : [way.tag])
                    .some(tag => tag["@_k"] === "area" && tag["@_v"] === "yes") // is area
                || !Array.isArray(way.nd) // 0 or 1 node, no way
            ) {
                return;
            }
            // is way
            this.appendLine(way)
        });
        // 渲染多边形，现在还没写完

        this.update()
    }

    removeBbox() {}

    /**
     * This is just a test function and will be removed in future
     */
    // testrender() {
    //     const ZOOM = 16;
    //     const point1 = {
    //         lon: 148.4105574,
    //         lat: 12.4899798
    //     }
    //     const point2 = {
    //         lon: 148.4100123,
    //         lat: 12.5018624
    //     }
    //     const point3 = {
    //         lon: 148.4104673,
    //         lat: 12.4957513
    //     };
    //     const viewpoint = {
    //         lon: 148.4105574,
    //         lat: 12.4899798
    //     }

    //     // test the line
    //     const line = new Line(this, 'line1', [point1, point3, point2]);
    //     line.update(viewpoint, ZOOM);
    //     /** @type {import('../components/types').PointComponentStyle} */
    //     const style = {
    //         type: 'pin',
    //         display: 'pin',
    //         marker: {
    //             circle: circleTexture,
    //             pin: locationPinTexture
    //         },
    //         size: 8,
    //         color: 0xffffff
    //     };

    //     console.log(circleTexture, locationPinTexture, 'and size of app', this.scene.stage.width, this.scene.stage.height, 'size of window', window.innerWidth, window.innerHeight)
    //     /** @type {Array<Point>} */
    //     const renderedPoints = [
    //         new Point(this, 'p1', point1, style),
    //         new Point(this, 'p2', point2, style),
    //         new Point(this, 'p3', point3, style),
    //         new Point(this, 'view', viewpoint, style)
    //     ];
    //     renderedPoints.forEach(point => {
    //         point.update(viewpoint, ZOOM);
    //     })


    // }
}  