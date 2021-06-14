export default class Animation {
  constructor ({
    element
  }) {
    this.element = element

    this.createObserver()
  }

  createObserver () {
    this.observer = new window.IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.animateIn()
        }
      }
    })

    this.observer.observe(this.element)
  }

  /**
   * These will hold the naimation definition in child classes
   */
  animateIn () {}

  animateOut () {}
}
