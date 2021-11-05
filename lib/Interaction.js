// This module is copied from package three.interactive, version 1.1.0
// The reason - it depends on old three.js version

// https://github.com/markuslerner/THREE.Interactive/tree/v1.1.0

import { Raycaster, Vector2 } from 'three';

export class InteractiveObject {
  constructor(target, name) {
    this.target = target;
    this.name = name;
    this.intersected = false;
    this.distance = 0;
  }
}

export class InteractiveEvent {
  constructor(type, originalEvent = null) {
    this.cancelBubble = false;
    this.type = type;
    this.originalEvent = originalEvent;
  }
  stopPropagation() {
    this.cancelBubble = true;
  }
}

export class InteractionManager {
  constructor(renderer, camera, domElement) {
    this.renderer = renderer;
    this.camera = camera;
    this.domElement = domElement;

    this.mouse = new Vector2(-1, 1); // top left default position

    this.supportsPointerEvents = !!window.PointerEvent;

    this.interactiveObjects = [];

    this.raycaster = new Raycaster();

    this.binds = {
      onMouseClick:        this.onMouseClick.bind(this),
      onMouseDown:         this.onMouseDown.bind(this),
      onMouseUp:           this.onMouseUp.bind(this),
      onTouchStart:        this.onTouchStart.bind(this),
      onTouchMove:         this.onTouchMove.bind(this),
      onTouchEnd:          this.onTouchEnd.bind(this),
      onDocumentMouseMove: this.onDocumentMouseMove.bind(this),
    }

    domElement.addEventListener('click', this.binds.onMouseClick);

    if (this.supportsPointerEvents) {
      domElement.ownerDocument.addEventListener(
        'pointermove',
        this.binds.onDocumentMouseMove
      );
      domElement.addEventListener('pointerdown', this.binds.onMouseDown);
      domElement.addEventListener('pointerup', this.binds.onMouseUp);
    } else {
      domElement.ownerDocument.addEventListener(
        'mousemove',
        this.binds.onDocumentMouseMove
      );
      domElement.addEventListener('mousedown', this.binds.onMouseDown);
      domElement.addEventListener('mouseup', this.binds.onMouseUp);
      domElement.addEventListener('touchstart', this.binds.onTouchStart, {
        passive: true,
      });
      domElement.addEventListener('touchmove', this.binds.onTouchMove, {
        passive: true,
      });
      domElement.addEventListener('touchend', this.binds.onTouchEnd, {
        passive: true,
      });
    }

    this.treatTouchEventsAsMouseEvents = true;
  }

  dispose(){
    domElement.removeEventListener('click', this.binds.onMouseClick);

    if (this.supportsPointerEvents) {
      domElement.ownerDocument.removeEventListener(
        'pointermove',
        this.binds.onDocumentMouseMove
      );
      domElement.removeEventListener('pointerdown', this.binds.onMouseDown);
      domElement.removeEventListener('pointerup', this.binds.onMouseUp);
    } else {
      domElement.ownerDocument.removeEventListener(
        'mousemove',
        this.binds.onDocumentMouseMove
      );
      domElement.removeEventListener('mousedown', this.binds.onMouseDown);
      domElement.removeEventListener('mouseup', this.binds.onMouseUp);
      domElement.removeEventListener('touchstart', this.binds.onTouchStart);
      domElement.removeEventListener('touchmove', this.binds.onTouchMove);
      domElement.removeEventListener('touchend', this.binds.onTouchEnd);
    }
  }

  add(object, childNames = []){
    if (object) {
      if (childNames.length > 0) {
        childNames.forEach((name) => {
          const o = object.getObjectByName(name);
          if (o) {
            const interactiveObject = new InteractiveObject(o, name);
            this.interactiveObjects.push(interactiveObject);
          }
        });
      } else {
        const interactiveObject = new InteractiveObject(object, object.name);
        this.interactiveObjects.push(interactiveObject);
      }
    }
  }

  remove(object, childNames = []){
    if (object) {
      if (childNames.length > 0) {
        const interactiveObjectsNew = [];
        this.interactiveObjects.forEach((o) => {
          if (!childNames.includes(o.name)) {
            interactiveObjectsNew.push(o);
          }
        });
        this.interactiveObjects = interactiveObjectsNew;
      } else {
        const interactiveObjectsNew = [];
        this.interactiveObjects.forEach((o) => {
          if (o.name !== object.name) {
            interactiveObjectsNew.push(o);
          }
        });
        this.interactiveObjects = interactiveObjectsNew;
      }
    }
  }

  update(){
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersections = [];

    this.interactiveObjects.forEach((object) => {
      if (object.target){
        this.checkIntersection(object);
        object.intersected && intersections.push(object);
      }
    });

    intersections.sort(function (a, b) {
      return a.distance - b.distance;
    });

    const closest = intersections.shift();

    if(closest){
      if (closest === this.__interacting_object) return;
      if(this.__interacting_object) {
        this.dispatch(this.__interacting_object, new InteractiveEvent('mouseout'));
      }
      this.dispatch(closest, new InteractiveEvent('mouseover'));
      this.__interacting_object = closest;
    }
    else if(this.__interacting_object){
      this.dispatch(this.__interacting_object, new InteractiveEvent('mouseout'));
      this.__interacting_object = null;
    }
    else {
      this.__interacting_object = null;
    }
  }

  __original_update(){
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.interactiveObjects.forEach((object) => {
      if (object.target) this.checkIntersection(object);
    });

    this.interactiveObjects.sort(function (a, b) {
      return a.distance - b.distance;
    });

    const eventOut = new InteractiveEvent('mouseout');
    this.interactiveObjects.forEach((object) => {
      if (!object.intersected && object.wasIntersected) {
        this.dispatch(object, eventOut);
      }
    });
    const eventOver = new InteractiveEvent('mouseover');
    this.interactiveObjects.forEach((object) => {
      if (object.intersected && !object.wasIntersected) {
        this.dispatch(object, eventOver);
      }
    });
  }

  checkIntersection(object){
    var intersects = this.raycaster.intersectObjects([object.target], true);

    object.wasIntersected = object.intersected;

    if (intersects.length > 0) {
      let distance = intersects[0].distance;
      intersects.forEach((i) => {
        if (i.distance < distance) {
          distance = i.distance;
        }
      });
      object.intersected = true;
      object.distance = distance;
    } else {
      object.intersected = false;
    }
  }

  onDocumentMouseMove(mouseEvent){
    // event.preventDefault();

    this.mapPositionToPoint(this.mouse, mouseEvent.clientX, mouseEvent.clientY);

    const event = new InteractiveEvent('mousemove', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  }

  onTouchMove(touchEvent){
    // event.preventDefault();

    this.mapPositionToPoint(
      this.mouse,
      touchEvent.touches[0].clientX,
      touchEvent.touches[0].clientY
    );

    const event = new InteractiveEvent(
      this.treatTouchEventsAsMouseEvents ? 'mousemove' : 'touchmove',
      touchEvent
    );

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  }

  onMouseClick(mouseEvent){
    this.update();

    const event = new InteractiveEvent('click', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, event);
      }
    });
  }

  onMouseDown(mouseEvent){
    this.mapPositionToPoint(this.mouse, mouseEvent.clientX, mouseEvent.clientY);

    this.update();

    const event = new InteractiveEvent('mousedown', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, event);
      }
    });
  }

  onTouchStart(touchEvent){
    this.mapPositionToPoint(
      this.mouse,
      touchEvent.touches[0].clientX,
      touchEvent.touches[0].clientY
    );

    this.update();

    const event = new InteractiveEvent(
      this.treatTouchEventsAsMouseEvents ? 'mousedown' : 'touchstart',
      touchEvent
    );

    this.interactiveObjects.forEach((object) => {
      if (object.intersected) {
        this.dispatch(object, event);
      }
    });
  }

  onMouseUp(mouseEvent){
    const event = new InteractiveEvent('mouseup', mouseEvent);

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  }

  onTouchEnd(touchEvent){
    this.mapPositionToPoint(
      this.mouse,
      touchEvent.touches[0].clientX,
      touchEvent.touches[0].clientY
    );

    this.update();

    const event = new InteractiveEvent(
      this.treatTouchEventsAsMouseEvents ? 'mouseup' : 'touchend',
      touchEvent
    );

    this.interactiveObjects.forEach((object) => {
      this.dispatch(object, event);
    });
  }

  dispatch(object, event){
    if (object.target && !event.cancelBubble) {
      event.coords = this.mouse;
      event.distance = object.distance;
      event.intersected = object.intersected;
      object.target.dispatchEvent(event);
    }
  }

  mapPositionToPoint(point, x, y){
    let rect;

    // IE 11 fix
    if (!this.renderer.domElement.parentElement) {
      rect = {
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };
    } else {
      rect = this.renderer.domElement.getBoundingClientRect();
    }

    point.x = ((x - rect.left) / rect.width) * 2 - 1;
    point.y = -((y - rect.top) / rect.height) * 2 + 1;
  }
}






/*


  MIT License

  Copyright (c) 2020 Markus Lerner

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


*/