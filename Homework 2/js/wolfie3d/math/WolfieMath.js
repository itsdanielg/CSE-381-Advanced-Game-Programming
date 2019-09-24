'use strict'
class WolfieVector3x1 {

    /**
     * DO NOT CHANGE THIS FUNCTION
     */
    constructor() {
        this.xAxis = this.create();
        this.set(this.xAxis, 1.0, 0.0, 0.0);
        this.yAxis = this.create();
        this.set(this.yAxis, 0.0, 1.0, 0.0);
        this.zAxis = this.create();
        this.set(this.zAxis, 0.0, 0.0, 1.0);
    }

    /**
     * DO NOT CHANGE THIS FUNCTION
     * 
     * create - this makes and returns a 3x1 array to represent a vector or point.
     */
    create(x, y, z) {
        var size = 3;
        var vector3x1 = new Float32Array(size);
        this.set(vector3x1, x, y, z);
        return vector3x1;
    }

    /**
     * set - this function sets the x, y, and z values into the outVector.
     */
    set(outVector, x, y, z) {
        outVector[0] = x;
        outVector[1] = y;
        outVector[2] = z;
    }

    /**
     * dot - this function calculates and returns the dot product of vector1 and vector2.
     */
    dot(vector1, vector2) {
        return vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2];
    }

    /**
     * cross - this function calculates the cross product of vector1 x vector2 and puts the
     * result in outVector.
     */
    cross(outVector, vector1, vector2) {
        let ax = vector1[0], ay = vector1[1], az = vector1[2];
        let bx = vector2[0], by = vector2[1], bz = vector2[2];
      
        outVector[0] = ay * bz - az * by;
        outVector[1] = az * bx - ax * bz;
        outVector[2] = ax * by - ay * bx;
        return outVector;
    }

    /**
     * normalize - this function takes the inVector and writes a normalized version of
     * the vector to outVector
     */
    normalize(outVector, inVector) {
        var xSquared = inVector[0] * inVector[0];
        var ySquared = inVector[1] * inVector[1];
        var zSquared = inVector[2] * inVector[2];
        var vectorLength = Math.sqrt(xSquared + ySquared + zSquared);
        outVector[0] = xSquared/vectorLength;
        outVector[1] = ySquared/vectorLength;
        outVector[2] = zSquared/vectorLength;
    }
}

class WolfieMatrix4x4 {

    /**
     * DO NOT CHANGE THIS FUNCTION
     */    
    constructor() {
        this.EPSILON = 0.000001;
        this.translateTemp = this.create();
        this.rotateTemp = this.create();
        this.scaleTemp = this.create();
        this.cameraTemp = this.create();
    }

    /**
     * DO NOT CHANGE THIS FUNCTION
     * 
     * create - this makes and returns a 4x4 column-major matrix int the form of a single-dimenational array.
     */
    create() {
        var size = 16;
        var matrix4x4 = new Float32Array(size);
        for (var i = 0; i < size; i++)
            matrix4x4[i] = 0.0;
        return matrix4x4;
    }
    
    /**
     * identity - this method loads identity matrix values into the matrix argument,
     * which must be a column-major 4x4 matrix (as produced by create).
     */    
    identity(matrix) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var index = (i * 4) + j;
                if (i == j)
                    matrix[index] = 1.0;
                else
                    matrix[index] = 0.0;
            }
        }
    }
    
    /**
     * translate - this method translates the inMatrix by the positionArray
     * and puts the result in the outMatrix.
     */
    translate(outMatrix, inMatrix, positionArray) {
        let x = positionArray[0], y = positionArray[1], z = positionArray[2];
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
      
        if (inMatrix === outMatrix) {
          outMatrix[12] = inMatrix[0] * x + inMatrix[4] * y + inMatrix[8] * z + inMatrix[12];
          outMatrix[13] = inMatrix[1] * x + inMatrix[5] * y + inMatrix[9] * z + inMatrix[13];
          outMatrix[14] = inMatrix[2] * x + inMatrix[6] * y + inMatrix[10] * z + inMatrix[14];
          outMatrix[15] = inMatrix[3] * x + inMatrix[7] * y + inMatrix[11] * z + inMatrix[15];
        } else {
          a00 = inMatrix[0]; a01 = inMatrix[1]; a02 = inMatrix[2]; a03 = inMatrix[3];
          a10 = inMatrix[4]; a11 = inMatrix[5]; a12 = inMatrix[6]; a13 = inMatrix[7];
          a20 = inMatrix[8]; a21 = inMatrix[9]; a22 = inMatrix[10]; a23 = inMatrix[11];
      
          outMatrix[0] = a00; outMatrix[1] = a01; outMatrix[2] = a02; outMatrix[3] = a03;
          outMatrix[4] = a10; outMatrix[5] = a11; outMatrix[6] = a12; outMatrix[7] = a13;
          outMatrix[8] = a20; outMatrix[9] = a21; outMatrix[10] = a22; outMatrix[11] = a23;
      
          outMatrix[12] = a00 * x + a10 * y + a20 * z + inMatrix[12];
          outMatrix[13] = a01 * x + a11 * y + a21 * z + inMatrix[13];
          outMatrix[14] = a02 * x + a12 * y + a22 * z + inMatrix[14];
          outMatrix[15] = a03 * x + a13 * y + a23 * z + inMatrix[15];
        }    
    }

    /**
     * rotate - this method rotates the inMatrix around the axis by radian degrees and
     * puts the result in outMatrix.
     */
    rotate(outMatrix, inMatrix, radians, axis) {
        let x = axis[0], y = axis[1], z = axis[2];
        let len = Math.sqrt(x * x + y * y + z * z);
        let s, c, t;
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        let b00, b01, b02;
        let b10, b11, b12;
        let b20, b21, b22;
      
        if (len < this.EPSILON) { return null; }
      
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
      
        s = Math.sin(radians);
        c = Math.cos(radians);
        t = 1 - c;
      
        a00 = inMatrix[0]; a01 = inMatrix[1]; a02 = inMatrix[2]; a03 = inMatrix[3];
        a10 = inMatrix[4]; a11 = inMatrix[5]; a12 = inMatrix[6]; a13 = inMatrix[7];
        a20 = inMatrix[8]; a21 = inMatrix[9]; a22 = inMatrix[10]; a23 = inMatrix[11];
      
        // Construct the elements of the rotation matrix
        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;
      
        // Perform rotation-specific matrix multiplication
        outMatrix[0] = a00 * b00 + a10 * b01 + a20 * b02;
        outMatrix[1] = a01 * b00 + a11 * b01 + a21 * b02;
        outMatrix[2] = a02 * b00 + a12 * b01 + a22 * b02;
        outMatrix[3] = a03 * b00 + a13 * b01 + a23 * b02;
        outMatrix[4] = a00 * b10 + a10 * b11 + a20 * b12;
        outMatrix[5] = a01 * b10 + a11 * b11 + a21 * b12;
        outMatrix[6] = a02 * b10 + a12 * b11 + a22 * b12;
        outMatrix[7] = a03 * b10 + a13 * b11 + a23 * b12;
        outMatrix[8] = a00 * b20 + a10 * b21 + a20 * b22;
        outMatrix[9] = a01 * b20 + a11 * b21 + a21 * b22;
        outMatrix[10] = a02 * b20 + a12 * b21 + a22 * b22;
        outMatrix[11] = a03 * b20 + a13 * b21 + a23 * b22;
      
        if (inMatrix !== outMatrix) { // If the source and destination differ, copy the unchanged last row
          outMatrix[12] = inMatrix[12];
          outMatrix[13] = inMatrix[13];
          outMatrix[14] = inMatrix[14];
          outMatrix[15] = inMatrix[15];
        }
        return outMatrix;
    }
    
    /**
     * scale - this method scales the inMatrix by the scalingVector
     * and puts the result in the outMatrix.
     */
    scale(outMatrix, inMatrix, scalingVector) {
        let x = scalingVector[0], y = scalingVector[1], z = scalingVector[2];

        outMatrix[0] = inMatrix[0] * x;
        outMatrix[1] = inMatrix[1] * x;
        outMatrix[2] = inMatrix[2] * x;
        outMatrix[3] = inMatrix[3] * x;
        outMatrix[4] = inMatrix[4] * y;
        outMatrix[5] = inMatrix[5] * y;
        outMatrix[6] = inMatrix[6] * y;
        outMatrix[7] = inMatrix[7] * y;
        outMatrix[8] = inMatrix[8] * z;
        outMatrix[9] = inMatrix[9] * z;
        outMatrix[10] = inMatrix[10] * z;
        outMatrix[11] = inMatrix[11] * z;
        outMatrix[12] = inMatrix[12];
        outMatrix[13] = inMatrix[13];
        outMatrix[14] = inMatrix[14];
        outMatrix[15] = inMatrix[15];
        return outMatrix;
    }
    
    /**
     * multiply - this method multiplies matrix1 * matrix2 and puts
     * the result in outMatrix.
     */
    multiply(outMatrix, matrix1, matrix2) {
        let a00 = matrix1[0], a01 = matrix1[1], a02 = matrix1[2], a03 = matrix1[3];
        let a10 = matrix1[4], a11 = matrix1[5], a12 = matrix1[6], a13 = matrix1[7];
        let a20 = matrix1[8], a21 = matrix1[9], a22 = matrix1[10], a23 = matrix1[11];
        let a30 = matrix1[12], a31 = matrix1[13], a32 = matrix1[14], a33 = matrix1[15];
      
        // Cache only the current line of the second matrix
        let b0  = matrix2[0], b1 = matrix2[1], b2 = matrix2[2], b3 = matrix2[3];
        outMatrix[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        outMatrix[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        outMatrix[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        outMatrix[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
      
        b0 = matrix2[4]; b1 = matrix2[5]; b2 = matrix2[6]; b3 = matrix2[7];
        outMatrix[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        outMatrix[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        outMatrix[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        outMatrix[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
      
        b0 = matrix2[8]; b1 = matrix2[9]; b2 = matrix2[10]; b3 = matrix2[11];
        outMatrix[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        outMatrix[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        outMatrix[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        outMatrix[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
      
        b0 = matrix2[12]; b1 = matrix2[13]; b2 = matrix2[14]; b3 = matrix2[15];
        outMatrix[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        outMatrix[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        outMatrix[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        outMatrix[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
        return outMatrix;
    }
    
    /**
     * invert - this method gets the inverse of inMatrix and puts the result
     * in outMatrix.
     */
    invert(outMatrix, inMatrix) {
        let a00 = inMatrix[0], a01 = inMatrix[1], a02 = inMatrix[2], a03 = inMatrix[3];
        let a10 = inMatrix[4], a11 = inMatrix[5], a12 = inMatrix[6], a13 = inMatrix[7];
        let a20 = inMatrix[8], a21 = inMatrix[9], a22 = inMatrix[10], a23 = inMatrix[11];
        let a30 = inMatrix[12], a31 = inMatrix[13], a32 = inMatrix[14], a33 = inMatrix[15];
      
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;
      
        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      
        if (!det) {
          return null;
        }
        det = 1.0 / det;
      
        outMatrix[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        outMatrix[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        outMatrix[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        outMatrix[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        outMatrix[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        outMatrix[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        outMatrix[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        outMatrix[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        outMatrix[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        outMatrix[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        outMatrix[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        outMatrix[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        outMatrix[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        outMatrix[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        outMatrix[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        outMatrix[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
      
        return outMatrix;
    }

    /**
     * persepctive - this method loads the perspective matrix into the outMatrix
     * based on the values provided.
     */
    perspective(outMatrix, fieldOfViewY, aspectRatio, nearClippingPlane, farClippingPlane) {
        let f = 1.0 / Math.tan(fieldOfViewY / 2), nf;
        outMatrix[0] = f / aspectRatio;
        outMatrix[1] = 0;
        outMatrix[2] = 0;
        outMatrix[3] = 0;
        outMatrix[4] = 0;
        outMatrix[5] = f;
        outMatrix[6] = 0;
        outMatrix[7] = 0;
        outMatrix[8] = 0;
        outMatrix[9] = 0;
        outMatrix[11] = -1;
        outMatrix[12] = 0;
        outMatrix[13] = 0;
        outMatrix[15] = 0;
        if (farClippingPlane != null && farClippingPlane !== Infinity) {
          nf = 1 / (nearClippingPlane - farClippingPlane);
          outMatrix[10] = (farClippingPlane + nearClippingPlane) * nf;
          outMatrix[14] = (2 * farClippingPlane * nearClippingPlane) * nf;
        } else {
          outMatrix[10] = -1;
          outMatrix[14] = -2 * nearClippingPlane;
        }
        return outMatrix;        
    }

    /**
     * model - this method loads the model matrix into outMatrix based on the translate,
     * rotate, and scale vectors provided.
     */
    model(outMatrix, translate, scale, rotate) {

        // CLEAR THE MATRICES
        this.identity(outMatrix);
        this.identity(this.translateTemp);
        this.identity(this.scaleTemp);
        this.identity(this.rotateTemp);

        // THIS WILL MOVE THE MODEL INTO POSITION
        this.translate(this.translateTemp, this.translateTemp, translate);

        // AND THIS WILL ORIENT IT
        this.rotate(this.rotateTemp, this.rotateTemp, rotate[0], wolfieVector3x1.xAxis);
        this.rotate(this.rotateTemp, this.rotateTemp, rotate[1], wolfieVector3x1.yAxis);
        this.rotate(this.rotateTemp, this.rotateTemp, rotate[2], wolfieVector3x1.zAxis);

        // AND THIS WILL SCALE IT
        this.scale(this.scaleTemp, this.scaleTemp, scale);

        // NOW COMBINE OUR TRANSFORMATIONS
        this.multiply(outMatrix, this.scaleTemp, this.rotateTemp);
        this.multiply(outMatrix, this.translateTemp, outMatrix);        
    }

    /**
     * view - this method loads the view matrix into outMatrix based on the camera
     * position and orientation.
     */
    view(outMatrix, position, orientation) {
        // START WITH THE IDENTITY MATRIX
        wolfieMatrix4x4.identity(this.translateTemp);
        wolfieMatrix4x4.identity(this.rotateTemp);
        wolfieMatrix4x4.identity(outMatrix);
        
        // POSITION THE CAMERA
        wolfieMatrix4x4.translate(this.translateTemp, this.translateTemp, position);

        // @todo DOUBLE CHECK ROTATION FOR z

        // AND THEN USE THEM TO ROTATE THE CAMERA        
        wolfieMatrix4x4.rotate(this.rotateTemp, this.rotateTemp, orientation[0], [1, 0, 0]);
        wolfieMatrix4x4.rotate(this.rotateTemp, this.rotateTemp, orientation[1], [0, 1, 0]);
        wolfieMatrix4x4.rotate(this.rotateTemp, this.rotateTemp, orientation[2], [0, 0, 1]);

        // NOW COMBINE TRANSLATION AND ROTATION INTO THE CAMERA MATRIX
        wolfieMatrix4x4.identity(this.cameraTemp);
        wolfieMatrix4x4.multiply(this.cameraTemp, this.translateTemp, this.rotateTemp);

        // AND NOW MAKE THE VIEW MATRIX ITS INVERSE
        wolfieMatrix4x4.invert(outMatrix, this.cameraTemp);        
    }
}

/**
 * DO NOT CHANGE - THIS JUST INITIALIZES THE WolfieMath LIBRARY
 * AND MAKES THE VECTOR AND MATRIX TYPES AVAILABLE EVERYWHERE
 */
class WolfieMath {
    constructor(){
        window.wolfieVector3x1 = new WolfieVector3x1();
        window.wolfieMatrix4x4 = new WolfieMatrix4x4();
    }

    printVector(name, data, size) {
        var text = "";
        text += name + ": [";
        for (var i = 0; i < size; i++) {
            text += data[i];
            if (i < (size-1))
                text += ", ";
        }
        text += "]\n";
        console.log(text);
    }

    printMatrix(name, data) {
        var text = name + "\n[";
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var index = (j*4) + i;
                text += data[index];
                if (j < 3)
                    text += ",";
                else if (i < 3)
                    text += "\n";
                else
                    text += "]";
            }
        }
        console.log(text);
    }

    runVectorTests() {
        // TEST DOT PRODUCT
        var vector1 = wolfieVector3x1.create(1, 0, 0);
        this.printVector("vector1", vector1, 3);
        var vector2 = wolfieVector3x1.create(0, 1, 0);
        this.printVector("vector2", vector2, 3);
        var dot = wolfieVector3x1.dot(vector1, vector2);
        console.log("vector1 dot vector2 = " + dot);  

        // TEST CROSS PRODUCT        
        var crossResult = wolfieVector3x1.create(0, 0, 0);
        wolfieVector3x1.cross(crossResult, vector1, vector2);
        this.printVector("vector1 cross vector2 = ", crossResult, 3); 

        // TEST NORMALIZE
        wolfieVector3x1.set(vector1, 1, 1, 0);
        var normalResult = wolfieVector3x1.create(0, 0, 0);
        wolfieVector3x1.normalize(normalResult, vector1);
        this.printVector("pre-normalized vector: ", vector1, 3);
        this.printVector("normalized vector = ", normalResult, 3);

        // ADD MORE AS NEEDED
    }

    runMatrixTests() {
        // identity
        var identityMatrix = wolfieMatrix4x4.create();
        wolfieMatrix4x4.identity(identityMatrix);
        this.printMatrix("identity matrix:", identityMatrix);

        // translate
        var translateMatrix = wolfieMatrix4x4.create();
        wolfieMatrix4x4.identity(translateMatrix);
        var position = wolfieVector3x1.create(10, 20, 30);
        wolfieMatrix4x4.translate(translateMatrix, translateMatrix, position);
        this.printMatrix("translate matrix:", translateMatrix);

        // rotate x
        var rotateMatrix = wolfieMatrix4x4.create();
        var rotation = wolfieVector3x1.create(Math.PI/4, Math.PI/8, Math.PI/16);
        wolfieMatrix4x4.identity(rotateMatrix);
        wolfieMatrix4x4.rotate(rotateMatrix, rotateMatrix, rotation[0], wolfieVector3x1.xAxis);
        this.printMatrix("x rotation Matrix:", rotateMatrix);

        // rotate y
        wolfieMatrix4x4.identity(rotateMatrix);
        wolfieMatrix4x4.rotate(rotateMatrix, rotateMatrix, rotation[1], wolfieVector3x1.yAxis);
        this.printMatrix("y rotation Matrix:", rotateMatrix);

        // rotate z
        wolfieMatrix4x4.identity(rotateMatrix);
        wolfieMatrix4x4.rotate(rotateMatrix, rotateMatrix, rotation[2], wolfieVector3x1.zAxis);
        this.printMatrix("z rotation Matrix:", rotateMatrix);

        // scale
        var scaleMatrix = wolfieMatrix4x4.create();
        wolfieMatrix4x4.identity(scaleMatrix);
        var scale = wolfieVector3x1.create(1,2,4);
        wolfieMatrix4x4.scale(scaleMatrix, scaleMatrix, scale);
        this.printMatrix("scale Matrix:", scaleMatrix);

        // multiply the rotation and scaling matrices together
        var multMatrix = wolfieMatrix4x4.create();
        wolfieMatrix4x4.identity(multMatrix);
        wolfieMatrix4x4.multiply(multMatrix, scaleMatrix, rotateMatrix);
        this.printMatrix("scaling * rotation Matrices: ", multMatrix);

        //perspective
        var fieldOfView = 90 * 180/Math.PI;
        var nearClippingPlane = 1.0;
        var farClippingPlane = 1000.0;
        var aspectRatio = 16/9;
        var perspectiveMatrix = wolfieMatrix4x4.create();
        wolfieMatrix4x4.identity(perspectiveMatrix);
        wolfieMatrix4x4.perspective(perspectiveMatrix, fieldOfView, aspectRatio, nearClippingPlane, farClippingPlane);
        this.printMatrix("perspective Matrix: ", perspectiveMatrix);

        // model
        var modelMatrix = wolfieMatrix4x4.create();
        wolfieMatrix4x4.identity(modelMatrix);
        wolfieMatrix4x4.model(modelMatrix, position, scale, rotation);
        this.printMatrix("model Matrix: ", modelMatrix);

        // view
        var viewMatrix = wolfieMatrix4x4.create();
        wolfieMatrix4x4.identity(viewMatrix);
        var cameraPosition = wolfieVector3x1.create(10, 20, 30);
        var cameraOrientation = wolfieVector3x1.create(0, 0, -1);
        wolfieMatrix4x4.view(viewMatrix, cameraPosition, cameraOrientation);
        this.printMatrix("view Matrix: ", viewMatrix);

        // ADD MORE AS NEEDED
    }
}