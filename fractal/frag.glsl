#version 300 es

precision highp float;

out highp vec4 o_color;
//in highp vec4 color;
in highp vec4 draw_pos;

uniform float Time;
uniform float ColorCoefR, ColorCoefG, ColorCoefB;
uniform float Zoom;

//SetCmpl(0.35 + 0.08 * sin(SyncTime + 3), 0.39 + 0.08 * sin(1.1 * SyncTime));

void main() {
    //o_color = color;
    vec2 c = vec2(0.35 + 0.08 * sin(Time / 16.0 + 3.0), 0.39 + 0.08 * sin(1.1 * Time / 16.0));
    vec2 z = draw_pos.xy;
    float n = 0.0;

    while (z.x * z.x + z.y * z.y < 4.0 && n < 255.0)
    {
        z = vec2(z.x * z.x - z.y * z.y, z.x * z.y + z.y * z.x) + c;
        n++;
    }
    n /= 255.0;
    o_color = vec4(ColorCoefR * n, ColorCoefG * n, ColorCoefB * n, 1.0);
}