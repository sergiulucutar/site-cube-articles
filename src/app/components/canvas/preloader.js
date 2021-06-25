import gsap from 'gsap'
import { Mesh, Plane, Program } from 'ogl'

import vertexShader from '@app/shaders/preloader/vertex.glsl'
import fragmentShader from '@app/shaders/preloader/fragment.glsl'

export class Preloader {
  constructor ({
    gl,
    parent,
    viewport
  }) {
    this.gl = gl
    this.parent = parent
    this.viewport = viewport

    this.createGeometry()
    this.createProgram()
    this.createMesh()
    this.updateScale()
  }

  createGeometry () {
    this.geometry = new Plane(this.gl, {
      widthSegments: 40,
      heightSegments: 20
    })
  }

  createProgram () {
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTransition: {
          value: 0
        }
      }
    })
  }

  createMesh () {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.parent)
  }

  updateScale () {
    this.mesh.scale.x = this.viewport.width
    this.mesh.scale.y = this.viewport.height
  }

  hide () {
    return new Promise(resolve => {
      const timeline = gsap.timeline()

      timeline
        .to(this.program.uniforms.uTransition, {
          value: 1,
          duration: 1.4,
          delay: 1,
          ease: 'expo.inOut',
          onComplete: resolve
        })
        .to(this.mesh.position, {
          y: this.viewport.height,
          duration: 1.4,
          delay: 1,
          ease: 'expo.inOut',
          onComplete: resolve
        }, 0)
    })
  }

  destroy () {
    this.mesh.setParent(null)
  }
}
