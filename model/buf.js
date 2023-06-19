
class _buffer {
    constructor(type, size, bindPoint) {
        this.id = 0;
        this.type = type;
        this.bindPoint = bindPoint;
        this.size = size;
        
        this.id = window.gl.createBuffer();
        window.gl.bindBuffer(this.type, this.id);
        window.gl.bufferData(this.type, size, window.gl.STATIC_DRAW);
    }

    updateFloat(data) {
        window.gl.bindBuffer(this.type, this.id);
        window.gl.bufferData(this.type, new Float32Array(data), window.gl.STATIC_DRAW);
    }
    updateUint(data) {
        window.gl.bindBuffer(this.type, this.id);
        window.gl.bufferData(this.type, new Uint16Array(data), window.gl.STATIC_DRAW);
    }
}

export function buffer(...args) {
  return new _buffer(...args);
}