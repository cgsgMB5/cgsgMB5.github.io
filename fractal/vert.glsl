#version 300 es
precision highp float;
in highp vec4 in_pos;

//out highp vec4 color;
out highp vec4 draw_pos;

void main() {
    gl_Position = in_pos;
    draw_pos = in_pos;

}