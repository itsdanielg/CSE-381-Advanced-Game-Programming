precision highp float;

varying vec2 val;

void main() {
    float R = 1.0;
    float R2 = 0.5;
    float dist = sqrt(dot(val,val));
    float alpha = 1.0;

    //    if (dist >= R) || dist <= R2) {
    if (dist > R) {
    discard;
    //alpha = 0.0;
    //        discard;
        }

    //float sm = smoothstep(R,R-0.01,dist);
    //float sm2 = smoothstep(R2,R2+0.01,dist);
    //alpha = sm*sm2;

    gl_FragColor = vec4(0.0, 0.0, 1.0, alpha);
}