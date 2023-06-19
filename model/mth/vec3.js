class _vec3 {
    addMethod (obj, name, func) {
        let old = obj[name];
        obj[name] = (...args) => {
            if (func.length == args.length) return func.apply(obj, args);
            else if (typeof old == 'function') return old.apply(obj, args);
        }
    }
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set() {
        let res = new _vec3(this.x, this.y, this.z);
        return res;
    }    
    set1(a) {
        this.x = a;
        this.y = a;
        this.z = a;
        return this;
    }

    add2(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }
    add3(other1, other2) {
        this.x += (other1.x + other2.x);
        this.y += (other1.y + other2.y);
        this.z += (other1.z + other2.z);
        return this;
    }
    sub(other) {
        let res = new _vec3(this.x - other.x,
                            this.y - other.y,
                            this.z - other.z)
        return res;
    }
    mulNum(a) {
        this.x *= a;
        this.y *= a;
        this.z *= a;
        return this;
    }
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    cross(other) {
        let res = vec3(0, 0, 0);
        res.x = this.y * other.z - this.z * other.y;
        res.y = this.z * other.x - this.x * other.z;
        res.z = this.x * other.y - this.y * other.x;
        return res;           
    }
    len2() {
        return this.dot(this);
    }
    normalise() {
        let len2 = this.len2();
        if (len2 == 1 || len2 == 0) return this;
        return this.mulNum(1.0 / Math.sqrt(len2));
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
}

export function vec3(...args) {
    return new _vec3(...args);
}   