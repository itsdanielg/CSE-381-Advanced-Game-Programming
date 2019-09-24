'use strict'

var UniformType = {
    SAMPLER:                       'sampler',
    UNIFORM1F:                     'uniform1f',
    UNIFORM1FV:                    'uniform1fv',
    UNIFORM1I:                     'uniform1i',
    UNIFORM1IV:                    'uniform1iv',
    UNIFORM2F:                     'uniform2f',
    UNIFORM2FV:                    'uniform2fv',
    UNIFORM2I:                     'uniform2i',
    UNIFORM2IV:                    'uniform2iv',
    UNIFORM3F:                     'uniform3f',
    UNIFORM3FV:                    'uniform3fv',
    UNIFORM3I:                     'uniform3i',
    UNIFORM3IV:                    'uniform3iv',
    UNIFORM4F:                     'uniform4f',
    UNIFORM4FV:                    'uniform4fv',
    UNIFORM4I:                     'uniform4i',
    UNIFORM4IV:                    'uniform4iv',
    UNIFORMMATRIX2FV:              'uniformMatrix2fv',
    UNIFORMMATRIX3FV:              'uniformMatrix3fv',
    UNIFORMMATRIX4FV:              'uniformMatrix4fv'
};

class Model {
    constructor(modelType) {
        // THE MESH DATA OBJECT
        this.modelType = modelType;      
        
        // POSITION AN ROTATION OF THIS MODEL IN 3D SPACE
        this.position = wolfieVector3x1.create(0.0,0.0,0.0);
        this.rotation = wolfieVector3x1.create(0.0,0.0,0.0);
        this.scale = wolfieVector3x1.create(1.0, 1.0, 1.0);

        // WE'LL USE THESE TO BUILD OUR MODELVIEW MATRIX
        this.translateMatrix = wolfieMatrix4x4.create();
        this.rotateMatrix = wolfieMatrix4x4.create();
        this.scaleMatrix = wolfieMatrix4x4.create();
        this.modelviewMatrix = wolfieMatrix4x4.create();
        
        // WE'LL STORE REFERENCES TO THE UNIFORMS 
        // OUR SHADER WILL USE HERE SINCE THEY
        // CAN BE PARIICULAR TO AN INDIVIDUAL MODEL
        this.uniformNames = new Array();
        this.uniforms = new Array();

        this.rotateTest = 0.0;
        this.rotateInc = 10*Math.PI /360.0;
    }

    addUniform(uniform, shaderProgram) {
        this.uniformNames.push(uniform.name);
        this.uniforms[uniform.name] = uniform;        
        var webGL = window.wolfie3d.graphics.webGL;
        webGL.useProgram(shaderProgram);
        uniform.id = webGL.getUniformLocation(shaderProgram, uniform.name);
    }

    sendUniforms(shaderProgram) {
        // INIT THE UNIFORMS   
        var webGL = window.wolfie3d.graphics.webGL;
        webGL.useProgram(shaderProgram);
        for (var i = 0; i < this.uniformNames.length; i++) {
            var uniformName = this.uniformNames[i];
            var uniform = this.uniforms[uniformName];
            var uniformFunctionName = uniform.type;
            switch(uniform.type) {
                case UniformType.UNIFORMMATRIX2FV:
                case UniformType.UNIFORMMATRIX3FV:
                case UniformType.UNIFORMMATRIX4FV:
                    webGL[uniformFunctionName](uniform.id, uniform.transpose, uniform.data0);
                    break;
                    
                case UniformType.UNIFORM2F:
                case UniformType.UNIFORM2I:
                    webGL[uniformFunctionName](uniform.id, uniform.data0, uniform.data1);
                    break;
                    
                case UniformType.UNIFORM3F:
                case UniformType.UNIFORM3I:
                    webGL[uniformFunctionName](uniform.id, uniform.data0, uniform.data1, uniform.data2);
                    break;
                
                case UniformType.UNIFORM4F:
                case UniformType.UNIFORM4I:
                    webGL[uniformFunctionName](uniform.id, uniform.data0, uniform.data1, uniform.data2, uniform.data3);
                    break;
                    
                case UniformType.SAMPLER:
                    var textureToActivate = "TEXTURE" + this.texture.index;
                    webGL.activeTexture(webGL[textureToActivate]);
                    webGL.bindTexture(webGL.TEXTURE_2D, this.texture.webGLtexture);
                    webGL[UniformType.UNIFORM1I](uniform.sampler, this.texture.id);
                    break;
                    
                default:
                    webGL[uniformFunctionName](uniform.id, uniform.data0);
            }
        }
    }

    decRotation(axis) {
        this.rotation[axis] -= this.rotateInc;
        if (this.rotation[axis] < 0)
            this.rotation[axis] = (Math.PI * 2) + this.rotation[axis];
    }

    incRotation(axis) {
        this.rotation[axis] += this.rotateInc;
        if (this.rotation[axis] > (Math.PI * 2))
            this.rotation[axis] = 0.0;
    }

    updateModelviewMatrix(viewMatrix) {
        // NOW UPDATE ACCORDING TO THE CAMERA, i.e. THE VIEW PORTION
        wolfieMatrix4x4.model(this.modelviewMatrix, this.position, this.scale, this.rotation);
        wolfieMatrix4x4.multiply(this.modelviewMatrix, viewMatrix, this.modelviewMatrix);

    }

    setPosition(x, y, z) {
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;
    }

    setRotation(thetaX, thetaY, thetaZ) {
        this.rotation[0] = thetaX;
        this.rotation[1] = thetaY;
        this.rotation[2] = thetaZ;
    }
}