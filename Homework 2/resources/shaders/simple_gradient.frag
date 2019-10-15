precision mediump float;

varying vec4 color;
uniform vec3 ambientLight;

void main(void) {
    gl_FragColor = vec4(ambientLight, 1.0) * color;	
}
