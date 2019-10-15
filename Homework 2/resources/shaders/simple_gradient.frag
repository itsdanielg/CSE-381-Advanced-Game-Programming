precision mediump float;

varying vec4 color;

uniform vec3 ambientLight;

uniform vec3 diffuseLightPos;
varying vec3 vertex;
varying vec3 normal;

uniform vec3 specularLightColor;
uniform float shininess;

void main(void) {
    vec4 ambientColor;
    vec4 diffuseColor;
    vec4 specularColor;
    vec4 finalColor;

    ambientColor = vec4(ambientLight, 1.0) * color;

    vec3 toLight = diffuseLightPos - vertex;
    toLight = normalize(toLight);
    vec3 vertexNormal = normalize(normal);
    float cosTheta = dot(vertexNormal, toLight);
    cosTheta = clamp(cosTheta, 0.0, 1.0);
    diffuseColor = vec4(color * cosTheta);

    vec3 reflection = 2.0 * dot(vertexNormal, toLight) * vertexNormal - toLight;
    vec3 toCamera = -1.0 * vertex;
    reflection = normalize(reflection);
    toCamera = normalize(toCamera);
    cosTheta = dot(reflection, toCamera);
    cosTheta = clamp(cosTheta, 0.0, 1.0);
    cosTheta = pow(cosTheta, shininess);

    if (cosTheta > 0.0) {
        specularColor = vec4(specularLightColor * cosTheta, 1.0);
        diffuseColor = diffuseColor * (1.0 - cosTheta);
    }
    else {
        specularColor = vec4(0.0, 0.0, 0.0, 0.0);
    }

    finalColor = ambientColor + diffuseColor + specularColor;

    gl_FragColor = finalColor;	
}
