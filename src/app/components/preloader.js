import gsap from 'gsap'

import Component from '@app/classes/component'
import State from '@app/state'

export const PRELOADER_EVENTS = {
  completed: 'completed'
}

export class Preloader extends Component {
  constructor () {
    super({
      domElement: '.preloader',
      domChildren: {
        title: '.preloader__title',
        number: '.preloader__number'
      }
    })

    this.progress = 0
    this.totalItems = 0
    this.percent = {
      current: 0,
      target: 0
    }

    this.load()
  }

  async load () {
    const response = await window.fetch('/preloade')
    const data = await response.json()

    this.totalItems = data.textures.length

    const images = {}
    for (const textureUrl of data.textures) {
      // eslint-disable-next-line no-undef
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = this.onAssetLoaded.bind(this)
      image.src = textureUrl

      images[textureUrl] = image
    }

    State.addImages(images)
  }

  hide () {
    return new Promise(resolve => {
      gsap.to(this.element, {
        delay: 1,
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  update () {
    this.percent.current = gsap.utils.interpolate(this.percent.current, this.percent.target, 0.1)
    this.children.number.innerText = `${Math.round(this.percent.current)}%`
  }

  onAssetLoaded () {
    this.progress += 1

    this.percent.target = Math.round(this.progress / this.totalItems * 100)

    if (this.progress === this.totalItems) {
      this.onLoadComplete()
    }
  }

  onLoadComplete () {
    this.emit(PRELOADER_EVENTS.completed)
  }

  destroy () {
    this.element.parentNode.removeChild(this.element)
  }
}
