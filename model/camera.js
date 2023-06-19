/*import {mat4} from './mth/mat4.js';
import {vec3} from './mth/vec3.js';
import { mbCamera } from "./main.js";

let xDelta = 0, yDelta = 0;

function MouseCoord(event) {//25 : 137
    let resize = 1;
  if (event.deltaY < 0) {
    resize = 1.0 /  (-event.deltaY / 80.0);
  } else if (event.deltaY > 0) {
    resize = 1.0 * event.deltaY / 80.0;
  }
  mbCamera.loc = mbCamera.loc.mulNum(resize);
}

let startX, startY

function MouseFirst(event) {//25 : 137
  startX = event.offsetX;
  startY = event.offsetY;
}

function MouseSecond(event) {//25 : 137
  let xCanvas = event.offsetX,
      yCanvas = event.offsetY;

  xDelta += (xCanvas - startX) / 250;
  yDelta += (yCanvas - startY) / 250;

  mbCamera.matrVP = mat4(mbCamera.matrVP).rot(xDelta, vec3(0, 1, 0)).rot(yDelta, vec3(0, 0, 1));
}*/