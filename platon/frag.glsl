#version 300 es
precision highp float;

out vec4 o_color;
//out vec3 o_norm;
//in highp vec4 color;
in vec3 draw_pos;
in vec3 draw_norm;

uniform float Time;
uniform float ColorCoefR, ColorCoefG, ColorCoefB;

float maximum( float a, float b ) {
  if (a > b) return a; 
  else return b;
}

vec3 Shade( vec3 P, vec3 N ) {
  vec3 L = normalize(vec3(1.0, 2.0, 3.0));
  vec3 LC = vec3(1.0, 1.0, 1.0);
  vec3 color = vec3(0.0);
  vec3 V = normalize(P - vec3(1.0, 1.0, 1.0));
  vec3 a = vec3(0.5, 0.5, 0.5);

  // Ambient
  color = vec3(0.25, 0.20725, 0.20725);

  N = faceforward(-N, V, N);

  float dotNL = dot(N, L);
  if (dotNL < 0.0)
    dotNL = 0.0;
  // Diffuse
  color += dotNL * vec3(1.0, 0.829, 0.829) * a * LC;

  // Specular
  vec3 R = reflect(V, N);

  float dotRL = dot(R, L);
  if (dotRL < 0.0)
    dotRL = 0.0;
  color += pow(dotRL, 11.264) * vec3(0.296648, 0.296648, 0.296648) * LC;

  return color;
}


void main() {
    //o_color = color;
    o_color = vec4(mix(vec3(ColorCoefR, ColorCoefG, ColorCoefB),
        draw_norm.yyy, 0.5), 1.0);
    //o_color = vec4(draw_pos, 1.0);//pos + vec3(1.0, 1.0, 1.0), 1.0);
    if (draw_pos.x == 0.0)
        o_color = vec4(1.0, 1.0, 1.0, 1.0);
    //o_color = vec4(0.5, 0.0, 0.7, 1.0);
    o_color.x = pow(o_color.x, 2.2);
    o_color.y = pow(o_color.y, 2.2);
    o_color.z = pow(o_color.z, 2.2);
}