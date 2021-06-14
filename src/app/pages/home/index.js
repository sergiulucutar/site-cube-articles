import Page from '@app/classes/page'

export default class Home extends Page {
  constructor () {
    super({
      id: 'home',

      domElement: '.home',
      domChildren: {
      }
    })
  }
}
