const canvas = document.getElementById("glCanvas");
//canvas = document.querySelector("#glCanvas");
window.gl = canvas.getContext("webgl2");
let gl = window.gl;

class _buffer {
    constructor(type, size, bindPoint) {
        this.id = 0;
        this.type = type;
        this.bindPoint = bindPoint;
        this.size = size;
        
        this.id = gl.createBuffer();
        gl.bindBuffer(this.type, this.id);
        gl.bufferData(this.type, size, gl.STATIC_DRAW);
    }

    updateFloat(data) {
        gl.bindBuffer(this.type, this.id);
        gl.bufferData(this.type, new Float32Array(data), gl.STATIC_DRAW);
    }
    updateUint(data) {
        gl.bindBuffer(this.type, this.id);
        gl.bufferData(this.type, new Uint16Array(data), gl.STATIC_DRAW);
    }
}

export function buffer(...args) {
  return new _buffer(...args);
}