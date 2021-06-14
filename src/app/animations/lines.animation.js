import gsap from 'gsap'

import Animation from '@app/classes/animation'
import { getContentAsWords, getLines } from '../utils/text'

export default class LinesAnimation extends Animation {
  constructor ({ element }) {
    super({ element })
    this.element = element

    const content = getContentAsWords(this.element)
    this.element.innerHTML = content

    const wordSpans = this.element.querySelectorAll('span span')
    this.lines = getLines(wordSpans)

    this.animateOut()
  }

  animateIn () {
    const timeline = gsap.timeline()

    this.lines.forEach((line, index) => {
      timeline
        .to(line, {
          yPercent: 0,
          z: 0.1,
          rotationZ: 0.01,
          duration: 1,
          delay: index * 0.1,
          ease: 'expo.out'
        }, 0)
    })
  }

  animateOut () {
    this.lines.forEach((line) => {
      gsap.set(line, {
        yPercent: 100
      })
    })
  }
}
