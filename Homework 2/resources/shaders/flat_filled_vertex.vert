precision highp float;

attribute vec4 aVertex;
attribute vec2 aValue;
varying vec2 val;
uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

void main() {
    val = aValue;
    gl_Position = projectionMatrix * modelviewMatrix * aVertex;
}