import gsap from 'gsap'

import Animation from '@app/classes/animation'

export default class OpacityAnimation extends Animation {
  constructor ({ element }) {
    super({ element })
    this.element = element

    this.animateOut()
  }

  animateIn () {
    gsap.to(this.element, {
      autoAlpha: 1,
      duration: 1.5,
      delay: 0.2,
      ease: 'expo.out'
    })
  }

  animateOut () {
    gsap.set(this.element, {
      autoAlpha: 0
    })
  }
}
