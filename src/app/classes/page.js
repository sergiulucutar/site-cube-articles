import gsap from 'gsap'

import LinesAnimation from '@app/animations/lines.animation'
import OpacityAnimation from '@app/animations/opacity.animation'

import { getLetters } from '@app/utils/text'
import Scroll from '@app/components/scroll'

export default class Page {
  constructor ({
    domElement,
    domChildren,
    id
  }) {
    this.id = id
    this.domElementSelector = domElement
    this.domChildrenSelectors = {
      ...domChildren,
      animateLines: '[data-animation="lines"]',
      animateOpacity: '[data-animation="opacity"]',
      animateLetters: '[data-animation="letters"]'
    }
  }

  create () {
    this.element = document.querySelector(this.domElementSelector)
    this.children = {}

    for (const property in this.domChildrenSelectors) {
      this.children[property] = document.querySelectorAll(this.domChildrenSelectors[property])

      if (this.children[property].length === 0) {
        this.children[property] = null
      } else if (this.children[property].length === 1) {
        this.children[property] = this.children[property][0]
      }
    }

    if (this.children.wrapper) {
      this.scroll = new Scroll({
        element: this.children.wrapper
      })
    }

    this.createAnimations()
    this.onResize()
  }

  createAnimations () {
    if (this.children.animateLines) {
      if (this.children.animateLines.length) {
        for (const element of this.children.animateLines) {
          // eslint-disable-next-line no-new
          new LinesAnimation({
            element
          })
        }
      } else {
        // eslint-disable-next-line no-new
        new LinesAnimation({
          element: this.children.animateLines
        })
      }
    }

    if (this.children.animateOpacity) {
      for (const element of this.children.animateOpacity) {
        // eslint-disable-next-line no-new
        new OpacityAnimation({
          element
        })
      }
    }

    if (this.children.animateLetters && this.children.animateLetters.length) {
      for (const element of this.children.animateLetters) {
        element.innerHTML = getLetters(element)
      }
    }
  }

  update () {
    if (this.scroll) {
      this.scroll.update()
    }
  }

  hide () {
    return new Promise(resolve => {
      gsap.fromTo(this.element, {
        autoAlpha: 1
      }, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  show () {
    return new Promise(resolve => {
      gsap.fromTo(this.element, {
        autoAlpha: 0
      }, {
        autoAlpha: 1,
        onComplete: resolve
      })
    })
  }

  /**
   * Event Listeners
   */

  onMouseWheel (event) {
    if (this.scroll) {
      this.scroll.onMouseWheel(event)
    }
  }

  onResize () {
    if (this.scroll) {
      this.scroll.onResize()
    }
  }

  onTouchDown (event) {
    if (this.scroll) {
      this.scroll.onTouchDown(event)
    }
  }

  onTouchMove (event) {
    if (this.scroll) {
      this.scroll.onTouchMove(event)
    }
  }

  onTouchUp (event) {
    if (this.scroll) {
      this.scroll.onTouchUp(event)
    }
  }
}
