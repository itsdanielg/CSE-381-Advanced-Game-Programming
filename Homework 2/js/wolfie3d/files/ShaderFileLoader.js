'use strict'
/*
 * ShaderFileLoader.js
 * 
 * This object is used for loading GLSL shader programs.
 */
class ShaderFileLoader {
    constructor() {
        
    }    
    
    loadShaderProgram(shaderProgram, callback) {
        var webGL = window.wolfie3d.graphics.webGL;
        var shaderProgramLoader = this;
        shaderProgramLoader.loadShaderSource(shaderProgram, shaderProgram.vertexShaderPath, webGL.VERTEX_SHADER, function() {
            // VERTEX SHADER SOURCE HAS LOADED
            shaderProgramLoader.loadShaderSource(shaderProgram, shaderProgram.fragmentShaderPath, webGL.FRAGMENT_SHADER, function() {
                // FRAGMENT SHADER SOURCE HAS LOADED
                
                // LOAD THE SHADER PROGRAM
                shaderProgram.init();
                
            
            // GET RID OF THE SOURCE
            shaderProgram.vertexShaderSource = null;
            shaderProgram.fragmentShaderSource = null;
                
            // NOTE THAT IT IS LOADED
            shaderProgram.status = Wolfie3dStatus.LOADED;
                
                // NOW GIVE IT TO THE SCENE
                var scene = window.wolfie3d.scene;
                scene.addShaderProgram(shaderProgram.name, shaderProgram);
                
                // WE'RE DONE, CALL THE CALLBACK FUNCTION
                callback();
            });
        });
    }
    
    loadShaderSource(program, filePath, shaderType, callback) {
        jQuery.get(filePath, function(source){
            // SET ASIDE THE SOURCE FOR LATER
            var webGL = window.wolfie3d.graphics.webGL;
            if (shaderType == webGL.VERTEX_SHADER)
                program.vertexShaderSource = source;
            else
                program.fragmentShaderSource = source;
        
            // CALL THE CALLBACK
            callback();
        });
    }

    
}