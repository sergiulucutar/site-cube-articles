precision highp float;

uniform vec3 uColor;
uniform vec3 uTransition;

varying vec2 vUv;
varying vec3 vNormal;

 void main() {
  vec3 normal = normalize(vNormal);
  float lighting = dot(normal, normalize(vec3(-0.8, 0.0, 0.0)));
  vec3 color = uColor + lighting * 0.1;
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}
