precision mediump float;

attribute vec3 aVertex;
attribute vec3 aNormal;
attribute vec4 aColor;

uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

varying vec4 color;

uniform vec3 ambientLight;

uniform vec3 diffuseLightPos;
attribute vec3 aVertexNormal;
varying vec3 vertex;
varying vec3 normal;

uniform vec3 specularLightColor;
uniform float shininess;

void main() {
    vertex = vec3(modelviewMatrix * vec4(aVertex, 1.0));
    normal = vec3(modelviewMatrix * vec4(aNormal, 0.0));
    gl_Position = projectionMatrix * modelviewMatrix * vec4(aVertex, 1.0);
    color = aColor;
}