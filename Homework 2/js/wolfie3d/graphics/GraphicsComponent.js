'use strict'

class GraphicsComponent { 
    constructor() {}
    
    init(renderingCanvasId) {
        // FIRST INITIALIZE webGL
        this.initWebGL(renderingCanvasId);
        
        // MAKE A CAMERA POSITIONED AT THE ORIGIN
        this.camera = new Camera();

        // AND SETUP THE DEFAULT FRUSTUM, WHICH INCLUDES MANAGING THE PROJECT MATRIX
        this.frustum = new Frustum(this.canvasWidth, this.canvasHeight);
        
        // WE'LL FILL THESE DURING RENDERING
        this.potentiallyVisibleSet = new Array();
        this.visibleSet = new Array();
        
        // THIS WILL STORE OUR TEXT
        this.text = new TextRenderer("text_canvas", "serif", "14", "#FFFF00");
    }
    
    logGLCall(functionName, args) {
        console.log("webGL." + functionName + "(" + 
                WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");
    }

    initWebGL(renderingCanvasId) {
        // GET THE WebGL OBJECT
        this.renderingCanvas = document.getElementById(renderingCanvasId);
        var workspace = document.getElementById("workspace");
        var workspaceWidth = workspace.getBoundingClientRect().width;
        var workspaceHeight = workspace.getBoundingClientRect().height;
        this.renderingCanvas.setAttribute('width', workspaceWidth);
        this.renderingCanvas.setAttribute('height', workspaceHeight*.8);
        this.canvasWidth = this.renderingCanvas.width;
        this.canvasHeight = this.renderingCanvas.height;
        this.webGL = this.renderingCanvas.getContext("webgl");
        this.webGL = WebGLDebugUtils.makeDebugContext(this.webGL, undefined, this.logGLCall);
        console.log(this.webGL.getParameter(this.webGL.VERSION));
        console.log(this.webGL.getParameter(this.webGL.SHADING_LANGUAGE_VERSION));
        console.log(this.webGL.getParameter(this.webGL.VENDOR));

        // IF THE USER'S MACHINE/BROWSER DOESN'T SUPPORT
        // WebGL THEN THERE'S NO POINT OF GOING ON
        if (!this.webGL) {
            // PROVIDE SOME FEEDBACK THAT WebGL WON'T WORK BECAUSE
            // THE USER'S' GRAPHICS CARD IS FOR THE BIRDS
            console.error("WebGL is not supported by this device");

            // AND END INITIALIZATION
            return;
        }        
        
        // WebGL IS SUPPORTED, SO INIT EVERYTHING THAT USES IT

        // VERTEX DATA WILL USE FLOATS
        this.vertexDataType = this.webGL.FLOAT;

        // MAKE THE CLEAR COLOR BLACK
        this.webGL.clearColor(0.0, 0.0, 0.0, 1.0);

        // ENABLE DEPTH TESTING
        this.webGL.enable(this.webGL.DEPTH_TEST);

        // TURN ON BACKFACE CULLING
        //this.webGL.enable(this.webGL.CULL_FACE);

        // THIS SPECIFIES THAT WE'RE USING THE ENTIRE CANVAS
        this.webGL.viewport(0, 0, this.canvasWidth, this.canvasHeight);
    }
    
    renderScene(sceneToRender) {

        // CLEAR THE CANVAS
        this.webGL.clear(this.webGL.COLOR_BUFFER_BIT | this.webGL.DEPTH_BUFFER_BIT);

        // FIRST HAVE THE SCENE GRAPH SCOPE THE SCENE, WHICH MEANS BUILD A LIST OF ALL THE MODELS IN THE SCENE THAT ARE // POSSIBLY IN THE FRUSTUM, i.e. THEY ARE NEAR THE CAMERA
        this.potentiallyVisibleSet.length = 0;
        sceneToRender.scope(this.potentiallyVisibleSet);

        // PERFORM FRUSTUM CULLING
        this.visibleSet.length = 0;
        this.frustum.scope(this.potentiallyVisibleSet, this.visibleSet);

        // UPDATE THE VIEW MATRIX
        this.camera.updateViewMatrix();

        // AND NOW RENDER ONLY THE MODELS THAT WERE IN THE FRUSTUM
        this.numModelsInFrustum = 0;
        for (var i = 0; i < this.visibleSet.length; i++) {
            // NOTE THAT IT MIGHT BE A GOOD IDEA TO SORT THESE BACK TO FRONT,
            // BUT WE'LL JUST DEPTH BUFFER TEST THEM AND HOPE FOR THE BEST
            var model = this.visibleSet[i];
            this.renderModel(model);
            this.numModelsInFrustum++;
        }
        
        // NOW RENDER THE TEXT ON TOP
        this.text.render();
    }

    renderModel(modelToRender) {

        // GET THE MODEL TYPE, SCENE, AND SHADER TO SHORTEN SOME CALLS
        var modelType = modelToRender.modelType;
        var shader = modelToRender.modelType.shaderProgram;
        var shaderProgram = shader.program;

        // UPDATE THE MODELVIEW MATRIX
        modelToRender.updateModelviewMatrix(this.camera.viewMatrix);

        // CHOOSE THE SHADER PROGRAM`
        this.webGL.useProgram(shaderProgram);

        // USE THE ATTRIBUTES
        for (var i = 0; i < shader.attributeNames.length; i++) {
            var attName = shader.attributeNames[i];
            var att = shader.attributes[attName];
            var bufferToBind = modelType.vbos[att.vboBuffer];
            this.webGL.bindBuffer(this.webGL.ARRAY_BUFFER, bufferToBind);
            this.webGL.vertexAttribPointer(att.id, att.size, att.type, false, att.stride, att.offset);
        }
        
        // USE THE UNIFORMS
        modelToRender.sendUniforms(shaderProgram);

        // DRAW THE TRIANGLES
        this.webGL.drawElements(this.webGL.TRIANGLES, modelType.numIndices, this.webGL.UNSIGNED_SHORT, 0);
    }
}