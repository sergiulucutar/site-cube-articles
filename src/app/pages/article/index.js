import Page from '@app/classes/page'
import { ColorsManager } from '@app/classes/colors'

export default class Article extends Page {
  constructor () {
    super({
      id: 'article',

      domElement: '.article',
      domChildren: {
        wrapper: '.article__wrapper',
        introHeader: '.article__intro__header'
      }
    })
  }

  show () {
    const palette = this.element.getAttribute('data-palette')
    document.body.style.backgroundColor = ColorsManager.getHexColor(palette)
    document.body.setAttribute('data-palette', palette)

    return super.show()
  }
}
