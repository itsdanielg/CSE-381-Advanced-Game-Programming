'use strict'

class Frustum {
    constructor (canvasWidth, canvasHeight) {
        // THESE ARE THE DEFAULT VALUES FOR OUR PROJECTION MATRIX
        this.fieldOfView = 45.0;
        this.nearClippingPlane = 1.0;
        this.farClippingPlane = 1000.0;
        this.aspectRatio = canvasWidth/canvasHeight;

        // MAKE THE MATRIX
        this.projectionMatrix = wolfieMatrix4x4.create();
    
        // THIS MATRIX WILL BE USED TO MOVE ALL MODELS FROM SCREEN SPACE TO CLIP SPACE
        this.updateProjectionMatrix();
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
        return true;
    }
}