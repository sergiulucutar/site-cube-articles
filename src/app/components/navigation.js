import gsap from 'gsap'

import Component from '@app/classes/component'

export default class Navigation extends Component {
  constructor () {
    super({
      domElement: '.navigation',
      domChildren: {
        items: '.navigation__list__item',
        links: '.navigation__list__link'
      }
    })
  }

  show () {
    gsap.to(this.element, {
      autoAlpha: 1,
      duration: 1,
      ease: 'expo.out'
    })
  }
}
