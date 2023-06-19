import {mat4} from "./mat4.js";
import {vec3} from "./vec3.js";
export {mat4, vec3};

class _camera {
  constructor() {
    // Projection properties
    this.projSize = 0.1;     // Project plane fit square                    
    this.projDist = 0.1;     // Distance to project plane from viewer (near)
    this.projFarClip = 1800; // Distance to project far clip plane (far)    

    // Local size data
    this.frameW = 30;   // Frame width
    this.frameH = 30;   // Frame height
    
    // Matrices
    this.matrView = mat4();    // View coordinate system matrix
    this.matrProj = mat4();    // Projection coordinate system matrix
    this.matrVP = mat4();      // View and projection matrix precalculate value

        // Set camera default settings
    this.loc = vec3(0, 0, 8);      // Camera location       
    this.at = vec3(0, 0, 0);       // Camera destination    
    this.dir = vec3(0, 0, -1);     // Camera Direction      
    this.up = vec3(0, 1, 0);       // Camera UP direction   
    this.up1 = vec3(0, 1, 0);       // Camera UP direction   
    this.right = vec3(1, 0, 0);    // Camera RIGHT direction
    this.setDef();
   
  } // End of 'constructor' function
  
  // Camera parmeters setting function
  set(loc, at, up1) {
    this.matrView = this.view(loc, at, up1);
    this.dir.set(-this.matrView.m[0][2],
                 -this.matrView.m[1][2],
                 -this.matrView.m[2][2]);
    this.up.set(this.matrView.m[0][1],
               this.matrView.m[1][1],
               this.matrView.m[2][1]);
    this.right.set(this.matrView.m[0][0],
                   this.matrView.m[1][0],
                   this.matrView.m[2][0]);
    this.matrVP = mat4(this.matrView).mul(this.matrProj);
  } // End of 'set' function

    view(loc, at, up1) {
      let dir = (at.sub(loc)).normalise();
      let right = (dir.cross(up1)).normalise();
      let up = right.cross(dir);
      let v = mat4(null);

      v.m = [[right.x, up.x, -dir.x, 0],
            [right.y, up.y, -dir.y, 0],
            [right.z, up.z, -dir.z, 0], 
            [-loc.dot(right), -loc.dot(up), loc.dot(dir), 1]];
      return v;
  }
  ortho (left, right, bottom, top, near, far) {
      let o = mat4(null);

      o.m = [[2 / (right - left), 0, 0, 0],
            [0, 2 / (top - bottom), 0, 0],
            [0, 0, 2 / (near - far), 0],
            [-(right + left) / (right - left), -(top + bottom) / (top - bottom), (near + far) / (near - far), 1],
      ];      
      return o;      
  }
  //frustum
  frustum (left, right, bottom, top, near, far) {
      let f = mat4(null);

      f.m = [[2 * near / (right - left), 0, 0, 0],
            [0, 2 * near / (top - bottom), 0, 0],
            [(right + left) / (right - left), (top + bottom) / (top - bottom), (near + far) / (near - far), -1],
            [0, 0, -2 * near * far / (far - near), 0],
      ];      
      return f;
  }

  // Projection parameters setting function.
  setProj(projSize, projDist, projFarClip) {
    let rx = projSize, ry = projSize;

    this.projDist = projDist;
    this.projSize = projSize;
    this.projFarClip = projFarClip;

    // Correct aspect ratio
    if (this.frameW > this.frameH)
      rx *= this.frameW / this.frameH;
    else
      ry *= this.frameH / this.frameW;
    this.matrProj = this.frustum(-rx / 2.0, rx / 2.0, -ry / 2.0, ry / 2.0, projDist, projFarClip);
    this.matrView = this.view(this.loc, this.at, this.up1);
    // pre-calculate view * proj matrix
    this.matrVP = mat4(this.matrView).mul(this.matrProj);
  } // End of 'setProj' function

  // Resize camera and projection function.
  setSize(frameW, frameH) {
    if (frameW < 1)
      frameW = 1;
    if (frameH < 1)
      frameH = 1;
    this.frameW = frameW;
    this.frameH = frameH;
    // Reset projection with new render window size
    this.setProj(this.projSize, this.projDist, this.projFarClip);
  } // End of 'setSize' function

  // Camera set default values function.
  setDef() {
    this.loc.set(0, 5, 8);
    this.at.set(0, 0, 0);
    this.up1.set(0, 1, 0);

    this.projDist = 0.1;
    this.projSize = 0.1;
    this.projFarClip = 1800;

    this.frameW = 30;
    this.frameH = 30;

    this.set(this.loc, this.at, this.up1);
    this.setProj(this.projSize, this.projDist, this.projFarClip);
    this.setSize(this.frameW, this.frameH);
  } // End of 'setDef' function

} // End of 'camera' class

export function camera(...args) {
  return new _camera(...args);
} // End of 'mat4' function
