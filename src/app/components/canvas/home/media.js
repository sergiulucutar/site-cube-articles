import { Mesh, Program, Texture } from 'ogl'

import vertexShader from '@app/shaders/media/vertex.glsl'
import fragmentShader from '@app/shaders/media/fragment.glsl'
import { ColorsManager } from '@app/classes/colors'

export default class Media {
  constructor ({ element, geometry, index, gl, scene, viewport, image }) {
    this.gl = gl
    this.scene = scene
    this.viewport = viewport

    this.element = element
    this.geometry = geometry
    this.index = index

    this.extra = 0
    this.texture = new Texture(this.gl, {
      generateMipmaps: false,
      image
    })

    this.createBounds()
    this.createProgram()
    this.createMesh()

    this.onResize(this.viewport)
  }

  createProgram () {
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: true,
      uniforms: {
        uColor: {
          value: ColorsManager.getNormalizedRGB(this.element.getAttribute('data-palette'))
        },
        uTexture: {
          value: this.texture
        },
        uTextureScale: {
          value: [this.imageBounds.width, this.imageBounds.height]
        },
        uTransition: {
          value: 0
        },
        uTransitionCurveOffset: {
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

    const imageAspect = this.texture.image.width / this.texture.image.height
    const canvasAspect = this.bounds.width / 2 / this.bounds.height

    let scaleY = 1
    let scaleX = imageAspect / canvasAspect
    if (scaleX < 1) {
      scaleY = 1 / scaleX
      scaleX = 1
    }

    this.imageBounds = {
      width: scaleX,
      height: scaleY
    }
  }

  updateScale () {
    this.mesh.scale.x = this.viewport.width * (this.bounds.width / window.innerWidth)
    this.mesh.scale.y = this.viewport.height * (this.bounds.height / window.innerHeight)
  }

  updatePosition (x = 0, y = 0) {
    this.mesh.position.x = (-this.viewport.width / 2) + (this.mesh.scale.x / 2) + ((this.bounds.left + x) / window.innerWidth) * this.viewport.width
    this.mesh.position.y = (this.viewport.height / 2) - (this.mesh.scale.y / 2) - ((this.bounds.top - y) / window.innerHeight) * this.viewport.height
  }

  update (x, y) {
    this.updatePosition(x, y)
  }

  onResize (viewport) {
    this.viewport = viewport
    this.extra = 0

    this.createBounds()
    this.updateScale()
    this.updatePosition()
  }
}
