import Component from '@app/classes/component'
import gsap from 'gsap'

const links = {
  home: 'home'
}

export default class Navigation extends Component {
  constructor ({ template }) {
    super({
      domElement: '.navigation',
      domChildren: {
        items: '.navigation__list__item',
        links: '.navigation__list__link'
      }
    })

    this.currentTemplate = template === links.about ? links.home : links.about
    this.onChange(template)
  }

  onChange (template) {
    const timeline = gsap.timeline()

    if (template === 'about' && this.currentTemplate !== template) {
      timeline
        .to(this.children.links[1], {
          yPercent: -100,
          z: 0.1,
          rotationZ: 0.01,
          duration: 0.4,
          ease: 'expo.out'
        })
        .set(this.children.items[1], {
          autoAlpha: 0
        })
        .set(this.children.items[0], {
          autoAlpha: 1
        })
        .fromTo(this.children.links[0],
          {
            yPercent: 100
          },
          {
            yPercent: 0,
            z: 0.1,
            rotationZ: 0.01,
            duration: 1,
            ease: 'expo.out'
          })
    } else if (template !== 'about' && this.currentTemplate === 'about') {
      timeline
        .to(this.children.links[0], {
          yPercent: -100,
          z: 0.1,
          rotationZ: 0.01,
          duration: 0.4,
          ease: 'expo.out'
        })
        .set(this.children.items[0], {
          autoAlpha: 0
        })
        .set(this.children.items[1], {
          autoAlpha: 1
        })
        .fromTo(this.children.links[1],
          {
            yPercent: 100
          },
          {
            yPercent: 0,
            z: 0.1,
            rotationZ: 0.01,
            duration: 1,
            ease: 'expo.out'
          })
    }

    this.currentTemplate = template
  }
}
