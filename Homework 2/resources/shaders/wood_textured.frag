precision mediump float;

varying highp vec2 vTextureCoordinate;

uniform sampler2D uSampler;
uniform vec3 ambientLight;

void main(void) {
    gl_FragColor = vec4(ambientLight, 1.0) * texture2D(uSampler, vTextureCoordinate);
}