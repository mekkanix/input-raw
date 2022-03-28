import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'
import {
  getElementChildByPropKey,
} from './helpers/DOM.js'
import PropPrimitive from './PropPrimitive.js'

export default class PropObject {
  _rowActions = [
    {
      classes: ['add-primitive',],
      icon: 'plus',
    },
    {
      classes: ['convert2object', 'add-object',],
      text: '+{}',
    },
    {
      classes: ['convert2array', 'add-array',],
      text: '+{}',
    },
  ]
  attachedElement = document.createElement('div')
  fieldWrapperElement = null
  propType = 'object'
  value = {}

  constructor() {
    this._initDOM()
  }

  _initDOM() {
    // Base
    this.attachedElement.classList.add('ir__prop-object')
    this.fieldWrapperElement = document.createElement('div')
    this.fieldWrapperElement.classList.add('ir__prop-object__field-wrapper')
    // Row actions
    const rowActionsElement = document.createElement('div')
    rowActionsElement.classList.add('ir__prop-object__row-actions')
    for (const rowAction of this._rowActions) {
      const rowActionElement = document.createElement('div')
      rowActionElement.classList.add('ir__prop-object__row-action')
      rowActionElement.classList.add('ir__prop-object__action')
      for (const cssClass of rowAction.classes) {
        rowActionElement.classList.add(cssClass)
      }
      let icnHTML = null
      if (rowAction.icon) {
        const icn = icon({ prefix: 'fas', iconName: rowAction.icon, })
        icnHTML = toHtml(icn.abstract[0])
      } else if (rowAction.text) {
        icnHTML = rowAction.text
      }
      rowActionElement.innerHTML = icnHTML
      rowActionsElement.appendChild(rowActionElement)
    }
    // Structure
    this.attachedElement.appendChild(this.fieldWrapperElement)
    this.attachedElement.appendChild(rowActionsElement)
  }

  _generateDOM() {
    for (const [propKey, propValue] of Object.entries(this.value)) {
      if (!this._hasDOMPropKey(propKey)) {
        let propElement = null
        switch (propValue.propType) {
          case 'object':
            propElement = this._generateDOMPartObjectProp(propKey, propValue)
            break
          case 'array':
            propElement = this._generateDOMPartArrayProp(propKey, propValue)
            break
          case 'primitive':
            propElement = this._generateDOMPartPrimitiveProp(propKey, propValue)
            break
        }
        propElement.classList.add('ir_prop')
        propElement.setAttribute('data-ir-prop-key', propKey)
        this.fieldWrapperElement.appendChild(propElement)
      }
    }
  }

  _hasDOMPropKey(key) {
    for (const element of this.fieldWrapperElement.children) {
      const propKey = element.getAttribute('data-ir-prop-key')
      if (propKey === key) {
        return true
      }
    }
    return false
  }

  _getPropByKey(key) {
    for (const [propKey, propValue] of Object.entries(this.value)) {
      if (propKey === key) {
        return propValue
      }
    }
    return null
  }

  _generateDOMPartObjectProp(key, objectValue) {
    console.log(key, objectValue);
    return
  }

  _generateDOMPartArrayProp(key, arrayValue) {
    console.log(key, arrayValue);
    return
  }

  _generateDOMPartPrimitiveProp(key, primitiveValue) {
    // Prop "box"
    const propElement = document.createElement('div')
    propElement.classList.add('ir__prop-primitive')
    // Prop name
    const propNameElement = document.createElement('div')
    propNameElement.classList.add('ir__prop-name')
    propNameElement.innerHTML = key
    // Prop value
    const propValueElement = document.createElement('div')
    propValueElement.classList.add('ir__prop-value')
    propValueElement.appendChild(primitiveValue.attachedElement)
    // console.log(primitiveValue);
    // Structure
    propElement.appendChild(propNameElement)
    propElement.appendChild(propValueElement)
    // propElement.appendChild(value.attachedElement)
    return propElement
  }

  setProp(key, value) {
    if (!this.value.hasOwnProperty(key)) {
      this.value[key] = value
      this._generateDOM()
    } else {
      const existingProp = this.value[key]
      switch (value.propType) {
        case 'object':

          break
        case 'array':

          break
        case 'primitive':
          existingProp.setValue(value.value)
          break
      }
    }
  }
}
