#version 300 es
precision highp float;
in vec3 in_pos;
in vec3 in_norm;

uniform mat4 MatrWVP;
uniform float Time;

//out highp vec4 color;
out vec3 draw_pos;
out vec3 draw_norm;

void main() {
    float a = Time;
    gl_Position = MatrWVP * vec4(in_pos, 1.0);
    //gl_Position = MatrWVP * vec4(in_pos, 1.0);
    draw_norm = (in_norm + vec3(1.0, 1.0, 1.0)) / 2.0;
/*    if (draw_norm.x > 0.5)
      draw_norm.x *= 2.0;
    else if (draw_norm.x < 0.5)
      draw_norm.x /= 2.0;
    if (draw_norm.y > 0.5)
      draw_norm.y *= 2.0;
    else if (draw_norm.y < 0.5)
      draw_norm.y /= 2.0;
    if (draw_norm.z > 0.5)
      draw_norm.z *= 2.0;
    else if (draw_norm.z < 0.5)
      draw_norm.z /= 2.0;
      */
    draw_pos = (MatrWVP * vec4(in_pos, 1.0)).xyz;
}