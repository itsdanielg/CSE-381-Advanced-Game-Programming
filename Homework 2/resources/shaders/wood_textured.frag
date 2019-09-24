precision mediump float;

varying highp vec2 vTextureCoordinate;

uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoordinate);
}