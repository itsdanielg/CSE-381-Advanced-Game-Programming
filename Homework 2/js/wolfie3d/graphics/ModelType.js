'use strict'

var BufferType = {
    VERTEX_BUFFER:  'VERTEX_BUFFER',
    INDEX_BUFFER:   'INDEX_BUFFER',
    COLOR_BUFFER:   'COLOR_BUFFER',
    NORMAL_BUFFER:  'NORMAL_BUFFER',
    TEXTURE_COORDINATE_BUFFER: 'TEXTURE_COORDINATE_BUFFER'
};

class ModelType {
    constructor() {
        // THESE WILL BE LOADED VIA init METHODS
        this.vbos = new Array();
        this.shaderProgram = null;
    }
    
    init(shaderProgram, numVertices, verticesData, indicesData, colorsData, normalsData, textureCoordinatesData) {
        // THIS IS THE SHADER PROGRAM WE'LL USE
        this.shaderProgram = shaderProgram;
        var program = this.shaderProgram.program;
        
        // WE'RE GOING TO NEED THE SHADER PROGRAM
        var webGL = window.wolfie3d.graphics.webGL;
        webGL.useProgram(program);

        // INIT THE BUFFERS
        if (verticesData != null)
            this.initFloatBuffer(BufferType.VERTEX_BUFFER, verticesData);
        if (indicesData != null)
            this.initIntBuffer(BufferType.INDEX_BUFFER, indicesData);
        if (colorsData != null)
            this.initFloatBuffer(BufferType.COLOR_BUFFER, colorsData);
        if (normalsData != null)
            this.initFloatBuffer(BufferType.NORMAL_BUFFER, normalsData);
        if (textureCoordinatesData != null)
            this.initFloatBuffer(BufferType.TEXTURE_COORDINATE_BUFFER, textureCoordinatesData);
    }
    
    initFloatBuffer(bufferType, floatData) {
        var webGL = window.wolfie3d.graphics.webGL;
        
        // SETUP THE VERTEXL Buffer
        this.vbos[bufferType] = webGL.createBuffer();
        webGL.bindBuffer(webGL.ARRAY_BUFFER, this.vbos[bufferType]);
        webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(floatData), webGL.STATIC_DRAW);
    }
    
    initIntBuffer(bufferType, intData) {
        var webGL = window.wolfie3d.graphics.webGL;
        
        // MAKE A WebGL BUFFER
        this.vbos[bufferType] = webGL.createBuffer();

        // REMEMBER HOW MANY INDICES THERE ARE
        this.numIndices = intData.length;

        // CHOOSE THE GLSL ELEMENT BUFFER TO FILL
        webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER, this.vbos[bufferType]);

        // AND NOW SEND THE INDEX DATA
        webGL.bufferData(webGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(intData), webGL.STATIC_DRAW);        
    }
    
    getVertexBuffer() {
        return vbos[BufferType.VERTEX_BUFFER];
    }
    
    getIndexBuffer() {
        return vbos[BufferType.INDEX_BUFFER];
    }
    
    getColorBuffer() {
        return vbos[BufferType.COLOR_BUFFER];
    }
    
    getNormalBuffer() {
        return vbos[BufferType.NORMAL_BUFFER];
    }
    
    getTextureCoordinateBuffer() {
        return vbos[BufferType.TEXTURE_COORDINATE_BUFFER];
    }
}