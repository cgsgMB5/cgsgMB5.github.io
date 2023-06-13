import * as mbTimer from './timer.js';
import {buffer} from './buf.js';
import {camera} from './mth/camera.js';
import {mat4} from './mth/mat4.js';
import {vec3} from './mth/vec3.js';
import { createCube, createOcta, createTetra } from './pg.js';
//import * as polygons from './pg.js'

// Global context data
//let canvas, gl;
let time_loc = -2, myTimer;
let wvp_loc = -2, matWVP = mat4();
let frameBuffer, frameData = [0, 0, 0, 0],
    prim1;//, prim2;
const frameUniformBufferIndex = 1;
let ShaderProgram;
let mbCamera = camera();

export let posloc = 0, normloc = 1;

function LoadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const Buf = gl.getShaderInfoLog(shader);
        console.log(Buf);
        alert('fail');
    }
    return shader;
}
/*
async function fetchShader(shaderURL) {
    try {
        const response = await fetch(shaderURL);
        const text = await response.text();

        console.log(text);
    } catch(err) {
        console.error(err);
    }
}*/

export function Pause(tag) {
    myTimer.isPause = tag.checked ? true : false;
}

export function initGL() {
  //let colorCoefR = 1.0, colorCoefG = 1.0, colorCoefB = 1.0;
  //debugger;
  const canvas = document.getElementById("glCanvas");
  //canvas = document.querySelector("#glCanvas");
  window.gl = canvas.getContext("webgl2");
  let gl = window.gl;

  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.FRONT);


  myTimer = new mbTimer.Timer();
  // Shader initialization
  let vs, fs;
  const ft1 = fetch("./vert.glsl")
    .then((res) => res.text())
    .then((data) => {
      vs = data;
    });
  const ft2 = fetch("./frag.glsl")
    .then((res) => res.text())
    .then((data) => {
      fs = data;
    });
  const allData = Promise.all([ft1, ft2]);
  allData.then(() => {
    // Shaders
    const vertexSh = LoadShader(gl, gl.VERTEX_SHADER, vs);
    const fragSh = LoadShader(gl, gl.FRAGMENT_SHADER, fs);
    
    ShaderProgram = gl.createProgram();
    gl.attachShader(ShaderProgram, vertexSh);
    gl.attachShader(ShaderProgram, fragSh);
    gl.linkProgram(ShaderProgram);

    if (!gl.getProgramParameter(ShaderProgram, gl.LINK_STATUS)) {
        const Buf = gl.getProgramInfoLog(ShaderProgram);
        console.log(Buf);
      }
    
    posloc = gl.getAttribLocation(ShaderProgram, "in_pos");
    normloc = gl.getAttribLocation(ShaderProgram, "in_norm");

    // let frameVertexArray = gl.createVertexArray();
    // gl.bindVertexArray(frameVertexArray);
    const pos = [-1, -1, 0,
                 1, -1, 0,
                 -1, 1, 0,
                 1, 1, 0];

    const posBuf = buffer(gl.ARRAY_BUFFER, pos.length * 4, 0);
    posBuf.updateFloat(pos);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);  

    gl.clearColor(0.85, 0.8, 0.96, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    gl.useProgram(ShaderProgram);

    //prim1 = createOcta();
    prim1 = createCube(); 

    time_loc = gl.getUniformLocation(ShaderProgram, "Time");
    gl.uniform1f(time_loc, myTimer.localTime);

    let rot = mat4(null).rotate(myTimer.localTime, vec3(0, 0, 0));
    matWVP = rot.mul(mbCamera.matrVP);

    wvp_loc = gl.getUniformLocation(ShaderProgram, "MatrWVP");
    frameData = new Float32Array(matWVP.toArray());
    gl.uniformMatrix4fv(wvp_loc, false, frameData);//new Float32Array(matWVP)); 

    frameBuffer = buffer(gl.UNIFORM_BUFFER, frameData.length * 4, frameUniformBufferIndex);
    frameBuffer.updateFloat(frameData);


    prim1.draw();
    //prim2.draw();
    });
}



export function Render() {
  let colorCoefR = 1.0, colorCoefG = 1.0, colorCoefB = 1.0;
  
  if (time_loc == -2) return;

  if (myTimer != undefined)
    myTimer.response(null);
  let gl = window.gl;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  time_loc = gl.getUniformLocation(ShaderProgram, "Time");
  gl.uniform1f(time_loc, myTimer.localTime);

  colorCoefR = document.getElementById('colorcoefr').value;
  time_loc = gl.getUniformLocation(ShaderProgram, "ColorCoefR");
  gl.uniform1f(time_loc, colorCoefR);

  colorCoefG = document.getElementById('colorcoefg').value;
  time_loc = gl.getUniformLocation(ShaderProgram, "ColorCoefG");
  gl.uniform1f(time_loc, colorCoefG);

  colorCoefB = document.getElementById('colorcoefb').value;
  time_loc = gl.getUniformLocation(ShaderProgram, "ColorCoefB");
  gl.uniform1f(time_loc, colorCoefB);


  let rot = new mat4(null).rotate(myTimer.localTime * 0.01 + 1.0, vec3(0, 1, 0));

  wvp_loc = gl.getUniformLocation(ShaderProgram, "MatrWVP");

  //matWVP = mat4(null);
  matWVP = mbCamera.matrVP.mul(rot);

  //matWVP = mat4(null);
  frameData = matWVP.toArray();
  gl.uniformMatrix4fv(wvp_loc, true, frameData);//new Float32Array(matWVP)); 

  gl.bindBuffer(gl.UNIFORM_BUFFER, frameBuffer.id);
  gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(frameData), gl.STATIC_DRAW);


  prim1.draw();
  //prim2.draw();

}
