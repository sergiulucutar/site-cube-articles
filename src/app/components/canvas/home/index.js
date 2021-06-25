import gsap from 'gsap'
import { Plane, Transform } from 'ogl'

import DeviceDetector from '@app/classes/device-detector'
import State from '@app/state'

import Media from './media'
import Transition from './transition'

export default class Home {
  constructor ({ gl, scene, viewport }) {
    this.gl = gl
    this.scene = scene
    this.viewport = viewport

    this.transition = new Transition({
      gl: this.gl,
      parent: this.scene,
      viewport: this.viewport
    })

    this.group = new Transform()
    this.group.setParent(scene)

    this.element = document.querySelector('.home__articles')
    // this.galleryIndicator = document.querySelector('.home__gallery__indicator')
    this.articleElements = [...this.element.querySelectorAll('.home__article')]

    this.createGeometry()
    this.createGallery()
    this.createGalleryBounds()

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
      isMovingRight: true
    }
  }

  createGeometry () {
    this.geometry = new Plane(this.gl, {
      widthSegments: 40,
      heightSegments: 20
    })
  }

  createGallery () {
    this.medias = this.articleElements.map((article, index) => {
      // const imageUrl = media.getAttribute('src')

      return new Media({
        element: article,
        geometry: this.geometry,
        index,
        scene: this.group,
        viewport: this.viewport,
        gl: this.gl,
        image: State.data.images[article.querySelector('img').getAttribute('src')]
      })
    })
  }

  createGalleryBounds () {
    this.gallery = {
      width: this.element.getBoundingClientRect().width,
      height: this.element.getBoundingClientRect().height
    }

    this.gallery.height += this.gallery.height * 0.05
  }

  getArticleByUID (mediaUID) {
    return this.medias.find(media => media.element.getAttribute('data-articleuid') === mediaUID)
  }

  update () {
    if (Math.abs(this.x.target - this.x.current) < 0.01) {
      this.x.current = this.x.target
    } else {
      this.x.current = gsap.utils.interpolate(this.x.current, this.x.target, this.x.lerp)
    }

    if (DeviceDetector.isPhone()) {
      this.element.style.transform = `translateY(${this.x.current}px)`
      this.medias.forEach(media => {
        media.update(0, -this.x.current)
      })
    } else {
      this.element.style.transform = `translateX(${this.x.current}px)`
      this.medias.forEach(media => {
        media.update(this.x.current)
      })
    }
  }

  updateX (distance) {
    if (DeviceDetector.isPhone()) {
      this.x.target = this.x.current + distance
      this.x.target = gsap.utils.clamp(-this.gallery.height + window.innerHeight, 0, this.x.target)
    } else {
      this.x.target = this.x.current + distance
      this.x.target = gsap.utils.clamp(-this.gallery.width + window.innerWidth, 0, this.x.target)
    }
  }

  hide (url) {
    const urlBits = url.split('/')
    const articleUID = urlBits[urlBits.length - 1]
    window.sessionStorage.setItem('visitedArticle', articleUID)
    const selectedArticle = this.getArticleByUID(articleUID)

    return this.transition.out(selectedArticle)
  }

  show () {
    const articleUID = window.sessionStorage.getItem('visitedArticle')
    const article = this.getArticleByUID(articleUID)
    if (article) {
      // Scroll so the object is in the camera view
      this.updateX(-article.bounds.left + window.innerWidth / 2 - article.bounds.width / 2)

      // Calculate the position of the element as it's on screen (substract scrolled distanced from element bound)
      return this.transition.in(article, (-this.viewport.width / 2) + (article.mesh.scale.x / 2) + ((article.bounds.left + this.x.target) / window.innerWidth) * this.viewport.width)
    }
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
    this.updateX(x.distance)
  }

  onMouseWheel (x) {
    this.updateX(x.distance)
  }

  /**
   * Destroy
   */

  destroy () {
    this.scene.removeChild(this.group)
    this.scene.removeChild(this.transition.mesh)
  }
}
