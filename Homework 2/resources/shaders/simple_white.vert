precision mediump float;

attribute vec3 aVertex;

uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

void main() {
    gl_Position = projectionMatrix * modelviewMatrix * vec4(aVertex, 1.0);
}