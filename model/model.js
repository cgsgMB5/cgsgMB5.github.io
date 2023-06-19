import {vec3} from './mth/vec3.js';
import {prim} from './prims.js';

function stringTo3f(str) {
    let res = vec3(0, 0, 0), resA = [0, 0, 0];
    let num, is3 = 0;
    let arrayStr = str.split(' ');

    for (let i = 1; i < arrayStr.length, is3 < 3; i++) {
        num = parseFloat(arrayStr[i]);
            resA[is3++] = num;
    }

    res = vec3(resA[0], resA[1], resA[2]);
    return res;
}

let getN = (P0, P1, P2) => P1.sub(P0).cross(P2.sub(P0)).normalise();

export function modelLoad(file) {
    let modelArray = file.split('\n');
    let modelV = [], modelF = [];
    let modelPrim;
    let fCount = 0;
    for (let i = 0; i < modelArray.length; i++) {
        if (modelArray[i][0] == 'v' && modelArray[i][1] == ' ') {
            modelV.push(stringTo3f(modelArray[i]));
        }
        else if (modelArray[i][0] == 'f' && modelArray[i][1] == ' ') {
            modelF = modelF.concat(stringTo3f(modelArray[i]).toArray());
            modelF[fCount++]--;
            modelF[fCount++]--;
            modelF[fCount++]--;
        }
    }

    let modelN = [];
    for (let i = 0; i < modelF.length; i+=3) {
        let N = getN(modelV[modelF[i]], modelV[modelF[i + 1]], modelV[modelF[i + 2]]);


        if (typeof(modelN[modelF[i]]) != "object") {
            modelN[modelF[i]] = vec3(0, 0, 0);
        }
        if (typeof(modelN[modelF[i + 1]]) != "object") {
            modelN[modelF[i + 1]] = vec3(0, 0, 0);
        }
        if (typeof(modelN[modelF[i + 2]]) != "object") {
            modelN[modelF[i + 2]] = vec3(0, 0, 0);
        }
        modelN[modelF[i]].add2(N);
        modelN[modelF[i + 1]].add2(N);
        modelN[modelF[i + 2]].add2(N);
    }

    let v = [];

    for (let i = 0; i < modelV.length; i++) {
        v = v.concat(modelV[i].toArray().concat(modelN[i].normalise().toArray()));
    }

modelPrim = prim(v, modelF);
return modelPrim;

}