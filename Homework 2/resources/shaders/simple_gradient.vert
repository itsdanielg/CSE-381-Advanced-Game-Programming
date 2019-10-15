precision mediump float;

attribute vec3 aVertex;
attribute vec4 aColor;

uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

varying vec4 color;
uniform vec3 ambientLight;

void main() {
    gl_Position = projectionMatrix * modelviewMatrix * vec4(aVertex, 1.0);
    color = aColor;
}