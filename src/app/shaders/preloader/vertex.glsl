attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uTransition;

varying vec2 vUv;
varying vec3 vNormal;

#define M_PI 3.1415926535897932384626433832

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  vec3 newPosition = position;
  newPosition.y += sin(uv.x * M_PI) * (sin(uTransition * M_PI) * 0.2);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
