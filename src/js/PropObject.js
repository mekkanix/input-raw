import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'
import {
  findElementChildByClass,
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
  attachedElement = null
  _propParentElement = null
  _propKNameContentElement = null
  _propWrapperElement = null
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
    this.attachedElement = document.createElement('div')
    this.attachedElement.classList.add('ir__prop-object')
    this._propParentElement = findElementParentByClass(this.attachedElement, 'ir__prop')
    this._propWrapperElement = document.createElement('div')
    this._propWrapperElement.classList.add('ir__prop-wrapper')
    // this._placeholderElement = document.createElement('div')
    // this._placeholderElement.classList.add('ir__prop-object__placeholder')
    const placeholderText = document.createElement('div')
    placeholderText.classList.add('ir__prop-object__placeholder-text')
    placeholderText.innerHTML = 'Object'
    const placeholderIcn = document.createElement('div')
    placeholderIcn.classList.add('ir__prop-object__placeholder-icn')
    placeholderIcn.innerHTML = '{&hellip;}'
    // this._placeholderElement.append(placeholderText)
    // this._placeholderElement.append(placeholderIcn)
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
    this.attachedElement.appendChild(this._propWrapperElement)
    this.attachedElement.appendChild(rowActionsElement)
  }

  _computeDOM() {
    // Processing: parent element
    if (!this._propParentElement) {
      this._propParentElement = findElementParentByClass(this.attachedElement, 'ir__prop')
    }
    // Processing: values
    for (const [chilPropKey, childPropValue] of Object.entries(this.$value)) {
      if (!this._hasDOMPropKey(chilPropKey)) {
        let childPropElement = null
        switch (childPropValue.propType) {
          case 'object':
              childPropElement = this._generateDOMPartObjectProp(chilPropKey, childPropValue)
              if (childPropValue.state.open) {
                childPropElement.classList.add('ir__prop--open')
              }
            break
          case 'array':
              childPropElement = this._generateDOMPartArrayProp(chilPropKey, childPropValue)
              if (childPropValue.state.open) {
                childPropElement.classList.add('ir__prop--open')
              }
            break
          case 'primitive':
              childPropElement = this._generateDOMPartPrimitiveProp(chilPropKey, childPropValue)
            break
        }
        childPropElement.classList.add('ir__prop')
        childPropElement.setAttribute('data-ir-prop-key', chilPropKey)
        this._propWrapperElement.appendChild(childPropElement)
      }
    }
    // Processing: "blank" state
    if (Object.keys(this.$value).length) {
      this._blankValueElement.remove()
    } else {
      this.attachedElement.appendChild(this._blankValueElement)
    }
    // Processing: "open" state
    if (this._propParentElement) {
      if (this.state.open) {
        this._propParentElement.classList.add('ir__prop--open')
      } else {
        this._propParentElement.classList.remove('ir__prop--open')
      }
    }
  }

  _hasDOMPropKey(key) {
    for (const element of this._propWrapperElement.children) {
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
    // -- Placeholder
    const placeholderElement = document.createElement('div')
    placeholderElement.classList.add('ir__prop-object__placeholder')
    const placeholderText = document.createElement('div')
    placeholderText.classList.add('ir__prop-object__placeholder-text')
    placeholderText.innerHTML = 'Object'
    const placeholderIcn = document.createElement('div')
    placeholderIcn.classList.add('ir__prop-object__placeholder-icn')
    placeholderIcn.innerHTML = '{&hellip;}'
    placeholderElement.append(placeholderText)
    placeholderElement.append(placeholderIcn)
    // -- DOM building
    propKeyNameElement.appendChild(keyNameColonElement)
    knameContentElement.appendChild(nameIcnElement)
    knameContentElement.appendChild(propKeyNameElement)
    knameContentElement.append(placeholderElement)
    nameElement.appendChild(knameContentElement)

    // Building: prop value
    objectValue.attachedElement.classList.add('ir__prop-object--nested')

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
    // const kNameBoxElement = findElementParentByClass(e.target, 'ir__prop-kname-box')
    const propElement = findElementParentByClass(e.target, 'ir__prop')
    const propKeyName = propElement.getAttribute('data-ir-prop-key')
    const prop = this._getPropByKey(propKeyName)
    prop.updateState('open', !prop.state.open)
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

  updateState(state, value) {
    const stateValue = this.state[state]
    if (this.state.hasOwnProperty(state) && stateValue !== value) {
      this.state[state] = value
      this._computeDOM()
    }
  }
}
