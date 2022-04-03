import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'
import {
  getElementChildByPropKey,
  findElementParentByClass,
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
  _wrapperElement = null
  _placeholderElement = null
  propType = 'object'
  $value = {}
  state = {
    initialized: false,
    editing: false,
    editable: false,
    errored: false,
    toObject: false,
    toArray: false,
    open: true,
  }

  constructor(value = null) {
    if (value) {
      this.$value = value
    }
    this._initDOM()
    this._computeDOM()
  }

  _initDOM() {
    // Base
    this.attachedElement.classList.add('ir__prop-object')
    // this.attachedElement.classList.add('ir__prop-object--open')
    this._wrapperElement = document.createElement('div')
    this._wrapperElement.classList.add('ir__prop-wrapper')
    this._placeholderElement = document.createElement('div')
    this._placeholderElement.classList.add('ir__prop-object__placeholder')
    this._blankValueElement = document.createElement('div')
    this._blankValueElement.classList.add('ir__prop-object__blank')
    this._blankValueElement.innerHTML = '(empty)'

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

    // Main DOM building
    this.attachedElement.appendChild(this._wrapperElement)
    this.attachedElement.appendChild(rowActionsElement)
    if (!Object.keys(this.$value).length) {
      this.attachedElement.appendChild(this._blankValueElement)
    }
  }

  _computeDOM() {
    // Processing: values
    for (const [propKey, propValue] of Object.entries(this.$value)) {
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
        propElement.classList.add('ir__prop')
        propElement.setAttribute('data-ir-prop-key', propKey)
        this._wrapperElement.appendChild(propElement)
      }
    }
    // Processnig: "blank" state
    if (Object.keys(this.$value).length) {
      this._blankValueElement.remove()
    } else {
      this.attachedElement.appendChild(this._blankValueElement)
    }
  }

  _hasDOMPropKey(key) {
    for (const element of this._wrapperElement.children) {
      const propKey = element.getAttribute('data-ir-prop-key')
      if (propKey === key) {
        return true
      }
    }
    return false
  }

  _getPropByKey(key) {
    for (const [propKey, propValue] of Object.entries(this.$value)) {
      if (propKey === key) {
        return propValue
      }
    }
    return null
  }

  _generateDOMPartObjectProp(key, objectValue) {
    // Building: main wrapper
    const element = document.createElement('div')
    element.classList.add('ir__prop-subobject')

    // Building: prop key
    const nameElement = document.createElement('div')
    nameElement.classList.add('ir__prop-kname-box')
    nameElement.addEventListener('click', this._onKNameBoxClick.bind(this))
    const knameContentElement = document.createElement('div')
    knameContentElement.classList.add('ir__prop-kname__content')
    // -- Icon
    const nameIcnElement = document.createElement('div')
    nameIcnElement.classList.add('ir__prop-kname__icn')
    const icn = icon({ prefix: 'fas', iconName: 'caret-right', })
    const icnHTML = toHtml(icn.abstract[0])
    nameIcnElement.innerHTML = icnHTML
    // -- Text
    const propKeyNameElement = document.createElement('div')
    propKeyNameElement.classList.add('ir__prop-object-kname')
    propKeyNameElement.innerHTML = key
    const keyNameColonElement = document.createElement('div')
    keyNameColonElement.classList.add('ir__prop-kname__colon')
    keyNameColonElement.innerHTML = ':'
    // -- DOM building
    propKeyNameElement.appendChild(keyNameColonElement)
    knameContentElement.appendChild(nameIcnElement)
    knameContentElement.appendChild(propKeyNameElement)
    nameElement.appendChild(knameContentElement)

    // Building: prop value
    objectValue.attachedElement.classList.add('ir__prop-object--nested')
    if (this.state.open) {
      // objectValue.attachedElement.classList.add('ir__prop-object--open')
    }

    // Main DOM building
    element.appendChild(nameElement)
    element.appendChild(objectValue.attachedElement)
    return element
  }

  _generateDOMPartArrayProp(key, arrayValue) {
    console.log(key, arrayValue);
    return
  }

  _generateDOMPartPrimitiveProp(key, primitiveValue) {
    // Building: prop "box"
    const element = document.createElement('div')
    element.classList.add('ir__prop-primitive')
    // Building: prop key
    const nameElement = document.createElement('div')
    nameElement.classList.add('ir__prop-name')
    nameElement.innerHTML = key
    const keyNameColonElement = document.createElement('div')
    keyNameColonElement.classList.add('ir__prop-kname__colon')
    keyNameColonElement.innerHTML = ':'
    nameElement.appendChild(keyNameColonElement)
    // Building: prop value
    const valueElement = document.createElement('div')
    valueElement.classList.add('ir__prop-value')
    valueElement.appendChild(primitiveValue.attachedElement)
    // Main DOM building
    element.appendChild(nameElement)
    element.appendChild(valueElement)
    return element
  }

  _onKNameBoxClick(e) {
    const kNameBoxElement = findElementParentByClass(e.target, 'ir__prop-kname-box')
    const objectElement = findElementParentByClass(e.target, 'ir__prop')
    console.log(kNameBoxElement, objectElement);
    // e.stopPropagation()
    // for ()
  }

  setProp(key, value) {
    if (!this.$value.hasOwnProperty(key)) {
      this.$value[key] = value
      this._computeDOM()
    } else {
      const existingProp = this.$value[key]
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
