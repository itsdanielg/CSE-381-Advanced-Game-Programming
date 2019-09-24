'use strict'

class Camera {
    constructor() {
        // THE CAMERA WILL START AT THE ORIGIN LOOKING DOWN THE NEGATIVE Z-AXIS
        this.position = wolfieVector3x1.create(0.0, 0.0, 1.0);
        this.lookAt = wolfieVector3x1.create(0.0, 0.0, -1.0);
        this.up = wolfieVector3x1.create(0.0, 1.0, 0.0);
        this.right = wolfieVector3x1.create(1.0, 0.0, 0.0);
        this.rotation = wolfieVector3x1.create(0.0, 0.0, 0.0);

        // MAKE THE MATRICES
        this.translateMatrix = wolfieMatrix4x4.create();
        this.rotateMatrix = wolfieMatrix4x4.create();
        this.cameraMatrix = wolfieMatrix4x4.create();
        this.viewMatrix = wolfieMatrix4x4.create();

        // MAKE SURE THE CAMERA MATRIX IS ALWAYS UP TO DATE
        this.updateViewMatrix();
    }
    
    move(incX, incY, incZ) {
        this.position[0] += incX;
        this.position[1] += incY;
        this.position[2] += incZ;
        this.updateViewMatrix();
    }
    
    updateViewMatrix() {
        // START WITH THE IDENTITY MATRIX
        wolfieMatrix4x4.identity(this.translateMatrix);
        wolfieMatrix4x4.identity(this.rotateMatrix);
        wolfieMatrix4x4.identity(this.cameraMatrix);
        wolfieMatrix4x4.identity(this.viewMatrix);
        
        // POSITION THE CAMERA
        wolfieMatrix4x4.translate(this.translateMatrix, this.translateMatrix, this.position);

        // COMPUTE THE CAMERA'S thetaX, thetaY, and thetaZ VALUES
        this.rotation[0] = Math.asin(-this.lookAt[1]);
        this.rotation[1] = Math.atan(this.lookAt[0]/this.lookAt[2]);

        // @todo DOUBLE CHECK ROTATION FOR z

        // AND THEN USE THEM TO ROTATE THE CAMERA        
        wolfieMatrix4x4.rotate(this.rotateMatrix, this.rotateMatrix, this.rotation[0], [1, 0, 0]);
        wolfieMatrix4x4.rotate(this.rotateMatrix, this.rotateMatrix, this.rotation[1], [0, 1, 0]);
        wolfieMatrix4x4.rotate(this.rotateMatrix, this.rotateMatrix, this.rotation[2], [0, 0, 1]);

        // NOW COMBINE TRANSLATION AND ROTATION INTO THE CAMERA MATRIX
        wolfieMatrix4x4.multiply(this.cameraMatrix, this.translateMatrix, this.rotateMatrix);

        // AND NOW MAKE THE VIEW MATRIX ITS INVERSE
        wolfieMatrix4x4.invert(this.viewMatrix, this.cameraMatrix);
    }
}