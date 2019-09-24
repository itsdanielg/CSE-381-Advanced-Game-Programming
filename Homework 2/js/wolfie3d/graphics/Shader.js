'use strict'

class ShaderUniform {
    constructor(type, name, transpose, data0, data1, data2, data3) {
        this.id   = -1;
        this.type = type;
        this.name = name;
        this.transpose = transpose;
        this.data0 = data0;
        this.data1 = data1;
        this.data2 = data2;
        this.data3 = data3;
    }
}

class ShaderAttribute {
    constructor(id, name, type, size, stride, offset, vboBuffer) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.stride = stride;
        this.offset = offset;
        this.vboBuffer = vboBuffer;
    }
}

class Shader {
    constructor(name, vertexShaderPath, fragmentShaderPath, attributesData) {
        this.name = name;
        this.vertexShaderPath = vertexShaderPath;
        this.fragmentShaderPath = fragmentShaderPath;
        this.status = Wolfie3dStatus.CONSTRUCTED;
        this.attributesData = attributesData;
        this.attributeNames = new Array();
        this.attributes = new Array();
    }
    
    init() {
        var webGL = window.wolfie3d.graphics.webGL;
        this.vertexShader = this.createShader(webGL.VERTEX_SHADER, this.vertexShaderSource);
        this.fragmentShader = this.createShader(webGL.FRAGMENT_SHADER, this.fragmentShaderSource);
        this.createShaderProgram();
    }

    createShader(type, source) {
        // MAKE A NEW SHADER OBJECT, LOAD IT'S SOURCE, AND COMPILE IT
        var webGL = window.wolfie3d.graphics.webGL;
        var shader = webGL.createShader(type);
        webGL.shaderSource(shader, source);
        webGL.compileShader(shader);

        // DID IT COMPILE?
        var success = webGL.getShaderParameter(shader, webGL.COMPILE_STATUS);
        if (success) {
            // SHADER COMPILED SUCCESSFULLY
            this.status = Wolfie3dStatus.LOADED;

            return shader;
        }

        // DISASTER
        console.log(webGL.getShaderInfoLog(shader));
        webGL.deleteShader(shader);
        this.status = Wolfie3dStatus.ERROR;
        return null;
    }
    
    getAttribute(name) {
        return this.attributes[name];
    }

    loadAttributes() {
        // GET ALL THE ATTRIBUTES USED BY THE SHADER        
        var webGL = window.wolfie3d.graphics.webGL;
        webGL.useProgram(this.program);
        var count = webGL.getProgramParameter(this.program, webGL.ACTIVE_ATTRIBUTES);
        for (var i = 0; i < count; ++i) {
            var info = webGL.getActiveAttrib(this.program, i);
            
            // ENABLE THE RENDERING BUFFERS WE'VE BOUND TO
            var attribute = webGL.getAttribLocation(this.program, info.name);
            webGL.enableVertexAttribArray(attribute);

            var attData = this.attributesData[info.name];
            this.attributeNames.push(info.name);
            this.attributes[info.name] = new ShaderAttribute(i, info.name, attData.type, attData.size, attData.stride, attData.offset, attData.vboBuffer);
        }
        this.attributesData = null;
    }
    
    createShaderProgram() {
        // MAKE THE GLSL SHADER PROGRAM
        var webGL = window.wolfie3d.graphics.webGL;
        this.program = webGL.createProgram();
 
        // LINK THE VERT AND FRAG
        webGL.attachShader(this.program, this.vertexShader);
        webGL.attachShader(this.program, this.fragmentShader);

        // NOW WE CAN LINK THE SHADER PROGRAM
        webGL.linkProgram(this.program);
        var linked = webGL.getProgramParameter(this.program, webGL.LINK_STATUS);

        // IS IT LINKED?
        if (!linked) {
            // DISASTER
            var errorFeedback = webGL.getProgramInfoLog(this.program);
            console.log(errorFeedback);

            // DISASTER
            console.log(webGL.getProgramInfoLog(this.program));
            webGL.deleteProgram(this.program);
        }        
        
        // GET THE ATTRIBUTE BINDINGS
        this.loadAttributes();
    }
}