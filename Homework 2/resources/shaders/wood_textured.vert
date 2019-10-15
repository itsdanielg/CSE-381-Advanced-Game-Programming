precision mediump float;

attribute vec4 aVertex;
attribute vec2 aTextureCoordinate;

uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

varying highp vec2 vTextureCoordinate;
uniform vec3 ambientLight;

void main(void) {
    gl_Position = projectionMatrix * modelviewMatrix * aVertex;
    vTextureCoordinate = aTextureCoordinate;
}