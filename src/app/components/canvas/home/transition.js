import gsap from 'gsap'
import { Mesh, Plane, Program, Transform, Texture } from 'ogl'

import vertexShader from '@app/shaders/media/vertex.glsl'
import fragmentShader from '@app/shaders/media/fragment.glsl'
import fragmentColorOnlyShader from '@app/shaders/media/fragment-color-only.glsl'

export default class {
  constructor ({
    gl,
    parent,
    viewport
  }) {
    this.gl = gl
    this.parent = parent
    this.viewport = viewport

    this.geometry = new Plane(this.gl)

    this.createProgram()
    this.createMesh()
  }

  createProgram () {
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      depthWrite: false,
      depthTest: false,
      transparent: true,
      uniforms: {
        uColor: {
          value: [0, 0, 0]
        },
        uTexture: {
          value: new Texture(this.gl, {
            generateMipmaps: false,
            image: new window.Image()
          })
        },
        uTextureScale: {
          value: [0, 0]
        },
        uTransition: {
          value: 0
        },
        uTransitionCurveOffset: {
          value: 0
        }
      }
    })

    this.colorOnlyProgram = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentColorOnlyShader,
      depthWrite: false,
      depthTest: false,
      transparent: true,
      uniforms: {
        uColor: {
          value: [0, 0, 0]
        }
      }
    })
  }

  createMesh () {
    this.mesh = new Transform()

    const frontPlane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
    frontPlane.setParent(this.mesh)
    frontPlane.renderOrder = 1

    const sidePlane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.colorOnlyProgram
    })
    sidePlane.position.x = 0.5
    sidePlane.position.z = -0.5
    sidePlane.rotation.y = Math.PI / 2
    sidePlane.setParent(this.mesh)
    sidePlane.renderOrder = 1

    const backPlane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.colorOnlyProgram
    })
    backPlane.position.z -= 1
    backPlane.rotation.y = Math.PI
    backPlane.setParent(this.mesh)
    backPlane.renderOrder = 1

    this.mesh.position.x = this.index * this.mesh.scale.x
    this.mesh.setParent(this.parent)

    this.mesh.renderOrder = 1
  }

  toggleDepthVisibility (isVisible) {
    this.mesh.children[1].visible = isVisible
    this.mesh.children[2].visible = isVisible
  }

  setImage (mimicImage) {
    this.program.uniforms.uTexture.value = mimicImage.texture
    this.program.uniforms.uTextureScale.value = [
      mimicImage.imageBounds.width,
      mimicImage.imageBounds.height
    ]
  }

  reset (mimic) {
    this.mesh.position.x = mimic.mesh.position.x
    this.mesh.position.y = mimic.mesh.position.y
    this.mesh.position.z = mimic.mesh.position.z

    this.mesh.scale.x = mimic.mesh.scale.x
    this.mesh.scale.y = mimic.mesh.scale.y
    this.mesh.scale.z = mimic.mesh.scale.x * 0.6

    this.program.uniforms.uColor.value = mimic.program.uniforms.uColor.value
    this.colorOnlyProgram.uniforms.uColor.value = mimic.program.uniforms.uColor.value
  }

  in (mimic, distance) {
    if (!mimic) {
      return
    }

    this.reset(mimic)
    this.setImage(mimic)

    this.mesh.visible = true
    mimic.mesh.visible = false

    this.mesh.position.x = distance

    this.toggleDepthVisibility(true)
    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.mesh.visible = false
          mimic.mesh.visible = true
          resolve()
        }
      })

      timeline
        .from(this.mesh.position, {
          x: 0,
          y: 0,
          z: -this.mesh.scale.x * 0.6,
          duration: 1.6,
          ease: 'expo.inOut'
        })
        .from(this.mesh.rotation, {
          y: -Math.PI,
          duration: 1.6,
          ease: 'expo.inOut'
        }, 0)
        .from(this.mesh.scale, {
          x: this.viewport.width,
          y: this.viewport.height,
          duration: 1.6,
          ease: 'expo.inOut'
        }, 0)
        .call(this.toggleDepthVisibility.bind(this), [false], 1.3)
        .from(this.program.uniforms.uTransition, {
          value: 1,
          duration: 1,
          delay: 0.6,
          ease: 'expo.inOut'
        }, 0)
        .from(this.program.uniforms.uTransitionCurveOffset, {
          value: -1,
          duration: 1,
          delay: 0.6,
          ease: 'expo.inOut'
        }, 0)
    })
  }

  out (mimic) {
    if (!mimic) {
      return
    }
    this.reset(mimic)
    this.setImage(mimic)

    this.mesh.visible = true
    mimic.mesh.visible = false

    this.toggleDepthVisibility(false)

    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: resolve
      })

      timeline
        .to(this.mesh.position, {
          x: 0,
          y: 0,
          z: -this.mesh.scale.x * 0.6,
          duration: 1.6,
          ease: 'expo.inOut'
        })
        .to(this.mesh.rotation, {
          y: -Math.PI,
          duration: 1.6,
          ease: 'expo.inOut'
        }, 0)
        .to(this.mesh.scale, {
          x: this.viewport.width,
          y: this.viewport.height,
          duration: 1.6,
          ease: 'expo.inOut'
        }, 0)
        .call(this.toggleDepthVisibility.bind(this), [true], 0.3)
        .to(this.program.uniforms.uTransition, {
          value: 1,
          duration: 1,
          ease: 'expo.inOut'
        }, 0)
        .to(this.program.uniforms.uTransitionCurveOffset, {
          value: 1,
          duration: 1,
          ease: 'expo.inOut'
        }, 0)
    })
  }
}
