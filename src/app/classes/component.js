import EventEmitter from 'events'

export default class Component extends EventEmitter {
  constructor ({
    domElement,
    domChildren
  }) {
    super()

    this.domElementSelector = domElement
    this.domChildrenSelectors = domChildren

    this.create()
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
  }
}
