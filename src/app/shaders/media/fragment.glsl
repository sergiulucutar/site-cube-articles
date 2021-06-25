precision highp float;

#define M_PI 3.1415926535897932384626433832795

uniform vec3 uColor;

uniform sampler2D uTexture;
uniform vec2 uTextureScale;
uniform float uTransition;
uniform float uTransitionCurveOffset;

varying vec2 vUv;
varying vec3 vNormal;
varying float vDeformation;

 void main() {
  vec2 newUv = vUv;
  newUv.x = fract(newUv.x * 2.0);
  newUv = (newUv - 0.5) / uTextureScale + 0.5;

  vec3 texture = texture2D(uTexture,newUv).rgb;

  vec3 normal = normalize(vNormal);
  float lighting = dot(normal, normalize(vec3(-0.8, 0.0, 0.0)));
  vec3 color = uColor + lighting * 0.1;

  float curvedTransitionMask = uTransition + sin(fract(vUv.x * 2.0) * M_PI) * (0.2 * sin(uTransitionCurveOffset * M_PI));

  vec3 textureMix = mix(color, texture, step(curvedTransitionMask, vUv.y));
  vec3 finalMix = mix(color, textureMix, step(0.5, vUv.x));

  gl_FragColor.rgb = finalMix;
  gl_FragColor.a = 1.0;
}
