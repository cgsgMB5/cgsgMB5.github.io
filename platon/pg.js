import {vec3} from './mth/vec3.js';
import {prim} from './prims.js';//, vertex

let getN = (P0, P1, P2) => P1.sub(P0).cross(P2.sub(P0)).normalise();

export function createCube() {
    let size = 2 * Math.sqrt(5) / 15;
    let cu_v = [vec3(-size, size, size),
        vec3(size, size, size),
        vec3(size, -size, size),
        vec3(-size, -size, size),

        vec3(-size, size, -size),
        vec3(size, size, -size),
        vec3(size, -size, -size),
        vec3(-size, -size, -size)
    ];

    /*let cu_v = [
        -size, size, size,
        size, size, size,
        size, -size, size,
        -size, -size, size,
        -size, size, -size,
        size, size, -size,
        size, -size, -size,
        -size, -size, -size
    ];
    let cube_index = [
        0, 2, 1,
        0, 3, 2,
        1, 6, 5,
        1, 2, 6,
        5, 7, 4,
        5, 6, 7,
        4, 3, 0,
        4, 7, 3,
        4, 1, 0,
        4, 5, 1,
        6, 3, 2,
        6, 7, 3]; */




    let cu_f = [
        [0, 3, 2, 1],
        [1, 2, 6, 5],
        [5, 6, 7, 4],
        [4, 7, 3, 0],
        [4, 0, 1, 5],
        [2, 3, 7, 6]   
    ];
    let cu_i = [];

    let cube_norm = [
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        ];

    cu_f.forEach((fi) => {
        let N = getN(cu_v[fi[0]], cu_v[fi[1]], cu_v[fi[2]]);

        cube_norm[fi[0]].add2(N);
        cube_norm[fi[1]].add2(N);
        cube_norm[fi[2]].add2(N);
        cube_norm[fi[3]].add2(N);

        cu_i = cu_i.concat([fi[0], fi[2], fi[3], fi[0], fi[1], fi[2]]);
    });

    let v = [];

    for (let i = 0; i < cu_v.length; i++) {
        v[i] = cu_v[i].toArray().concat(cube_norm[i].normalise().toArray());
    }
    v = v[0].concat(v[1], v[2], v[3], v[4], v[5], v[6], v[7]);

    let cube = prim(v, cu_i);

    return cube;
}

export function createOcta() {
    let size = 0.5;
    let oc_v = [
        vec3(0, size, 0),
        vec3(0, 0, -size),
        vec3(size, 0, 0),
        vec3(0, 0, size),
        vec3(-size, 0, 0),
        vec3(0, -size, 0),
    ];

    let octa_index = [
        4, 0, 1,
        1, 0, 2,
        5, 1, 2,//
        5, 4, 1,//
        5, 3, 4,//.
        5, 2, 3,//
        2, 0, 3,
        3, 0, 4
    ]; 
/*
    octa_index = [
        0, 4, 1,
        0, 1, 2,
        0, 4, 1,
        0, 4, 1,
        0, 4, 1,
        0, 4, 1,
        0, 2, 3,
        0, 3, 4
    ];    
*/
    let octa_norm = [
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        ];

    for (let i = 0; i < octa_index.length; i+=3) {
        let N = getN(oc_v[octa_index[i]], oc_v[octa_index[i + 1]], oc_v[octa_index[i + 2]]);

        octa_norm[octa_index[i]].add2(N);
        octa_norm[octa_index[i + 1]].add2(N);
        octa_norm[octa_index[i + 2]].add2(N);
    }

    let v = [];

    for (let i = 0; i < oc_v.length; i++) {
        v = v.concat(oc_v[i].toArray().concat(octa_norm[i].normalise().toArray()));
    }

       
    let octa = prim(v, octa_index);
    octa.trans.translate(vec3(0, 0.7, 0));

    return octa;
}

export function createTetra() {
    let a = Math.sqrt(2) / 3, b = Math.sqrt(6) / 3, s = 0.5;
    let te_v = [
        vec3(0, s, 0),
        vec3(0, -1/3 * s, 2 * a * s),
        vec3(b * s, -1/3 * s, -a * s),
        vec3(-b * s, -1/3 * s, -a * s),
    ];

    let tetra_index = [
        0, 3, 1,
        0, 1, 2,
        0, 2, 3,
        2, 1, 3,
    ]; 

    let tetra_norm = [
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        vec3(0, 0, 0),
        ];

    for (let i = 0; i < tetra_index.length; i+=3) {
        let N = getN(te_v[tetra_index[i]], te_v[tetra_index[i + 1]], te_v[tetra_index[i + 2]]);

        tetra_norm[tetra_index[i]].add2(N);
        tetra_norm[tetra_index[i + 1]].add2(N);
        tetra_norm[tetra_index[i + 2]].add2(N);
    }

    let v = [];

    for (let i = 0; i < te_v.length; i++) {
        v = v.concat(te_v[i].toArray().concat(tetra_norm[i].normalise().toArray()));
    }

       
    let octa = prim(v, tetra_index);
    octa.trans.translate(vec3(0, 0.7, 0));

    return octa;
}