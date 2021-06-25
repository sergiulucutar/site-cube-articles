/**
 * Mainly used by the preloader to store data that is going to be used later in the website
 */
export class State {
  constructor () {
    this.data = {}
  }

  addImages (images) {
    this.data.images = images
  }
}

export default new State()
