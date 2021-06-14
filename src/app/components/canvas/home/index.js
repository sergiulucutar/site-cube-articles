import gsap from 'gsap'
import { Plane, Transform } from 'ogl'

import State from '@app/state'

import Media from './media'

export default class Home {
  constructor ({ gl, scene, viewport }) {
    this.gl = gl
    this.scene = scene
    this.viewport = viewport

    this.group = new Transform()
    this.group.setParent(scene)

    this.galleryElement = document.querySelector('.home__gallery')
    this.galleryIndicator = document.querySelector('.home__gallery__indicator')
    this.mediaLinkElements = [...this.galleryElement.querySelectorAll('.home__gallery__link')]
    this.mediaElements = [...this.galleryElement.querySelectorAll('.home__gallery__media__image')]

    this.createGeometry()
    this.createGallery()
    this.createGalleryBounds()

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
      isMovingRight: true
    }

    // Hide untill shown, to avoid flicker
    this.group.position.y = this.viewport.height
  }

  createGeometry () {
    this.geometry = new Plane(this.gl)
  }

  createGallery () {
    this.medias = this.mediaElements.map((media, index) => {
      const imageUrl = media.getAttribute('src')

      return new Media({
        element: media,
        linkElement: this.mediaLinkElements[index],
        geometry: this.geometry,
        index,
        scene: this.group,
        viewport: this.viewport,
        gl: this.gl,
        textureImage: State.data.images[imageUrl]
      })
    })
  }

  createGalleryBounds () {
    this.gallery = {
      width: this.galleryElement.getBoundingClientRect().width
      // canvasWidth: this.galleryElement.getBoundingClientRect().width / window.innerWidth * this.viewport.width
    }
  }

  update () {
    if (Math.abs(this.x.target - this.x.current) < 0.01) {
      this.x.current = this.x.target
    } else {
      this.x.current = gsap.utils.interpolate(this.x.current, this.x.target, this.x.lerp)
    }
    this.galleryElement.style.transform = `translateX(${this.x.current}px)`
    this.galleryIndicator.style.transform = `rotate(${this.x.current / this.gallery.width * 360}deg)`

    // this.isMovingRight = this.x.target > this.x.current

    this.medias.forEach(media => {
      // Infinite gallery
      // const scaleX = media.mesh.scale.x / 2 * 1.5 // * 1.5 to have on offset before moving the item at the end of the gallery

      // if (this.isMovingRight) {
      //   if (media.mesh.position.x - scaleX > this.viewport.width / 2) {
      //     media.extra -= this.gallery.canvasWidth
      //   }
      // } else {
      //   if (media.mesh.position.x + scaleX < -this.viewport.width / 2) {
      //     media.extra += this.galleryWidth.canvasWidth
      //   }
      // }

      media.update(this.x.current)
    })
  }

  updateX (x) {
    this.x.target = this.x.current + x.distance
    const extra = this.medias[0].bounds.width / 2
    this.x.target = gsap.utils.clamp(-this.gallery.width + window.innerWidth * 0.5 + extra, window.innerWidth * 0.5 - extra, this.x.target)
  }

  hide () {
    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: resolve
      })

      timeline
        .to(this.group.position, {
          y: -this.viewport.height,
          duration: 1,
          ease: 'expo.in'
        })
        .to(this.group.scale, {
          x: 0.8,
          y: 0.8,
          duration: 1,
          ease: 'expo.in'
        }, 0)
    })
  }

  show () {
    const timeline = gsap.timeline()

    timeline
      .to(this.group.position, {
        y: 0,
        duration: 1,
        ease: 'expo.out'
      })
      .from(this.group.scale, {
        x: 1.2,
        y: 1.2,
        duration: 1,
        ease: 'expo.out'
      }, 0)
  }

  /**
   * Events
   */

  onResize (viewport) {
    this.viewport = viewport
    this.x.current = 0
    this.x.target = 0

    this.createGalleryBounds()
    this.medias.forEach(media => media.onResize(viewport))
  }

  onTouchMove (x) {
    this.updateX(x)
  }

  onMouseWheel (x) {
    this.updateX(x)
  }

  /**
   * Destroy
   */

  destroy () {
    this.scene.removeChild(this.group)
  }
}
