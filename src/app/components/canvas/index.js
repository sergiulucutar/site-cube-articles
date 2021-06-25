import { Camera, Renderer, Transform } from 'ogl'
import DeviceDetector from '../../classes/device-detector'

import Home from './home'
import { Preloader } from './preloader'

const TEMPLATES = {
  home: 'home'
}

export default class Canvas {
  constructor () {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.x = {
      start: 0,
      end: 0,
      distance: 0
    }

    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()

    this.createPreloader()
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.position.z = 5
  }

  createRenderer () {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true
    })

    this.renderer.sort = true
    this.gl = this.renderer.gl

    document.getElementById('canvas').appendChild(this.gl.canvas)
  }

  createScene () {
    this.scene = new Transform()
  }

  createPreloader () {
    this.preloader = new Preloader({
      gl: this.gl,
      parent: this.scene,
      viewport: this.viewport
    })
  }

  hide (url) {
    if (this.template && this.template.hide) {
      return this.template.hide(url)
    }
  }

  show () {
    if (this.template && this.template.show) {
      return this.template.show()
    }
  }

  /**
   * Loop
   */

  update () {
    if (this.template && this.template.update) {
      this.template.update()
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene
    })
  }

  updateScrollOffset (offset) {
    if (this.template) {
      this.template.updateScrollOffset(offset)
    }
  }

  /**
   * Event handlers
   */

  onChange (template) {
    if (this.template) {
      this.template.destroy()
      this.template = null
    }

    switch (template) {
      case TEMPLATES.home:
        this.template = new Home({
          gl: this.gl,
          scene: this.scene,
          viewport: this.viewport
        })
        break
    }
  }

  onResize () {
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.camera.perspective({
      aspect: this.sizes.width / this.sizes.height
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.viewport = {
      width,
      height
    }

    if (this.template) {
      this.template.onResize(this.viewport)
    }
  }

  onMouseWheel (event) {
    if (this.template && this.template.onMouseWheel) {
      this.x.distance = -event.pixelY * 4
      this.template.onMouseWheel(this.x)
    }
  }

  onTouchDown (event) {
    this.isTouchDown = true
    if (DeviceDetector.isPhone()) {
      this.x.start = event.touches ? event.touches[0].clientY : event.clientY
    } else {
      this.x.start = event.touches ? event.touches[0].clientX : event.clientX
    }
  }

  onTouchMove (event) {
    if (!this.isTouchDown) {
      return
    }

    if (DeviceDetector.isPhone()) {
      this.x.end = event.touches ? event.touches[0].clientY : event.clientY
    } else {
      this.x.end = event.touches ? event.touches[0].clientX : event.clientX
    }
    this.x.distance = this.x.end - this.x.start

    if (this.template && this.template.onTouchMove) {
      this.template.onTouchMove(this.x)
    }
  }

  onTouchUp () {
    this.isTouchDown = false
  }
}
