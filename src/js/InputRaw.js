import {
  library as faLib,
  icon,
} from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default class InputRaw {
  _initialized = false
  _autoMount = false
  attachedElement = null

  constructor(selector, config = null, autoMount = false) {
    this._initAttachedElement(selector)
    this._autoMount = autoMount

    if (this._autoMount) {
      if (!this.attachedElement) {
        console.error(`[InputRaw] Cannot find element matching "${selector}" selector.`)
        return
      }
      this.init()
    }
  }

  _initAttachedElement(selector) {
    const element = document.querySelector(selector)
    if (element) {
      this.attachedElement = element
    }
  }

  init() {
    // Init dependencies
    faLib.add(faPlus)
    icon({ prefix: 'fas', iconName: 'plus', })
    // Init module
    // ...
  }
}
