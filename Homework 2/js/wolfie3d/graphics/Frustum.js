'use strict'

class Frustum {
    constructor (canvasWidth, canvasHeight) {
        // THESE ARE THE DEFAULT VALUES FOR OUR PROJECTION MATRIX
        this.fieldOfView = 45.0;
        this.nearClippingPlane = 1.0;
        this.farClippingPlane = 1000.0;
        this.aspectRatio = canvasWidth/canvasHeight;
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;

        // MAKE THE MATRIX
        this.projectionMatrix = wolfieMatrix4x4.create();
    
        // THIS MATRIX WILL BE USED TO MOVE ALL MODELS FROM SCREEN SPACE TO CLIP SPACE
        this.updateProjectionMatrix();

        this.frontTopRight = wolfieVector3x1.create(this.nearClippingPlane, canvasHeight/2, canvasWidth/2);
        this.frontBottomRight = wolfieVector3x1.create(this.nearClippingPlane, -canvasHeight/2, canvasWidth/2);
        this.frontTopLeft = wolfieVector3x1.create(this.nearClippingPlane, canvasHeight/2, -canvasWidth/2);
        this.frontBottomLeft = wolfieVector3x1.create(this.nearClippingPlane, -canvasHeight/2, -canvasWidth/2);
        this.backTopRight = wolfieVector3x1.create(this.farClippingPlane, canvasHeight/2, canvasWidth/2);
        this.backBottomRight = wolfieVector3x1.create(this.farClippingPlane, -canvasHeight/2, canvasWidth/2);
        this.backTopLeft = wolfieVector3x1.create(this.farClippingPlane, canvasHeight/2, -canvasWidth/2);
        this.backBottomLeft = wolfieVector3x1.create(this.farClippingPlane, -canvasHeight/2, -canvasWidth/2);
    }
    
    updateProjectionMatrix() {
        wolfieMatrix4x4.perspective(this.projectionMatrix, this.fieldOfView, this.aspectRatio, this.nearClippingPlane, this.farClippingPlane);
    }

    scope(modelsToTest, visibleSet) {
        for (var key in modelsToTest) {
            var model = modelsToTest[key];
            if (this.isModelInFrustum(model)) {
                visibleSet.push(model);
            }
        }
    }

    isModelInFrustum(testModel) {
        // @todo perform frustum culling here
        // Get 8 Frustum Points
        var canvasHeight = this.canvasHeight;
        var canvasWidth = this.canvasWidth;
        wolfieVector3x1.set(this.frontTopRight, this.nearClippingPlane, canvasHeight/2, canvasWidth/2);
        wolfieVector3x1.set(this.frontBottomRight, this.nearClippingPlane, -canvasHeight/2, canvasWidth/2);
        wolfieVector3x1.set(this.frontTopLeft, this.nearClippingPlane, canvasHeight/2, -canvasWidth/2);
        wolfieVector3x1.set(this.frontBottomLeft, this.nearClippingPlane, -canvasHeight/2, -canvasWidth/2);
        wolfieVector3x1.set(this.backTopRight, this.farClippingPlane, canvasHeight/2, canvasWidth/2);
        wolfieVector3x1.set(this.backBottomRight, this.farClippingPlane, -canvasHeight/2, canvasWidth/2);
        wolfieVector3x1.set(this.backTopLeft, this.farClippingPlane, canvasHeight/2, -canvasWidth/2);
        wolfieVector3x1.set(this.backBottomLeft, this.farClippingPlane, -canvasHeight/2, -canvasWidth/2);
        return true;
    }
}