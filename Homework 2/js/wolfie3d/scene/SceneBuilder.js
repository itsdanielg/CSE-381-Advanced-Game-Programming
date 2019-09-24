'use strict'

var PrefabShader = {
    FLAT_FILLED_VERTEX:     'flat_filled_vertex',
    SIMPLE_WHITE:           'simple_white',
    SIMPLE_GRADIENT:        'simple_gradient',
    WOOD_TEXTURED:          'wood_textured'
};
var PrefabModelType = {
    VERTEX_MODEL_TYPE:      'VERTEX_MODEL_TYPE',
    LINE_MODEL_TYPE:        'LINE_MODEL_TYPE'
};

/**
 * SceneBuilder is a cheap way of making prefab models, meaning these are hard coded
 * models to use for testing our rendering system.
 */

class SceneBuilder {
    constructor() {  
    }
    
    // METHODS FOR BUILDING MODEL TYPES
    buildVertexModelType(vertexModelType) {
        // LOAD SHADER HERE        
        var webGL = window.wolfie3d.graphics.webGL;
        var FLAT_FILLED_CIRCLE_PROGRAM = "flat_filled_vertex";
        var aVertexAttribute = new ShaderAttribute(1, "aVertex", webGL.FLOAT, 3, 20, 0); 
        var aValueAttribute = new ShaderAttribute(2, "aValue", webGL.FLOAT, 2, 20, 12);
        var attributesData = new Array();
        attributesData[aVertexAttribute.name] = aVertexAttribute;
        attributesData[aValueAttribute.name] = aValueAttribute;
        this.buildShaderProgram(FLAT_FILLED_CIRCLE_PROGRAM, attributesData, function() {
            var scene = window.wolfie3d.scene;
            var program = scene.shaderPrograms[FLAT_FILLED_CIRCLE_PROGRAM];
            var verticesData = new Array(-.5,  .5,  0.0,  1.0, -1.0,
                                         -.5, -.5,  0.0,  1.0,  1.0,
                                          .5, -.5,  0.0, -1.0,  1.0,
                                          .5,  .5,  0.0, -1.0, -1.0 );        
            var indicesData = new Array(0, 1, 2, 0, 2, 3);
            vertexModelType.init(program, verticesData, 3, 4, window.wolfie3d.graphics.webGL.TRIANGLES, indicesData);        
            scene.addModelType(PrefabModelType.VERTEX_MODEL_TYPE, vertexModelType);
        });
    }

    // METHODS FOR BUILDING SHADERS
    buildShaderProgram(shaderName, attributesData, callback) {
        // FIRST CHECK TO SEE IF SUCH A NAMED SHADER PROGRAM ALREADY EXISTS
        var scene = window.wolfie3d.scene;
        if (shaderName in scene.shaderPrograms) {
            callback();
        }
        else {
            var SHADERS_DIR_PATH = "resources/shaders/";
            var VERT_EXT = ".vert";
            var FRAG_EXT = ".frag";
            var vertPath = SHADERS_DIR_PATH + shaderName + VERT_EXT;
            var fragPath = SHADERS_DIR_PATH + shaderName + FRAG_EXT;
            var shaderProgram = new Shader(shaderName, vertPath, fragPath, attributesData);
            var shaderLoader = wolfie3d.files.shaderFileLoader;
            shaderLoader.loadShaderProgram(shaderProgram, callback);
        }
    }
    
    // METHODS FOR BUILDING SCENE OBJECTS
    
    buildVertexSceneObject() {
        // BUILD THE MODEL
        var scene = window.wolfie3d.scene;
        var vertexModelType = scene.getModelType(PrefabModelType.VERTEX_MODEL_TYPE);
        var vertexModel = new Model(vertexModelType);

        // GIVE THE NEW MODEL TO THE SCENE
        var collidableObject = new CollidableObject(BoundingVolumeType.Circle);
        var sceneObject = new SceneObject(vertexModel, collidableObject);
        scene.addSceneObject(sceneObject);
        
        // RETURN THE SCENE OBJECT
        return sceneObject;
    }
    
 
    // AND NOW FOR VERY SPECIFIC TYPES OF MODELS
    buildWoodSquareModelType(modelType, callback) {
        // LOAD SHADER HERE        
        var webGL = window.wolfie3d.graphics.webGL;
        var aVertexAttribute = new ShaderAttribute(0, "aVertex", webGL.FLOAT, 3, 0, 0, BufferType.VERTEX_BUFFER); 
        var aTextureCoordinateAttribute = new ShaderAttribute(1, "aTextureCoordinate", webGL.FLOAT, 2, 0, 0, BufferType.TEXTURE_COORDINATE_BUFFER);
        var attributesData = new Array();
        attributesData[aVertexAttribute.name] = aVertexAttribute;
        attributesData[aTextureCoordinateAttribute.name] = aTextureCoordinateAttribute;
        this.buildShaderProgram(PrefabShader.WOOD_TEXTURED, attributesData, function() {
            var scene = window.wolfie3d.scene;
            var program = scene.shaderPrograms[PrefabShader.WOOD_TEXTURED];
            var verticesData = new Array(   -.5,  .5,  0.0,
                                            -.5, -.5,  0.0,
                                             .5, -.5,  0.0,
                                             .5,  .5,  0.0 );
            var indicesData = new Array(0, 1, 2, 0, 2, 3);
            var numVertices = 4;
            var textureCoordinatesData = new Array( 0.0, 1.0,
                                                    0.0, 0.0,
                                                    1.0, 0.0,
                                                    1.0, 1.0);
            modelType.init(program, numVertices, verticesData, indicesData, null, null, textureCoordinatesData);
            callback();
        });
    }

    buildWhiteSquareModelType(modelType, callback) {
        // LOAD SHADER HERE        
        var webGL = window.wolfie3d.graphics.webGL;
        var aVertexAttribute = new ShaderAttribute(0, "aVertex", webGL.FLOAT, 3, 0, 0, BufferType.VERTEX_BUFFER); 
        var attributesData = new Array();
        attributesData[aVertexAttribute.name] = aVertexAttribute;
        this.buildShaderProgram(PrefabShader.SIMPLE_WHITE, attributesData, function() {
            var scene = window.wolfie3d.scene;
            var program = scene.shaderPrograms[PrefabShader.SIMPLE_WHITE];
            var verticesData = new Array(-.5,  .5,  0.0,
                                         -.5, -.5,  0.0,
                                          .5, -.5,  0.0,
                                          .5,  .5,  0.0 );        
            var indicesData = new Array(0, 1, 2, 0, 2, 3);
            var numVertices = 4;
            modelType.init(program, numVertices, verticesData, indicesData, null, null, null);
            callback();
        });
    }
    
    buildGradientSquareModelType(modelType, callback) {
        // LOAD SHADER HERE        
        var webGL = window.wolfie3d.graphics.webGL;
        var aVertexAttribute = new ShaderAttribute(0, "aVertex", webGL.FLOAT, 3, 0, 0, BufferType.VERTEX_BUFFER); 
        var aColorAttribute = new ShaderAttribute(1, "aColor", webGL.FLOAT, 4, 0, 0, BufferType.COLOR_BUFFER);
        var attributesData = new Array();
        attributesData[aVertexAttribute.name] = aVertexAttribute;
        attributesData[aColorAttribute.name] = aColorAttribute;
        this.buildShaderProgram(PrefabShader.SIMPLE_GRADIENT, attributesData, function() {
            var scene = window.wolfie3d.scene;
            var program = scene.shaderPrograms[PrefabShader.SIMPLE_GRADIENT];
            var verticesData = new Array(-.5,  .5,  0.0,
                                         -.5, -.5,  0.0,
                                          .5, -.5,  0.0,
                                          .5,  .5,  0.0 );
            var indicesData = new Array(0, 1, 2, 0, 2, 3);
            var colorData = new Array(  1.0, 0.0, 0.0, 1.0,
                                        0.0, 1.0, 0.0, 1.0,
                                        0.0, 0.0, 1.0, 1.0,
                                        1.0, 1.0, 0.0, 1.0);
            var numVertices = 4;
            modelType.init(program, numVertices, verticesData, indicesData, colorData, null, null);
            callback();
        });
    }

    // USED FOR DISPLAYING TEXT    
    addCameraPositionText() {
        var text = window.wolfie3d.graphics.text;
        var newText = new TextToRender("Camera Position", "", 20, 20, function() {
            var camera = window.wolfie3d.graphics.camera;
            newText.text = "Camera Position: " 
                    + camera.position[0] + ", "
                    + camera.position[1] + ", "
                    + camera.position[2];
        });
        text.addTextToRender(newText);
    }
    addCameraLookAtText() {
        var text = window.wolfie3d.graphics.text;
        var newText = new TextToRender("Camera Look At", "", 20, 40, function() {
            var camera = window.wolfie3d.graphics.camera;
            newText.text = "Camera Look At: " 
                    + camera.lookAt[0] + ", "
                    + camera.lookAt[1] + ", "
                    + camera.lookAt[2];
        });
        text.addTextToRender(newText);
    }
    addCameraUpText() {
        var text = window.wolfie3d.graphics.text;
        var newText = new TextToRender("Camera Up", "", 20, 60, function() {
            var camera = window.wolfie3d.graphics.camera;
            newText.text = "Camera Up: " 
                    + camera.up[0] + ", "
                    + camera.up[1] + ", "
                    + camera.up[2];
        });
        text.addTextToRender(newText);
    }
    addCameraRightText() {
        var text = window.wolfie3d.graphics.text;
        var newText = new TextToRender("Camera Right", "", 20, 80, function() {
            var camera = window.wolfie3d.graphics.camera;
            newText.text = "Camera Right: " 
                    + camera.right[0] + ", "
                    + camera.right[1] + ", "
                    + camera.right[2];
        });
        text.addTextToRender(newText);
    }
}