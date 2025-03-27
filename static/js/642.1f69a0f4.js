/*! For license information please see 642.1f69a0f4.js.LICENSE.txt */
"use strict";(self.webpackChunkbus_fensi=self.webpackChunkbus_fensi||[]).push([["642"],{1365:function(t,e,i){i.d(e,{YZ:()=>s,s$:()=>o,W2:()=>u});var r=i(7781);class s{constructor(){this.minX=1/0,this.minY=1/0,this.maxX=-1/0,this.maxY=-1/0,this.rect=null,this.updateID=-1}isEmpty(){return this.minX>this.maxX||this.minY>this.maxY}clear(){this.minX=1/0,this.minY=1/0,this.maxX=-1/0,this.maxY=-1/0}getRectangle(t){return this.minX>this.maxX||this.minY>this.maxY?r.Ae.EMPTY:((t=t||new r.Ae(0,0,1,1)).x=this.minX,t.y=this.minY,t.width=this.maxX-this.minX,t.height=this.maxY-this.minY,t)}addPoint(t){this.minX=Math.min(this.minX,t.x),this.maxX=Math.max(this.maxX,t.x),this.minY=Math.min(this.minY,t.y),this.maxY=Math.max(this.maxY,t.y)}addPointMatrix(t,e){let{a:i,b:r,c:s,d:o,tx:n,ty:a}=t,l=i*e.x+s*e.y+n,h=r*e.x+o*e.y+a;this.minX=Math.min(this.minX,l),this.maxX=Math.max(this.maxX,l),this.minY=Math.min(this.minY,h),this.maxY=Math.max(this.maxY,h)}addQuad(t){let e=this.minX,i=this.minY,r=this.maxX,s=this.maxY,o=t[0],n=t[1];e=o<e?o:e,i=n<i?n:i,r=o>r?o:r,s=n>s?n:s,o=t[2],n=t[3],e=o<e?o:e,i=n<i?n:i,r=o>r?o:r,s=n>s?n:s,o=t[4],n=t[5],e=o<e?o:e,i=n<i?n:i,r=o>r?o:r,s=n>s?n:s,o=t[6],n=t[7],e=o<e?o:e,i=n<i?n:i,r=o>r?o:r,s=n>s?n:s,this.minX=e,this.minY=i,this.maxX=r,this.maxY=s}addFrame(t,e,i,r,s){this.addFrameMatrix(t.worldTransform,e,i,r,s)}addFrameMatrix(t,e,i,r,s){let o=t.a,n=t.b,a=t.c,l=t.d,h=t.tx,u=t.ty,d=this.minX,c=this.minY,p=this.maxX,m=this.maxY,f=o*e+a*i+h,g=n*e+l*i+u;d=f<d?f:d,c=g<c?g:c,p=f>p?f:p,m=g>m?g:m,f=o*r+a*i+h,g=n*r+l*i+u,d=f<d?f:d,c=g<c?g:c,p=f>p?f:p,m=g>m?g:m,f=o*e+a*s+h,g=n*e+l*s+u,d=f<d?f:d,c=g<c?g:c,p=f>p?f:p,m=g>m?g:m,f=o*r+a*s+h,g=n*r+l*s+u,d=f<d?f:d,c=g<c?g:c,p=f>p?f:p,m=g>m?g:m,this.minX=d,this.minY=c,this.maxX=p,this.maxY=m}addVertexData(t,e,i){let r=this.minX,s=this.minY,o=this.maxX,n=this.maxY;for(let a=e;a<i;a+=2){let e=t[a],i=t[a+1];r=e<r?e:r,s=i<s?i:s,o=e>o?e:o,n=i>n?i:n}this.minX=r,this.minY=s,this.maxX=o,this.maxY=n}addVertices(t,e,i,r){this.addVerticesMatrix(t.worldTransform,e,i,r)}addVerticesMatrix(t,e,i,r,s=0,o=s){let n=t.a,a=t.b,l=t.c,h=t.d,u=t.tx,d=t.ty,c=this.minX,p=this.minY,m=this.maxX,f=this.maxY;for(let t=i;t<r;t+=2){let i=e[t],r=e[t+1],g=n*i+l*r+u,v=h*r+a*i+d;c=Math.min(c,g-s),m=Math.max(m,g+s),p=Math.min(p,v-o),f=Math.max(f,v+o)}this.minX=c,this.minY=p,this.maxX=m,this.maxY=f}addBounds(t){let e=this.minX,i=this.minY,r=this.maxX,s=this.maxY;this.minX=t.minX<e?t.minX:e,this.minY=t.minY<i?t.minY:i,this.maxX=t.maxX>r?t.maxX:r,this.maxY=t.maxY>s?t.maxY:s}addBoundsMask(t,e){let i=t.minX>e.minX?t.minX:e.minX,r=t.minY>e.minY?t.minY:e.minY,s=t.maxX<e.maxX?t.maxX:e.maxX,o=t.maxY<e.maxY?t.maxY:e.maxY;if(i<=s&&r<=o){let t=this.minX,e=this.minY,n=this.maxX,a=this.maxY;this.minX=i<t?i:t,this.minY=r<e?r:e,this.maxX=s>n?s:n,this.maxY=o>a?o:a}}addBoundsMatrix(t,e){this.addFrameMatrix(e,t.minX,t.minY,t.maxX,t.maxY)}addBoundsArea(t,e){let i=t.minX>e.x?t.minX:e.x,r=t.minY>e.y?t.minY:e.y,s=t.maxX<e.x+e.width?t.maxX:e.x+e.width,o=t.maxY<e.y+e.height?t.maxY:e.y+e.height;if(i<=s&&r<=o){let t=this.minX,e=this.minY,n=this.maxX,a=this.maxY;this.minX=i<t?i:t,this.minY=r<e?r:e,this.maxX=s>n?s:n,this.maxY=o>a?o:a}}pad(t=0,e=t){this.isEmpty()||(this.minX-=t,this.maxX+=t,this.minY-=e,this.maxY+=e)}addFramePad(t,e,i,r,s,o){t-=s,e-=o,i+=s,r+=o,this.minX=this.minX<t?this.minX:t,this.maxX=this.maxX>i?this.maxX:i,this.minY=this.minY<e?this.minY:e,this.maxY=this.maxY>r?this.maxY:r}}class o extends r.P6.EventEmitter{constructor(){super(),this.tempDisplayObjectParent=null,this.transform=new r.wx,this.alpha=1,this.visible=!0,this.renderable=!0,this.cullable=!1,this.cullArea=null,this.parent=null,this.worldAlpha=1,this._lastSortedIndex=0,this._zIndex=0,this.filterArea=null,this.filters=null,this._enabledFilters=null,this._bounds=new s,this._localBounds=null,this._boundsID=0,this._boundsRect=null,this._localBoundsRect=null,this._mask=null,this._maskRefCount=0,this._destroyed=!1,this.isSprite=!1,this.isMask=!1}static mixin(t){let e=Object.keys(t);for(let i=0;i<e.length;++i){let r=e[i];Object.defineProperty(o.prototype,r,Object.getOwnPropertyDescriptor(t,r))}}get destroyed(){return this._destroyed}_recursivePostUpdateTransform(){this.parent?(this.parent._recursivePostUpdateTransform(),this.transform.updateTransform(this.parent.transform)):this.transform.updateTransform(this._tempDisplayObjectParent.transform)}updateTransform(){this._boundsID++,this.transform.updateTransform(this.parent.transform),this.worldAlpha=this.alpha*this.parent.worldAlpha}getBounds(t,e){return t||(this.parent?(this._recursivePostUpdateTransform(),this.updateTransform()):(this.parent=this._tempDisplayObjectParent,this.updateTransform(),this.parent=null)),this._bounds.updateID!==this._boundsID&&(this.calculateBounds(),this._bounds.updateID=this._boundsID),e||(this._boundsRect||(this._boundsRect=new r.Ae),e=this._boundsRect),this._bounds.getRectangle(e)}getLocalBounds(t){t||(this._localBoundsRect||(this._localBoundsRect=new r.Ae),t=this._localBoundsRect),this._localBounds||(this._localBounds=new s);let e=this.transform,i=this.parent;this.parent=null,this._tempDisplayObjectParent.worldAlpha=i?.worldAlpha??1,this.transform=this._tempDisplayObjectParent.transform;let o=this._bounds,n=this._boundsID;this._bounds=this._localBounds;let a=this.getBounds(!1,t);return this.parent=i,this.transform=e,this._bounds=o,this._bounds.updateID+=this._boundsID-n,a}toGlobal(t,e,i=!1){return i||(this._recursivePostUpdateTransform(),this.parent?this.displayObjectUpdateTransform():(this.parent=this._tempDisplayObjectParent,this.displayObjectUpdateTransform(),this.parent=null)),this.worldTransform.apply(t,e)}toLocal(t,e,i,r){return e&&(t=e.toGlobal(t,i,r)),r||(this._recursivePostUpdateTransform(),this.parent?this.displayObjectUpdateTransform():(this.parent=this._tempDisplayObjectParent,this.displayObjectUpdateTransform(),this.parent=null)),this.worldTransform.applyInverse(t,i)}setParent(t){if(!t||!t.addChild)throw Error("setParent: Argument must be a Container");return t.addChild(this),t}removeFromParent(){this.parent?.removeChild(this)}setTransform(t=0,e=0,i=1,r=1,s=0,o=0,n=0,a=0,l=0){return this.position.x=t,this.position.y=e,this.scale.x=i||1,this.scale.y=r||1,this.rotation=s,this.skew.x=o,this.skew.y=n,this.pivot.x=a,this.pivot.y=l,this}destroy(t){this.removeFromParent(),this._destroyed=!0,this.transform=null,this.parent=null,this._bounds=null,this.mask=null,this.cullArea=null,this.filters=null,this.filterArea=null,this.hitArea=null,this.eventMode="auto",this.interactiveChildren=!1,this.emit("destroyed"),this.removeAllListeners()}get _tempDisplayObjectParent(){return null===this.tempDisplayObjectParent&&(this.tempDisplayObjectParent=new n),this.tempDisplayObjectParent}enableTempParent(){let t=this.parent;return this.parent=this._tempDisplayObjectParent,t}disableTempParent(t){this.parent=t}get x(){return this.position.x}set x(t){this.transform.position.x=t}get y(){return this.position.y}set y(t){this.transform.position.y=t}get worldTransform(){return this.transform.worldTransform}get localTransform(){return this.transform.localTransform}get position(){return this.transform.position}set position(t){this.transform.position.copyFrom(t)}get scale(){return this.transform.scale}set scale(t){this.transform.scale.copyFrom(t)}get pivot(){return this.transform.pivot}set pivot(t){this.transform.pivot.copyFrom(t)}get skew(){return this.transform.skew}set skew(t){this.transform.skew.copyFrom(t)}get rotation(){return this.transform.rotation}set rotation(t){this.transform.rotation=t}get angle(){return this.transform.rotation*r.jl}set angle(t){this.transform.rotation=t*r.ZX}get zIndex(){return this._zIndex}set zIndex(t){this._zIndex!==t&&(this._zIndex=t,this.parent&&(this.parent.sortDirty=!0))}get worldVisible(){let t=this;do{if(!t.visible)return!1;t=t.parent}while(t);return!0}get mask(){return this._mask}set mask(t){if(this._mask!==t){if(this._mask){let t=this._mask.isMaskData?this._mask.maskObject:this._mask;t&&(t._maskRefCount--,0===t._maskRefCount&&(t.renderable=!0,t.isMask=!1))}if(this._mask=t,this._mask){let t=this._mask.isMaskData?this._mask.maskObject:this._mask;t&&(0===t._maskRefCount&&(t.renderable=!1,t.isMask=!0),t._maskRefCount++)}}}}class n extends o{constructor(){super(...arguments),this.sortDirty=null}}o.prototype.displayObjectUpdateTransform=o.prototype.updateTransform;let a=new r.y3;function l(t,e){return t.zIndex===e.zIndex?t._lastSortedIndex-e._lastSortedIndex:t.zIndex-e.zIndex}let h=class t extends o{constructor(){super(),this.children=[],this.sortableChildren=t.defaultSortableChildren,this.sortDirty=!1}onChildrenChange(t){}addChild(...t){if(t.length>1)for(let e=0;e<t.length;e++)this.addChild(t[e]);else{let e=t[0];e.parent&&e.parent.removeChild(e),e.parent=this,this.sortDirty=!0,e.transform._parentID=-1,this.children.push(e),this._boundsID++,this.onChildrenChange(this.children.length-1),this.emit("childAdded",e,this,this.children.length-1),e.emit("added",this)}return t[0]}addChildAt(t,e){if(e<0||e>this.children.length)throw Error(`${t}addChildAt: The index ${e} supplied is out of bounds ${this.children.length}`);return t.parent&&t.parent.removeChild(t),t.parent=this,this.sortDirty=!0,t.transform._parentID=-1,this.children.splice(e,0,t),this._boundsID++,this.onChildrenChange(e),t.emit("added",this),this.emit("childAdded",t,this,e),t}swapChildren(t,e){if(t===e)return;let i=this.getChildIndex(t),r=this.getChildIndex(e);this.children[i]=e,this.children[r]=t,this.onChildrenChange(i<r?i:r)}getChildIndex(t){let e=this.children.indexOf(t);if(-1===e)throw Error("The supplied DisplayObject must be a child of the caller");return e}setChildIndex(t,e){if(e<0||e>=this.children.length)throw Error(`The index ${e} supplied is out of bounds ${this.children.length}`);let i=this.getChildIndex(t);r.P6.removeItems(this.children,i,1),this.children.splice(e,0,t),this.onChildrenChange(e)}getChildAt(t){if(t<0||t>=this.children.length)throw Error(`getChildAt: Index (${t}) does not exist.`);return this.children[t]}removeChild(...t){if(t.length>1)for(let e=0;e<t.length;e++)this.removeChild(t[e]);else{let e=t[0],i=this.children.indexOf(e);if(-1===i)return null;e.parent=null,e.transform._parentID=-1,r.P6.removeItems(this.children,i,1),this._boundsID++,this.onChildrenChange(i),e.emit("removed",this),this.emit("childRemoved",e,this,i)}return t[0]}removeChildAt(t){let e=this.getChildAt(t);return e.parent=null,e.transform._parentID=-1,r.P6.removeItems(this.children,t,1),this._boundsID++,this.onChildrenChange(t),e.emit("removed",this),this.emit("childRemoved",e,this,t),e}removeChildren(t=0,e=this.children.length){let i;let r=e-t;if(r>0&&r<=e){i=this.children.splice(t,r);for(let t=0;t<i.length;++t)i[t].parent=null,i[t].transform&&(i[t].transform._parentID=-1);this._boundsID++,this.onChildrenChange(t);for(let t=0;t<i.length;++t)i[t].emit("removed",this),this.emit("childRemoved",i[t],this,t);return i}if(0===r&&0===this.children.length)return[];throw RangeError("removeChildren: numeric values are outside the acceptable range.")}sortChildren(){let t=!1;for(let e=0,i=this.children.length;e<i;++e){let i=this.children[e];i._lastSortedIndex=e,t||0===i.zIndex||(t=!0)}t&&this.children.length>1&&this.children.sort(l),this.sortDirty=!1}updateTransform(){this.sortableChildren&&this.sortDirty&&this.sortChildren(),this._boundsID++,this.transform.updateTransform(this.parent.transform),this.worldAlpha=this.alpha*this.parent.worldAlpha;for(let t=0,e=this.children.length;t<e;++t){let e=this.children[t];e.visible&&e.updateTransform()}}calculateBounds(){this._bounds.clear(),this._calculateBounds();for(let t=0;t<this.children.length;t++){let e=this.children[t];if(!(!e.visible||!e.renderable)){if(e.calculateBounds(),e._mask){let t=e._mask.isMaskData?e._mask.maskObject:e._mask;t?(t.calculateBounds(),this._bounds.addBoundsMask(e._bounds,t._bounds)):this._bounds.addBounds(e._bounds)}else e.filterArea?this._bounds.addBoundsArea(e._bounds,e.filterArea):this._bounds.addBounds(e._bounds)}}this._bounds.updateID=this._boundsID}getLocalBounds(t,e=!1){let i=super.getLocalBounds(t);if(!e)for(let t=0,e=this.children.length;t<e;++t){let e=this.children[t];e.visible&&e.updateTransform()}return i}_calculateBounds(){}_renderWithCulling(e){let i,r;let s=e.renderTexture.sourceFrame;if(!(s.width>0&&s.height>0))return;this.cullArea?(i=this.cullArea,r=this.worldTransform):this._render!==t.prototype._render&&(i=this.getBounds(!0));let o=e.projection.transform;if(o&&(r?(r=a.copyFrom(r)).prepend(o):r=o),i&&s.intersects(i,r))this._render(e);else if(this.cullArea)return;for(let t=0,i=this.children.length;t<i;++t){let i=this.children[t],r=i.cullable;i.cullable=r||!this.cullArea,i.render(e),i.cullable=r}}render(t){if(!(!this.visible||this.worldAlpha<=0||!this.renderable)){if(this._mask||this.filters?.length)this.renderAdvanced(t);else if(this.cullable)this._renderWithCulling(t);else{this._render(t);for(let e=0,i=this.children.length;e<i;++e)this.children[e].render(t)}}}renderAdvanced(t){let e=this.filters,i=this._mask;if(e){this._enabledFilters||(this._enabledFilters=[]),this._enabledFilters.length=0;for(let t=0;t<e.length;t++)e[t].enabled&&this._enabledFilters.push(e[t])}let s=e&&this._enabledFilters?.length||i&&(!i.isMaskData||i.enabled&&(i.autoDetect||i.type!==r.A7.NONE));if(s&&t.batch.flush(),e&&this._enabledFilters?.length&&t.filter.push(this,this._enabledFilters),i&&t.mask.push(this,this._mask),this.cullable)this._renderWithCulling(t);else{this._render(t);for(let e=0,i=this.children.length;e<i;++e)this.children[e].render(t)}s&&t.batch.flush(),i&&t.mask.pop(this),e&&this._enabledFilters?.length&&t.filter.pop()}_render(t){}destroy(t){super.destroy(),this.sortDirty=!1;let e="boolean"==typeof t?t:t?.children,i=this.removeChildren(0,this.children.length);if(e)for(let e=0;e<i.length;++e)i[e].destroy(t)}get width(){return this.scale.x*this.getLocalBounds().width}set width(t){let e=this.getLocalBounds().width;0!==e?this.scale.x=t/e:this.scale.x=1,this._width=t}get height(){return this.scale.y*this.getLocalBounds().height}set height(t){let e=this.getLocalBounds().height;0!==e?this.scale.y=t/e:this.scale.y=1,this._height=t}};h.defaultSortableChildren=!1;let u=h;u.prototype.containerUpdateTransform=u.prototype.updateTransform,Object.defineProperties(r.Xd,{SORTABLE_CHILDREN:{get:()=>u.defaultSortableChildren,set(t){r.P6.deprecation("7.1.0","settings.SORTABLE_CHILDREN is deprecated, use Container.defaultSortableChildren"),u.defaultSortableChildren=t}}})},5431:function(t,e,i){i.d(e,{xA:()=>o});var r=i(7781);let s=new class{constructor(){this.interactionFrequency=10,this._deltaTime=0,this._didMove=!1,this.tickerAdded=!1,this._pauseUpdate=!0}init(t){this.removeTickerListener(),this.events=t,this.interactionFrequency=10,this._deltaTime=0,this._didMove=!1,this.tickerAdded=!1,this._pauseUpdate=!0}get pauseUpdate(){return this._pauseUpdate}set pauseUpdate(t){this._pauseUpdate=t}addTickerListener(){this.tickerAdded||!this.domElement||(r.vB.system.add(this.tickerUpdate,this,r.uF.INTERACTION),this.tickerAdded=!0)}removeTickerListener(){this.tickerAdded&&(r.vB.system.remove(this.tickerUpdate,this),this.tickerAdded=!1)}pointerMoved(){this._didMove=!0}update(){if(!this.domElement||this._pauseUpdate)return;if(this._didMove){this._didMove=!1;return}let t=this.events.rootPointerEvent;this.events.supportsTouchEvents&&"touch"===t.pointerType||globalThis.document.dispatchEvent(new PointerEvent("pointermove",{clientX:t.clientX,clientY:t.clientY}))}tickerUpdate(t){this._deltaTime+=t,this._deltaTime<this.interactionFrequency||(this._deltaTime=0,this.update())}};class o{constructor(t){this.bubbles=!0,this.cancelBubble=!0,this.cancelable=!1,this.composed=!1,this.defaultPrevented=!1,this.eventPhase=o.prototype.NONE,this.propagationStopped=!1,this.propagationImmediatelyStopped=!1,this.layer=new r.E9,this.page=new r.E9,this.NONE=0,this.CAPTURING_PHASE=1,this.AT_TARGET=2,this.BUBBLING_PHASE=3,this.manager=t}get layerX(){return this.layer.x}get layerY(){return this.layer.y}get pageX(){return this.page.x}get pageY(){return this.page.y}get data(){return this}composedPath(){return this.manager&&(!this.path||this.path[this.path.length-1]!==this.target)&&(this.path=this.target?this.manager.propagationPath(this.target):[]),this.path}initEvent(t,e,i){throw Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.")}initUIEvent(t,e,i,r,s){throw Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.")}preventDefault(){this.nativeEvent instanceof Event&&this.nativeEvent.cancelable&&this.nativeEvent.preventDefault(),this.defaultPrevented=!0}stopImmediatePropagation(){this.propagationImmediatelyStopped=!0}stopPropagation(){this.propagationStopped=!0}}class n extends o{constructor(){super(...arguments),this.client=new r.E9,this.movement=new r.E9,this.offset=new r.E9,this.global=new r.E9,this.screen=new r.E9}get clientX(){return this.client.x}get clientY(){return this.client.y}get x(){return this.clientX}get y(){return this.clientY}get movementX(){return this.movement.x}get movementY(){return this.movement.y}get offsetX(){return this.offset.x}get offsetY(){return this.offset.y}get globalX(){return this.global.x}get globalY(){return this.global.y}get screenX(){return this.screen.x}get screenY(){return this.screen.y}getLocalPosition(t,e,i){return t.worldTransform.applyInverse(i||this.global,e)}getModifierState(t){return"getModifierState"in this.nativeEvent&&this.nativeEvent.getModifierState(t)}initMouseEvent(t,e,i,r,s,o,n,a,l,h,u,d,c,p,m){throw Error("Method not implemented.")}}class a extends n{constructor(){super(...arguments),this.width=0,this.height=0,this.isPrimary=!1}getCoalescedEvents(){return"pointermove"===this.type||"mousemove"===this.type||"touchmove"===this.type?[this]:[]}getPredictedEvents(){throw Error("getPredictedEvents is not supported!")}}class l extends n{constructor(){super(...arguments),this.DOM_DELTA_PIXEL=0,this.DOM_DELTA_LINE=1,this.DOM_DELTA_PAGE=2}}l.DOM_DELTA_PIXEL=0,l.DOM_DELTA_LINE=1,l.DOM_DELTA_PAGE=2;let h=new r.E9,u=new r.E9;class d{constructor(t){this.dispatch=new r.P6.EventEmitter,this.moveOnAll=!1,this.enableGlobalMoveEvents=!0,this.mappingState={trackingData:{}},this.eventPool=new Map,this._allInteractiveElements=[],this._hitElements=[],this._isPointerMoveEvent=!1,this.rootTarget=t,this.hitPruneFn=this.hitPruneFn.bind(this),this.hitTestFn=this.hitTestFn.bind(this),this.mapPointerDown=this.mapPointerDown.bind(this),this.mapPointerMove=this.mapPointerMove.bind(this),this.mapPointerOut=this.mapPointerOut.bind(this),this.mapPointerOver=this.mapPointerOver.bind(this),this.mapPointerUp=this.mapPointerUp.bind(this),this.mapPointerUpOutside=this.mapPointerUpOutside.bind(this),this.mapWheel=this.mapWheel.bind(this),this.mappingTable={},this.addEventMapping("pointerdown",this.mapPointerDown),this.addEventMapping("pointermove",this.mapPointerMove),this.addEventMapping("pointerout",this.mapPointerOut),this.addEventMapping("pointerleave",this.mapPointerOut),this.addEventMapping("pointerover",this.mapPointerOver),this.addEventMapping("pointerup",this.mapPointerUp),this.addEventMapping("pointerupoutside",this.mapPointerUpOutside),this.addEventMapping("wheel",this.mapWheel)}addEventMapping(t,e){this.mappingTable[t]||(this.mappingTable[t]=[]),this.mappingTable[t].push({fn:e,priority:0}),this.mappingTable[t].sort((t,e)=>t.priority-e.priority)}dispatchEvent(t,e){t.propagationStopped=!1,t.propagationImmediatelyStopped=!1,this.propagate(t,e),this.dispatch.emit(e||t.type,t)}mapEvent(t){if(!this.rootTarget)return;let e=this.mappingTable[t.type];if(e)for(let i=0,r=e.length;i<r;i++)e[i].fn(t);else console.warn(`[EventBoundary]: Event mapping not defined for ${t.type}`)}hitTest(t,e){s.pauseUpdate=!0;let i=this[this._isPointerMoveEvent&&this.enableGlobalMoveEvents?"hitTestMoveRecursive":"hitTestRecursive"](this.rootTarget,this.rootTarget.eventMode,h.set(t,e),this.hitTestFn,this.hitPruneFn);return i&&i[0]}propagate(t,e){if(!t.target)return;let i=t.composedPath();t.eventPhase=t.CAPTURING_PHASE;for(let r=0,s=i.length-1;r<s;r++)if(t.currentTarget=i[r],this.notifyTarget(t,e),t.propagationStopped||t.propagationImmediatelyStopped)return;if(t.eventPhase=t.AT_TARGET,t.currentTarget=t.target,this.notifyTarget(t,e),!(t.propagationStopped||t.propagationImmediatelyStopped)){t.eventPhase=t.BUBBLING_PHASE;for(let r=i.length-2;r>=0;r--)if(t.currentTarget=i[r],this.notifyTarget(t,e),t.propagationStopped||t.propagationImmediatelyStopped)return}}all(t,e,i=this._allInteractiveElements){if(0===i.length)return;t.eventPhase=t.BUBBLING_PHASE;let r=Array.isArray(e)?e:[e];for(let e=i.length-1;e>=0;e--)r.forEach(r=>{t.currentTarget=i[e],this.notifyTarget(t,r)})}propagationPath(t){let e=[t];for(let i=0;i<2048&&t!==this.rootTarget;i++){if(!t.parent)throw Error("Cannot find propagation path to disconnected target");e.push(t.parent),t=t.parent}return e.reverse(),e}hitTestMoveRecursive(t,e,i,r,o,n=!1){let a=!1;if(this._interactivePrune(t))return null;if(("dynamic"===t.eventMode||"dynamic"===e)&&(s.pauseUpdate=!1),t.interactiveChildren&&t.children){let s=t.children;for(let l=s.length-1;l>=0;l--){let h=s[l],u=this.hitTestMoveRecursive(h,this._isInteractive(e)?e:h.eventMode,i,r,o,n||o(t,i));if(u){if(u.length>0&&!u[u.length-1].parent)continue;let e=t.isInteractive();(u.length>0||e)&&(e&&this._allInteractiveElements.push(t),u.push(t)),0===this._hitElements.length&&(this._hitElements=u),a=!0}}}let l=this._isInteractive(e),h=t.isInteractive();return l&&h&&this._allInteractiveElements.push(t),n||this._hitElements.length>0?null:a?this._hitElements:l&&!o(t,i)&&r(t,i)?h?[t]:[]:null}hitTestRecursive(t,e,i,r,o){if(this._interactivePrune(t)||o(t,i))return null;if(("dynamic"===t.eventMode||"dynamic"===e)&&(s.pauseUpdate=!1),t.interactiveChildren&&t.children){let s=t.children;for(let n=s.length-1;n>=0;n--){let a=s[n],l=this.hitTestRecursive(a,this._isInteractive(e)?e:a.eventMode,i,r,o);if(l){if(l.length>0&&!l[l.length-1].parent)continue;let e=t.isInteractive();return(l.length>0||e)&&l.push(t),l}}}let n=this._isInteractive(e),a=t.isInteractive();return n&&r(t,i)?a?[t]:[]:null}_isInteractive(t){return"static"===t||"dynamic"===t}_interactivePrune(t){return!!(!t||t.isMask||!t.visible||!t.renderable||"none"===t.eventMode||"passive"===t.eventMode&&!t.interactiveChildren||t.isMask)}hitPruneFn(t,e){if(t.hitArea&&(t.worldTransform.applyInverse(e,u),!t.hitArea.contains(u.x,u.y)))return!0;if(t._mask){let i=t._mask.isMaskData?t._mask.maskObject:t._mask;if(i&&!i.containsPoint?.(e))return!0}return!1}hitTestFn(t,e){return"passive"!==t.eventMode&&(!!t.hitArea||!!t.containsPoint&&t.containsPoint(e))}notifyTarget(t,e){e=e??t.type;let i=`on${e}`;t.currentTarget[i]?.(t);let r=t.eventPhase===t.CAPTURING_PHASE||t.eventPhase===t.AT_TARGET?`${e}capture`:e;this.notifyListeners(t,r),t.eventPhase===t.AT_TARGET&&this.notifyListeners(t,e)}mapPointerDown(t){if(!(t instanceof a)){console.warn("EventBoundary cannot map a non-pointer event as a pointer event");return}let e=this.createPointerEvent(t);if(this.dispatchEvent(e,"pointerdown"),"touch"===e.pointerType)this.dispatchEvent(e,"touchstart");else if("mouse"===e.pointerType||"pen"===e.pointerType){let t=2===e.button;this.dispatchEvent(e,t?"rightdown":"mousedown")}this.trackingData(t.pointerId).pressTargetsByButton[t.button]=e.composedPath(),this.freeEvent(e)}mapPointerMove(t){if(!(t instanceof a)){console.warn("EventBoundary cannot map a non-pointer event as a pointer event");return}this._allInteractiveElements.length=0,this._hitElements.length=0,this._isPointerMoveEvent=!0;let e=this.createPointerEvent(t);this._isPointerMoveEvent=!1;let i="mouse"===e.pointerType||"pen"===e.pointerType,r=this.trackingData(t.pointerId),s=this.findMountedTarget(r.overTargets);if(r.overTargets?.length>0&&s!==e.target){let r="mousemove"===t.type?"mouseout":"pointerout",o=this.createPointerEvent(t,r,s);if(this.dispatchEvent(o,"pointerout"),i&&this.dispatchEvent(o,"mouseout"),!e.composedPath().includes(s)){let r=this.createPointerEvent(t,"pointerleave",s);for(r.eventPhase=r.AT_TARGET;r.target&&!e.composedPath().includes(r.target);)r.currentTarget=r.target,this.notifyTarget(r),i&&this.notifyTarget(r,"mouseleave"),r.target=r.target.parent;this.freeEvent(r)}this.freeEvent(o)}if(s!==e.target){let r="mousemove"===t.type?"mouseover":"pointerover",o=this.clonePointerEvent(e,r);this.dispatchEvent(o,"pointerover"),i&&this.dispatchEvent(o,"mouseover");let n=s?.parent;for(;n&&n!==this.rootTarget.parent&&n!==e.target;)n=n.parent;if(!n||n===this.rootTarget.parent){let t=this.clonePointerEvent(e,"pointerenter");for(t.eventPhase=t.AT_TARGET;t.target&&t.target!==s&&t.target!==this.rootTarget.parent;)t.currentTarget=t.target,this.notifyTarget(t),i&&this.notifyTarget(t,"mouseenter"),t.target=t.target.parent;this.freeEvent(t)}this.freeEvent(o)}let o=[],n=this.enableGlobalMoveEvents??!0;this.moveOnAll?o.push("pointermove"):this.dispatchEvent(e,"pointermove"),n&&o.push("globalpointermove"),"touch"===e.pointerType&&(this.moveOnAll?o.splice(1,0,"touchmove"):this.dispatchEvent(e,"touchmove"),n&&o.push("globaltouchmove")),i&&(this.moveOnAll?o.splice(1,0,"mousemove"):this.dispatchEvent(e,"mousemove"),n&&o.push("globalmousemove"),this.cursor=e.target?.cursor),o.length>0&&this.all(e,o),this._allInteractiveElements.length=0,this._hitElements.length=0,r.overTargets=e.composedPath(),this.freeEvent(e)}mapPointerOver(t){if(!(t instanceof a)){console.warn("EventBoundary cannot map a non-pointer event as a pointer event");return}let e=this.trackingData(t.pointerId),i=this.createPointerEvent(t),r="mouse"===i.pointerType||"pen"===i.pointerType;this.dispatchEvent(i,"pointerover"),r&&this.dispatchEvent(i,"mouseover"),"mouse"===i.pointerType&&(this.cursor=i.target?.cursor);let s=this.clonePointerEvent(i,"pointerenter");for(s.eventPhase=s.AT_TARGET;s.target&&s.target!==this.rootTarget.parent;)s.currentTarget=s.target,this.notifyTarget(s),r&&this.notifyTarget(s,"mouseenter"),s.target=s.target.parent;e.overTargets=i.composedPath(),this.freeEvent(i),this.freeEvent(s)}mapPointerOut(t){if(!(t instanceof a)){console.warn("EventBoundary cannot map a non-pointer event as a pointer event");return}let e=this.trackingData(t.pointerId);if(e.overTargets){let i="mouse"===t.pointerType||"pen"===t.pointerType,r=this.findMountedTarget(e.overTargets),s=this.createPointerEvent(t,"pointerout",r);this.dispatchEvent(s),i&&this.dispatchEvent(s,"mouseout");let o=this.createPointerEvent(t,"pointerleave",r);for(o.eventPhase=o.AT_TARGET;o.target&&o.target!==this.rootTarget.parent;)o.currentTarget=o.target,this.notifyTarget(o),i&&this.notifyTarget(o,"mouseleave"),o.target=o.target.parent;e.overTargets=null,this.freeEvent(s),this.freeEvent(o)}this.cursor=null}mapPointerUp(t){if(!(t instanceof a)){console.warn("EventBoundary cannot map a non-pointer event as a pointer event");return}let e=performance.now(),i=this.createPointerEvent(t);if(this.dispatchEvent(i,"pointerup"),"touch"===i.pointerType)this.dispatchEvent(i,"touchend");else if("mouse"===i.pointerType||"pen"===i.pointerType){let t=2===i.button;this.dispatchEvent(i,t?"rightup":"mouseup")}let r=this.trackingData(t.pointerId),s=this.findMountedTarget(r.pressTargetsByButton[t.button]),o=s;if(s&&!i.composedPath().includes(s)){let e=s;for(;e&&!i.composedPath().includes(e);){if(i.currentTarget=e,this.notifyTarget(i,"pointerupoutside"),"touch"===i.pointerType)this.notifyTarget(i,"touchendoutside");else if("mouse"===i.pointerType||"pen"===i.pointerType){let t=2===i.button;this.notifyTarget(i,t?"rightupoutside":"mouseupoutside")}e=e.parent}delete r.pressTargetsByButton[t.button],o=e}if(o){let s=this.clonePointerEvent(i,"click");s.target=o,s.path=null,r.clicksByButton[t.button]||(r.clicksByButton[t.button]={clickCount:0,target:s.target,timeStamp:e});let n=r.clicksByButton[t.button];if(n.target===s.target&&e-n.timeStamp<200?++n.clickCount:n.clickCount=1,n.target=s.target,n.timeStamp=e,s.detail=n.clickCount,"mouse"===s.pointerType){let t=2===s.button;this.dispatchEvent(s,t?"rightclick":"click")}else"touch"===s.pointerType&&this.dispatchEvent(s,"tap");this.dispatchEvent(s,"pointertap"),this.freeEvent(s)}this.freeEvent(i)}mapPointerUpOutside(t){if(!(t instanceof a)){console.warn("EventBoundary cannot map a non-pointer event as a pointer event");return}let e=this.trackingData(t.pointerId),i=this.findMountedTarget(e.pressTargetsByButton[t.button]),r=this.createPointerEvent(t);if(i){let s=i;for(;s;)r.currentTarget=s,this.notifyTarget(r,"pointerupoutside"),"touch"===r.pointerType?this.notifyTarget(r,"touchendoutside"):("mouse"===r.pointerType||"pen"===r.pointerType)&&this.notifyTarget(r,2===r.button?"rightupoutside":"mouseupoutside"),s=s.parent;delete e.pressTargetsByButton[t.button]}this.freeEvent(r)}mapWheel(t){if(!(t instanceof l)){console.warn("EventBoundary cannot map a non-wheel event as a wheel event");return}let e=this.createWheelEvent(t);this.dispatchEvent(e),this.freeEvent(e)}findMountedTarget(t){if(!t)return null;let e=t[0];for(let i=1;i<t.length&&t[i].parent===e;i++)e=t[i];return e}createPointerEvent(t,e,i){let r=this.allocateEvent(a);return this.copyPointerData(t,r),this.copyMouseData(t,r),this.copyData(t,r),r.nativeEvent=t.nativeEvent,r.originalEvent=t,r.target=i??this.hitTest(r.global.x,r.global.y)??this._hitElements[0],"string"==typeof e&&(r.type=e),r}createWheelEvent(t){let e=this.allocateEvent(l);return this.copyWheelData(t,e),this.copyMouseData(t,e),this.copyData(t,e),e.nativeEvent=t.nativeEvent,e.originalEvent=t,e.target=this.hitTest(e.global.x,e.global.y),e}clonePointerEvent(t,e){let i=this.allocateEvent(a);return i.nativeEvent=t.nativeEvent,i.originalEvent=t.originalEvent,this.copyPointerData(t,i),this.copyMouseData(t,i),this.copyData(t,i),i.target=t.target,i.path=t.composedPath().slice(),i.type=e??i.type,i}copyWheelData(t,e){e.deltaMode=t.deltaMode,e.deltaX=t.deltaX,e.deltaY=t.deltaY,e.deltaZ=t.deltaZ}copyPointerData(t,e){t instanceof a&&e instanceof a&&(e.pointerId=t.pointerId,e.width=t.width,e.height=t.height,e.isPrimary=t.isPrimary,e.pointerType=t.pointerType,e.pressure=t.pressure,e.tangentialPressure=t.tangentialPressure,e.tiltX=t.tiltX,e.tiltY=t.tiltY,e.twist=t.twist)}copyMouseData(t,e){t instanceof n&&e instanceof n&&(e.altKey=t.altKey,e.button=t.button,e.buttons=t.buttons,e.client.copyFrom(t.client),e.ctrlKey=t.ctrlKey,e.metaKey=t.metaKey,e.movement.copyFrom(t.movement),e.screen.copyFrom(t.screen),e.shiftKey=t.shiftKey,e.global.copyFrom(t.global))}copyData(t,e){e.isTrusted=t.isTrusted,e.srcElement=t.srcElement,e.timeStamp=performance.now(),e.type=t.type,e.detail=t.detail,e.view=t.view,e.which=t.which,e.layer.copyFrom(t.layer),e.page.copyFrom(t.page)}trackingData(t){return this.mappingState.trackingData[t]||(this.mappingState.trackingData[t]={pressTargetsByButton:{},clicksByButton:{},overTarget:null}),this.mappingState.trackingData[t]}allocateEvent(t){this.eventPool.has(t)||this.eventPool.set(t,[]);let e=this.eventPool.get(t).pop()||new t(this);return e.eventPhase=e.NONE,e.currentTarget=null,e.path=null,e.target=null,e}freeEvent(t){if(t.manager!==this)throw Error("It is illegal to free an event not managed by this EventBoundary!");let e=t.constructor;this.eventPool.has(e)||this.eventPool.set(e,[]),this.eventPool.get(e).push(t)}notifyListeners(t,e){let i=t.currentTarget._events[e];if(i&&t.currentTarget.isInteractive()){if("fn"in i)i.once&&t.currentTarget.removeListener(e,i.fn,void 0,!0),i.fn.call(i.context,t);else for(let r=0,s=i.length;r<s&&!t.propagationImmediatelyStopped;r++)i[r].once&&t.currentTarget.removeListener(e,i[r].fn,void 0,!0),i[r].fn.call(i[r].context,t)}}}let c={touchstart:"pointerdown",touchend:"pointerup",touchendoutside:"pointerupoutside",touchmove:"pointermove",touchcancel:"pointercancel"},p=class t{constructor(e){this.supportsTouchEvents="ontouchstart"in globalThis,this.supportsPointerEvents=!!globalThis.PointerEvent,this.domElement=null,this.resolution=1,this.renderer=e,this.rootBoundary=new d(null),s.init(this),this.autoPreventDefault=!0,this.eventsAdded=!1,this.rootPointerEvent=new a(null),this.rootWheelEvent=new l(null),this.cursorStyles={default:"inherit",pointer:"pointer"},this.features=new Proxy({...t.defaultEventFeatures},{set:(t,e,i)=>("globalMove"===e&&(this.rootBoundary.enableGlobalMoveEvents=i),t[e]=i,!0)}),this.onPointerDown=this.onPointerDown.bind(this),this.onPointerMove=this.onPointerMove.bind(this),this.onPointerUp=this.onPointerUp.bind(this),this.onPointerOverOut=this.onPointerOverOut.bind(this),this.onWheel=this.onWheel.bind(this)}static get defaultEventMode(){return this._defaultEventMode}init(e){let{view:i,resolution:r}=this.renderer;this.setTargetElement(i),this.resolution=r,t._defaultEventMode=e.eventMode??"auto",Object.assign(this.features,e.eventFeatures??{}),this.rootBoundary.enableGlobalMoveEvents=this.features.globalMove}resolutionChange(t){this.resolution=t}destroy(){this.setTargetElement(null),this.renderer=null}setCursor(t){t=t||"default";let e=!0;if(globalThis.OffscreenCanvas&&this.domElement instanceof OffscreenCanvas&&(e=!1),this.currentCursor===t)return;this.currentCursor=t;let i=this.cursorStyles[t];if(i)switch(typeof i){case"string":e&&(this.domElement.style.cursor=i);break;case"function":i(t);break;case"object":e&&Object.assign(this.domElement.style,i)}else e&&"string"==typeof t&&!Object.prototype.hasOwnProperty.call(this.cursorStyles,t)&&(this.domElement.style.cursor=t)}get pointer(){return this.rootPointerEvent}onPointerDown(t){if(!this.features.click)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered;let e=this.normalizeToPointerData(t);this.autoPreventDefault&&e[0].isNormalized&&(t.cancelable||!("cancelable"in t))&&t.preventDefault();for(let t=0,i=e.length;t<i;t++){let i=e[t],r=this.bootstrapEvent(this.rootPointerEvent,i);this.rootBoundary.mapEvent(r)}this.setCursor(this.rootBoundary.cursor)}onPointerMove(t){if(!this.features.move)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered,s.pointerMoved();let e=this.normalizeToPointerData(t);for(let t=0,i=e.length;t<i;t++){let i=this.bootstrapEvent(this.rootPointerEvent,e[t]);this.rootBoundary.mapEvent(i)}this.setCursor(this.rootBoundary.cursor)}onPointerUp(t){if(!this.features.click)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered;let e=t.target;t.composedPath&&t.composedPath().length>0&&(e=t.composedPath()[0]);let i=e!==this.domElement?"outside":"",r=this.normalizeToPointerData(t);for(let t=0,e=r.length;t<e;t++){let e=this.bootstrapEvent(this.rootPointerEvent,r[t]);e.type+=i,this.rootBoundary.mapEvent(e)}this.setCursor(this.rootBoundary.cursor)}onPointerOverOut(t){if(!this.features.click)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered;let e=this.normalizeToPointerData(t);for(let t=0,i=e.length;t<i;t++){let i=this.bootstrapEvent(this.rootPointerEvent,e[t]);this.rootBoundary.mapEvent(i)}this.setCursor(this.rootBoundary.cursor)}onWheel(t){if(!this.features.wheel)return;let e=this.normalizeWheelEvent(t);this.rootBoundary.rootTarget=this.renderer.lastObjectRendered,this.rootBoundary.mapEvent(e)}setTargetElement(t){this.removeEvents(),this.domElement=t,s.domElement=t,this.addEvents()}addEvents(){if(this.eventsAdded||!this.domElement)return;s.addTickerListener();let t=this.domElement.style;t&&(globalThis.navigator.msPointerEnabled?(t.msContentZooming="none",t.msTouchAction="none"):this.supportsPointerEvents&&(t.touchAction="none")),this.supportsPointerEvents?(globalThis.document.addEventListener("pointermove",this.onPointerMove,!0),this.domElement.addEventListener("pointerdown",this.onPointerDown,!0),this.domElement.addEventListener("pointerleave",this.onPointerOverOut,!0),this.domElement.addEventListener("pointerover",this.onPointerOverOut,!0),globalThis.addEventListener("pointerup",this.onPointerUp,!0)):(globalThis.document.addEventListener("mousemove",this.onPointerMove,!0),this.domElement.addEventListener("mousedown",this.onPointerDown,!0),this.domElement.addEventListener("mouseout",this.onPointerOverOut,!0),this.domElement.addEventListener("mouseover",this.onPointerOverOut,!0),globalThis.addEventListener("mouseup",this.onPointerUp,!0),this.supportsTouchEvents&&(this.domElement.addEventListener("touchstart",this.onPointerDown,!0),this.domElement.addEventListener("touchend",this.onPointerUp,!0),this.domElement.addEventListener("touchmove",this.onPointerMove,!0))),this.domElement.addEventListener("wheel",this.onWheel,{passive:!0,capture:!0}),this.eventsAdded=!0}removeEvents(){if(!this.eventsAdded||!this.domElement)return;s.removeTickerListener();let t=this.domElement.style;globalThis.navigator.msPointerEnabled?(t.msContentZooming="",t.msTouchAction=""):this.supportsPointerEvents&&(t.touchAction=""),this.supportsPointerEvents?(globalThis.document.removeEventListener("pointermove",this.onPointerMove,!0),this.domElement.removeEventListener("pointerdown",this.onPointerDown,!0),this.domElement.removeEventListener("pointerleave",this.onPointerOverOut,!0),this.domElement.removeEventListener("pointerover",this.onPointerOverOut,!0),globalThis.removeEventListener("pointerup",this.onPointerUp,!0)):(globalThis.document.removeEventListener("mousemove",this.onPointerMove,!0),this.domElement.removeEventListener("mousedown",this.onPointerDown,!0),this.domElement.removeEventListener("mouseout",this.onPointerOverOut,!0),this.domElement.removeEventListener("mouseover",this.onPointerOverOut,!0),globalThis.removeEventListener("mouseup",this.onPointerUp,!0),this.supportsTouchEvents&&(this.domElement.removeEventListener("touchstart",this.onPointerDown,!0),this.domElement.removeEventListener("touchend",this.onPointerUp,!0),this.domElement.removeEventListener("touchmove",this.onPointerMove,!0))),this.domElement.removeEventListener("wheel",this.onWheel,!0),this.domElement=null,this.eventsAdded=!1}mapPositionToPoint(t,e,i){let r=this.domElement.isConnected?this.domElement.getBoundingClientRect():{x:0,y:0,width:this.domElement.width,height:this.domElement.height,left:0,top:0},s=1/this.resolution;t.x=(e-r.left)*(this.domElement.width/r.width)*s,t.y=(i-r.top)*(this.domElement.height/r.height)*s}normalizeToPointerData(t){let e=[];if(this.supportsTouchEvents&&t instanceof TouchEvent)for(let i=0,r=t.changedTouches.length;i<r;i++){let r=t.changedTouches[i];typeof r.button>"u"&&(r.button=0),typeof r.buttons>"u"&&(r.buttons=1),typeof r.isPrimary>"u"&&(r.isPrimary=1===t.touches.length&&"touchstart"===t.type),typeof r.width>"u"&&(r.width=r.radiusX||1),typeof r.height>"u"&&(r.height=r.radiusY||1),typeof r.tiltX>"u"&&(r.tiltX=0),typeof r.tiltY>"u"&&(r.tiltY=0),typeof r.pointerType>"u"&&(r.pointerType="touch"),typeof r.pointerId>"u"&&(r.pointerId=r.identifier||0),typeof r.pressure>"u"&&(r.pressure=r.force||.5),typeof r.twist>"u"&&(r.twist=0),typeof r.tangentialPressure>"u"&&(r.tangentialPressure=0),typeof r.layerX>"u"&&(r.layerX=r.offsetX=r.clientX),typeof r.layerY>"u"&&(r.layerY=r.offsetY=r.clientY),r.isNormalized=!0,r.type=t.type,e.push(r)}else(!globalThis.MouseEvent||t instanceof MouseEvent&&(!this.supportsPointerEvents||!(t instanceof globalThis.PointerEvent)))&&(typeof t.isPrimary>"u"&&(t.isPrimary=!0),typeof t.width>"u"&&(t.width=1),typeof t.height>"u"&&(t.height=1),typeof t.tiltX>"u"&&(t.tiltX=0),typeof t.tiltY>"u"&&(t.tiltY=0),typeof t.pointerType>"u"&&(t.pointerType="mouse"),typeof t.pointerId>"u"&&(t.pointerId=1),typeof t.pressure>"u"&&(t.pressure=.5),typeof t.twist>"u"&&(t.twist=0),typeof t.tangentialPressure>"u"&&(t.tangentialPressure=0),t.isNormalized=!0),e.push(t);return e}normalizeWheelEvent(t){let e=this.rootWheelEvent;return this.transferMouseData(e,t),e.deltaX=t.deltaX,e.deltaY=t.deltaY,e.deltaZ=t.deltaZ,e.deltaMode=t.deltaMode,this.mapPositionToPoint(e.screen,t.clientX,t.clientY),e.global.copyFrom(e.screen),e.offset.copyFrom(e.screen),e.nativeEvent=t,e.type=t.type,e}bootstrapEvent(t,e){return t.originalEvent=null,t.nativeEvent=e,t.pointerId=e.pointerId,t.width=e.width,t.height=e.height,t.isPrimary=e.isPrimary,t.pointerType=e.pointerType,t.pressure=e.pressure,t.tangentialPressure=e.tangentialPressure,t.tiltX=e.tiltX,t.tiltY=e.tiltY,t.twist=e.twist,this.transferMouseData(t,e),this.mapPositionToPoint(t.screen,e.clientX,e.clientY),t.global.copyFrom(t.screen),t.offset.copyFrom(t.screen),t.isTrusted=e.isTrusted,"pointerleave"===t.type&&(t.type="pointerout"),t.type.startsWith("mouse")&&(t.type=t.type.replace("mouse","pointer")),t.type.startsWith("touch")&&(t.type=c[t.type]||t.type),t}transferMouseData(t,e){t.isTrusted=e.isTrusted,t.srcElement=e.srcElement,t.timeStamp=performance.now(),t.type=e.type,t.altKey=e.altKey,t.button=e.button,t.buttons=e.buttons,t.client.x=e.clientX,t.client.y=e.clientY,t.ctrlKey=e.ctrlKey,t.metaKey=e.metaKey,t.movement.x=e.movementX,t.movement.y=e.movementY,t.page.x=e.pageX,t.page.y=e.pageY,t.relatedTarget=null,t.shiftKey=e.shiftKey}};function m(t){return"dynamic"===t||"static"===t}p.extension={name:"events",type:[r.nw.RendererSystem,r.nw.CanvasRendererSystem]},p.defaultEventFeatures={move:!0,globalMove:!0,click:!0,wheel:!0},r.Rw.add(p),i(1365).s$.mixin({onclick:null,onmousedown:null,onmouseenter:null,onmouseleave:null,onmousemove:null,onglobalmousemove:null,onmouseout:null,onmouseover:null,onmouseup:null,onmouseupoutside:null,onpointercancel:null,onpointerdown:null,onpointerenter:null,onpointerleave:null,onpointermove:null,onglobalpointermove:null,onpointerout:null,onpointerover:null,onpointertap:null,onpointerup:null,onpointerupoutside:null,onrightclick:null,onrightdown:null,onrightup:null,onrightupoutside:null,ontap:null,ontouchcancel:null,ontouchend:null,ontouchendoutside:null,ontouchmove:null,onglobaltouchmove:null,ontouchstart:null,onwheel:null,_internalInteractive:void 0,get interactive(){return this._internalInteractive??m(p.defaultEventMode)},set interactive(value){r.P6.deprecation("7.2.0","Setting interactive is deprecated, use eventMode = 'none'/'passive'/'auto'/'static'/'dynamic' instead."),this._internalInteractive=value,this.eventMode=value?"static":"auto"},_internalEventMode:void 0,get eventMode(){return this._internalEventMode??p.defaultEventMode},set eventMode(value){this._internalInteractive=m(value),this._internalEventMode=value},isInteractive(){return"static"===this.eventMode||"dynamic"===this.eventMode},interactiveChildren:!0,hitArea:null,addEventListener(t,e,i){let r="boolean"==typeof i&&i||"object"==typeof i&&i.capture,s="object"==typeof i?i.signal:void 0,o="object"==typeof i&&!0===i.once,n="function"==typeof e?void 0:e;t=r?`${t}capture`:t;let a="function"==typeof e?e:e.handleEvent,l=this;s&&s.addEventListener("abort",()=>{l.off(t,a,n)}),o?l.once(t,a,n):l.on(t,a,n)},removeEventListener(t,e,i){let r="boolean"==typeof i&&i||"object"==typeof i&&i.capture,s="function"==typeof e?void 0:e;t=r?`${t}capture`:t,e="function"==typeof e?e:e.handleEvent,this.off(t,e,s)},dispatchEvent(t){if(!(t instanceof o))throw Error("DisplayObject cannot propagate events outside of the Federated Events API");return t.defaultPrevented=!1,t.path=null,t.target=this,t.manager.dispatchEvent(t),!t.defaultPrevented}})},731:function(t,e,i){let r;i.d(e,{R:()=>a,n:()=>s});var s=((r=s||{}).Renderer="renderer",r.Application="application",r.RendererSystem="renderer-webgl-system",r.RendererPlugin="renderer-webgl-plugin",r.CanvasRendererSystem="renderer-canvas-system",r.CanvasRendererPlugin="renderer-canvas-plugin",r.Asset="asset",r.LoadParser="load-parser",r.ResolveParser="resolve-parser",r.CacheParser="cache-parser",r.DetectionParser="detection-parser",r);let o=t=>{if("function"==typeof t||"object"==typeof t&&t.extension){if(!t.extension)throw Error("Extension class must have an extension object");t={..."object"!=typeof t.extension?{type:t.extension}:t.extension,ref:t}}if("object"==typeof t)t={...t};else throw Error("Invalid extension type");return"string"==typeof t.type&&(t.type=[t.type]),t},n=(t,e)=>o(t).priority??e,a={_addHandlers:{},_removeHandlers:{},_queue:{},remove(...t){return t.map(o).forEach(t=>{t.type.forEach(e=>this._removeHandlers[e]?.(t))}),this},add(...t){return t.map(o).forEach(t=>{t.type.forEach(e=>{let i=this._addHandlers,r=this._queue;i[e]?i[e]?.(t):(r[e]=r[e]||[],r[e]?.push(t))})}),this},handle(t,e,i){let r=this._addHandlers,s=this._removeHandlers;if(r[t]||s[t])throw Error(`Extension type ${t} already has a handler`);r[t]=e,s[t]=i;let o=this._queue;return o[t]&&(o[t]?.forEach(t=>e(t)),delete o[t]),this},handleByMap(t,e){return this.handle(t,t=>{t.name&&(e[t.name]=t.ref)},t=>{t.name&&delete e[t.name]})},handleByList(t,e,i=-1){return this.handle(t,t=>{e.includes(t.ref)||(e.push(t.ref),e.sort((t,e)=>n(e,i)-n(t,i)))},t=>{let i=e.indexOf(t.ref);-1!==i&&e.splice(i,1)})}}},7620:function(t,e,i){i(7781).wn},1413:function(t,e,i){var r=i(7781),s=i(7362),o=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,n=`
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform float threshold;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);

    // A simple & fast algorithm for getting brightness.
    // It's inaccuracy , but good enought for this feature.
    float _max = max(max(color.r, color.g), color.b);
    float _min = min(min(color.r, color.g), color.b);
    float brightness = (_max + _min) * 0.5;

    if(brightness > threshold) {
        gl_FragColor = color;
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}
`;class a extends r.wn{constructor(t=.5){super(o,n),this.threshold=t}get threshold(){return this.uniforms.threshold}set threshold(t){this.uniforms.threshold=t}}var l=`uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform sampler2D bloomTexture;
uniform float bloomScale;
uniform float brightness;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    color.rgb *= brightness;
    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);
    bloomColor.rgb *= bloomScale;
    gl_FragColor = color + bloomColor;
}
`;let h=class extends r.wn{constructor(t){super(o,l),this.bloomScale=1,this.brightness=1,this._resolution=r.Xd.FILTER_RESOLUTION,"number"==typeof t&&(t={threshold:t});let e=Object.assign(h.defaults,t);this.bloomScale=e.bloomScale,this.brightness=e.brightness;let{kernels:i,blur:n,quality:u,pixelSize:d,resolution:c}=e;this._extractFilter=new a(e.threshold),this._extractFilter.resolution=c,this._blurFilter=i?new s.p(i):new s.p(n,u),this.pixelSize=d,this.resolution=c}apply(t,e,i,r,s){let o=t.getFilterTexture();this._extractFilter.apply(t,e,o,1,s);let n=t.getFilterTexture();this._blurFilter.apply(t,o,n,1),this.uniforms.bloomScale=this.bloomScale,this.uniforms.brightness=this.brightness,this.uniforms.bloomTexture=n,t.applyFilter(this,e,i,r),t.returnFilterTexture(n),t.returnFilterTexture(o)}get resolution(){return this._resolution}set resolution(t){this._resolution=t,this._extractFilter&&(this._extractFilter.resolution=t),this._blurFilter&&(this._blurFilter.resolution=t)}get threshold(){return this._extractFilter.threshold}set threshold(t){this._extractFilter.threshold=t}get kernels(){return this._blurFilter.kernels}set kernels(t){this._blurFilter.kernels=t}get blur(){return this._blurFilter.blur}set blur(t){this._blurFilter.blur=t}get quality(){return this._blurFilter.quality}set quality(t){this._blurFilter.quality=t}get pixelSize(){return this._blurFilter.pixelSize}set pixelSize(t){this._blurFilter.pixelSize=t}};h.defaults={threshold:.5,bloomScale:1,brightness:1,kernels:null,blur:8,quality:4,pixelSize:1,resolution:r.Xd.FILTER_RESOLUTION}},176:function(t,e,i){i.d(e,{U:()=>o});var r=i(7781),s=`varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uAlpha;

void main(void)
{
   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;
}
`;class o extends r.wn{constructor(t=1){super(r.kP,s,{uAlpha:1}),this.alpha=t}get alpha(){return this.uniforms.uAlpha}set alpha(t){this.uniforms.uAlpha=t}}},2127:function(t,e,i){i(7781).wn},5452:function(t,e,i){i(7781).wn},4064:function(t,e,i){var r=i(7781);i(176),i(9921),r.wn},9921:function(t,e,i){i.d(e,{T:()=>l,Y:()=>a});var r=i(7781);let s={5:[.153388,.221461,.250301],7:[.071303,.131514,.189879,.214607],9:[.028532,.067234,.124009,.179044,.20236],11:[.0093,.028002,.065984,.121703,.175713,.198596],13:[.002406,.009255,.027867,.065666,.121117,.174868,.197641],15:[489e-6,.002403,.009246,.02784,.065602,.120999,.174697,.197448]},o=["varying vec2 vBlurTexCoords[%size%];","uniform sampler2D uSampler;","void main(void)","{","    gl_FragColor = vec4(0.0);","    %blur%","}"].join(`
`),n=`
    attribute vec2 aVertexPosition;

    uniform mat3 projectionMatrix;

    uniform float strength;

    varying vec2 vBlurTexCoords[%size%];

    uniform vec4 inputSize;
    uniform vec4 outputFrame;

    vec4 filterVertexPosition( void )
    {
        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
    }

    vec2 filterTextureCoord( void )
    {
        return aVertexPosition * (outputFrame.zw * inputSize.zw);
    }

    void main(void)
    {
        gl_Position = filterVertexPosition();

        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;class a extends r.wn{constructor(t,e=8,i=4,a=r.wn.defaultResolution,l=5){super(function(t,e){let i=Math.ceil(t/2),r=n,s="",o;o=e?"vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);":"vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";for(let e=0;e<t;e++){let t=o.replace("%index%",e.toString());s+=t=t.replace("%sampleIndex%",`${e-(i-1)}.0`),s+=`
`}return(r=r.replace("%blur%",s)).replace("%size%",t.toString())}(l,t),function(t){let e;let i=s[t],r=i.length,n=o,a="";for(let s=0;s<t;s++){let o="gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;".replace("%index%",s.toString());e=s,s>=r&&(e=t-s-1),a+=o=o.replace("%value%",i[e].toString()),a+=`
`}return(n=n.replace("%blur%",a)).replace("%size%",t.toString())}(l)),this.horizontal=t,this.resolution=a,this._quality=0,this.quality=i,this.blur=e}apply(t,e,i,s){if(i?this.horizontal?this.uniforms.strength=1/i.width*(i.width/e.width):this.uniforms.strength=1/i.height*(i.height/e.height):this.horizontal?this.uniforms.strength=1/t.renderer.width*(t.renderer.width/e.width):this.uniforms.strength=1/t.renderer.height*(t.renderer.height/e.height),this.uniforms.strength*=this.strength,this.uniforms.strength/=this.passes,1===this.passes)t.applyFilter(this,e,i,s);else{let o=t.getFilterTexture(),n=t.renderer,a=e,l=o;this.state.blend=!1,t.applyFilter(this,a,l,r.yl.CLEAR);for(let e=1;e<this.passes-1;e++){t.bindAndClear(a,r.yl.BLIT),this.uniforms.uSampler=l;let e=l;l=a,a=e,n.shader.bind(this),n.geometry.draw(5)}this.state.blend=!0,t.applyFilter(this,l,i,s),t.returnFilterTexture(o)}}get blur(){return this.strength}set blur(t){this.padding=1+2*Math.abs(t),this.strength=t}get quality(){return this._quality}set quality(t){this._quality=t,this.passes=t}}class l extends r.wn{constructor(t=8,e=4,i=r.wn.defaultResolution,s=5){super(),this._repeatEdgePixels=!1,this.blurXFilter=new a(!0,t,e,i,s),this.blurYFilter=new a(!1,t,e,i,s),this.resolution=i,this.quality=e,this.blur=t,this.repeatEdgePixels=!1}apply(t,e,i,s){let o=Math.abs(this.blurXFilter.strength),n=Math.abs(this.blurYFilter.strength);if(o&&n){let o=t.getFilterTexture();this.blurXFilter.apply(t,e,o,r.yl.CLEAR),this.blurYFilter.apply(t,o,i,s),t.returnFilterTexture(o)}else n?this.blurYFilter.apply(t,e,i,s):this.blurXFilter.apply(t,e,i,s)}updatePadding(){this._repeatEdgePixels?this.padding=0:this.padding=2*Math.max(Math.abs(this.blurXFilter.strength),Math.abs(this.blurYFilter.strength))}get blur(){return this.blurXFilter.blur}set blur(t){this.blurXFilter.blur=this.blurYFilter.blur=t,this.updatePadding()}get quality(){return this.blurXFilter.quality}set quality(t){this.blurXFilter.quality=this.blurYFilter.quality=t}get blurX(){return this.blurXFilter.blur}set blurX(t){this.blurXFilter.blur=t,this.updatePadding()}get blurY(){return this.blurYFilter.blur}set blurY(t){this.blurYFilter.blur=t,this.updatePadding()}get blendMode(){return this.blurYFilter.blendMode}set blendMode(t){this.blurYFilter.blendMode=t}get repeatEdgePixels(){return this._repeatEdgePixels}set repeatEdgePixels(t){this._repeatEdgePixels=t,this.updatePadding()}}},6698:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`uniform float radius;
uniform float strength;
uniform vec2 center;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform vec2 dimensions;

void main()
{
    vec2 coord = vTextureCoord * filterArea.xy;
    coord -= center * dimensions.xy;
    float distance = length(coord);
    if (distance < radius) {
        float percent = distance / radius;
        if (strength > 0.0) {
            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);
        } else {
            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);
        }
    }
    coord += center * dimensions.xy;
    coord /= filterArea.xy;
    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);
    vec4 color = texture2D(uSampler, clampedCoord);
    if (coord != clampedCoord) {
        color *= max(0.0, 1.0 - length(coord - clampedCoord));
    }

    gl_FragColor = color;
}
`;let n=class extends r.wn{constructor(t){super(s,o),this.uniforms.dimensions=new Float32Array(2),Object.assign(this,n.defaults,t)}apply(t,e,i,r){let{width:s,height:o}=e.filterFrame;this.uniforms.dimensions[0]=s,this.uniforms.dimensions[1]=o,t.applyFilter(this,e,i,r)}get radius(){return this.uniforms.radius}set radius(t){this.uniforms.radius=t}get strength(){return this.uniforms.strength}set strength(t){this.uniforms.strength=t}get center(){return this.uniforms.center}set center(t){this.uniforms.center=t}};n.defaults={center:[.5,.5],radius:100,strength:1}},735:function(t,e,i){var r,s=i(7781),o=`const float PI = 3.1415926538;
const float PI_2 = PI*2.;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;
uniform sampler2D uSampler;

const int TYPE_LINEAR = 0;
const int TYPE_RADIAL = 1;
const int TYPE_CONIC = 2;
const int MAX_STOPS = 32;

uniform int uNumStops;
uniform float uAlphas[3*MAX_STOPS];
uniform vec3 uColors[MAX_STOPS];
uniform float uOffsets[MAX_STOPS];
uniform int uType;
uniform float uAngle;
uniform float uAlpha;
uniform int uMaxColors;
uniform bool uReplace;

struct ColorStop {
    float offset;
    vec3 color;
    float alpha;
};

mat2 rotate2d(float angle){
    return mat2(cos(angle), -sin(angle),
    sin(angle), cos(angle));
}

float projectLinearPosition(vec2 pos, float angle){
    vec2 center = vec2(0.5);
    vec2 result = pos - center;
    result = rotate2d(angle) * result;
    result = result + center;
    return clamp(result.x, 0., 1.);
}

float projectRadialPosition(vec2 pos) {
    float r = distance(vFilterCoord, vec2(0.5));
    return clamp(2.*r, 0., 1.);
}

float projectAnglePosition(vec2 pos, float angle) {
    vec2 center = pos - vec2(0.5);
    float polarAngle=atan(-center.y, center.x);
    return mod(polarAngle + angle, PI_2) / PI_2;
}

float projectPosition(vec2 pos, int type, float angle) {
    if (type == TYPE_LINEAR) {
        return projectLinearPosition(pos, angle);
    } else if (type == TYPE_RADIAL) {
        return projectRadialPosition(pos);
    } else if (type == TYPE_CONIC) {
        return projectAnglePosition(pos, angle);
    }

    return pos.y;
}

void main(void) {
    // current/original color
    vec4 currentColor = texture2D(uSampler, vTextureCoord);

    // skip calculations if gradient alpha is 0
    if (0.0 == uAlpha) {
        gl_FragColor = currentColor;
        return;
    }

    // project position
    float y = projectPosition(vFilterCoord, uType, radians(uAngle));

    // check gradient bounds
    float offsetMin = uOffsets[0];
    float offsetMax = 0.0;

    for (int i = 0; i < MAX_STOPS; i++) {
        if (i == uNumStops-1){ // last index
            offsetMax = uOffsets[i];
        }
    }

    if (y  < offsetMin || y > offsetMax) {
        gl_FragColor = currentColor;
        return;
    }

    // limit colors
    if (uMaxColors > 0) {
        float stepSize = 1./float(uMaxColors);
        float stepNumber = float(floor(y/stepSize));
        y = stepSize * (stepNumber + 0.5);// offset by 0.5 to use color from middle of segment
    }

    // find color stops
    ColorStop from;
    ColorStop to;

    for (int i = 0; i < MAX_STOPS; i++) {
        if (y >= uOffsets[i]) {
            from = ColorStop(uOffsets[i], uColors[i], uAlphas[i]);
            to = ColorStop(uOffsets[i+1], uColors[i+1], uAlphas[i+1]);
        }

        if (i == uNumStops-1){ // last index
            break;
        }
    }

    // mix colors from stops
    vec4 colorFrom = vec4(from.color * from.alpha, from.alpha);
    vec4 colorTo = vec4(to.color * to.alpha, to.alpha);

    float segmentHeight = to.offset - from.offset;
    float relativePos = y - from.offset;// position from 0 to [segmentHeight]
    float relativePercent = relativePos / segmentHeight;// position in percent between [from.offset] and [to.offset].

    float gradientAlpha = uAlpha * currentColor.a;
    vec4 gradientColor = mix(colorFrom, colorTo, relativePercent) * gradientAlpha;

    if (uReplace == false) {
        // mix resulting color with current color
        gl_FragColor = gradientColor + currentColor*(1.-gradientColor.a);
    } else {
        // replace with gradient color
        gl_FragColor = gradientColor;
    }
}
`,n=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;
uniform vec4 inputSize;
uniform vec4 outputFrame;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
    vFilterCoord = vTextureCoord * inputSize.xy / outputFrame.zw;
}
`,a=a||{};a.stringify=(r={"visit_linear-gradient":function(t){return r.visit_gradient(t)},"visit_repeating-linear-gradient":function(t){return r.visit_gradient(t)},"visit_radial-gradient":function(t){return r.visit_gradient(t)},"visit_repeating-radial-gradient":function(t){return r.visit_gradient(t)},visit_gradient:function(t){var e=r.visit(t.orientation);return e&&(e+=", "),t.type+"("+e+r.visit(t.colorStops)+")"},visit_shape:function(t){var e=t.value,i=r.visit(t.at),s=r.visit(t.style);return s&&(e+=" "+s),i&&(e+=" at "+i),e},"visit_default-radial":function(t){var e="",i=r.visit(t.at);return i&&(e+=i),e},"visit_extent-keyword":function(t){var e=t.value,i=r.visit(t.at);return i&&(e+=" at "+i),e},"visit_position-keyword":function(t){return t.value},visit_position:function(t){return r.visit(t.value.x)+" "+r.visit(t.value.y)},"visit_%":function(t){return t.value+"%"},visit_em:function(t){return t.value+"em"},visit_px:function(t){return t.value+"px"},visit_literal:function(t){return r.visit_color(t.value,t)},visit_hex:function(t){return r.visit_color("#"+t.value,t)},visit_rgb:function(t){return r.visit_color("rgb("+t.value.join(", ")+")",t)},visit_rgba:function(t){return r.visit_color("rgba("+t.value.join(", ")+")",t)},visit_color:function(t,e){var i=t,s=r.visit(e.length);return s&&(i+=" "+s),i},visit_angular:function(t){return t.value+"deg"},visit_directional:function(t){return"to "+t.value},visit_array:function(t){var e="",i=t.length;return t.forEach(function(t,s){e+=r.visit(t),s<i-1&&(e+=", ")}),e},visit:function(t){if(!t)return"";if(t instanceof Array)return r.visit_array(t,"");if(t.type){var e=r["visit_"+t.type];if(e)return e(t);throw Error("Missing visitor visit_"+t.type)}throw Error("Invalid node.")}},function(t){return r.visit(t)});var a=a||{};a.parse=function(){var t={linearGradient:/^(\-(webkit|o|ms|moz)\-)?(linear\-gradient)/i,repeatingLinearGradient:/^(\-(webkit|o|ms|moz)\-)?(repeating\-linear\-gradient)/i,radialGradient:/^(\-(webkit|o|ms|moz)\-)?(radial\-gradient)/i,repeatingRadialGradient:/^(\-(webkit|o|ms|moz)\-)?(repeating\-radial\-gradient)/i,sideOrCorner:/^to (left (top|bottom)|right (top|bottom)|left|right|top|bottom)/i,extentKeywords:/^(closest\-side|closest\-corner|farthest\-side|farthest\-corner|contain|cover)/,positionKeywords:/^(left|center|right|top|bottom)/i,pixelValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))px/,percentageValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))\%/,emValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))em/,angleValue:/^(-?(([0-9]*\.[0-9]+)|([0-9]+\.?)))deg/,startCall:/^\(/,endCall:/^\)/,comma:/^,/,hexColor:/^\#([0-9a-fA-F]+)/,literalColor:/^([a-zA-Z]+)/,rgbColor:/^rgb/i,rgbaColor:/^rgba/i,number:/^(([0-9]*\.[0-9]+)|([0-9]+\.?))/},e="";function i(t){var i=Error(e+": "+t);throw i.source=e,i}function r(){return s("linear-gradient",t.linearGradient,n)||s("repeating-linear-gradient",t.repeatingLinearGradient,n)||s("radial-gradient",t.radialGradient,a)||s("repeating-radial-gradient",t.repeatingRadialGradient,a)}function s(e,r,s){return o(r,function(r){var o=s();return o&&(y(t.comma)||i("Missing comma before color stops")),{type:e,orientation:o,colorStops:c(p)}})}function o(e,r){var s=y(e);if(s){y(t.startCall)||i("Missing (");var o=r(s);return y(t.endCall)||i("Missing )"),o}}function n(){return v("directional",t.sideOrCorner,1)||v("angular",t.angleValue,1)}function a(){var i,r,s=l();return s&&((i=[]).push(s),r=e,y(t.comma)&&((s=l())?i.push(s):e=r)),i}function l(){var t,e,i=((t=v("shape",/^(circle)/i,0))&&(t.style=g()||h()),t||((e=v("shape",/^(ellipse)/i,0))&&(e.style=f()||h()),e));if(i)i.at=u();else{var r=h();if(r){i=r;var s=u();s&&(i.at=s)}else{var o=d();o&&(i={type:"default-radial",at:o})}}return i}function h(){return v("extent-keyword",t.extentKeywords,1)}function u(){if(v("position",/^at/,0)){var t=d();return t||i("Missing positioning value"),t}}function d(){var t={x:f(),y:f()};if(t.x||t.y)return{type:"position",value:t}}function c(e){var r=e(),s=[];if(r)for(s.push(r);y(t.comma);)(r=e())?s.push(r):i("One extra comma");return s}function p(){var e=v("hex",t.hexColor,1)||o(t.rgbaColor,function(){return{type:"rgba",value:c(m)}})||o(t.rgbColor,function(){return{type:"rgb",value:c(m)}})||v("literal",t.literalColor,0);return e||i("Expected color definition"),e.length=f(),e}function m(){return y(t.number)[1]}function f(){return v("%",t.percentageValue,1)||v("position-keyword",t.positionKeywords,1)||g()}function g(){return v("px",t.pixelValue,1)||v("em",t.emValue,1)}function v(t,e,i){var r=y(e);if(r)return{type:t,value:r[i]}}function y(t){var i,r;return(r=/^[\n\r\t\s]+/.exec(e))&&x(r[0].length),(i=t.exec(e))&&x(i[0].length),i}function x(t){e=e.substr(t)}return function(t){var s;return e=t.toString(),s=c(r),e.length>0&&i("Invalid input not EOF"),s}}();var l=a.parse;a.stringify;var h={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},u={red:0,orange:60,yellow:120,green:180,blue:240,purple:300},d={name:"rgb",min:[0,0,0],max:[255,255,255],channel:["red","green","blue"],alias:["RGB"]},c={min:[0,0,0],max:[360,100,100],rgb:function(t){var e,i,r,s,o,n=t[0]/360,a=t[1]/100,l=t[2]/100;if(0===a)return[o=255*l,o,o];i=l<.5?l*(1+a):l+a-l*a,e=2*l-i,s=[0,0,0];for(var h=0;h<3;h++)(r=n+-(1/3*(h-1)))<0?r++:r>1&&r--,o=6*r<1?e+(i-e)*6*r:2*r<1?i:3*r<2?e+(i-e)*(2/3-r)*6:e,s[h]=255*o;return s}};function p(t){switch(typeof t){case"string":return function(t){let e=function(t){Array.isArray(t)&&t.raw&&(t=String.raw(...arguments));var e,i=function(t){var e,i,r=[],s=1;if("string"==typeof t){if(h[t])r=h[t].slice(),i="rgb";else if("transparent"===t)s=0,i="rgb",r=[0,0,0];else if(/^#[A-Fa-f0-9]+$/.test(t)){var o=t.slice(1),n=o.length;s=1,n<=4?(r=[parseInt(o[0]+o[0],16),parseInt(o[1]+o[1],16),parseInt(o[2]+o[2],16)],4===n&&(s=parseInt(o[3]+o[3],16)/255)):(r=[parseInt(o[0]+o[1],16),parseInt(o[2]+o[3],16),parseInt(o[4]+o[5],16)],8===n&&(s=parseInt(o[6]+o[7],16)/255)),r[0]||(r[0]=0),r[1]||(r[1]=0),r[2]||(r[2]=0),i="rgb"}else if(e=/^((?:rgb|hs[lvb]|hwb|cmyk?|xy[zy]|gray|lab|lchu?v?|[ly]uv|lms)a?)\s*\(([^\)]*)\)/.exec(t)){var a=e[1],l="rgb"===a,o=a.replace(/a$/,"");i=o;var n="cmyk"===o?4:"gray"===o?1:3;r=e[2].trim().split(/\s*[,\/]\s*|\s+/).map(function(t,e){if(/%$/.test(t))return e===n?parseFloat(t)/100:"rgb"===o?255*parseFloat(t)/100:parseFloat(t);if("h"===o[e]){if(/deg$/.test(t))return parseFloat(t);if(void 0!==u[t])return u[t]}return parseFloat(t)}),a===o&&r.push(1),s=l||void 0===r[n]?1:r[n],r=r.slice(0,n)}else t.length>10&&/[0-9](?:\s|\/)/.test(t)&&(r=t.match(/([0-9]+)/g).map(function(t){return parseFloat(t)}),i=t.match(/([a-z])/ig).join("").toLowerCase())}else isNaN(t)?Array.isArray(t)||t.length?(r=[t[0],t[1],t[2]],i="rgb",s=4===t.length?t[3]:1):t instanceof Object&&(null!=t.r||null!=t.red||null!=t.R?(i="rgb",r=[t.r||t.red||t.R||0,t.g||t.green||t.G||0,t.b||t.blue||t.B||0]):(i="hsl",r=[t.h||t.hue||t.H||0,t.s||t.saturation||t.S||0,t.l||t.lightness||t.L||t.b||t.brightness]),s=t.a||t.alpha||t.opacity||1,null!=t.opacity&&(s/=100)):(i="rgb",r=[t>>>16,(65280&t)>>>8,255&t]);return{space:i,values:r,alpha:s}}(t);if(!i.space)return[];let r="h"===i.space[0]?c.min:d.min,s="h"===i.space[0]?c.max:d.max;return(e=[,,,])[0]=Math.min(Math.max(i.values[0],r[0]),s[0]),e[1]=Math.min(Math.max(i.values[1],r[1]),s[1]),e[2]=Math.min(Math.max(i.values[2],r[2]),s[2]),"h"===i.space[0]&&(e=c.rgb(e)),e.push(Math.min(Math.max(i.alpha,0),1)),e}(t);if(!e)throw Error(`Unable to parse color "${t}" as RGBA.`);return[e[0]/255,e[1]/255,e[2]/255,e[3]]}(t);case"number":return s.P6.hex2rgb(t);default:return t}}function m(t){return t.toString().length>6?parseFloat(t.toString().substring(0,6)):t}d.hsl=function(t){var e,i,r=t[0]/255,s=t[1]/255,o=t[2]/255,n=Math.min(r,s,o),a=Math.max(r,s,o),l=a-n;return a===n?e=0:r===a?e=(s-o)/l:s===a?e=2+(o-r)/l:o===a&&(e=4+(r-s)/l),(e=Math.min(60*e,360))<0&&(e+=360),i=(n+a)/2,[e,100*(a===n?0:i<=.5?l/(a+n):l/(2-a-n)),100*i]};var f=Object.defineProperty,g=Object.defineProperties,v=Object.getOwnPropertyDescriptors,y=Object.getOwnPropertySymbols,x=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable,_=(t,e,i)=>e in t?f(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,T=(t,e)=>{for(var i in e||(e={}))x.call(e,i)&&_(t,i,e[i]);if(y)for(var i of y(e))b.call(e,i)&&_(t,i,e[i]);return t},C=(t,e)=>g(t,v(e));let E=class extends s.wn{constructor(t){var e,i;let r;if(!(r=t&&"css"in t?C(T({},function(t){let e;let i=l((e=(e=(e=(e=(e=t.replace(/\s{2,}/gu," ")).replace(/;/g,"")).replace(/ ,/g,",")).replace(/\( /g,"(")).replace(/ \)/g,")")).trim());if(0===i.length)throw Error("Invalid CSS gradient.");if(1!==i.length)throw Error("Unsupported CSS gradient (multiple gradients is not supported).");let r=i[0],s=function(t){let e={"linear-gradient":0,"radial-gradient":1};if(!(t in e))throw Error(`Unsupported gradient type "${t}"`);return e[t]}(r.type);return{type:s,stops:function(t){let e=function(t){let e=[];for(let i=0;i<t.length;i++){let r=t[i],s=-1;"literal"===r.type&&r.length&&"type"in r.length&&"%"===r.length.type&&"value"in r.length&&(s=parseFloat(r.length.value)/100),e.push(s)}let i=t=>{for(let i=t;i<e.length;i++)if(-1!==e[i])return{indexDelta:i-t,offset:e[i]};return{indexDelta:e.length-1-t,offset:1}},r=0;for(let t=0;t<e.length;t++){let s=e[t];if(-1!==s)r=s;else if(0===t)e[t]=0;else if(t+1===e.length)e[t]=1;else{let s=i(t),o=(s.offset-r)/(1+s.indexDelta);for(let i=0;i<=s.indexDelta;i++)e[t+i]=r+(i+1)*o;t+=s.indexDelta,r=e[t]}}return e.map(m)}(t),i=[];for(let r=0;r<t.length;r++){let s=p(function(t){switch(t.type){case"hex":return`#${t.value}`;case"literal":return t.value;default:return`${t.type}(${t.value.join(",")})`}}(t[r]));i.push({offset:e[r],color:s.slice(0,3),alpha:s[3]})}return i}(r.colorStops),angle:function(t){if(void 0===t)return 0;if("type"in t&&"value"in t)switch(t.type){case"angular":return parseFloat(t.value);case"directional":return function(t){let e={left:270,top:0,bottom:180,right:90,"left top":315,"top left":315,"left bottom":225,"bottom left":225,"right top":45,"top right":45,"right bottom":135,"bottom right":135};if(!(t in e))throw Error(`Unsupported directional value "${t}"`);return e[t]}(t.value)}return 0}(r.orientation)}}(t.css||"")),{alpha:null!=(e=t.alpha)?e:E.defaults.alpha,maxColors:null!=(i=t.maxColors)?i:E.defaults.maxColors}):T(T({},E.defaults),t)).stops||r.stops.length<2)throw Error("ColorGradientFilter requires at least 2 color stops.");super(n,o),this._stops=[],this.autoFit=!1,Object.assign(this,r)}get stops(){return this._stops}set stops(t){let e=[...t].sort((t,e)=>t.offset-e.offset),i=new Float32Array(3*e.length);for(let t=0;t<e.length;t++){let r=p(e[t].color),s=3*t;i[s+0]=r[0],i[s+1]=r[1],i[s+2]=r[2]}this.uniforms.uColors=i,this.uniforms.uOffsets=e.map(t=>t.offset),this.uniforms.uAlphas=e.map(t=>t.alpha),this.uniforms.uNumStops=e.length,this._stops=e}set type(t){this.uniforms.uType=t}get type(){return this.uniforms.uType}set angle(t){this.uniforms.uAngle=t-90}get angle(){return this.uniforms.uAngle+90}set alpha(t){this.uniforms.uAlpha=t}get alpha(){return this.uniforms.uAlpha}set maxColors(t){this.uniforms.uMaxColors=t}get maxColors(){return this.uniforms.uMaxColors}set replace(t){this.uniforms.uReplace=t}get replace(){return this.uniforms.uReplace}};E.LINEAR=0,E.RADIAL=1,E.CONIC=2,E.defaults={type:E.LINEAR,stops:[{offset:0,color:0xff0000,alpha:1},{offset:1,color:255,alpha:1}],alpha:1,angle:90,maxColors:0,replace:!1}},7430:function(t,e,i){i(7781).wn},7231:function(t,e,i){i(7781).wn},4629:function(t,e,i){i(7781).wn},967:function(t,e,i){i(7781).wn},5505:function(t,e,i){i(7781).wn},6610:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec2 dimensions;

const float SQRT_2 = 1.414213;

const float light = 1.0;

uniform float curvature;
uniform float lineWidth;
uniform float lineContrast;
uniform bool verticalLine;
uniform float noise;
uniform float noiseSize;

uniform float vignetting;
uniform float vignettingAlpha;
uniform float vignettingBlur;

uniform float seed;
uniform float time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void)
{
    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
    vec2 dir = vec2(vTextureCoord.xy * filterArea.xy / dimensions - vec2(0.5, 0.5));
    
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    vec3 rgb = gl_FragColor.rgb;

    if (noise > 0.0 && noiseSize > 0.0)
    {
        pixelCoord.x = floor(pixelCoord.x / noiseSize);
        pixelCoord.y = floor(pixelCoord.y / noiseSize);
        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;
        rgb += _noise * noise;
    }

    if (lineWidth > 0.0)
    {
        float _c = curvature > 0. ? curvature : 1.;
        float k = curvature > 0. ?(length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;
        vec2 uv = dir * k;

        float v = (verticalLine ? uv.x * dimensions.x : uv.y * dimensions.y) * min(1.0, 2.0 / lineWidth ) / _c;
        float j = 1. + cos(v * 1.2 - time) * 0.5 * lineContrast;
        rgb *= j;
        float segment = verticalLine ? mod((dir.x + .5) * dimensions.x, 4.) : mod((dir.y + .5) * dimensions.y, 4.);
        rgb *= 0.99 + ceil(segment) * 0.015;
    }

    if (vignetting > 0.0)
    {
        float outter = SQRT_2 - vignetting * SQRT_2;
        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);
        rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);
    }

    gl_FragColor.rgb = rgb;
}
`;let n=class extends r.wn{constructor(t){super(s,o),this.time=0,this.seed=0,this.uniforms.dimensions=new Float32Array(2),Object.assign(this,n.defaults,t)}apply(t,e,i,r){let{width:s,height:o}=e.filterFrame;this.uniforms.dimensions[0]=s,this.uniforms.dimensions[1]=o,this.uniforms.seed=this.seed,this.uniforms.time=this.time,t.applyFilter(this,e,i,r)}set curvature(t){this.uniforms.curvature=t}get curvature(){return this.uniforms.curvature}set lineWidth(t){this.uniforms.lineWidth=t}get lineWidth(){return this.uniforms.lineWidth}set lineContrast(t){this.uniforms.lineContrast=t}get lineContrast(){return this.uniforms.lineContrast}set verticalLine(t){this.uniforms.verticalLine=t}get verticalLine(){return this.uniforms.verticalLine}set noise(t){this.uniforms.noise=t}get noise(){return this.uniforms.noise}set noiseSize(t){this.uniforms.noiseSize=t}get noiseSize(){return this.uniforms.noiseSize}set vignetting(t){this.uniforms.vignetting=t}get vignetting(){return this.uniforms.vignetting}set vignettingAlpha(t){this.uniforms.vignettingAlpha=t}get vignettingAlpha(){return this.uniforms.vignettingAlpha}set vignettingBlur(t){this.uniforms.vignettingBlur=t}get vignettingBlur(){return this.uniforms.vignettingBlur}};n.defaults={curvature:1,lineWidth:1,lineContrast:.25,verticalLine:!1,noise:0,noiseSize:1,seed:0,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3,time:0}},7184:function(t,e,i){i(7781).wn},5985:function(t,e,i){var r=i(7362),s=i(7781),o=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,n=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float alpha;
uniform vec3 color;

uniform vec2 shift;
uniform vec4 inputSize;

void main(void){
    vec4 sample = texture2D(uSampler, vTextureCoord - shift * inputSize.zw);

    // Premultiply alpha
    sample.rgb = color.rgb * sample.a;

    // alpha user alpha
    sample *= alpha;

    gl_FragColor = sample;
}`,a=Object.defineProperty,l=Object.getOwnPropertySymbols,h=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable,d=(t,e,i)=>e in t?a(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,c=(t,e)=>{for(var i in e||(e={}))h.call(e,i)&&d(t,i,e[i]);if(l)for(var i of l(e))u.call(e,i)&&d(t,i,e[i]);return t};let p=class extends s.wn{constructor(t){super(),this.angle=45,this._distance=5,this._resolution=s.Xd.FILTER_RESOLUTION;let e=t?c(c({},p.defaults),t):p.defaults,{kernels:i,blur:a,quality:l,pixelSize:h,resolution:u}=e;this._offset=new s.AB(this._updatePadding,this),this._tintFilter=new s.wn(o,n),this._tintFilter.uniforms.color=new Float32Array(4),this._tintFilter.uniforms.shift=this._offset,this._tintFilter.resolution=u,this._blurFilter=i?new r.p(i):new r.p(a,l),this.pixelSize=h,this.resolution=u;let{shadowOnly:d,rotation:m,distance:f,offset:g,alpha:v,color:y}=e;this.shadowOnly=d,void 0!==m&&void 0!==f?(this.rotation=m,this.distance=f):this.offset=g,this.alpha=v,this.color=y}apply(t,e,i,r){let s=t.getFilterTexture();this._tintFilter.apply(t,e,s,1),this._blurFilter.apply(t,s,i,r),!0!==this.shadowOnly&&t.applyFilter(this,e,i,0),t.returnFilterTexture(s)}_updatePadding(){let t=Math.max(Math.abs(this._offset.x),Math.abs(this._offset.y));this.padding=t+2*this.blur}_updateShift(){this._tintFilter.uniforms.shift.set(this.distance*Math.cos(this.angle),this.distance*Math.sin(this.angle))}set offset(t){this._offset.copyFrom(t),this._updatePadding()}get offset(){return this._offset}get resolution(){return this._resolution}set resolution(t){this._resolution=t,this._tintFilter&&(this._tintFilter.resolution=t),this._blurFilter&&(this._blurFilter.resolution=t)}get distance(){return this._distance}set distance(t){s.P6.deprecation("5.3.0","DropShadowFilter distance is deprecated, use offset"),this._distance=t,this._updatePadding(),this._updateShift()}get rotation(){return this.angle/s.ZX}set rotation(t){s.P6.deprecation("5.3.0","DropShadowFilter rotation is deprecated, use offset"),this.angle=t*s.ZX,this._updateShift()}get alpha(){return this._tintFilter.uniforms.alpha}set alpha(t){this._tintFilter.uniforms.alpha=t}get color(){return s.P6.rgb2hex(this._tintFilter.uniforms.color)}set color(t){s.P6.hex2rgb(t,this._tintFilter.uniforms.color)}get kernels(){return this._blurFilter.kernels}set kernels(t){this._blurFilter.kernels=t}get blur(){return this._blurFilter.blur}set blur(t){this._blurFilter.blur=t,this._updatePadding()}get quality(){return this._blurFilter.quality}set quality(t){this._blurFilter.quality=t}get pixelSize(){return this._blurFilter.pixelSize}set pixelSize(t){this._blurFilter.pixelSize=t}};p.defaults={offset:{x:4,y:4},color:0,alpha:.5,shadowOnly:!1,kernels:null,blur:2,quality:3,pixelSize:1,resolution:s.Xd.FILTER_RESOLUTION}},6870:function(t,e,i){i(7781).wn},3505:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`// precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform vec2 dimensions;
uniform float aspect;

uniform sampler2D displacementMap;
uniform float offset;
uniform float sinDir;
uniform float cosDir;
uniform int fillMode;

uniform float seed;
uniform vec2 red;
uniform vec2 green;
uniform vec2 blue;

const int TRANSPARENT = 0;
const int ORIGINAL = 1;
const int LOOP = 2;
const int CLAMP = 3;
const int MIRROR = 4;

void main(void)
{
    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;

    if (coord.x > 1.0 || coord.y > 1.0) {
        return;
    }

    float cx = coord.x - 0.5;
    float cy = (coord.y - 0.5) * aspect;
    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;

    // displacementMap: repeat
    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);

    // displacementMap: mirror
    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);

    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));

    float displacement = (dc.r - dc.g) * (offset / filterArea.x);

    coord = vTextureCoord + vec2(cosDir * displacement, sinDir * displacement * aspect);

    if (fillMode == CLAMP) {
        coord = clamp(coord, filterClamp.xy, filterClamp.zw);
    } else {
        if( coord.x > filterClamp.z ) {
            if (fillMode == TRANSPARENT) {
                discard;
            } else if (fillMode == LOOP) {
                coord.x -= filterClamp.z;
            } else if (fillMode == MIRROR) {
                coord.x = filterClamp.z * 2.0 - coord.x;
            }
        } else if( coord.x < filterClamp.x ) {
            if (fillMode == TRANSPARENT) {
                discard;
            } else if (fillMode == LOOP) {
                coord.x += filterClamp.z;
            } else if (fillMode == MIRROR) {
                coord.x *= -filterClamp.z;
            }
        }

        if( coord.y > filterClamp.w ) {
            if (fillMode == TRANSPARENT) {
                discard;
            } else if (fillMode == LOOP) {
                coord.y -= filterClamp.w;
            } else if (fillMode == MIRROR) {
                coord.y = filterClamp.w * 2.0 - coord.y;
            }
        } else if( coord.y < filterClamp.y ) {
            if (fillMode == TRANSPARENT) {
                discard;
            } else if (fillMode == LOOP) {
                coord.y += filterClamp.w;
            } else if (fillMode == MIRROR) {
                coord.y *= -filterClamp.w;
            }
        }
    }

    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;
    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;
    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;
    gl_FragColor.a = texture2D(uSampler, coord).a;
}
`;let n=class extends r.wn{constructor(t){super(s,o),this.offset=100,this.fillMode=n.TRANSPARENT,this.average=!1,this.seed=0,this.minSize=8,this.sampleSize=512,this._slices=0,this._offsets=new Float32Array(1),this._sizes=new Float32Array(1),this._direction=-1,this.uniforms.dimensions=new Float32Array(2),this._canvas=document.createElement("canvas"),this._canvas.width=4,this._canvas.height=this.sampleSize,this.texture=r.xE.from(this._canvas,{scaleMode:r.aH.NEAREST}),Object.assign(this,n.defaults,t)}apply(t,e,i,r){let{width:s,height:o}=e.filterFrame;this.uniforms.dimensions[0]=s,this.uniforms.dimensions[1]=o,this.uniforms.aspect=o/s,this.uniforms.seed=this.seed,this.uniforms.offset=this.offset,this.uniforms.fillMode=this.fillMode,t.applyFilter(this,e,i,r)}_randomizeSizes(){let t=this._sizes,e=this._slices-1,i=this.sampleSize,r=Math.min(this.minSize/i,.9/this._slices);if(this.average){let i=this._slices,s=1;for(let o=0;o<e;o++){let e=Math.max(s/(i-o)*(1-.6*Math.random()),r);t[o]=e,s-=e}t[e]=s}else{let i=1,s=Math.sqrt(1/this._slices);for(let o=0;o<e;o++){let e=Math.max(s*i*Math.random(),r);t[o]=e,i-=e}t[e]=i}this.shuffle()}shuffle(){let t=this._sizes,e=this._slices-1;for(let i=e;i>0;i--){let e=Math.random()*i>>0,r=t[i];t[i]=t[e],t[e]=r}}_randomizeOffsets(){for(let t=0;t<this._slices;t++)this._offsets[t]=Math.random()*(.5>Math.random()?-1:1)}refresh(){this._randomizeSizes(),this._randomizeOffsets(),this.redraw()}redraw(){let t=this.sampleSize,e=this.texture,i=this._canvas.getContext("2d");i.clearRect(0,0,8,t);let r,s=0;for(let e=0;e<this._slices;e++){r=Math.floor(256*this._offsets[e]);let o=this._sizes[e]*t,n=r>0?r:0,a=r<0?-r:0;i.fillStyle=`rgba(${n}, ${a}, 0, 1)`,i.fillRect(0,s>>0,t,o+1>>0),s+=o}e.baseTexture.update(),this.uniforms.displacementMap=e}set sizes(t){let e=Math.min(this._slices,t.length);for(let i=0;i<e;i++)this._sizes[i]=t[i]}get sizes(){return this._sizes}set offsets(t){let e=Math.min(this._slices,t.length);for(let i=0;i<e;i++)this._offsets[i]=t[i]}get offsets(){return this._offsets}get slices(){return this._slices}set slices(t){this._slices!==t&&(this._slices=t,this.uniforms.slices=t,this._sizes=this.uniforms.slicesWidth=new Float32Array(t),this._offsets=this.uniforms.slicesOffset=new Float32Array(t),this.refresh())}get direction(){return this._direction}set direction(t){if(this._direction===t)return;this._direction=t;let e=t*r.ZX;this.uniforms.sinDir=Math.sin(e),this.uniforms.cosDir=Math.cos(e)}get red(){return this.uniforms.red}set red(t){this.uniforms.red=t}get green(){return this.uniforms.green}set green(t){this.uniforms.green=t}get blue(){return this.uniforms.blue}set blue(t){this.uniforms.blue=t}destroy(){var t;null==(t=this.texture)||t.destroy(!0),this.texture=this._canvas=this.red=this.green=this.blue=this._sizes=this._offsets=null}};n.defaults={slices:5,offset:100,direction:0,fillMode:0,average:!1,seed:0,red:[0,0],green:[0,0],blue:[0,0],minSize:8,sampleSize:512},n.TRANSPARENT=0,n.ORIGINAL=1,n.LOOP=2,n.CLAMP=3,n.MIRROR=4},7918:function(t,e,i){i.d(e,{V:()=>a});var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

uniform float outerStrength;
uniform float innerStrength;

uniform vec4 glowColor;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform bool knockout;
uniform float alpha;

const float PI = 3.14159265358979323846264;

const float DIST = __DIST__;
const float ANGLE_STEP_SIZE = min(__ANGLE_STEP_SIZE__, PI * 2.0);
const float ANGLE_STEP_NUM = ceil(PI * 2.0 / ANGLE_STEP_SIZE);

const float MAX_TOTAL_ALPHA = ANGLE_STEP_NUM * DIST * (DIST + 1.0) / 2.0;

void main(void) {
    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);

    float totalAlpha = 0.0;

    vec2 direction;
    vec2 displaced;
    vec4 curColor;

    for (float angle = 0.0; angle < PI * 2.0; angle += ANGLE_STEP_SIZE) {
       direction = vec2(cos(angle), sin(angle)) * px;

       for (float curDistance = 0.0; curDistance < DIST; curDistance++) {
           displaced = clamp(vTextureCoord + direction * 
                   (curDistance + 1.0), filterClamp.xy, filterClamp.zw);

           curColor = texture2D(uSampler, displaced);

           totalAlpha += (DIST - curDistance) * curColor.a;
       }
    }
    
    curColor = texture2D(uSampler, vTextureCoord);

    float alphaRatio = (totalAlpha / MAX_TOTAL_ALPHA);

    float innerGlowAlpha = (1.0 - alphaRatio) * innerStrength * curColor.a;
    float innerGlowStrength = min(1.0, innerGlowAlpha);
    
    vec4 innerColor = mix(curColor, glowColor, innerGlowStrength);

    float outerGlowAlpha = alphaRatio * outerStrength * (1. - curColor.a);
    float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha);

    if (knockout) {
      float resultAlpha = (outerGlowAlpha + innerGlowAlpha) * alpha;
      gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha);
    }
    else {
      vec4 outerGlowColor = outerGlowStrength * glowColor.rgba * alpha;
      gl_FragColor = innerColor + outerGlowColor;
    }
}
`;let n=class extends r.wn{constructor(t){let e=Object.assign({},n.defaults,t),{outerStrength:i,innerStrength:r,color:a,knockout:l,quality:h,alpha:u}=e,d=Math.round(e.distance);super(s,o.replace(/__ANGLE_STEP_SIZE__/gi,`${(1/h/d).toFixed(7)}`).replace(/__DIST__/gi,`${d.toFixed(0)}.0`)),this.uniforms.glowColor=new Float32Array([0,0,0,1]),this.uniforms.alpha=1,Object.assign(this,{color:a,outerStrength:i,innerStrength:r,padding:d,knockout:l,alpha:u})}get color(){return r.P6.rgb2hex(this.uniforms.glowColor)}set color(t){r.P6.hex2rgb(t,this.uniforms.glowColor)}get outerStrength(){return this.uniforms.outerStrength}set outerStrength(t){this.uniforms.outerStrength=t}get innerStrength(){return this.uniforms.innerStrength}set innerStrength(t){this.uniforms.innerStrength=t}get knockout(){return this.uniforms.knockout}set knockout(t){this.uniforms.knockout=t}get alpha(){return this.uniforms.alpha}set alpha(t){this.uniforms.alpha=t}},a=n;a.defaults={distance:10,outerStrength:4,innerStrength:0,color:0xffffff,quality:.1,knockout:!1,alpha:1}},1015:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`vec3 mod289(vec3 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x)
{
    return mod289(((x * 34.0) + 1.0) * x);
}
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t)
{
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}
float turb(vec3 P, vec3 rep, float lacunarity, float gain)
{
    float sum = 0.0;
    float sc = 1.0;
    float totalgain = 1.0;
    for (float i = 0.0; i < 6.0; i++)
    {
        sum += totalgain * pnoise(P * sc, rep);
        sc *= lacunarity;
        totalgain *= gain;
    }
    return abs(sum);
}
`,n=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec2 dimensions;

uniform vec2 light;
uniform bool parallel;
uniform float aspect;

uniform float gain;
uniform float lacunarity;
uniform float time;
uniform float alpha;

\${perlin}

void main(void) {
    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;

    float d;

    if (parallel) {
        float _cos = light.x;
        float _sin = light.y;
        d = (_cos * coord.x) + (_sin * coord.y * aspect);
    } else {
        float dx = coord.x - light.x / dimensions.x;
        float dy = (coord.y - light.y / dimensions.y) * aspect;
        float dis = sqrt(dx * dx + dy * dy) + 0.00001;
        d = dy / dis;
    }

    vec3 dir = vec3(d, d, 0.0);

    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);
    noise = mix(noise, 0.0, 0.3);
    //fade vertically.
    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);
    mist.a = 1.0;
    // apply user alpha
    mist *= alpha;

    gl_FragColor = texture2D(uSampler, vTextureCoord) + mist;

}
`;let a=class extends r.wn{constructor(t){super(s,n.replace("${perlin}",o)),this.parallel=!0,this.time=0,this._angle=0,this.uniforms.dimensions=new Float32Array(2);let e=Object.assign(a.defaults,t);this._angleLight=new r.E9,this.angle=e.angle,this.gain=e.gain,this.lacunarity=e.lacunarity,this.alpha=e.alpha,this.parallel=e.parallel,this.center=e.center,this.time=e.time}apply(t,e,i,r){let{width:s,height:o}=e.filterFrame;this.uniforms.light=this.parallel?this._angleLight:this.center,this.uniforms.parallel=this.parallel,this.uniforms.dimensions[0]=s,this.uniforms.dimensions[1]=o,this.uniforms.aspect=o/s,this.uniforms.time=this.time,this.uniforms.alpha=this.alpha,t.applyFilter(this,e,i,r)}get angle(){return this._angle}set angle(t){this._angle=t;let e=t*r.ZX;this._angleLight.x=Math.cos(e),this._angleLight.y=Math.sin(e)}get gain(){return this.uniforms.gain}set gain(t){this.uniforms.gain=t}get lacunarity(){return this.uniforms.lacunarity}set lacunarity(t){this.uniforms.lacunarity=t}get alpha(){return this.uniforms.alpha}set alpha(t){this.uniforms.alpha=t}};a.defaults={angle:30,gain:.5,lacunarity:2.5,time:0,parallel:!0,center:[0,0],alpha:1}},3039:function(t,e,i){i(7781).wn},2156:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uHue;
uniform float uAlpha;
uniform bool uColorize;
uniform float uSaturation;
uniform float uLightness;

// https://en.wikipedia.org/wiki/Luma_(video)
const vec3 weight = vec3(0.299, 0.587, 0.114);

float getWeightedAverage(vec3 rgb) {
    return rgb.r * weight.r + rgb.g * weight.g + rgb.b * weight.b;
}

// https://gist.github.com/mairod/a75e7b44f68110e1576d77419d608786?permalink_comment_id=3195243#gistcomment-3195243
const vec3 k = vec3(0.57735, 0.57735, 0.57735);

vec3 hueShift(vec3 color, float angle) {
    float cosAngle = cos(angle);
    return vec3(
    color * cosAngle +
    cross(k, color) * sin(angle) +
    k * dot(k, color) * (1.0 - cosAngle)
    );
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    vec4 result = color;

    // colorize
    if (uColorize) {
        result.rgb = vec3(getWeightedAverage(result.rgb), 0., 0.);
    }

    // hue
    result.rgb = hueShift(result.rgb, uHue);

    // saturation
    // https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/huesaturation.js
    float average = (result.r + result.g + result.b) / 3.0;

    if (uSaturation > 0.) {
        result.rgb += (average - result.rgb) * (1. - 1. / (1.001 - uSaturation));
    } else {
        result.rgb -= (average - result.rgb) * uSaturation;
    }

    // lightness
    result.rgb = mix(result.rgb, vec3(ceil(uLightness)) * color.a, abs(uLightness));

    // alpha
    gl_FragColor = mix(color, result, uAlpha);
}
`;let n=class extends r.wn{constructor(t){super(s,o),this._hue=0,Object.assign(this,Object.assign({},n.defaults,t))}get hue(){return this._hue}set hue(t){this._hue=t,this.uniforms.uHue=this._hue*(Math.PI/180)}get alpha(){return this.uniforms.uAlpha}set alpha(t){this.uniforms.uAlpha=t}get colorize(){return this.uniforms.uColorize}set colorize(t){this.uniforms.uColorize=t}get lightness(){return this.uniforms.uLightness}set lightness(t){this.uniforms.uLightness=t}get saturation(){return this.uniforms.uSaturation}set saturation(t){this.uniforms.uSaturation=t}};n.defaults={hue:0,saturation:0,lightness:0,colorize:!1,alpha:1}},7362:function(t,e,i){i.d(e,{p:()=>a});var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uOffset;

void main(void)
{
    vec4 color = vec4(0.0);

    // Sample top left pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));

    // Sample top right pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));

    // Sample bottom right pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));

    // Sample bottom left pixel
    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));

    // Average
    color *= 0.25;

    gl_FragColor = color;
}`,n=`
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uOffset;
uniform vec4 filterClamp;

void main(void)
{
    vec4 color = vec4(0.0);

    // Sample top left pixel
    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));

    // Sample top right pixel
    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));

    // Sample bottom right pixel
    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));

    // Sample bottom left pixel
    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));

    // Average
    color *= 0.25;

    gl_FragColor = color;
}
`;class a extends r.wn{constructor(t=4,e=3,i=!1){super(s,i?n:o),this._kernels=[],this._blur=4,this._quality=3,this.uniforms.uOffset=new Float32Array(2),this._pixelSize=new r.E9,this.pixelSize=1,this._clamp=i,Array.isArray(t)?this.kernels=t:(this._blur=t,this.quality=e)}apply(t,e,i,r){let s;let o=this._pixelSize.x/e._frame.width,n=this._pixelSize.y/e._frame.height;if(1===this._quality||0===this._blur)s=this._kernels[0]+.5,this.uniforms.uOffset[0]=s*o,this.uniforms.uOffset[1]=s*n,t.applyFilter(this,e,i,r);else{let a=t.getFilterTexture(),l=e,h=a,u,d=this._quality-1;for(let e=0;e<d;e++)s=this._kernels[e]+.5,this.uniforms.uOffset[0]=s*o,this.uniforms.uOffset[1]=s*n,t.applyFilter(this,l,h,1),u=l,l=h,h=u;s=this._kernels[d]+.5,this.uniforms.uOffset[0]=s*o,this.uniforms.uOffset[1]=s*n,t.applyFilter(this,l,i,r),t.returnFilterTexture(a)}}_updatePadding(){this.padding=Math.ceil(this._kernels.reduce((t,e)=>t+e+.5,0))}_generateKernels(){let t=this._blur,e=this._quality,i=[t];if(t>0){let r=t,s=t/e;for(let t=1;t<e;t++)r-=s,i.push(r)}this._kernels=i,this._updatePadding()}get kernels(){return this._kernels}set kernels(t){Array.isArray(t)&&t.length>0?(this._kernels=t,this._quality=t.length,this._blur=Math.max(...t)):(this._kernels=[0],this._quality=1)}get clamp(){return this._clamp}set pixelSize(t){"number"==typeof t?(this._pixelSize.x=t,this._pixelSize.y=t):Array.isArray(t)?(this._pixelSize.x=t[0],this._pixelSize.y=t[1]):t instanceof r.E9?(this._pixelSize.x=t.x,this._pixelSize.y=t.y):(this._pixelSize.x=1,this._pixelSize.y=1)}get pixelSize(){return this._pixelSize}get quality(){return this._quality}set quality(t){this._quality=Math.max(1,Math.round(t)),this._generateKernels()}get blur(){return this._blur}set blur(t){this._blur=t,this._generateKernels()}}},6732:function(t,e,i){i(7781).wn},7779:function(t,e,i){i(7781).wn},4087:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec2 dimensions;

uniform float sepia;
uniform float noise;
uniform float noiseSize;
uniform float scratch;
uniform float scratchDensity;
uniform float scratchWidth;
uniform float vignetting;
uniform float vignettingAlpha;
uniform float vignettingBlur;
uniform float seed;

const float SQRT_2 = 1.414213;
const vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 Overlay(vec3 src, vec3 dst)
{
    // if (dst <= 0.5) then: 2 * src * dst
    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)
    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),
                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),
                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));
}


void main()
{
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    vec3 color = gl_FragColor.rgb;

    if (sepia > 0.0)
    {
        float gray = (color.x + color.y + color.z) / 3.0;
        vec3 grayscale = vec3(gray);

        color = Overlay(SEPIA_RGB, grayscale);

        color = grayscale + sepia * (color - grayscale);
    }

    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;

    if (vignetting > 0.0)
    {
        float outter = SQRT_2 - vignetting * SQRT_2;
        vec2 dir = vec2(vec2(0.5, 0.5) - coord);
        dir.y *= dimensions.y / dimensions.x;
        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);
        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);
    }

    if (scratchDensity > seed && scratch != 0.0)
    {
        float phase = seed * 256.0;
        float s = mod(floor(phase), 2.0);
        float dist = 1.0 / scratchDensity;
        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));
        if (d < seed * 0.6 + 0.4)
        {
            highp float period = scratchDensity * 10.0;

            float xx = coord.x * period + phase;
            float aa = abs(mod(xx, 0.5) * 4.0);
            float bb = mod(floor(xx / 0.5), 2.0);
            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);

            float kk = 2.0 * period;
            float dw = scratchWidth / dimensions.x * (0.75 + seed);
            float dh = dw * kk;

            float tine = (yy - (2.0 - dh));

            if (tine > 0.0) {
                float _sign = sign(scratch);

                tine = s * tine / period + scratch + 0.1;
                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);

                color.rgb *= tine;
            }
        }
    }

    if (noise > 0.0 && noiseSize > 0.0)
    {
        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
        pixelCoord.x = floor(pixelCoord.x / noiseSize);
        pixelCoord.y = floor(pixelCoord.y / noiseSize);
        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);
        // float _noise = snoise(d) * 0.5;
        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;
        color += _noise * noise;
    }

    gl_FragColor.rgb = color;
}
`;let n=class extends r.wn{constructor(t,e=0){super(s,o),this.seed=0,this.uniforms.dimensions=new Float32Array(2),"number"==typeof t?(this.seed=t,t=void 0):this.seed=e,Object.assign(this,n.defaults,t)}apply(t,e,i,r){var s,o;this.uniforms.dimensions[0]=null==(s=e.filterFrame)?void 0:s.width,this.uniforms.dimensions[1]=null==(o=e.filterFrame)?void 0:o.height,this.uniforms.seed=this.seed,t.applyFilter(this,e,i,r)}set sepia(t){this.uniforms.sepia=t}get sepia(){return this.uniforms.sepia}set noise(t){this.uniforms.noise=t}get noise(){return this.uniforms.noise}set noiseSize(t){this.uniforms.noiseSize=t}get noiseSize(){return this.uniforms.noiseSize}set scratch(t){this.uniforms.scratch=t}get scratch(){return this.uniforms.scratch}set scratchDensity(t){this.uniforms.scratchDensity=t}get scratchDensity(){return this.uniforms.scratchDensity}set scratchWidth(t){this.uniforms.scratchWidth=t}get scratchWidth(){return this.uniforms.scratchWidth}set vignetting(t){this.uniforms.vignetting=t}get vignetting(){return this.uniforms.vignetting}set vignettingAlpha(t){this.uniforms.vignettingAlpha=t}get vignettingAlpha(){return this.uniforms.vignettingAlpha}set vignettingBlur(t){this.uniforms.vignettingBlur=t}get vignettingBlur(){return this.uniforms.vignettingBlur}};n.defaults={sepia:.3,noise:.3,noiseSize:1,scratch:.5,scratchDensity:.3,scratchWidth:1,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3}},1843:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterClamp;

uniform float uAlpha;
uniform vec2 uThickness;
uniform vec4 uColor;
uniform bool uKnockout;

const float DOUBLE_PI = 2. * 3.14159265358979323846264;
const float ANGLE_STEP = \${angleStep};

float outlineMaxAlphaAtPos(vec2 pos) {
    if (uThickness.x == 0. || uThickness.y == 0.) {
        return 0.;
    }

    vec4 displacedColor;
    vec2 displacedPos;
    float maxAlpha = 0.;

    for (float angle = 0.; angle <= DOUBLE_PI; angle += ANGLE_STEP) {
        displacedPos.x = vTextureCoord.x + uThickness.x * cos(angle);
        displacedPos.y = vTextureCoord.y + uThickness.y * sin(angle);
        displacedColor = texture2D(uSampler, clamp(displacedPos, filterClamp.xy, filterClamp.zw));
        maxAlpha = max(maxAlpha, displacedColor.a);
    }

    return maxAlpha;
}

void main(void) {
    vec4 sourceColor = texture2D(uSampler, vTextureCoord);
    vec4 contentColor = sourceColor * float(!uKnockout);
    float outlineAlpha = uAlpha * outlineMaxAlphaAtPos(vTextureCoord.xy) * (1.-sourceColor.a);
    vec4 outlineColor = vec4(vec3(uColor) * outlineAlpha, outlineAlpha);
    gl_FragColor = contentColor + outlineColor;
}
`;let n=class extends r.wn{constructor(t=1,e=0,i=.1,r=1,a=!1){super(s,o.replace(/\$\{angleStep\}/,n.getAngleStep(i))),this._thickness=1,this._alpha=1,this._knockout=!1,this.uniforms.uThickness=new Float32Array([0,0]),this.uniforms.uColor=new Float32Array([0,0,0,1]),this.uniforms.uAlpha=r,this.uniforms.uKnockout=a,Object.assign(this,{thickness:t,color:e,quality:i,alpha:r,knockout:a})}static getAngleStep(t){return(2*Math.PI/Math.max(t*n.MAX_SAMPLES,n.MIN_SAMPLES)).toFixed(7)}apply(t,e,i,r){this.uniforms.uThickness[0]=this._thickness/e._frame.width,this.uniforms.uThickness[1]=this._thickness/e._frame.height,this.uniforms.uAlpha=this._alpha,this.uniforms.uKnockout=this._knockout,t.applyFilter(this,e,i,r)}get alpha(){return this._alpha}set alpha(t){this._alpha=t}get color(){return r.P6.rgb2hex(this.uniforms.uColor)}set color(t){r.P6.hex2rgb(t,this.uniforms.uColor)}get knockout(){return this._knockout}set knockout(t){this._knockout=t}get thickness(){return this._thickness}set thickness(t){this._thickness=t,this.padding=t}};n.MIN_SAMPLES=1,n.MAX_SAMPLES=100},2628:function(t,e,i){i(7781).wn},7454:function(t,e,i){i(7781).wn},730:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec4 filterArea;
uniform vec4 filterClamp;
uniform vec2 dimensions;

uniform bool mirror;
uniform float boundary;
uniform vec2 amplitude;
uniform vec2 waveLength;
uniform vec2 alpha;
uniform float time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void)
{
    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;
    vec2 coord = pixelCoord / dimensions;

    if (coord.y < boundary) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        return;
    }

    float k = (coord.y - boundary) / (1. - boundary + 0.0001);
    float areaY = boundary * dimensions.y / filterArea.y;
    float v = areaY + areaY - vTextureCoord.y;
    float y = mirror ? v : vTextureCoord.y;

    float _amplitude = ((amplitude.y - amplitude.x) * k + amplitude.x ) / filterArea.x;
    float _waveLength = ((waveLength.y - waveLength.x) * k + waveLength.x) / filterArea.y;
    float _alpha = (alpha.y - alpha.x) * k + alpha.x;

    float x = vTextureCoord.x + cos(v * 6.28 / _waveLength - time) * _amplitude;
    x = clamp(x, filterClamp.x, filterClamp.z);

    vec4 color = texture2D(uSampler, vec2(x, y));

    gl_FragColor = color * _alpha;
}
`;let n=class extends r.wn{constructor(t){super(s,o),this.time=0,this.uniforms.amplitude=new Float32Array(2),this.uniforms.waveLength=new Float32Array(2),this.uniforms.alpha=new Float32Array(2),this.uniforms.dimensions=new Float32Array(2),Object.assign(this,n.defaults,t)}apply(t,e,i,r){var s,o;this.uniforms.dimensions[0]=null==(s=e.filterFrame)?void 0:s.width,this.uniforms.dimensions[1]=null==(o=e.filterFrame)?void 0:o.height,this.uniforms.time=this.time,t.applyFilter(this,e,i,r)}set mirror(t){this.uniforms.mirror=t}get mirror(){return this.uniforms.mirror}set boundary(t){this.uniforms.boundary=t}get boundary(){return this.uniforms.boundary}set amplitude(t){this.uniforms.amplitude[0]=t[0],this.uniforms.amplitude[1]=t[1]}get amplitude(){return this.uniforms.amplitude}set waveLength(t){this.uniforms.waveLength[0]=t[0],this.uniforms.waveLength[1]=t[1]}get waveLength(){return this.uniforms.waveLength}set alpha(t){this.uniforms.alpha[0]=t[0],this.uniforms.alpha[1]=t[1]}get alpha(){return this.uniforms.alpha}};n.defaults={mirror:!0,boundary:.5,amplitude:[0,20],waveLength:[30,100],alpha:[1,1],time:0}},2444:function(t,e,i){i(7781).wn},6778:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;
uniform vec4 filterClamp;

uniform vec2 center;

uniform float amplitude;
uniform float wavelength;
// uniform float power;
uniform float brightness;
uniform float speed;
uniform float radius;

uniform float time;

const float PI = 3.14159;

void main()
{
    float halfWavelength = wavelength * 0.5 / filterArea.x;
    float maxRadius = radius / filterArea.x;
    float currentRadius = time * speed / filterArea.x;

    float fade = 1.0;

    if (maxRadius > 0.0) {
        if (currentRadius > maxRadius) {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            return;
        }
        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);
    }

    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);
    dir.y *= filterArea.y / filterArea.x;
    float dist = length(dir);

    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        return;
    }

    vec2 diffUV = normalize(dir);

    float diff = (dist - currentRadius) / halfWavelength;

    float p = 1.0 - pow(abs(diff), 2.0);

    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );
    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );

    vec2 offset = diffUV * powDiff / filterArea.xy;

    // Do clamp :
    vec2 coord = vTextureCoord + offset;
    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);
    vec4 color = texture2D(uSampler, clampedCoord);
    if (coord != clampedCoord) {
        color *= max(0.0, 1.0 - length(coord - clampedCoord));
    }

    // No clamp :
    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);

    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;

    gl_FragColor = color;
}
`;let n=class extends r.wn{constructor(t=[0,0],e,i=0){super(s,o),this.center=t,Object.assign(this,n.defaults,e),this.time=i}apply(t,e,i,r){this.uniforms.time=this.time,t.applyFilter(this,e,i,r)}get center(){return this.uniforms.center}set center(t){this.uniforms.center=t}get amplitude(){return this.uniforms.amplitude}set amplitude(t){this.uniforms.amplitude=t}get wavelength(){return this.uniforms.wavelength}set wavelength(t){this.uniforms.wavelength=t}get brightness(){return this.uniforms.brightness}set brightness(t){this.uniforms.brightness=t}get speed(){return this.uniforms.speed}set speed(t){this.uniforms.speed=t}get radius(){return this.uniforms.radius}set radius(t){this.uniforms.radius=t}};n.defaults={amplitude:30,wavelength:160,brightness:1,speed:500,radius:-1}},7552:function(t,e,i){i(7781).wn},2337:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float blur;
uniform float gradientBlur;
uniform vec2 start;
uniform vec2 end;
uniform vec2 delta;
uniform vec2 texSize;

float random(vec3 scale, float seed)
{
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

void main(void)
{
    vec4 color = vec4(0.0);
    float total = 0.0;

    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));
    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;

    for (float t = -30.0; t <= 30.0; t++)
    {
        float percent = (t + offset - 0.5) / 30.0;
        float weight = 1.0 - abs(percent);
        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);
        sample.rgb *= sample.a;
        color += sample * weight;
        total += weight;
    }

    color /= total;
    color.rgb /= color.a + 0.00001;

    gl_FragColor = color;
}
`;class n extends r.wn{constructor(t){var e,i;super(s,o),this.uniforms.blur=t.blur,this.uniforms.gradientBlur=t.gradientBlur,this.uniforms.start=null!=(e=t.start)?e:new r.E9(0,window.innerHeight/2),this.uniforms.end=null!=(i=t.end)?i:new r.E9(600,window.innerHeight/2),this.uniforms.delta=new r.E9(30,30),this.uniforms.texSize=new r.E9(window.innerWidth,window.innerHeight),this.updateDelta()}updateDelta(){this.uniforms.delta.x=0,this.uniforms.delta.y=0}get blur(){return this.uniforms.blur}set blur(t){this.uniforms.blur=t}get gradientBlur(){return this.uniforms.gradientBlur}set gradientBlur(t){this.uniforms.gradientBlur=t}get start(){return this.uniforms.start}set start(t){this.uniforms.start=t,this.updateDelta()}get end(){return this.uniforms.end}set end(t){this.uniforms.end=t,this.updateDelta()}}class a extends n{updateDelta(){let t=this.uniforms.end.x-this.uniforms.start.x,e=this.uniforms.end.y-this.uniforms.start.y,i=Math.sqrt(t*t+e*e);this.uniforms.delta.x=t/i,this.uniforms.delta.y=e/i}}class l extends n{updateDelta(){let t=this.uniforms.end.x-this.uniforms.start.x,e=this.uniforms.end.y-this.uniforms.start.y,i=Math.sqrt(t*t+e*e);this.uniforms.delta.x=-e/i,this.uniforms.delta.y=t/i}}let h=class extends r.wn{constructor(t,e,i,s){super(),"number"==typeof t&&(r.P6.deprecation("5.3.0","TiltShiftFilter constructor arguments is deprecated, use options."),t={blur:t,gradientBlur:e,start:i,end:s}),t=Object.assign({},h.defaults,t),this.tiltShiftXFilter=new a(t),this.tiltShiftYFilter=new l(t)}apply(t,e,i,r){let s=t.getFilterTexture();this.tiltShiftXFilter.apply(t,e,s,1),this.tiltShiftYFilter.apply(t,s,i,r),t.returnFilterTexture(s)}get blur(){return this.tiltShiftXFilter.blur}set blur(t){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=t}get gradientBlur(){return this.tiltShiftXFilter.gradientBlur}set gradientBlur(t){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=t}get start(){return this.tiltShiftXFilter.start}set start(t){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=t}get end(){return this.tiltShiftXFilter.end}set end(t){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=t}};h.defaults={blur:100,gradientBlur:600,start:void 0,end:void 0}},5165:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float radius;
uniform float angle;
uniform vec2 offset;
uniform vec4 filterArea;

vec2 mapCoord( vec2 coord )
{
    coord *= filterArea.xy;
    coord += filterArea.zw;

    return coord;
}

vec2 unmapCoord( vec2 coord )
{
    coord -= filterArea.zw;
    coord /= filterArea.xy;

    return coord;
}

vec2 twist(vec2 coord)
{
    coord -= offset;

    float dist = length(coord);

    if (dist < radius)
    {
        float ratioDist = (radius - dist) / radius;
        float angleMod = ratioDist * ratioDist * angle;
        float s = sin(angleMod);
        float c = cos(angleMod);
        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);
    }

    coord += offset;

    return coord;
}

void main(void)
{

    vec2 coord = mapCoord(vTextureCoord);

    coord = twist(coord);

    coord = unmapCoord(coord);

    gl_FragColor = texture2D(uSampler, coord );

}
`;let n=class extends r.wn{constructor(t){super(s,o),Object.assign(this,n.defaults,t)}get offset(){return this.uniforms.offset}set offset(t){this.uniforms.offset=t}get radius(){return this.uniforms.radius}set radius(t){this.uniforms.radius=t}get angle(){return this.uniforms.angle}set angle(t){this.uniforms.angle=t}};n.defaults={radius:200,angle:4,padding:20,offset:new r.E9}},431:function(t,e,i){var r=i(7781),s=`attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`,o=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec4 filterArea;

uniform vec2 uCenter;
uniform float uStrength;
uniform float uInnerRadius;
uniform float uRadius;

const float MAX_KERNEL_SIZE = \${maxKernelSize};

// author: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand(vec2 co, float seed) {
    const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    highp float dt = dot(co + seed, vec2(a, b)), sn = mod(dt, 3.14159);
    return fract(sin(sn) * c + seed);
}

void main() {

    float minGradient = uInnerRadius * 0.3;
    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;

    float gradient = uRadius * 0.3;
    float radius = (uRadius - gradient * 0.5) / filterArea.x;

    float countLimit = MAX_KERNEL_SIZE;

    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);
    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));

    float strength = uStrength;

    float delta = 0.0;
    float gap;
    if (dist < innerRadius) {
        delta = innerRadius - dist;
        gap = minGradient;
    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity
        delta = dist - radius;
        gap = gradient;
    }

    if (delta > 0.0) {
        float normalCount = gap / filterArea.x;
        delta = (normalCount - delta) / normalCount;
        countLimit *= delta;
        strength *= delta;
        if (countLimit < 1.0)
        {
            gl_FragColor = texture2D(uSampler, vTextureCoord);
            return;
        }
    }

    // randomize the lookup values to hide the fixed number of samples
    float offset = rand(vTextureCoord, 0.0);

    float total = 0.0;
    vec4 color = vec4(0.0);

    dir *= strength;

    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {
        float percent = (t + offset) / MAX_KERNEL_SIZE;
        float weight = 4.0 * (percent - percent * percent);
        vec2 p = vTextureCoord + dir * percent;
        vec4 sample = texture2D(uSampler, p);

        // switch to pre-multiplied alpha to correctly blur transparent images
        // sample.rgb *= sample.a;

        color += sample * weight;
        total += weight;

        if (t > countLimit){
            break;
        }
    }

    color /= total;
    // switch back from pre-multiplied alpha
    // color.rgb /= color.a + 0.00001;

    gl_FragColor = color;
}
`,n=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,h=(t,e)=>{var i={};for(var r in t)a.call(t,r)&&0>e.indexOf(r)&&(i[r]=t[r]);if(null!=t&&n)for(var r of n(t))0>e.indexOf(r)&&l.call(t,r)&&(i[r]=t[r]);return i};let u=class extends r.wn{constructor(t){let e=Object.assign(u.defaults,t),{maxKernelSize:i}=e,r=h(e,["maxKernelSize"]);super(s,o.replace("${maxKernelSize}",i.toFixed(1))),Object.assign(this,r)}get center(){return this.uniforms.uCenter}set center(t){this.uniforms.uCenter=t}get strength(){return this.uniforms.uStrength}set strength(t){this.uniforms.uStrength=t}get innerRadius(){return this.uniforms.uInnerRadius}set innerRadius(t){this.uniforms.uInnerRadius=t}get radius(){return this.uniforms.uRadius}set radius(t){(t<0||t===1/0)&&(t=-1),this.uniforms.uRadius=t}};u.defaults={strength:.1,center:[0,0],innerRadius:0,radius:-1,maxKernelSize:32}},6050:function(t,e,i){let r,s;i.d(e,{S:()=>d,TC:()=>I,$o:()=>c,yR:()=>O});var o=i(7781);let n={build(t){let e,i,r,s,n,a;let l=t.points;if(t.type===o.HS.CIRC){let o=t.shape;e=o.x,i=o.y,n=a=o.radius,r=s=0}else if(t.type===o.HS.ELIP){let o=t.shape;e=o.x,i=o.y,n=o.width,a=o.height,r=s=0}else{let o=t.shape,l=o.width/2,h=o.height/2;e=o.x+l,i=o.y+h,n=a=Math.max(0,Math.min(o.radius,Math.min(l,h))),r=l-n,s=h-a}if(!(n>=0&&a>=0&&r>=0&&s>=0)){l.length=0;return}let h=Math.ceil(2.3*Math.sqrt(n+a)),u=8*h+4*!!r+4*!!s;if(l.length=u,0===u)return;if(0===h){l.length=8,l[0]=l[6]=e+r,l[1]=l[3]=i+s,l[2]=l[4]=e-r,l[5]=l[7]=i-s;return}let d=0,c=4*h+2*!!r+2,p=c,m=u;{let t=r+n,o=s,a=e+t,h=e-t,u=i+o;if(l[d++]=a,l[d++]=u,l[--c]=u,l[--c]=h,s){let t=i-o;l[p++]=h,l[p++]=t,l[--m]=t,l[--m]=a}}for(let t=1;t<h;t++){let o=Math.PI/2*(t/h),u=r+Math.cos(o)*n,f=s+Math.sin(o)*a,g=e+u,v=e-u,y=i+f,x=i-f;l[d++]=g,l[d++]=y,l[--c]=y,l[--c]=v,l[p++]=v,l[p++]=x,l[--m]=x,l[--m]=g}{let t=r,o=s+a,n=e+t,h=e-t,u=i+o,c=i-o;l[d++]=n,l[d++]=u,l[--m]=c,l[--m]=n,r&&(l[d++]=h,l[d++]=u,l[--m]=c,l[--m]=h)}},triangulate(t,e){let i,r;let s=t.points,n=e.points,a=e.indices;if(0===s.length)return;let l=n.length/2,h=l;if(t.type!==o.HS.RREC){let e=t.shape;i=e.x,r=e.y}else{let e=t.shape;i=e.x+e.width/2,r=e.y+e.height/2}let u=t.matrix;n.push(t.matrix?u.a*i+u.c*r+u.tx:i,t.matrix?u.b*i+u.d*r+u.ty:r),l++,n.push(s[0],s[1]);for(let t=2;t<s.length;t+=2)n.push(s[t],s[t+1]),a.push(l++,h,l);a.push(h+1,h,l)}};function a(t,e=!1){let i=t.length;if(i<6)return;let r=0;for(let e=0,s=t[i-2],o=t[i-1];e<i;e+=2){let i=t[e],n=t[e+1];r+=(i-s)*(n+o),s=i,o=n}if(!e&&r>0||e&&r<=0){let e=i/2;for(let r=e+e%2;r<i;r+=2){let e=i-r-2,s=i-r-1,o=r,n=r+1;[t[e],t[o]]=[t[o],t[e]],[t[s],t[n]]=[t[n],t[s]]}}}let l={build(t){t.points=t.shape.points.slice()},triangulate(t,e){let i=t.points,r=t.holes,s=e.points,n=e.indices;if(i.length>=6){a(i,!1);let t=[];for(let e=0;e<r.length;e++){let s=r[e];a(s.points,!0),t.push(i.length/2),i=i.concat(s.points)}let e=o.P6.earcut(i,t,2);if(!e)return;let l=s.length/2;for(let t=0;t<e.length;t+=3)n.push(e[t]+l),n.push(e[t+1]+l),n.push(e[t+2]+l);for(let t=0;t<i.length;t++)s.push(i[t])}}},h={build(t){let e=t.shape,i=e.x,r=e.y,s=e.width,o=e.height,n=t.points;n.length=0,s>=0&&o>=0&&n.push(i,r,i+s,r,i+s,r+o,i,r+o)},triangulate(t,e){let i=t.points,r=e.points;if(0===i.length)return;let s=r.length/2;r.push(i[0],i[1],i[2],i[3],i[6],i[7],i[4],i[5]),e.indices.push(s,s+1,s+2,s+1,s+2,s+3)}},u={build(t){n.build(t)},triangulate(t,e){n.triangulate(t,e)}};var d=((r=d||{}).MITER="miter",r.BEVEL="bevel",r.ROUND="round",r),c=((s=c||{}).BUTT="butt",s.ROUND="round",s.SQUARE="square",s);let p={adaptive:!0,maxLength:10,minSegments:8,maxSegments:2048,epsilon:1e-4,_segmentsCount(t,e=20){if(!this.adaptive||!t||isNaN(t))return e;let i=Math.ceil(t/this.maxLength);return i<this.minSegments?i=this.minSegments:i>this.maxSegments&&(i=this.maxSegments),i}};class m{static curveTo(t,e,i,r,s,o){let n=o[o.length-2],a=o[o.length-1]-e,l=n-t,h=r-e,u=i-t,d=Math.abs(a*u-l*h);if(d<1e-8||0===s)return(o[o.length-2]!==t||o[o.length-1]!==e)&&o.push(t,e),null;let c=a*a+l*l,p=h*h+u*u,m=a*h+l*u,f=s*Math.sqrt(c)/d,g=s*Math.sqrt(p)/d,v=f*m/c,y=g*m/p,x=f*u+g*l,b=f*h+g*a,_=Math.atan2(a*(g+v)-b,l*(g+v)-x),T=Math.atan2(h*(f+y)-b,u*(f+y)-x);return{cx:x+t,cy:b+e,radius:s,startAngle:_,endAngle:T,anticlockwise:l*h>u*a}}static arc(t,e,i,r,s,n,a,l,h){let u=a-n,d=p._segmentsCount(Math.abs(u)*s,40*Math.ceil(Math.abs(u)/o._b)),c=u/(2*d),m=2*c,f=Math.cos(c),g=Math.sin(c),v=d-1,y=v%1/v;for(let t=0;t<=v;++t){let e=c+n+m*(t+y*t),o=Math.cos(e),a=-Math.sin(e);h.push((f*o+g*a)*s+i,(-(f*a)+g*o)*s+r)}}}class f{static curveLength(t,e,i,r,s,o,n,a){let l=0,h=0,u=0,d=0,c=0,p=0,m=0,f=0,g=0,v=0,y=0,x=t,b=e;for(let _=1;_<=10;++_)d=(u=(h=_/10)*h)*h,f=(m=(p=(c=1-h)*c)*c)*t+3*p*h*i+3*c*u*s+d*n,g=m*e+3*p*h*r+3*c*u*o+d*a,v=x-f,y=b-g,x=f,b=g,l+=Math.sqrt(v*v+y*y);return l}static curveTo(t,e,i,r,s,o,n){let a=n[n.length-2],l=n[n.length-1];n.length-=2;let h=p._segmentsCount(f.curveLength(a,l,t,e,i,r,s,o)),u=0,d=0,c=0,m=0,g=0;n.push(a,l);for(let p=1,f=0;p<=h;++p)c=(d=(u=1-(f=p/h))*u)*u,g=(m=f*f)*f,n.push(c*a+3*d*f*t+3*u*m*i+g*s,c*l+3*d*f*e+3*u*m*r+g*o)}}function g(t,e,i,r,s,o,n,a){let l,h;n?(l=r,h=-i):(l=-r,h=i);let u=t-i*s+l,d=e-r*s+h,c=t+i*o+l,p=e+r*o+h;return a.push(u,d,c,p),2}function v(t,e,i,r,s,o,n,a){let l=i-t,h=r-e,u=Math.atan2(l,h),d=Math.atan2(s-t,o-e);a&&u<d?u+=2*Math.PI:!a&&u>d&&(d+=2*Math.PI);let c=u,p=d-u,m=Math.sqrt(l*l+h*h),f=(15*Math.abs(p)*Math.sqrt(m)/Math.PI>>0)+1,g=p/f;if(c+=g,a){n.push(t,e,i,r);for(let i=1,r=c;i<f;i++,r+=g)n.push(t,e,t+Math.sin(r)*m,e+Math.cos(r)*m);n.push(t,e,s,o)}else{n.push(i,r,t,e);for(let i=1,r=c;i<f;i++,r+=g)n.push(t+Math.sin(r)*m,e+Math.cos(r)*m,t,e);n.push(s,o,t,e)}return 2*f}function y(t,e){t.lineStyle.native?function(t,e){let i=0,r=t.shape,s=t.points||r.points,n=r.type!==o.HS.POLY||r.closeStroke;if(0===s.length)return;let a=e.points,l=e.indices,h=s.length/2,u=a.length/2,d=u;for(a.push(s[0],s[1]),i=1;i<h;i++)a.push(s[2*i],s[2*i+1]),l.push(d,d+1),d++;n&&l.push(d,u)}(t,e):function(t,e){let i=t.shape,r=t.points||i.points.slice(),s=e.closePointEps;if(0===r.length)return;let n=t.lineStyle,a=new o.E9(r[0],r[1]),l=new o.E9(r[r.length-2],r[r.length-1]),h=i.type!==o.HS.POLY||i.closeStroke,u=Math.abs(a.x-l.x)<s&&Math.abs(a.y-l.y)<s;if(h){r=r.slice(),u&&(r.pop(),r.pop(),l.set(r[r.length-2],r[r.length-1]));let t=(a.x+l.x)*.5,e=(l.y+a.y)*.5;r.unshift(t,e),r.push(t,e)}let m=e.points,f=r.length/2,y=r.length,x=m.length/2,b=n.width/2,_=b*b,T=n.miterLimit*n.miterLimit,C=r[0],E=r[1],P=r[2],w=r[3],S=0,A=0,M=-(E-w),D=C-P,F=0,I=0,O=Math.sqrt(M*M+D*D);M/=O,D/=O,M*=b,D*=b;let R=n.alignment,k=(1-R)*2,z=2*R;h||(n.cap===c.ROUND?y+=v(C-M*(k-z)*.5,E-D*(k-z)*.5,C-M*k,E-D*k,C+M*z,E+D*z,m,!0)+2:n.cap===c.SQUARE&&(y+=g(C,E,M,D,k,z,!0,m))),m.push(C-M*k,E-D*k,C+M*z,E+D*z);for(let t=1;t<f-1;++t){C=r[(t-1)*2],E=r[(t-1)*2+1],P=r[2*t],w=r[2*t+1],S=r[(t+1)*2],A=r[(t+1)*2+1],O=Math.sqrt((M=-(E-w))*M+(D=C-P)*D),M/=O,D/=O,M*=b,D*=b,O=Math.sqrt((F=-(w-A))*F+(I=P-S)*I),F/=O,I/=O,F*=b,I*=b;let e=P-C,i=E-w,s=P-S,o=A-w,a=e*s+i*o,l=i*s-o*e,h=l<0;if(Math.abs(l)<.001*Math.abs(a)){m.push(P-M*k,w-D*k,P+M*z,w+D*z),a>=0&&(n.join===d.ROUND?y+=v(P,w,P-M*k,w-D*k,P-F*k,w-I*k,m,!1)+4:y+=2,m.push(P-F*z,w-I*z,P+F*k,w+I*k));continue}let u=(-M+C)*(-D+w)-(-M+P)*(-D+E),c=(-F+S)*(-I+w)-(-F+P)*(-I+A),p=(e*c-s*u)/l,f=(o*u-i*c)/l,g=(p-P)*(p-P)+(f-w)*(f-w),x=P+(p-P)*k,R=w+(f-w)*k,L=P-(p-P)*z,B=w-(f-w)*z,N=h?k:z,X=g<=Math.min(e*e+i*i,s*s+o*o)+N*N*_,Y=n.join;if(Y===d.MITER&&g/_>T&&(Y=d.BEVEL),X)switch(Y){case d.MITER:m.push(x,R,L,B);break;case d.BEVEL:h?m.push(x,R,P+M*z,w+D*z,x,R,P+F*z,w+I*z):m.push(P-M*k,w-D*k,L,B,P-F*k,w-I*k,L,B),y+=2;break;case d.ROUND:h?(m.push(x,R,P+M*z,w+D*z),y+=v(P,w,P+M*z,w+D*z,P+F*z,w+I*z,m,!0)+4,m.push(x,R,P+F*z,w+I*z)):(m.push(P-M*k,w-D*k,L,B),y+=v(P,w,P-M*k,w-D*k,P-F*k,w-I*k,m,!1)+4,m.push(P-F*k,w-I*k,L,B))}else{switch(m.push(P-M*k,w-D*k,P+M*z,w+D*z),Y){case d.MITER:h?m.push(L,B,L,B):m.push(x,R,x,R),y+=2;break;case d.ROUND:h?y+=v(P,w,P+M*z,w+D*z,P+F*z,w+I*z,m,!0)+2:y+=v(P,w,P-M*k,w-D*k,P-F*k,w-I*k,m,!1)+2}m.push(P-F*k,w-I*k,P+F*z,w+I*z),y+=2}}C=r[(f-2)*2],E=r[(f-2)*2+1],P=r[(f-1)*2],O=Math.sqrt((M=-(E-(w=r[(f-1)*2+1])))*M+(D=C-P)*D),M/=O,D/=O,M*=b,D*=b,m.push(P-M*k,w-D*k,P+M*z,w+D*z),h||(n.cap===c.ROUND?y+=v(P-M*(k-z)*.5,w-D*(k-z)*.5,P-M*k,w-D*k,P+M*z,w+D*z,m,!1)+2:n.cap===c.SQUARE&&(y+=g(P,w,M,D,k,z,!1,m)));let L=e.indices,B=p.epsilon*p.epsilon;for(let t=x;t<y+x-2;++t)C=m[2*t],E=m[2*t+1],P=m[(t+1)*2],w=m[(t+1)*2+1],S=m[(t+2)*2],Math.abs(C*(w-(A=m[(t+2)*2+1]))+P*(A-E)+S*(E-w))<B||L.push(t,t+1,t+2)}(t,e)}class x{static curveLength(t,e,i,r,s,o){let n=t-2*i+s,a=e-2*r+o,l=2*i-2*t,h=2*r-2*e,u=4*(n*n+a*a),d=4*(n*l+a*h),c=l*l+h*h,p=2*Math.sqrt(u+d+c),m=Math.sqrt(u),f=2*u*m,g=2*Math.sqrt(c),v=d/m;return(f*p+m*d*(p-g)+(4*c*u-d*d)*Math.log((2*m+v+p)/(v+g)))/(4*f)}static curveTo(t,e,i,r,s){let o=s[s.length-2],n=s[s.length-1],a=p._segmentsCount(x.curveLength(o,n,t,e,i,r)),l=0,h=0;for(let u=1;u<=a;++u){let d=u/a;l=o+(t-o)*d,h=n+(e-n)*d,s.push(l+(t+(i-t)*d-l)*d,h+(e+(r-e)*d-h)*d)}}}let b={[o.HS.POLY]:l,[o.HS.CIRC]:n,[o.HS.ELIP]:n,[o.HS.RECT]:h,[o.HS.RREC]:u},_=[],T=[];var C=i(1365);class E{constructor(t,e=null,i=null,r=null){this.points=[],this.holes=[],this.shape=t,this.lineStyle=i,this.fillStyle=e,this.matrix=r,this.type=t.type}clone(){return new E(this.shape,this.fillStyle,this.lineStyle,this.matrix)}destroy(){this.shape=null,this.holes.length=0,this.holes=null,this.points.length=0,this.points=null,this.lineStyle=null,this.fillStyle=null}}class P{constructor(){this.reset()}begin(t,e,i){this.reset(),this.style=t,this.start=e,this.attribStart=i}end(t,e){this.attribSize=e-this.attribStart,this.size=t-this.start}reset(){this.style=null,this.size=0,this.start=0,this.attribStart=0,this.attribSize=0}}let w=new o.E9,S=class t extends o.JZ{constructor(){super(),this.closePointEps=1e-4,this.boundsPadding=0,this.uvsFloat32=null,this.indicesUint16=null,this.batchable=!1,this.points=[],this.colors=[],this.uvs=[],this.indices=[],this.textureIds=[],this.graphicsData=[],this.drawCalls=[],this.batchDirty=-1,this.batches=[],this.dirty=0,this.cacheDirty=-1,this.clearDirty=0,this.shapeIndex=0,this._bounds=new C.YZ,this.boundsDirty=-1}get bounds(){return this.updateBatches(),this.boundsDirty!==this.dirty&&(this.boundsDirty=this.dirty,this.calculateBounds()),this._bounds}invalidate(){this.boundsDirty=-1,this.dirty++,this.batchDirty++,this.shapeIndex=0,this.points.length=0,this.colors.length=0,this.uvs.length=0,this.indices.length=0,this.textureIds.length=0;for(let t=0;t<this.drawCalls.length;t++)this.drawCalls[t].texArray.clear(),T.push(this.drawCalls[t]);this.drawCalls.length=0;for(let t=0;t<this.batches.length;t++){let e=this.batches[t];e.reset(),_.push(e)}this.batches.length=0}clear(){return this.graphicsData.length>0&&(this.invalidate(),this.clearDirty++,this.graphicsData.length=0),this}drawShape(t,e=null,i=null,r=null){let s=new E(t,e,i,r);return this.graphicsData.push(s),this.dirty++,this}drawHole(t,e=null){if(!this.graphicsData.length)return null;let i=new E(t,null,null,e),r=this.graphicsData[this.graphicsData.length-1];return i.lineStyle=r.lineStyle,r.holes.push(i),this.dirty++,this}destroy(){super.destroy();for(let t=0;t<this.graphicsData.length;++t)this.graphicsData[t].destroy();this.points.length=0,this.points=null,this.colors.length=0,this.colors=null,this.uvs.length=0,this.uvs=null,this.indices.length=0,this.indices=null,this.indexBuffer.destroy(),this.indexBuffer=null,this.graphicsData.length=0,this.graphicsData=null,this.drawCalls.length=0,this.drawCalls=null,this.batches.length=0,this.batches=null,this._bounds=null}containsPoint(t){let e=this.graphicsData;for(let i=0;i<e.length;++i){let r=e[i];if(r.fillStyle.visible&&r.shape&&(r.matrix?r.matrix.applyInverse(t,w):w.copyFrom(t),r.shape.contains(w.x,w.y))){let t=!1;if(r.holes){for(let e=0;e<r.holes.length;e++)if(r.holes[e].shape.contains(w.x,w.y)){t=!0;break}}if(!t)return!0}}return!1}updateBatches(){if(!this.graphicsData.length){this.batchable=!0;return}if(!this.validateBatching())return;this.cacheDirty=this.dirty;let t=this.uvs,e=this.graphicsData,i=null,r=null;this.batches.length>0&&(r=(i=this.batches[this.batches.length-1]).style);for(let s=this.shapeIndex;s<e.length;s++){this.shapeIndex++;let n=e[s],a=n.fillStyle,l=n.lineStyle;b[n.type].build(n),n.matrix&&this.transformPoints(n.points,n.matrix),(a.visible||l.visible)&&this.processHoles(n.holes);for(let e=0;e<2;e++){let s=0===e?a:l;if(!s.visible)continue;let h=s.texture.baseTexture,u=this.indices.length,d=this.points.length/2;h.wrapMode=o.Nt.REPEAT,0===e?this.processFill(n):this.processLine(n);let c=this.points.length/2-d;0!==c&&(i&&!this._compareStyles(r,s)&&(i.end(u,d),i=null),i||((i=_.pop()||new P).begin(s,u,d),this.batches.push(i),r=s),this.addUvs(this.points,t,s.texture,d,c,s.matrix))}}let s=this.indices.length,n=this.points.length/2;if(i&&i.end(s,n),0===this.batches.length){this.batchable=!0;return}let a=n>65535;this.indicesUint16&&this.indices.length===this.indicesUint16.length&&a===this.indicesUint16.BYTES_PER_ELEMENT>2?this.indicesUint16.set(this.indices):this.indicesUint16=a?new Uint32Array(this.indices):new Uint16Array(this.indices),this.batchable=this.isBatchable(),this.batchable?this.packBatches():this.buildDrawCalls()}_compareStyles(t,e){return!(!t||!e||t.texture.baseTexture!==e.texture.baseTexture||t.color+t.alpha!==e.color+e.alpha||!!t.native!=!!e.native)}validateBatching(){if(this.dirty===this.cacheDirty||!this.graphicsData.length)return!1;for(let t=0,e=this.graphicsData.length;t<e;t++){let e=this.graphicsData[t],i=e.fillStyle,r=e.lineStyle;if(i&&!i.texture.baseTexture.valid||r&&!r.texture.baseTexture.valid)return!1}return!0}packBatches(){this.batchDirty++,this.uvsFloat32=new Float32Array(this.uvs);let t=this.batches;for(let e=0,i=t.length;e<i;e++){let i=t[e];for(let t=0;t<i.size;t++){let e=i.start+t;this.indicesUint16[e]=this.indicesUint16[e]-i.attribStart}}}isBatchable(){if(this.points.length>131070)return!1;let e=this.batches;for(let t=0;t<e.length;t++)if(e[t].style.native)return!1;return this.points.length<2*t.BATCHABLE_SIZE}buildDrawCalls(){let t=++o.VL._globalBatch;for(let t=0;t<this.drawCalls.length;t++)this.drawCalls[t].texArray.clear(),T.push(this.drawCalls[t]);this.drawCalls.length=0;let e=this.colors,i=this.textureIds,r=T.pop();r||((r=new o.a$).texArray=new o.Ie),r.texArray.count=0,r.start=0,r.size=0,r.type=o.lg.TRIANGLES;let s=0,n=null,a=0,l=!1,h=o.lg.TRIANGLES,u=0;this.drawCalls.push(r);for(let d=0;d<this.batches.length;d++){let c=this.batches[d],p=c.style,m=p.texture.baseTexture;!!p.native!==l&&(h=(l=!!p.native)?o.lg.LINES:o.lg.TRIANGLES,n=null,s=8,t++),n!==m&&(n=m,m._batchEnabled!==t&&(8===s&&(t++,s=0,r.size>0&&((r=T.pop())||((r=new o.a$).texArray=new o.Ie),this.drawCalls.push(r)),r.start=u,r.size=0,r.texArray.count=0,r.type=h),m.touched=1,m._batchEnabled=t,m._batchLocation=s,m.wrapMode=o.Nt.REPEAT,r.texArray.elements[r.texArray.count++]=m,s++)),r.size+=c.size,u+=c.size,a=m._batchLocation,this.addColors(e,p.color,p.alpha,c.attribSize,c.attribStart),this.addTextureIds(i,a,c.attribSize,c.attribStart)}o.VL._globalBatch=t,this.packAttributes()}packAttributes(){let t=this.points,e=this.uvs,i=this.colors,r=this.textureIds,s=new ArrayBuffer(12*t.length),o=new Float32Array(s),n=new Uint32Array(s),a=0;for(let s=0;s<t.length/2;s++)o[a++]=t[2*s],o[a++]=t[2*s+1],o[a++]=e[2*s],o[a++]=e[2*s+1],n[a++]=i[s],o[a++]=r[s];this._buffer.update(s),this._indexBuffer.update(this.indicesUint16)}processFill(t){t.holes.length?l.triangulate(t,this):b[t.type].triangulate(t,this)}processLine(t){y(t,this);for(let e=0;e<t.holes.length;e++)y(t.holes[e],this)}processHoles(t){for(let e=0;e<t.length;e++){let i=t[e];b[i.type].build(i),i.matrix&&this.transformPoints(i.points,i.matrix)}}calculateBounds(){let t=this._bounds;t.clear(),t.addVertexData(this.points,0,this.points.length),t.pad(this.boundsPadding,this.boundsPadding)}transformPoints(t,e){for(let i=0;i<t.length/2;i++){let r=t[2*i],s=t[2*i+1];t[2*i]=e.a*r+e.c*s+e.tx,t[2*i+1]=e.b*r+e.d*s+e.ty}}addColors(t,e,i,r,s=0){let n=o.Il.shared.setValue(e).toLittleEndianNumber(),a=o.Il.shared.setValue(n).toPremultiplied(i);t.length=Math.max(t.length,s+r);for(let e=0;e<r;e++)t[s+e]=a}addTextureIds(t,e,i,r=0){t.length=Math.max(t.length,r+i);for(let s=0;s<i;s++)t[r+s]=e}addUvs(t,e,i,r,s,o=null){let n=0,a=e.length,l=i.frame;for(;n<s;){let i=t[(r+n)*2],s=t[(r+n)*2+1];if(o){let t=o.a*i+o.c*s+o.tx;s=o.b*i+o.d*s+o.ty,i=t}n++,e.push(i/l.width,s/l.height)}let h=i.baseTexture;(l.width<h.width||l.height<h.height)&&this.adjustUvs(e,i,a,s)}adjustUvs(t,e,i,r){let s=e.baseTexture,o=i+2*r,n=e.frame,a=n.width/s.width,l=n.height/s.height,h=n.x/n.width,u=n.y/n.height,d=Math.floor(t[i]+1e-6),c=Math.floor(t[i+1]+1e-6);for(let e=i+2;e<o;e+=2)d=Math.min(d,Math.floor(t[e]+1e-6)),c=Math.min(c,Math.floor(t[e+1]+1e-6));h-=d,u-=c;for(let e=i;e<o;e+=2)t[e]=(t[e]+h)*a,t[e+1]=(t[e+1]+u)*l}};S.BATCHABLE_SIZE=100;class A{constructor(){this.color=0xffffff,this.alpha=1,this.texture=o.xE.WHITE,this.matrix=null,this.visible=!1,this.reset()}clone(){let t=new A;return t.color=this.color,t.alpha=this.alpha,t.texture=this.texture,t.matrix=this.matrix,t.visible=this.visible,t}reset(){this.color=0xffffff,this.alpha=1,this.texture=o.xE.WHITE,this.matrix=null,this.visible=!1}destroy(){this.texture=null,this.matrix=null}}class M extends A{constructor(){super(...arguments),this.width=0,this.alignment=.5,this.native=!1,this.cap=c.BUTT,this.join=d.MITER,this.miterLimit=10}clone(){let t=new M;return t.color=this.color,t.alpha=this.alpha,t.texture=this.texture,t.matrix=this.matrix,t.visible=this.visible,t.width=this.width,t.alignment=this.alignment,t.native=this.native,t.cap=this.cap,t.join=this.join,t.miterLimit=this.miterLimit,t}reset(){super.reset(),this.color=0,this.alignment=.5,this.width=0,this.native=!1,this.cap=c.BUTT,this.join=d.MITER,this.miterLimit=10}}let D={},F=class t extends C.W2{constructor(t=null){super(),this.shader=null,this.pluginName="batch",this.currentPath=null,this.batches=[],this.batchTint=-1,this.batchDirty=-1,this.vertexData=null,this._fillStyle=new A,this._lineStyle=new M,this._matrix=null,this._holeMode=!1,this.state=o.ZM.for2d(),this._geometry=t||new S,this._geometry.refCount++,this._transformID=-1,this._tintColor=new o.Il(0xffffff),this.blendMode=o.T$.NORMAL}get geometry(){return this._geometry}clone(){return this.finishPoly(),new t(this._geometry)}set blendMode(t){this.state.blendMode=t}get blendMode(){return this.state.blendMode}get tint(){return this._tintColor.value}set tint(t){this._tintColor.setValue(t)}get fill(){return this._fillStyle}get line(){return this._lineStyle}lineStyle(t=null,e=0,i,r=.5,s=!1){return"number"==typeof t&&(t={width:t,color:e,alpha:i,alignment:r,native:s}),this.lineTextureStyle(t)}lineTextureStyle(t){t=Object.assign({width:0,texture:o.xE.WHITE,color:0xffffff*!!t?.texture,matrix:null,alignment:.5,native:!1,cap:c.BUTT,join:d.MITER,miterLimit:10},t),this.normalizeColor(t),this.currentPath&&this.startPoly();let e=t.width>0&&t.alpha>0;return e?(t.matrix&&(t.matrix=t.matrix.clone(),t.matrix.invert()),Object.assign(this._lineStyle,{visible:e},t)):this._lineStyle.reset(),this}startPoly(){if(this.currentPath){let t=this.currentPath.points,e=this.currentPath.points.length;e>2&&(this.drawShape(this.currentPath),this.currentPath=new o.mg,this.currentPath.closeStroke=!1,this.currentPath.points.push(t[e-2],t[e-1]))}else this.currentPath=new o.mg,this.currentPath.closeStroke=!1}finishPoly(){this.currentPath&&(this.currentPath.points.length>2?(this.drawShape(this.currentPath),this.currentPath=null):this.currentPath.points.length=0)}moveTo(t,e){return this.startPoly(),this.currentPath.points[0]=t,this.currentPath.points[1]=e,this}lineTo(t,e){this.currentPath||this.moveTo(0,0);let i=this.currentPath.points,r=i[i.length-2],s=i[i.length-1];return(r!==t||s!==e)&&i.push(t,e),this}_initCurve(t=0,e=0){this.currentPath?0===this.currentPath.points.length&&(this.currentPath.points=[t,e]):this.moveTo(t,e)}quadraticCurveTo(t,e,i,r){this._initCurve();let s=this.currentPath.points;return 0===s.length&&this.moveTo(0,0),x.curveTo(t,e,i,r,s),this}bezierCurveTo(t,e,i,r,s,o){return this._initCurve(),f.curveTo(t,e,i,r,s,o,this.currentPath.points),this}arcTo(t,e,i,r,s){this._initCurve(t,e);let o=this.currentPath.points,n=m.curveTo(t,e,i,r,s,o);if(n){let{cx:t,cy:e,radius:i,startAngle:r,endAngle:s,anticlockwise:o}=n;this.arc(t,e,i,r,s,o)}return this}arc(t,e,i,r,s,n=!1){if(r===s||(!n&&s<=r?s+=o._b:n&&r<=s&&(r+=o._b),s-r==0))return this;let a=t+Math.cos(r)*i,l=e+Math.sin(r)*i,h=this._geometry.closePointEps,u=this.currentPath?this.currentPath.points:null;if(u){let t=Math.abs(u[u.length-2]-a),e=Math.abs(u[u.length-1]-l);t<h&&e<h||u.push(a,l)}else this.moveTo(a,l),u=this.currentPath.points;return m.arc(a,l,t,e,i,r,s,n,u),this}beginFill(t=0,e){return this.beginTextureFill({texture:o.xE.WHITE,color:t,alpha:e})}normalizeColor(t){let e=o.Il.shared.setValue(t.color??0);t.color=e.toNumber(),t.alpha??(t.alpha=e.alpha)}beginTextureFill(t){t=Object.assign({texture:o.xE.WHITE,color:0xffffff,matrix:null},t),this.normalizeColor(t),this.currentPath&&this.startPoly();let e=t.alpha>0;return e?(t.matrix&&(t.matrix=t.matrix.clone(),t.matrix.invert()),Object.assign(this._fillStyle,{visible:e},t)):this._fillStyle.reset(),this}endFill(){return this.finishPoly(),this._fillStyle.reset(),this}drawRect(t,e,i,r){return this.drawShape(new o.Ae(t,e,i,r))}drawRoundedRect(t,e,i,r,s){return this.drawShape(new o.c9(t,e,i,r,s))}drawCircle(t,e,i){return this.drawShape(new o.Cd(t,e,i))}drawEllipse(t,e,i,r){return this.drawShape(new o.Pj(t,e,i,r))}drawPolygon(...t){let e,i=!0,r=t[0];r.points?(i=r.closeStroke,e=r.points):e=Array.isArray(t[0])?t[0]:t;let s=new o.mg(e);return s.closeStroke=i,this.drawShape(s),this}drawShape(t){return this._holeMode?this._geometry.drawHole(t,this._matrix):this._geometry.drawShape(t,this._fillStyle.clone(),this._lineStyle.clone(),this._matrix),this}clear(){return this._geometry.clear(),this._lineStyle.reset(),this._fillStyle.reset(),this._boundsID++,this._matrix=null,this._holeMode=!1,this.currentPath=null,this}isFastRect(){let t=this._geometry.graphicsData;return 1===t.length&&t[0].shape.type===o.HS.RECT&&!t[0].matrix&&!t[0].holes.length&&!(t[0].lineStyle.visible&&t[0].lineStyle.width)}_render(t){this.finishPoly();let e=this._geometry;e.updateBatches(),e.batchable?(this.batchDirty!==e.batchDirty&&this._populateBatches(),this._renderBatched(t)):(t.batch.flush(),this._renderDirect(t))}_populateBatches(){let t=this._geometry,e=this.blendMode,i=t.batches.length;this.batchTint=-1,this._transformID=-1,this.batchDirty=t.batchDirty,this.batches.length=i,this.vertexData=new Float32Array(t.points);for(let r=0;r<i;r++){let i=t.batches[r],s=i.style.color,n=new Float32Array(this.vertexData.buffer,8*i.attribStart,2*i.attribSize),a=new Float32Array(t.uvsFloat32.buffer,8*i.attribStart,2*i.attribSize),l={vertexData:n,blendMode:e,indices:new Uint16Array(t.indicesUint16.buffer,2*i.start,i.size),uvs:a,_batchRGB:o.Il.shared.setValue(s).toRgbArray(),_tintRGB:s,_texture:i.style.texture,alpha:i.style.alpha,worldAlpha:1};this.batches[r]=l}}_renderBatched(t){if(this.batches.length){t.batch.setObjectRenderer(t.plugins[this.pluginName]),this.calculateVertices(),this.calculateTints();for(let e=0,i=this.batches.length;e<i;e++){let i=this.batches[e];i.worldAlpha=this.worldAlpha*i.alpha,t.plugins[this.pluginName].render(i)}}}_renderDirect(t){let e=this._resolveDirectShader(t),i=this._geometry,r=this.worldAlpha,s=e.uniforms,n=i.drawCalls;s.translationMatrix=this.transform.worldTransform,o.Il.shared.setValue(this._tintColor).premultiply(r).toArray(s.tint),t.shader.bind(e),t.geometry.bind(i,e),t.state.set(this.state);for(let e=0,r=n.length;e<r;e++)this._renderDrawCallDirect(t,i.drawCalls[e])}_renderDrawCallDirect(t,e){let{texArray:i,type:r,size:s,start:o}=e,n=i.count;for(let e=0;e<n;e++)t.texture.bind(i.elements[e],e);t.geometry.draw(r,s,o)}_resolveDirectShader(t){let e=this.shader,i=this.pluginName;if(!e){if(!D[i]){let{maxTextures:e}=t.plugins[i],r=new Int32Array(e);for(let t=0;t<e;t++)r[t]=t;let s={tint:new Float32Array([1,1,1,1]),translationMatrix:new o.y3,default:o.oo.from({uSamplers:r},!0)},n=t.plugins[i]._shader.program;D[i]=new o.ex(n,s)}e=D[i]}return e}_calculateBounds(){this.finishPoly();let t=this._geometry;if(!t.graphicsData.length)return;let{minX:e,minY:i,maxX:r,maxY:s}=t.bounds;this._bounds.addFrame(this.transform,e,i,r,s)}containsPoint(e){return this.worldTransform.applyInverse(e,t._TEMP_POINT),this._geometry.containsPoint(t._TEMP_POINT)}calculateTints(){if(this.batchTint!==this.tint){this.batchTint=this._tintColor.toNumber();for(let t=0;t<this.batches.length;t++){let e=this.batches[t];e._tintRGB=o.Il.shared.setValue(this._tintColor).multiply(e._batchRGB).toLittleEndianNumber()}}}calculateVertices(){let t=this.transform._worldID;if(this._transformID===t)return;this._transformID=t;let e=this.transform.worldTransform,i=e.a,r=e.b,s=e.c,o=e.d,n=e.tx,a=e.ty,l=this._geometry.points,h=this.vertexData,u=0;for(let t=0;t<l.length;t+=2){let e=l[t],d=l[t+1];h[u++]=i*e+s*d+n,h[u++]=o*d+r*e+a}}closePath(){let t=this.currentPath;return t&&(t.closeStroke=!0,this.finishPoly()),this}setMatrix(t){return this._matrix=t,this}beginHole(){return this.finishPoly(),this._holeMode=!0,this}endHole(){return this.finishPoly(),this._holeMode=!1,this}destroy(t){this._geometry.refCount--,0===this._geometry.refCount&&this._geometry.dispose(),this._matrix=null,this.currentPath=null,this._lineStyle.destroy(),this._lineStyle=null,this._fillStyle.destroy(),this._fillStyle=null,this._geometry=null,this.shader=null,this.vertexData=null,this.batches.length=0,this.batches=null,super.destroy(t)}};F.curves=p,F._TEMP_POINT=new o.E9;let I=F,O={buildPoly:l,buildCircle:n,buildRectangle:h,buildRoundedRectangle:u,buildLine:y,ArcUtils:m,BezierUtils:f,QuadraticUtils:x,BatchPart:P,FILL_COMMANDS:b,BATCH_POOL:_,DRAW_CALL_POOL:T}},1839:function(t,e,i){i.d(e,{Cdc:()=>r.Cd,$oy:()=>x.$o,pn8:()=>b.pn,mgq:()=>r.mg,TCu:()=>x.TC,xEZ:()=>r.xE,Sat:()=>x.S,AeJ:()=>r.Ae,yRe:()=>x.yR}),i(4021),i(7652),i(2897);var r=i(7781),s=i(176),o=i(9921),n=`varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float m[20];
uniform float uAlpha;

void main(void)
{
    vec4 c = texture2D(uSampler, vTextureCoord);

    if (uAlpha == 0.0) {
        gl_FragColor = c;
        return;
    }

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (c.a > 0.0) {
      c.rgb /= c.a;
    }

    vec4 result;

    result.r = (m[0] * c.r);
        result.r += (m[1] * c.g);
        result.r += (m[2] * c.b);
        result.r += (m[3] * c.a);
        result.r += m[4];

    result.g = (m[5] * c.r);
        result.g += (m[6] * c.g);
        result.g += (m[7] * c.b);
        result.g += (m[8] * c.a);
        result.g += m[9];

    result.b = (m[10] * c.r);
       result.b += (m[11] * c.g);
       result.b += (m[12] * c.b);
       result.b += (m[13] * c.a);
       result.b += m[14];

    result.a = (m[15] * c.r);
       result.a += (m[16] * c.g);
       result.a += (m[17] * c.b);
       result.a += (m[18] * c.a);
       result.a += m[19];

    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);

    // Premultiply alpha again.
    rgb *= result.a;

    gl_FragColor = vec4(rgb, result.a);
}
`;class a extends r.wn{constructor(){super(r.Y9,n,{m:new Float32Array([1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]),uAlpha:1}),this.alpha=1}_loadMatrix(t,e=!1){let i=t;e&&(this._multiply(i,this.uniforms.m,t),i=this._colorMatrix(i)),this.uniforms.m=i}_multiply(t,e,i){return t[0]=e[0]*i[0]+e[1]*i[5]+e[2]*i[10]+e[3]*i[15],t[1]=e[0]*i[1]+e[1]*i[6]+e[2]*i[11]+e[3]*i[16],t[2]=e[0]*i[2]+e[1]*i[7]+e[2]*i[12]+e[3]*i[17],t[3]=e[0]*i[3]+e[1]*i[8]+e[2]*i[13]+e[3]*i[18],t[4]=e[0]*i[4]+e[1]*i[9]+e[2]*i[14]+e[3]*i[19]+e[4],t[5]=e[5]*i[0]+e[6]*i[5]+e[7]*i[10]+e[8]*i[15],t[6]=e[5]*i[1]+e[6]*i[6]+e[7]*i[11]+e[8]*i[16],t[7]=e[5]*i[2]+e[6]*i[7]+e[7]*i[12]+e[8]*i[17],t[8]=e[5]*i[3]+e[6]*i[8]+e[7]*i[13]+e[8]*i[18],t[9]=e[5]*i[4]+e[6]*i[9]+e[7]*i[14]+e[8]*i[19]+e[9],t[10]=e[10]*i[0]+e[11]*i[5]+e[12]*i[10]+e[13]*i[15],t[11]=e[10]*i[1]+e[11]*i[6]+e[12]*i[11]+e[13]*i[16],t[12]=e[10]*i[2]+e[11]*i[7]+e[12]*i[12]+e[13]*i[17],t[13]=e[10]*i[3]+e[11]*i[8]+e[12]*i[13]+e[13]*i[18],t[14]=e[10]*i[4]+e[11]*i[9]+e[12]*i[14]+e[13]*i[19]+e[14],t[15]=e[15]*i[0]+e[16]*i[5]+e[17]*i[10]+e[18]*i[15],t[16]=e[15]*i[1]+e[16]*i[6]+e[17]*i[11]+e[18]*i[16],t[17]=e[15]*i[2]+e[16]*i[7]+e[17]*i[12]+e[18]*i[17],t[18]=e[15]*i[3]+e[16]*i[8]+e[17]*i[13]+e[18]*i[18],t[19]=e[15]*i[4]+e[16]*i[9]+e[17]*i[14]+e[18]*i[19]+e[19],t}_colorMatrix(t){let e=new Float32Array(t);return e[4]/=255,e[9]/=255,e[14]/=255,e[19]/=255,e}brightness(t,e){this._loadMatrix([t,0,0,0,0,0,t,0,0,0,0,0,t,0,0,0,0,0,1,0],e)}tint(t,e){let[i,s,o]=r.Il.shared.setValue(t).toArray();this._loadMatrix([i,0,0,0,0,0,s,0,0,0,0,0,o,0,0,0,0,0,1,0],e)}greyscale(t,e){this._loadMatrix([t,t,t,0,0,t,t,t,0,0,t,t,t,0,0,0,0,0,1,0],e)}blackAndWhite(t){this._loadMatrix([.3,.6,.1,0,0,.3,.6,.1,0,0,.3,.6,.1,0,0,0,0,0,1,0],t)}hue(t,e){let i=Math.cos(t=(t||0)/180*Math.PI),r=Math.sin(t),s=1/3,o=(0,Math.sqrt)(1/3);this._loadMatrix([i+(1-i)*s,s*(1-i)-o*r,s*(1-i)+o*r,0,0,s*(1-i)+o*r,i+s*(1-i),s*(1-i)-o*r,0,0,s*(1-i)-o*r,s*(1-i)+o*r,i+s*(1-i),0,0,0,0,0,1,0],e)}contrast(t,e){let i=(t||0)+1,r=-.5*(i-1);this._loadMatrix([i,0,0,0,r,0,i,0,0,r,0,0,i,0,r,0,0,0,1,0],e)}saturate(t=0,e){let i=2*t/3+1,r=-((i-1)*.5);this._loadMatrix([i,r,r,0,0,r,i,r,0,0,r,r,i,0,0,0,0,0,1,0],e)}desaturate(){this.saturate(-1)}negative(t){this._loadMatrix([-1,0,0,1,0,0,-1,0,1,0,0,0,-1,1,0,0,0,0,1,0],t)}sepia(t){this._loadMatrix([.393,.7689999,.18899999,0,0,.349,.6859999,.16799999,0,0,.272,.5339999,.13099999,0,0,0,0,0,1,0],t)}technicolor(t){this._loadMatrix([1.9125277891456083,-.8545344976951645,-.09155508482755585,0,11.793603434377337,-.3087833385928097,1.7658908555458428,-.10601743074722245,0,-70.35205161461398,-.231103377548616,-.7501899197440212,1.847597816108189,0,30.950940869491138,0,0,0,1,0],t)}polaroid(t){this._loadMatrix([1.438,-.062,-.062,0,0,-.122,1.378,-.122,0,0,-.016,-.016,1.483,0,0,0,0,0,1,0],t)}toBGR(t){this._loadMatrix([0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0],t)}kodachrome(t){this._loadMatrix([1.1285582396593525,-.3967382283601348,-.03992559172921793,0,63.72958762196502,-.16404339962244616,1.0835251566291304,-.05498805115633132,0,24.732407896706203,-.16786010706155763,-.5603416277695248,1.6014850761964943,0,35.62982807460946,0,0,0,1,0],t)}browni(t){this._loadMatrix([.5997023498159715,.34553243048391263,-.2708298674538042,0,47.43192855600873,-.037703249837783157,.8609577587992641,.15059552388459913,0,-36.96841498319127,.24113635128153335,-.07441037908422492,.44972182064877153,0,-7.562075277591283,0,0,0,1,0],t)}vintage(t){this._loadMatrix([.6279345635605994,.3202183420819367,-.03965408211312453,0,9.651285835294123,.02578397704808868,.6441188644374771,.03259127616149294,0,7.462829176470591,.0466055556782719,-.0851232987247891,.5241648018700465,0,5.159190588235296,0,0,0,1,0],t)}colorTone(t,e,i,s,o){t=t||.2,e=e||.15,i=i||0xffe580,s=s||3375104;let n=r.Il.shared,[a,l,h]=n.setValue(i).toArray(),[u,d,c]=n.setValue(s).toArray(),p=[.3,.59,.11,0,0,a,l,h,t,0,u,d,c,e,0,a-u,l-d,h-c,0,0];this._loadMatrix(p,o)}night(t,e){let i=[-2*(t=t||.1),-t,0,0,0,-t,0,t,0,0,0,t,2*t,0,0,0,0,0,1,0];this._loadMatrix(i,e)}predator(t,e){this._loadMatrix([11.224130630493164*t,-4.794486999511719*t,-2.8746118545532227*t,0*t,.40342438220977783*t,-3.6330697536468506*t,9.193157196044922*t,-2.951810836791992*t,0*t,-1.316135048866272*t,-3.2184197902679443*t,-4.2375030517578125*t,7.476448059082031*t,0*t,.8044459223747253*t,0,0,0,1,0],e)}lsd(t){this._loadMatrix([2,-.4,.5,0,0,-.5,2,-.4,0,0,-.4,-.5,3,0,0,0,0,0,1,0],t)}reset(){this._loadMatrix([1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],!1)}get matrix(){return this.uniforms.m}set matrix(t){this.uniforms.m=t}get alpha(){return this.uniforms.uAlpha}set alpha(t){this.uniforms.uAlpha=t}}a.prototype.grayscale=a.prototype.greyscale;var l=`varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

uniform vec2 scale;
uniform mat2 rotation;
uniform sampler2D uSampler;
uniform sampler2D mapSampler;

uniform highp vec4 inputSize;
uniform vec4 inputClamp;

void main(void)
{
  vec4 map =  texture2D(mapSampler, vFilterCoord);

  map -= 0.5;
  map.xy = scale * inputSize.zw * (rotation * map.xy);

  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));
}
`,h=`attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
	gl_Position = filterVertexPosition();
	vTextureCoord = filterTextureCoord();
	vFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;
}
`;class u extends r.wn{constructor(t,e){let i=new r.y3;t.renderable=!1,super(h,l,{mapSampler:t._texture,filterMatrix:i,scale:{x:1,y:1},rotation:new Float32Array([1,0,0,1])}),this.maskSprite=t,this.maskMatrix=i,null==e&&(e=20),this.scale=new r.E9(e,e)}apply(t,e,i,r){this.uniforms.filterMatrix=t.calculateSpriteMatrix(this.maskMatrix,this.maskSprite),this.uniforms.scale.x=this.scale.x,this.uniforms.scale.y=this.scale.y;let s=this.maskSprite.worldTransform,o=Math.sqrt(s.a*s.a+s.b*s.b),n=Math.sqrt(s.c*s.c+s.d*s.d);0!==o&&0!==n&&(this.uniforms.rotation[0]=s.a/o,this.uniforms.rotation[1]=s.b/o,this.uniforms.rotation[2]=s.c/n,this.uniforms.rotation[3]=s.d/n),t.applyFilter(this,e,i,r)}get map(){return this.uniforms.mapSampler}set map(t){this.uniforms.mapSampler=t}}var d=`varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vFragCoord;
uniform sampler2D uSampler;
uniform highp vec4 inputSize;


/**
 Basic FXAA implementation based on the code on geeks3d.com with the
 modification that the texture2DLod stuff was removed since it's
 unsupported by WebGL.

 --

 From:
 https://github.com/mitsuhiko/webgl-meincraft

 Copyright (c) 2011 by Armin Ronacher.

 Some rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are
 met:

 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above
 copyright notice, this list of conditions and the following
 disclaimer in the documentation and/or other materials provided
 with the distribution.

 * The names of the contributors may not be used to endorse or
 promote products derived from this software without specific
 prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef FXAA_REDUCE_MIN
#define FXAA_REDUCE_MIN   (1.0/ 128.0)
#endif
#ifndef FXAA_REDUCE_MUL
#define FXAA_REDUCE_MUL   (1.0 / 8.0)
#endif
#ifndef FXAA_SPAN_MAX
#define FXAA_SPAN_MAX     8.0
#endif

//optimized version for mobile, where dependent
//texture reads can be a bottleneck
vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,
          vec2 v_rgbNW, vec2 v_rgbNE,
          vec2 v_rgbSW, vec2 v_rgbSE,
          vec2 v_rgbM) {
    vec4 color;
    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;
    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;
    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;
    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;
    vec4 texColor = texture2D(tex, v_rgbM);
    vec3 rgbM  = texColor.xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    mediump vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
                  dir * rcpDirMin)) * inverseVP;

    vec3 rgbA = 0.5 * (
                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +
                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
        color = vec4(rgbA, texColor.a);
    else
        color = vec4(rgbB, texColor.a);
    return color;
}

void main() {

      vec4 color;

      color = fxaa(uSampler, vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

      gl_FragColor = color;
}
`,c=`
attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

varying vec2 vFragCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

void texcoords(vec2 fragCoord, vec2 inverseVP,
               out vec2 v_rgbNW, out vec2 v_rgbNE,
               out vec2 v_rgbSW, out vec2 v_rgbSE,
               out vec2 v_rgbM) {
    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
    v_rgbM = vec2(fragCoord * inverseVP);
}

void main(void) {

   gl_Position = filterVertexPosition();

   vFragCoord = aVertexPosition * outputFrame.zw;

   texcoords(vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}
`;class p extends r.wn{constructor(){super(c,d)}}var m=`precision highp float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform float uNoise;
uniform float uSeed;
uniform sampler2D uSampler;

float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);
    float randomValue = rand(gl_FragCoord.xy * uSeed);
    float diff = (randomValue - 0.5) * uNoise;

    // Un-premultiply alpha before applying the color matrix. See issue #3539.
    if (color.a > 0.0) {
        color.rgb /= color.a;
    }

    color.r += diff;
    color.g += diff;
    color.b += diff;

    // Premultiply alpha again.
    color.rgb *= color.a;

    gl_FragColor = color;
}
`;class f extends r.wn{constructor(t=.5,e=Math.random()){super(r.Y9,m,{uNoise:0,uSeed:0}),this.noise=t,this.seed=e}get noise(){return this.uniforms.uNoise}set noise(t){this.uniforms.uNoise=t}get seed(){return this.uniforms.uSeed}set seed(t){this.uniforms.uSeed=t}}let g={AlphaFilter:s.U,BlurFilter:o.T,BlurFilterPass:o.Y,ColorMatrixFilter:a,DisplacementFilter:u,FXAAFilter:p,NoiseFilter:f};Object.entries(g).forEach(([t,e])=>{Object.defineProperty(g,t,{get:()=>(r.P6.deprecation("7.1.0",`filters.${t} has moved to ${t}`),e)})}),i(4971),i(7923),i(5337),i(1678),i(1365),i(5431);let v=new r.Ae,y=class t{constructor(t){this.renderer=t,this._rendererPremultipliedAlpha=!1}contextChange(){let t=this.renderer?.gl.getContextAttributes();this._rendererPremultipliedAlpha=!!(t&&t.alpha&&t.premultipliedAlpha)}async image(t,e,i,r){let s=new Image;return s.src=await this.base64(t,e,i,r),s}async base64(t,e,i,r){let s=this.canvas(t,r);if(void 0!==s.toBlob)return new Promise((t,r)=>{s.toBlob(e=>{if(!e){r(Error("ICanvas.toBlob failed!"));return}let i=new FileReader;i.onload=()=>t(i.result),i.onerror=r,i.readAsDataURL(e)},e,i)});if(void 0!==s.toDataURL)return s.toDataURL(e,i);if(void 0!==s.convertToBlob){let t=await s.convertToBlob({type:e,quality:i});return new Promise((e,i)=>{let r=new FileReader;r.onload=()=>e(r.result),r.onerror=i,r.readAsDataURL(t)})}throw Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented")}canvas(e,i){let{pixels:s,width:o,height:n,flipY:a,premultipliedAlpha:l}=this._rawPixels(e,i);a&&t._flipY(s,o,n),l&&t._unpremultiplyAlpha(s);let h=new r.P6.CanvasRenderTarget(o,n,1),u=new ImageData(new Uint8ClampedArray(s.buffer),o,n);return h.context.putImageData(u,0,0),h.canvas}pixels(e,i){let{pixels:r,width:s,height:o,flipY:n,premultipliedAlpha:a}=this._rawPixels(e,i);return n&&t._flipY(r,s,o),a&&t._unpremultiplyAlpha(r),r}_rawPixels(t,e){let i=this.renderer;if(!i)throw Error("The Extract has already been destroyed");let s,o=!1,n=!1,a,l=!1;t&&(t instanceof r.TI?a=t:(a=i.generateTexture(t,{region:e,resolution:i.resolution,multisample:i.multisample}),l=!0,e&&(v.width=e.width,v.height=e.height,e=v)));let h=i.gl;if(a){if(s=a.baseTexture.resolution,e=e??a.frame,o=!1,n=a.baseTexture.alphaMode>0&&a.baseTexture.format===r.I2.RGBA,!l){i.renderTexture.bind(a);let t=a.framebuffer.glFramebuffers[i.CONTEXT_UID];t.blitFramebuffer&&i.framebuffer.bind(t.blitFramebuffer)}}else s=i.resolution,e||((e=v).width=i.width/s,e.height=i.height/s),o=!0,n=this._rendererPremultipliedAlpha,i.renderTexture.bind();let u=Math.max(Math.round(e.width*s),1),d=Math.max(Math.round(e.height*s),1),c=new Uint8Array(4*u*d);return h.readPixels(Math.round(e.x*s),Math.round(e.y*s),u,d,h.RGBA,h.UNSIGNED_BYTE,c),l&&a?.destroy(!0),{pixels:c,width:u,height:d,flipY:o,premultipliedAlpha:n}}destroy(){this.renderer=null}static _flipY(t,e,i){let r=e<<2,s=i>>1,o=new Uint8Array(r);for(let e=0;e<s;e++){let s=e*r,n=(i-e-1)*r;o.set(t.subarray(s,s+r)),t.copyWithin(s,n,n+r),t.set(o,n)}}static _unpremultiplyAlpha(t){t instanceof Uint8ClampedArray&&(t=new Uint8Array(t.buffer));let e=t.length;for(let i=0;i<e;i+=4){let e=t[i+3];if(0!==e){let r=255.001/e;t[i]=t[i]*r+.5,t[i+1]=t[i+1]*r+.5,t[i+2]=t[i+2]*r+.5}}}};y.extension={name:"extract",type:r.nw.RendererSystem},r.Rw.add(y);var x=i(6050);i(9462),i(4725),i(7495),i(1218),i(171),i(2319),i(8947),i(7234);var b=i(155);i(4556),i(760)}}]);