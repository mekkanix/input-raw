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
  _propToolbar = null

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
      this.rootElement.classList.add('ir-root')
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
    this._propToolbar = new PropToolbar(this.rootElement)
    // console.log(this._propToolbar);
    this._propToolbar.updateState('initialized', true)
    // this.rootElement.appendChild(toolbar.attachedElement)
  }

  _initDefaultState() {
    const pt = this._propToolbar
    const propObject = new PropObject(pt)
    propObject.setProp('test', new PropObject(pt))
    propObject.$value.test.setProp('test1_1', new PropPrimitive(pt, false))
    propObject.$value.test.setProp('test1_2', new PropPrimitive(pt, 123))
    propObject.$value.test.setProp('test1_3', new PropObject(pt))
    propObject.$value.test.setProp('test1_4', new PropArray(pt))
    propObject.setProp('test2', new PropArray(pt))
    propObject.$value.test2.addProp(new PropPrimitive(pt, true))
    propObject.$value.test2.addProp(new PropPrimitive(pt, 456))
    propObject.$value.test2.addProp(new PropObject(pt))
    propObject.$value.test2.addProp(new PropArray(pt))
    propObject.$value.test2.$value[3].addProp(new PropArray(pt))
    this.tree = propObject
    this.rootElement.appendChild(propObject.attachedElement)
  }

  init(selector = null) {
    if (selector) {
      this._initRootElement(selector)
    }
    this._initDependencies()
    this._initPropToolbar()
    this._initDefaultState()
  }
}
