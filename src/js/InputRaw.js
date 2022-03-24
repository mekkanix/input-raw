import {
  library as faLib,
  icon,
} from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import PropObject from './PropObject.js'
import PropArray from './PropArray.js'
import PropToolbar from './PropToolbar.js'

export default class InputRaw {
  _initialized = false
  _autoMount = false
  tree = {}
  rootElement = null

  constructor(selector, config, autoMount = false) {
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
      this.rootElement.classList.add('input-raw')
    }
  }

  init(selector = null) {
    if (selector) {
      this._initRootElement(selector)
    }
    this._initDependencies()
    this._initPropToolbar()
  }

  _initDependencies() {
    faLib.add(faPlus)
    icon({ prefix: 'fas', iconName: 'plus', })
  }

  _initPropToolbar() {
    const toolbar = new PropToolbar()
    this.rootElement.appendChild(toolbar.attachedElement)
  }
}
