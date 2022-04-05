import {
  library as faLib,
} from '@fortawesome/fontawesome-svg-core'
import {
  faEdit,
  faCheck,
  faTimes,
  faTrash,
  faPlus,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons'
import PropPrimitive from './PropPrimitive.js'
import PropObject from './PropObject.js'
import PropArray from './PropArray.js'
import PropToolbar from './PropToolbar.js'

export default class InputRaw {
  _initialized = false
  _autoMount = false
  tree = null
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

  _initDependencies() {
    // FA icons
    faLib.add(faEdit)
    faLib.add(faCheck)
    faLib.add(faTimes)
    faLib.add(faTrash)
    faLib.add(faPlus)
    faLib.add(faCaretRight)
  }

  _initPropToolbar() {
    const toolbar = new PropToolbar()
    toolbar.updateState('initialized', true)
    // this.rootElement.appendChild(toolbar.attachedElement)
  }

  _initDefaultState() {
    const propObject = new PropObject()
    propObject.setProp('test', new PropObject())
    propObject.setProp('test2', new PropArray())
    // propObject.$value.test2.addProp(new PropPrimitive(true))
    console.log(propObject);
    this.tree = propObject
    this.rootElement.appendChild(propObject.attachedElement)
  }

  init(selector = null) {
    if (selector) {
      this._initRootElement(selector)
    }
    this._initDependencies()
    this._initDefaultState()
    this._initPropToolbar()
  }
}
