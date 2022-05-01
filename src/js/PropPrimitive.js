// import {
//   icon,
//   toHtml,
// } from '@fortawesome/fontawesome-svg-core'
import { formatPrimitiveValueToCode, } from './helpers/Formatter.js'

export default class PropPrimitive {
  _typeCSSClasses = {
    null: 't-null',
    string: 't-string',
    number: 't-number',
    boolean: 't-boolean',
    date: 't-date',
  }
  attachedElement = document.createElement('div')
  _propToolbar = null
  mounted = false
  propType = 'primitive'
  valueType = null
  $value = null
  // state = {
  //   initialized: false,
  //   editing: false,
  //   editable: false,
  //   errored: false,
  //   toObject: false,
  //   toArray: false,
  //   open: true,
  // }
  fmtValue = null

  constructor(propToolbar, value) {
    this._propToolbar = propToolbar
    this.$value = value
    this.valueType = this._getFmtTypeFromValue(value)
    this.fmtValue = formatPrimitiveValueToCode(value, this.valueType)
    this._initDOM()
    this._computeDOM()
    this.mounted = true
  }

  _initDOM() {
    // Base
    this.attachedElement.classList.add('ir__primitive-value')
  }

  _computeDOM() {
    // CSS Class
    this._updateAttachedElementTypeClass()
    // Value
    this.attachedElement.innerHTML = this.fmtValue
  }

  _updateAttachedElementTypeClass() {
    let typeClasses = this._typeCSSClasses
    // Reset CSS class
    for (const [_, tClass] of Object.entries(typeClasses)) {
      if (this.attachedElement.classList.contains(tClass)) {
        this.attachedElement.classList.remove(tClass)
      }
    }
    this.attachedElement.classList.add(typeClasses[this.valueType])
  }

  _getFmtTypeFromValue(value) {
    const nativeType = typeof value
    if (value === null) {
      return 'null'
    }
    return nativeType
  }

  setValue(value) {
    this.$value = value
    this.valueType = this._getFmtTypeFromValue(value)
    this.fmtValue = formatPrimitiveValueToCode(value, this.valueType)
    this._updateDOM()
  }
}
