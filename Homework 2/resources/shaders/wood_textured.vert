precision mediump float;

attribute vec4 aVertex;
attribute vec2 aTextureCoordinate;

uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

varying highp vec2 vTextureCoordinate;

uniform vec3 ambientLight;

uniform vec3 diffuseLightPos;
attribute vec3 aVertexNormal;
varying vec3 vertex;
varying vec3 normal;

uniform vec3 specularLightColor;
uniform float shininess;

void main(void) {
    vertex = vec3(modelviewMatrix * aVertex);
    normal = vec3(modelviewMatrix * aVertex);
    gl_Position = projectionMatrix * modelviewMatrix * aVertex;
    vTextureCoordinate = aTextureCoordinate;
}