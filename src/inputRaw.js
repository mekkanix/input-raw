export default class InputRaw {
  _initialized = false
  _autoMount = false
  attachedElement = null

  constructor(selector, config = null, autoMount = false) {
    this._initAttachedElement(selector)
    this._autoMount = autoMount

    if (this._autoMount && !this.attachedElement) {
      console.error(`[InputRaw] Cannot find DOM element matching "${selector}" selector.`)
      return
    }
  }

  _initAttachedElement(selector) {
    const element = document.querySelector(selector)
    if (element) {
      this.attachedElement = element
    }
  }
}
