#version 300 es
precision highp float;
in highp vec4 in_pos;

//out highp vec4 color;
out highp vec4 draw_pos;

uniform float Zoom, dY, dX;

void main() {
    gl_Position = in_pos;
    if (dX == 0.0 || dY == 0.0)
        draw_pos = vec4(0.0, 0.0, 0.0, 0.0);
    draw_pos = (in_pos - vec4(dX, dY, 0, 0)) * Zoom;

}