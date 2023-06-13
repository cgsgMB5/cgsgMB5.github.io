#version 300 es
precision highp float;

out vec4 o_color;
//out vec3 o_norm;
//in highp vec4 color;
in vec3 draw_pos;
in vec3 draw_norm;

uniform float Time;
uniform float ColorCoefR, ColorCoefG, ColorCoefB;

void main() {
    //o_color = color;
    o_color = vec4(mix(vec3(ColorCoefR, ColorCoefG, ColorCoefB),
        (draw_norm.xxx + draw_norm.yyy + draw_norm.zzz) / 1.5, 0.5), 1.0);
    //o_color = vec4(draw_pos, 1.0);//pos + vec3(1.0, 1.0, 1.0), 1.0);
    if (draw_pos.x == 0.0)
        o_color = vec4(1.0, 1.0, 1.0, 1.0);
    //o_color = vec4(0.5, 0.0, 0.7, 1.0);

}