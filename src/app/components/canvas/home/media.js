import gsap from 'gsap'
import { Mesh, Program, Texture } from 'ogl'

import vertexShader from '@app/shaders/media/vertex.glsl'
import fragmentShader from '@app/shaders/media/fragment.glsl'

export default class Media {
  constructor ({ element, linkElement, geometry, index, gl, scene, viewport, textureImage }) {
    this.gl = gl
    this.scene = scene
    this.viewport = viewport

    this.element = element
    this.linkElement = linkElement
    this.geometry = geometry
    this.index = index

    this.extra = 0
    this.texture = new Texture(this.gl, {
      generateMipmaps: false,
      image: textureImage
    })

    this.createBounds()
    this.createProgram()
    this.createMesh()

    this.onResize(this.viewport)
  }

  createProgram () {
    const canvasAspect = this.bounds.width / this.bounds.height
    const imageAspect = this.texture.image.width / this.texture.image.height

    let scaleY = 1
    let scaleX = imageAspect / canvasAspect
    if (scaleX < 1) {
      scaleY = 1 / scaleX
      scaleX = 1
    }

    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uOffset: {
          value: 0
        },
        uTexture: {
          value: this.texture
        },
        uTextureScale: {
          value: [scaleX, scaleY]
        }
      }
    })
  }

  createMesh () {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.position.x = this.index * this.mesh.scale.x

    this.mesh.setParent(this.scene)
  }

  createBounds () {
    const boundingRect = this.element.getBoundingClientRect()

    this.bounds = {
      left: boundingRect.x,
      top: boundingRect.y,
      width: this.element.offsetWidth,
      height: this.element.offsetHeight
    }
  }

  updateScale () {
    this.mesh.scale.x = this.viewport.width * (this.bounds.width / window.innerWidth)
    this.mesh.scale.y = this.viewport.height * (this.bounds.height / window.innerHeight)
  }

  updatePosition () {
    this.mesh.position.x = (-this.viewport.width / 2) + (this.mesh.scale.x / 2) + (this.bounds.left / window.innerWidth) * this.viewport.width
    this.mesh.position.y = (this.viewport.height / 2) - (this.mesh.scale.y / 2) - (this.bounds.top / window.innerHeight) * this.viewport.height
  }

  updatePositionX (x = 0) {
    this.mesh.position.x = (-this.viewport.width / 2) + (this.mesh.scale.x / 2) + ((this.bounds.left + x) / window.innerWidth) * this.viewport.width + this.extra
  }

  updatePositionY () {
    const bounderies = Math.max(this.viewport.width, 7)
    this.mesh.position.y = Math.cos(this.mesh.position.x / bounderies * Math.PI) * 0.618 - 0.2
  }

  updateRotation () {
    const bounderies = Math.max(this.viewport.width, 5)
    this.mesh.rotation.z = gsap.utils.mapRange(-bounderies / 2, bounderies / 2, Math.PI, -Math.PI, this.mesh.position.x) * 0.08
  }

  updateTextureOffset () {
    this.mesh.program.uniforms.uOffset.value = gsap.utils.mapRange(-this.viewport.width / 2, this.viewport.width / 2, -1, 1, this.mesh.position.x)
  }

  updateElement () {
    const bounderies = Math.max(this.viewport.width, 7)
    this.linkElement.style.transform = `
    translateY(${(-this.mesh.position.y) * (window.innerHeight / this.viewport.height)}px)
    rotateZ(${gsap.utils.mapRange(-bounderies / 2, bounderies / 2, 180, -180, this.mesh.position.x) * -0.1}deg)`
  }

  update (x) {
    this.updatePositionX(x)
    this.updatePositionY()
    this.updateRotation()
    this.updateTextureOffset()
    this.updateElement()
  }

  onResize (viewport) {
    this.viewport = viewport
    this.extra = 0

    this.createBounds()
    this.updateScale()
    this.updatePosition()
    this.updateElement()
    // this.updatePositionX()
  }
}
