import {
  library as faLib,
  icon,
} from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default class InputRaw {
  _initialized = false
  _autoMount = false
  _defaultType = 'object'
  rootElement = null

  constructor(selector, config = null, autoMount = false) {
    this._initRootElement(selector)
    this._autoMount = autoMount

    if (this._autoMount) {
      if (!this.rootElement) {
        console.error(`[InputRaw] Cannot find element matching "${selector}" selector.`)
        return
      }
      this.init()
    }
  }

  _initRootElement(selector) {
    const element = document.querySelector(selector)
    if (element) {
      this.rootElement = element
    }
  }

  init(selector = null) {
    if (selector) {
      this._initRootElement(selector)
    }
    this._initDependencies()
    this._generateDOM()
  }

  _initDependencies() {
    faLib.add(faPlus)
    icon({ prefix: 'fas', iconName: 'plus', })
  }

  _generateDOM() {
    const root = this.rootElement
    root.classList.add('input-raw')
  }
}
