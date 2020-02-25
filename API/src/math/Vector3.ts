class Vector3 {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    public constructor(_x: number = 0, _y: number = 0, _z: number = 0){
        _x = isNaN(_x) ? 0 : _x;
        _y = isNaN(_y) ? 0 : _y;
        _z = isNaN(_z) ? 0 : _z;
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }

    plus(rhs: Vector3) : Vector3 {
        return new Vector3(
            this.x + rhs.x,
            this.y + rhs.y,
            this.z + rhs.z
        );
    }

    minus(rhs: Vector3) : Vector3 {
        return new Vector3(
            this.x - rhs.x,
            this.y - rhs.y,
            this.z - rhs.z
        );
    }

    multiply(rhs: Vector3) : Vector3 {
        return new Vector3(
            this.x * rhs.x,
            this.y * rhs.y,
            this.z * rhs.z
        );
    }

    multiplyN(rhs: number) : Vector3 {
        return new Vector3(
            this.x * rhs,
            this.y * rhs,
            this.z * rhs
        );
    }

    divide(rhs: Vector3) : Vector3 {
        return new Vector3(
            this.x / rhs.x,
            this.y / rhs.y,
            this.z / rhs.z
        );
    }

    divideN(rhs: number) : Vector3 {
        return new Vector3(
            this.x / rhs,
            this.y / rhs,
            this.z / rhs
        );
    }

    magnitude() : number {
        return Math.pow(this.x * this.x + this.y * this.y + this.z * this.z, 0.5);
    }

    inverse() : Vector3 {
        return this.multiplyN(-1);
    }

    dot(rhs: Vector3) : number {
        return this.x * rhs.x
            + this.y * rhs.y
            + this.z * rhs.z;
    }

    cross(rhs: Vector3) : Vector3 {
        return new Vector3(
            this.y * rhs.z - rhs.y * this.z,
            this.z * rhs.x - rhs.z * this.x,
            this.x * rhs.y - rhs.x * this.y
        );
    }

    normalized() : Vector3 {
        let mag = this.magnitude();
        if (mag == 0) return new Vector3();
        return this.divideN(mag);
    }

    toString() : string {
        return "(" + this.x.toString() + ", " + this.y.toString() + ", " + this.z.toString() + ")";
    }

    isNaN() : boolean {
        return !(this.x===this.x && this.y===this.y && this.z===this.z);
    }

    getNaNs() : string {
        return (!(this.x===this.x) ? "x " : "") + (!(this.y===this.y) ? "y " : "") + (!(this.z===this.z) ? "z" : "");
    }


}

export default Vector3;