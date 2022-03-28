// import {
//   icon,
//   toHtml,
// } from '@fortawesome/fontawesome-svg-core'
import { formatPrimitiveValueToCode, } from './helpers/Formatter.js'

export default class PropPrimitive {
  attachedElement = document.createElement('div')
  propType = 'primitive'
  valueType = null
  value = null
  fmtValue = null

  constructor(value) {
    this.value = value
    this.valueType = this._getFmtTypeFromValue(value)
    this.fmtValue = formatPrimitiveValueToCode(value, this.valueType)
    this._initDOM()
    this._updateDOM()
  }

  _initDOM() {
    // Base
    this.attachedElement.classList.add('ir__primitive-value')
  }

  _updateDOM() {
    // CSS Class
    let cssClass = `t-${this.valueType}`
    // if (this.attachedElement.classList.contains(cssClass)) {
    //   this.attachedElement.classList.remove(cssClass)
    // }
    this.attachedElement.classList.add(cssClass)
    // Value
    this.attachedElement.innerHTML = this.fmtValue
  }

  _getFmtTypeFromValue(value) {
    const nativeType = typeof value
    if (value === null) {
      return 'null'
    }
    return nativeType
  }

  setValue(value) {
    this.value = value
    this.valueType = this._getFmtTypeFromValue(value)
    this.fmtValue = formatPrimitiveValueToCode(value, this.valueType)
    this._updateDOM()
  }

  removeDOMElement() {
    this.attachedElement.remove()
  }
}
