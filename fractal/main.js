// Global context data
let canvas, gl, time_loc, myTimer;

// Timer data
let startTime,
  oldTime,
  oldTimeFPS,
  pauseTime,
  timePerSec,
  frameCounter,
  FPS,
  globalTime,
  globalDeltaTime,
  localTime,
  localDeltaTime;

// Timer class constructor function
function Timer() {
    // Timer obtain current time in seconds method
    const getTime = () => {
      const date = new Date();
      let t =
        date.getMilliseconds() / 1000.0 +
        date.getSeconds() +
        date.getMinutes() * 60;
      return t;
    };
  
    // Timer response method
    this.response = (tag_id = null) => {
      let t = getTime();
      // Global time
      this.globalTime = t;
      this.globalDeltaTime = t - this.oldTime;
      // Time with pause
      if (this.isPause) {
        this.localDeltaTime = 0;
        this.pauseTime += t - this.oldTime;
      } else {
        this.localDeltaTime = this.globalDeltaTime;
        this.localTime = t - this.pauseTime - this.startTime;
      }
      // FPS
      this.frameCounter++;
      if (t - this.oldTimeFPS > 3) {
        this.FPS = this.frameCounter / (t - this.oldTimeFPS);
        this.oldTimeFPS = t;
        this.frameCounter = 0;
        if (tag_id != null)
          document.getElementById(tag_id).innerHTML = this.getFPS();
      }
      this.oldTime = t;
    };
  
    // Obtain FPS as string method
    this.getFPS = () => this.FPS.toFixed(3);
  
    // Fill timer global data
    this.globalTime = this.localTime = getTime();
    this.globalDeltaTime = this.localDeltaTime = 0;
  
    // Fill timer semi global data
    this.startTime = this.oldTime = this.oldTimeFPS = this.globalTime;
    this.frameCounter = 0;
    this.isPause = false;
    this.FPS = 30.0;
    this.pauseTime = 0;
  
    return this;
  } // End of 'Timer' function
  

function LoadShader( gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        const Buf = gl.getShaderInfoLog(shader);
        console.log(Buf);
        alert('fail');
    }
    return shader;
}

async function fetchShader(shaderURL) {
    try {
        const response = await fetch(shaderURL);
        const text = await response.text();

        console.log(text);
    } catch(err) {
        console.error(err);
    }
}

function Pause(tag) {
    myTimer.isPause = tag.checked ? true : false;
}

function initGL() {
    let colorCoefR = 1.0, colorCoefG = 1.0, colorCoefB = 1.0;
    //debugger;
    const canvas = document.getElementById("glCanvas");
    const gl = canvas.getContext("webgl2");

    gl.clearColor(0.85, 0.8, 0.96, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    myTimer = new Timer();
    // Shader initialization
    let vs, fs;
    const ft1 = fetch("vert.glsl")
      .then((res) => res.text())
      .then((data) => {
        vs = data;
      });
    const ft2 = fetch("frag.glsl")
      .then((res) => res.text())
      .then((data) => {
        fs = data;
      });
    const allData = Promise.all([ft1, ft2]);
    allData.then((res) => {
      // Shaders
    const vertexSh = LoadShader(gl, gl.VERTEX_SHADER, vs);
    const fragSh = LoadShader(gl, gl.FRAGMENT_SHADER, fs);
    const ShaderProgram = gl.createProgram();
    gl.attachShader(ShaderProgram, vertexSh);
    gl.attachShader(ShaderProgram, fragSh);
    gl.linkProgram(ShaderProgram);

    if (!gl.getProgramParameter(ShaderProgram, gl.LINK_STATUS)) {
        const Buf = gl.getProgramInfoLog(ShaderProgram);
        console.log(Buf);
      }
    
    const posLoc = gl.getAttribLocation(ShaderProgram, "in_pos");
//    let frameVertexArray = gl.createVertexArray();
//    gl.bindVertexArray(frameVertexArray);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    const pos = [-1, -1, 0,
                 1, -1, 0,
                 -1, 1, 0,
                 1, 1, 0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posLoc);
    gl.useProgram(ShaderProgram);
      

    //let time = Math.floor((new Date()).getTime() / 1000);
    time_loc = gl.getUniformLocation(ShaderProgram, "Time");
    gl.uniform1f(time_loc, myTimer.localTime);
    //frameBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.UNIFORM_BUFFER, frameBuffer);
    //gl.bufferData(gl.UNIFORM_BUFFER, 8 * 4, gl.STATIC_DRAW);
    //gl.uniformBlockBinding(ShaderProgram, gl.getUniformLocation, 0);
    const draw = () => {
        myTimer.response();
        console.log(myTimer.isPause + '=' + myTimer.isPause);
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
        //gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posLoc);
        gl.useProgram(ShaderProgram);

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

        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.drawArrays(gl.TRIANGLES, 1, 3);

        window.requestAnimationFrame(draw);
        };
    //window.requestAnimationFrame(draw);
    draw();
   window.setInterval(draw(), 100);

    });
}

let frameBuffer, frameData = [0, 0, 0, 0];

function Render() {
    if (time_loc = -2) return;

    const timer = new Timer();
    if (time_loc != -1) {
        gl.uniform1f(time_loc, timer.localTime);
    }
    gl.bindBuffer(gl.UNIFORM_BUFFER, frameBuffer);
    frameData[4] = t;
    gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(pos), gl.STATIC_DRAW)
    gl.bindBufferBase(gl.UNIFORM_BUFFER, frameUniform,)

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

