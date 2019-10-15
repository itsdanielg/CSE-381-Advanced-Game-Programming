precision mediump float;

varying highp vec2 vTextureCoordinate;

uniform sampler2D uSampler;

uniform vec3 ambientLight;

uniform vec3 diffuseLightPos;
varying vec3 vertex;
varying vec3 normal;

void main(void) {
    vec4 ambientColor;
    vec4 diffuseColor;
    vec4 finalColor;

    ambientColor = vec4(ambientLight, 1.0) * texture2D(uSampler, vTextureCoordinate);

    vec3 toLight = diffuseLightPos - vertex;
    toLight = normalize(toLight);
    vec3 vertexNormal = normalize(normal);
    float cosTheta = dot(vertexNormal, toLight);
    cosTheta = clamp(cosTheta, 0.0, 1.0);
    diffuseColor = vec4(texture2D(uSampler, vTextureCoordinate) * cosTheta);

    finalColor = ambientColor + diffuseColor;

    gl_FragColor = finalColor;
}