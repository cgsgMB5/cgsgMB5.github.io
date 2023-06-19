import { vec3 } from './vec3.js'


class _mat4 {
    constructor(m = null) {
      if (m != null && m != undefined && typeof m == 'object')
        if (m.length == 4)
          this.m = m;
        else
          this.m = m.m;
      else
        this.m = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    }

    transpose() {
        return this.m = [[this.m[0][0], this.m[1][0], this.m[2][0], this.m[3][0]],
                         [this.m[0][1], this.m[1][1], this.m[2][1], this.m[3][1]],
                         [this.m[0][2], this.m[1][2], this.m[2][2], this.m[3][2]], 
                         [this.m[0][3], this.m[1][3], this.m[2][3], this.m[3][3]]];
    }

    translate(vec = vec3(0, 0, 0)) {
        this.m = [[1, 0, 0, 0],
                       [0, 1, 0, 0],
                       [0, 0, 1, 0],
                       [vec.x, vec.y, vec.z, 1]];
        return this;
    }
    scale(vec = vec3(1, 1, 1)) {
        this.m = [[vec.x, 0, 0, 0],
                  [0, vec.y, 0, 0],
                  [0, 0, vec.z, 0],
                  [0, 0, 0, 1]];
        return this;
    }

    rotate(aid, vec) {
        let air = aid * (Math.PI / 180.0),
        s = Math.sin(air), c = Math.cos(air);
        vec.normalise();
        this.m = [[c + vec.x * vec.x * (1 - c),
            vec.x * vec.y * (1 - c) + vec.z * s, 
              vec.x * vec.z * (1 - c) - vec.y * s, 0],
          [vec.y * vec.x * (1 - c) - vec.z * s,
            c + vec.y * vec.y * (1 - c),
              vec.y * vec.z * (1 - c) + vec.x * s, 0],
          [vec.z * vec.x * (1 - c) + vec.y * s,
            vec.z * vec.y * (1 - c) - vec.x * s,
              c + vec.z * vec.z * (1 - c), 0],
          [0, 0, 0, 1]];
          return this;
    }
    mul(other) {
        let mat = mat4(null);
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++) {
                mat.m[i][j] = 0;
                for (let k = 0; k < 4; k++)
                    mat.m[i][j] += this.m[i][k] * other.m[k][j];
            }
        this.m = mat.m;
        return this;    
    }
/*
    setRotate(AngleInDegree, R) {
      let a = AngleInDegree * Math.PI / 180.0, sine = Math.sin(a), cosine = Math.cos(a);
      let x = 0, y = 0, z = 1;
      if (typeof R == 'object')
        if (R.length == 3)
          x = R[0], y = R[1], z = R[2];
        else
          x = R.x, y = R.y, z = R.z;
      // Vector normalize
      let len = x * x + y * y + z * z;
      if (len != 0 && len != 1)
        len = Math.sqrt(len), x /= len, y /= len, z /= len;
      this.m[0][0] = cosine + x * x * (1 - cosine);
      this.m[0][1] = x * y * (1 - cosine) + z * sine;
      this.m[0][2] = x * z * (1 - cosine) - y * sine;
      this.m[0][3] = 0;
      this.m[1][0] = y * x * (1 - cosine) - z * sine;
      this.m[1][1] = cosine + y * y * (1 - cosine);
      this.m[1][2] = y * z * (1 - cosine) + x * sine;
      this.m[1][3] = 0;
      this.m[2][0] = z * x * (1 - cosine) + y * sine;
      this.m[2][1] = z * y * (1 - cosine) - x * sine;
      this.m[2][2] = cosine + z * z * (1 - cosine);
      this.m[2][3] = 0;
      this.m[3][0] = 0;
      this.m[3][1] = 0;
      this.m[3][2] = 0;
      this.m[3][3] = 1;
      return this;
    } // End of 'setRotate' function

    rotate(AngleInDegree, R) {
      return this.mul(mat4().setRotate(AngleInDegree, R));
    } // End of 'rotate' function
*/
    determ3 (a11, a12, a13, a21, a22, a23, a31, a32, a33) {
        return a11 * a22 * a33 + a12 * a23 * a31 + a13 * a21 * a32 -
               a11 * a23 * a32 - a12 * a21 * a33 - a13 * a22 * a31;
    }

    determ4 () {
        return +
        +this.m[0][0] * this.determ3(this.m[1][1], this.m[1][2], this.m[1][3],
                                       this.m[2][1], this.m[2][2], this.m[2][3],
                                       this.m[3][1], this.m[3][2], this.m[3][3]) +
        -this.m[0][1] * this.determ3(this.m[1][0], this.m[1][2], this.m[1][3],
                                       this.m[2][0], this.m[2][2], this.m[2][3],
                                       this.m[3][0], this.m[3][2], this.m[3][3]) +
        +this.m[0][2] * this.determ3(this.m[1][0], this.m[1][1], this.m[1][3],
                                       this.m[2][0], this.m[2][1], this.m[2][3],
                                       this.m[3][0], this.m[3][1], this.m[3][3]) +
        -this.m[0][3] * this.determ3(this.m[1][0], this.m[1][1], this.m[1][2],
                                       this.m[2][0], this.m[2][1], this.m[2][2],
                                       this.m[3][0], this.m[3][1], this.m[3][2]);
    }

    inverse() {
        let det = this.determ4();
        let r = new _mat4();
      
        if (det == 0)
          return _mat4(null);
      
        /* build adjoint matrix */
        r.m[0][0] =
          +this.determ3(this.m[1][1], this.m[1][2], this.m[1][3],
                         this.m[2][1], this.m[2][2], this.m[2][3],
                         this.m[3][1], this.m[3][2], this.m[3][3]) / det;
        r.m[1][0] =
          -this.determ3(this.m[1][0], this.m[1][2], this.m[1][3],
                         this.m[2][0], this.m[2][2], this.m[2][3],
                         this.m[3][0], this.m[3][2], this.m[3][3]) / det;
        r.m[2][0] =
          +this.determ3(this.m[1][0], this.m[1][1], this.m[1][3],
                         this.m[2][0], this.m[2][1], this.m[2][3],
                         this.m[3][0], this.m[3][1], this.m[3][3]) / det;
        r.m[3][0] =
          -this.determ3(this.m[1][0], this.m[1][1], this.m[1][2],
                         this.m[2][0], this.m[2][1], this.m[2][2],
                         this.m[3][0], this.m[3][1], this.m[3][2]) / det;
        r.m[0][1] =
          -this.determ3(this.m[0][1], this.m[0][2], this.m[0][3],
                         this.m[2][1], this.m[2][2], this.m[2][3],
                         this.m[3][1], this.m[3][2], this.m[3][3]) / det;
        r.m[1][1] =
          +this.determ3(this.m[0][0], this.m[0][2], this.m[0][3],
                         this.m[2][0], this.m[2][2], this.m[2][3],
                         this.m[3][0], this.m[3][2], this.m[3][3]) / det;
        r.m[2][1] =
          -this.determ3(this.m[0][0], this.m[0][1], this.m[0][3],
                         this.m[2][0], this.m[2][1], this.m[2][3],
                         this.m[3][0], this.m[3][1], this.m[3][3]) / det;
        r.m[3][1] =
          +this.determ3(this.m[0][0], this.m[0][1], this.m[0][2],
                         this.m[2][0], this.m[2][1], this.m[2][2],
                         this.m[3][0], this.m[3][1], this.m[3][2]) / det;
        r.m[0][2] =
          +this.determ3(this.m[0][1], this.m[0][2], this.m[0][3],
                         this.m[1][1], this.m[1][2], this.m[1][3],
                         this.m[3][1], this.m[3][2], this.m[3][3]) / det;
        r.m[1][2] =
          -this.determ3(this.m[0][0], this.m[0][2], this.m[0][3],
                         this.m[1][0], this.m[1][2], this.m[1][3],
                         this.m[3][0], this.m[3][2], this.m[3][3]) / det;
        r.m[2][2] =
          +this.determ3(this.m[0][0], this.m[0][1], this.m[0][3],
                         this.m[1][0], this.m[1][1], this.m[1][3],
                         this.m[3][0], this.m[3][1], this.m[3][3]) / det;
        r.m[3][2] =
          -this.determ3(this.m[0][0], this.m[0][1], this.m[0][2],
                         this.m[1][0], this.m[1][1], this.m[1][2],
                         this.m[3][0], this.m[3][1], this.m[3][2]) / det;
        r.m[0][3] =
          -this.determ3(this.m[0][1], this.m[0][2], this.m[0][3],
                         this.m[1][1], this.m[1][2], this.m[1][3],
                         this.m[2][1], this.m[2][2], this.m[2][3]) / det;
        r.m[1][3] =
          +this.determ3(this.m[0][0], this.m[0][2], this.m[0][3],
                         this.m[1][0], this.m[1][2], this.m[1][3],
                         this.m[2][0], this.m[2][2], this.m[2][3]) / det;
        r.m[2][3] =
          -this.determ3(this.m[0][0], this.m[0][1], this.m[0][3],
                         this.m[1][0], this.m[1][1], this.m[1][3],
                         this.m[2][0], this.m[2][1], this.m[2][3]) / det;
        r.m[3][3] =
          +this.determ3(this.m[0][0], this.m[0][1], this.m[0][2],
                         this.m[1][0], this.m[1][1], this.m[1][2],
                         this.m[2][0], this.m[2][1], this.m[2][2]) / det;
        return r; 
    }

    

    toArray() {
      return [this.m[0][0], this.m[0][1], this.m[0][2], this.m[0][3],
              this.m[1][0], this.m[1][1], this.m[1][2], this.m[1][3],
              this.m[2][0], this.m[2][1], this.m[2][2], this.m[2][3],
              this.m[3][0], this.m[3][1], this.m[3][2], this.m[3][3]];
    }   
}

export function mat4(...args) {
    return new _mat4(...args);
}