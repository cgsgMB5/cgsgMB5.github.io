import {vec3} from './mth/vec3.js'
import {mat4}  from './mth/mat4.js'
import {buffer} from './buf.js'
import {posloc, normloc} from './main.js'//, normloc

//let gl = window.gl;
let vB = 0, iB = 1;

class _vertex {
  constructor(p, n) {
    this.pos = p;
    this.norm = n;
  }
  toArray() {
    return [this.pos.x, this.pos.y, this.pos.z, this.norm.x, this.norm.y, this.norm.z];
  }
}

export function vertex(...args) {
  return new _vertex(...args);
}

class _prim {
  constructor(Vert, Ind) {
    this.vBufID = buffer(window.gl.ARRAY_BUFFER, Vert.length * 4, vB);
    this.vBufID.updateFloat(Vert);
    this.iBufID = buffer(window.gl.ELEMENT_ARRAY_BUFFER, Ind.length * 2, iB);
    this.iBufID.updateUint(Ind);
    this.uboMatrID = mat4();
    
    this.type = window.gl.TRIANGLES; // gl.LINE_STRIP;
    this.minBB = vec3(0, 0, 0);
    this.maxBB = vec3(0, 0, 0);
    this.numofElems = Ind.length;
    this.trans = mat4();
  }
  draw() {
    if (this.vA == null) {
      this.vA = window.gl.createVertexArray();
      window.gl.bindVertexArray(this.vA);
      window.gl.vertexAttribPointer(posloc, 3, window.gl.FLOAT, false, 24, 0);
      window.gl.vertexAttribPointer(normloc, 3, window.gl.FLOAT, false, 24, 12);
      window.gl.enableVertexAttribArray(posloc);
      window.gl.enableVertexAttribArray(normloc);
    }
    window.gl.bindVertexArray(this.vA);
    window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, this.iBufID.id);
    window.gl.drawElements(this.type, this.numofElems, window.gl.UNSIGNED_SHORT, 0);
  }
}
export function prim(...args) {
  return new _prim(...args);
}

/*
    createPrim(type, vertex, nofV, index, nofI) {
      let i;
      let frameBuffer = buffer(gl.UNIFORM_BUFFER, 8 * 4, 1);
//      prim.vBuf = new buf._buffer(vBufID, 2, gl.ARRAY_BUFFER);
//      prim.iBuf = new buf._buffer(iBufID, 3, gl.ELEMENTS_ARRAY_BUFFER);
      
//      frameBuffer.createAnyBuffer(4 * 8);
//      gl.bindBuffer(this.type, 0);    

      if (vertex != null && nofV != 0) {
          this.minBB = this.maxBB = vertex[0].P;
          for(let i = 1; i < nofV; i++) {
              if (this.minBB.x > vertex.P.x) {
                  this.minBB.x = vertex.P.x;                
              }
              if (this.maxBB.x < vertex.P.x) {
                  this.maxBB.x = vertex.P.x;                
              }

              if (this.minBB.y > vertex.P.y) {
                  this.minBB.y = vertex.P.y;                
              }   
              if (this.maxBB.y < vertex.P.y) {
                  this.maxBB.y = vertex.P.y;                
              }

              if (this.minBB.z > vertex.P.z) {
                  this.minBB.z = vertex.P.z;                
              }   
              if (this.maxBB.z < vertex.P.z) {
                  this.maxBB.z = vertex.P.z;                
              }
          }
          prim.vBuf.createAnyBuffer(new Float32Array(vertex));

          gl.createVertexArray(1, prim.vA);
          gl.bindVertexArray(prim.vA);

          gl.vertexAttribPointer(posloc, 3, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(posloc);

  / *        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
          gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 12, 3);
          gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 12, 6);
          gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 12, 9);

          gl.enableVertexAttribArray(0);
          gl.enableVertexAttribArray(1);
          gl.enableVertexAttribArray(2);
          gl.enableVertexAttribArray(3);
  * / 
          gl.bindVertexArray(0);
      }

      if (index != null && nofI != 0) {
          prim.vBuf.createAnyBuffer(new Float32Array(index));
          gl.bindBuffer(gl.ELEMENTS_ARRAY_BUFFER, 0);
          prim.numOfElems = nofI;
      }
      else {
          prim.numOfElems = nofV;
      }
      prim.Trans = _mat4._mat4(null);
      prim.type = type;
  }
}

/ *
function freePrim(prim) {
  gl.bindVertexArray(prim.vA);
  gl.bindBuffer(gl.ARRAY_BUFFER, 0);
  gl.deleteBuffers(1, prim.vBuf);
  gl.bindVertexArray(0);
  gl.deleteVertexArrays(1, prim.vA);
  gl.deleteBuffers(1, prim.iBuf);

}*/

/*
  export function newVertex(pos, normal, tex, color) {
      this.p = pos;
      this.n = normal;
      this.t = tex;
      this.pc = color;
  }
???????????
  class _vertex {
    constructor (pos, normal, tex, color) {
      this.p = pos;
      this.n = normal;
      this.t = tex;
      this.c = color;
    }
  }

  let prim = {
      type: gl.TRIANGLE_STRIP,
      minBB: _vec3.vec3(0, 0, 0),
      maxBB: _vec3.vec3(0, 0, 0),
      vA: 0, vBuf: 0, iBuf: 0,
      numOfElems: 0,
      numOfPP: 0,
      Trans: _mat4.mat4()
  }

*/