import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'
import {
  findElementParentByClass,
  findElementChildByAttr,
} from './helpers/DOM.js'

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
  _propToolbar = null
  _editedProp = {
    name: null,
    value: null,
    element: null,
    tmpNameElement: null,
    tmpValueElement: null,
    nameInputElement: null,
    valueInputElement: null,
  }
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

  constructor(propToolbar, value = null) {
    this._propToolbar = propToolbar
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
    const placeholderText = document.createElement('div')
    placeholderText.classList.add('ir__prop__placeholder-text')
    placeholderText.innerHTML = 'Object'
    const placeholderIcn = document.createElement('div')
    placeholderIcn.classList.add('ir__prop__placeholder-icn')
    placeholderIcn.innerHTML = '{&hellip;}'
    this._blankValueElement = document.createElement('div')
    this._blankValueElement.classList.add('ir__prop__blank')
    this._blankValueElement.innerHTML = '(empty)'
    // Main DOM building
    this.attachedElement.appendChild(this._propWrapperElement)
  }

  _computeDOM() {
    // Processing: parent element
    if (!this._propParentElement) {
      this._propParentElement = findElementParentByClass(this.attachedElement, 'ir__prop')
    }
    // Processing: pending DOM actions (delete)
    for (const element of this._propWrapperElement.children) {
      const pendingAction = element.getAttribute('data-ir-action')
      if (pendingAction) {
        if (pendingAction === 'delete') {
          element.remove()
        }
      }
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
    // Processing: "editing" state
    const nameElement = this._editedProp.tmpNameElement
    const valueElement = this._editedProp.tmpValueElement
    const nameInput = this._editedProp.nameInputElement
    const valueInput = this._editedProp.valueInputElement
    if (this.state.editing) {
      if (!document.body.contains(nameInput)) {
        nameElement.innerHTML = ''
        nameElement.appendChild(nameInput)
      }
      if (!document.body.contains(valueInput)) {
        valueElement.innerHTML = ''
        valueElement.appendChild(valueInput)
      }
    } else {
      const propElement = this._editedProp.element
      if (propElement) {
        const pendingAction = propElement.getAttribute('data-ir-action')
        if (pendingAction === 'cancel_edit') {
          if (document.body.contains(nameInput)) {
            nameInput.remove()
            nameElement.innerText = this._editedProp.name
          }
          if (document.body.contains(valueInput)) {
            valueInput.remove()
            valueElement.innerText = this._editedProp.value
          }
        }
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

  _getDOMPropKeyElement(key) {
    for (const element of this._propWrapperElement.children) {
      const propKey = element.getAttribute('data-ir-prop-key')
      if (propKey === key) {
        return element
      }
    }
    return null
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
    // -- Events
    nameElement.addEventListener(
      'click',
      this._onPropBoxClick.bind(this)
    )
    nameElement.addEventListener(
      'mouseover',
      this._onPropBoxMouseOver.bind(this)
    )
    nameElement.addEventListener(
      'mouseout',
      this._onPropBoxMouseOut.bind(this)
    )
    const knameContentElement = document.createElement('div')
    knameContentElement.classList.add('ir__prop-content')
    // -- Icon
    const icnCaretElement = document.createElement('div')
    icnCaretElement.classList.add('ir__prop-kname__icn')
    const icn = icon({ prefix: 'fas', iconName: 'caret-right', })
    const icnHTML = toHtml(icn.abstract[0])
    icnCaretElement.innerHTML = icnHTML
    // -- Text
    const propKeyNameElement = document.createElement('div')
    propKeyNameElement.classList.add('ir__prop-kname')
    const nameBoxElement = document.createElement('div')
    nameBoxElement.setAttribute('data-ir-pph-name', '')
    nameBoxElement.classList.add('ir__prop-kname-box')
    nameBoxElement.innerHTML = key
    propKeyNameElement.appendChild(nameBoxElement)
    const keyNameColonElement = document.createElement('div')
    keyNameColonElement.classList.add('ir__prop-kname__colon')
    keyNameColonElement.innerHTML = ':'
    // -- Placeholder
    const placeholderElement = document.createElement('div')
    placeholderElement.classList.add('ir__prop__placeholder')
    const placeholderText = document.createElement('div')
    placeholderText.classList.add('ir__prop__placeholder-text')
    placeholderText.innerHTML = 'Object'
    const placeholderIcn = document.createElement('div')
    placeholderIcn.classList.add('ir__prop__placeholder-icn')
    placeholderIcn.innerHTML = '{&hellip;}'
    placeholderElement.append(placeholderText)
    placeholderElement.append(placeholderIcn)
    objectValue.setPlaceholderElement(placeholderElement)
    // -- DOM building
    propKeyNameElement.appendChild(keyNameColonElement)
    knameContentElement.appendChild(propKeyNameElement)
    knameContentElement.appendChild(icnCaretElement)
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
    // Building: main wrapper
    const element = document.createElement('div')
    element.classList.add('ir__prop-subarray')

    // Building: prop key
    const nameElement = document.createElement('div')
    nameElement.classList.add('ir__prop-kname-box')
    // -- Events
    nameElement.addEventListener(
      'click',
      this._onPropBoxClick.bind(this)
    )
    nameElement.addEventListener(
      'mouseover',
      this._onPropBoxMouseOver.bind(this)
    )
    nameElement.addEventListener(
      'mouseout',
      this._onPropBoxMouseOut.bind(this)
    )
    const knameContentElement = document.createElement('div')
    knameContentElement.classList.add('ir__prop-content')
    // -- Icon
    const icnCaretElement = document.createElement('div')
    icnCaretElement.classList.add('ir__prop-kname__icn')
    const icn = icon({ prefix: 'fas', iconName: 'caret-right', })
    const icnHTML = toHtml(icn.abstract[0])
    icnCaretElement.innerHTML = icnHTML
    // -- Text
    const propKeyNameElement = document.createElement('div')
    propKeyNameElement.classList.add('ir__prop-kname')
    const nameBoxElement = document.createElement('div')
    nameBoxElement.setAttribute('data-ir-pph-name', '')
    nameBoxElement.classList.add('ir__prop-kname-box')
    nameBoxElement.innerHTML = key
    propKeyNameElement.appendChild(nameBoxElement)
    const keyNameColonElement = document.createElement('div')
    keyNameColonElement.classList.add('ir__prop-kname__colon')
    keyNameColonElement.innerHTML = ':'
    // -- Placeholder
    const placeholderElement = document.createElement('div')
    placeholderElement.classList.add('ir__prop__placeholder')
    const placeholderText = document.createElement('div')
    placeholderText.classList.add('ir__prop__placeholder-text')
    placeholderText.innerHTML = 'Array'
    const placeholderIcn = document.createElement('div')
    placeholderIcn.classList.add('ir__prop__placeholder-icn')
    placeholderIcn.innerHTML = '[&hellip;]'
    placeholderElement.append(placeholderText)
    placeholderElement.append(placeholderIcn)
    arrayValue.setPlaceholderElement(placeholderElement)
    // -- DOM building
    propKeyNameElement.appendChild(keyNameColonElement)
    knameContentElement.appendChild(propKeyNameElement)
    knameContentElement.appendChild(icnCaretElement)
    knameContentElement.append(placeholderElement)
    nameElement.appendChild(knameContentElement)

    // Building: prop value
    arrayValue.attachedElement.classList.add('ir__prop-array--nested')

    // Main DOM building
    element.appendChild(nameElement)
    element.appendChild(arrayValue.attachedElement)
    return element
  }

  _generateDOMPartPrimitiveProp(key, primitiveValue) {
    // Building: prop "box"
    const element = document.createElement('div')
    element.classList.add('ir__prop-primitive')
    const boxElement = document.createElement('div')
    boxElement.classList.add('ir__prop-box')
    const contentElement = document.createElement('div')
    contentElement.classList.add('ir__prop-content')
    // Events
    boxElement.addEventListener(
      'mouseover',
      this._onPropBoxMouseOver.bind(this)
    )
    boxElement.addEventListener(
      'mouseout',
      this._onPropBoxMouseOut.bind(this)
    )
    // Building: prop key
    const nameElement = document.createElement('div')
    nameElement.classList.add('ir__prop-name')
    const nameBoxElement = document.createElement('div')
    nameBoxElement.setAttribute('data-ir-pph-name', '')
    nameBoxElement.classList.add('ir__prop-kname-box')
    nameBoxElement.innerHTML = key
    nameElement.appendChild(nameBoxElement)
    const keyNameColonElement = document.createElement('div')
    keyNameColonElement.classList.add('ir__prop-kname__colon')
    keyNameColonElement.innerHTML = ':'
    nameElement.appendChild(keyNameColonElement)
    // Building: prop value
    const valueElement = document.createElement('div')
    valueElement.classList.add('ir__prop-value')
    valueElement.appendChild(primitiveValue.attachedElement)
    // Main DOM building
    contentElement.appendChild(nameElement)
    contentElement.appendChild(valueElement)
    boxElement.appendChild(contentElement)
    element.appendChild(boxElement)
    return element
  }

  _propToolbarActionCallback(actionType, propName) {
    const element = this._getDOMPropKeyElement(propName)
    element.setAttribute('data-ir-action', actionType)
    this._computeDOM()
  }

  _onPropBoxClick(e) {
    const propElement = findElementParentByClass(e.target, 'ir__prop')
    const propKeyName = propElement.getAttribute('data-ir-prop-key')
    const prop = this._getPropByKey(propKeyName)
    prop.updateState('open', !prop.state.open)
    this._propToolbar.computeDOM()
  }

  _onPropBoxMouseOver(e) {
    const propContentElement = findElementParentByClass(
      e.target,
      'ir__prop-content',
    )
    const propElement = findElementParentByClass(
      e.target,
      'ir__prop',
    )
    const propName = propElement.getAttribute('data-ir-prop-key')
    this._propToolbar.setTarget(
      this,
      propName,
      propContentElement,
      this._propToolbarActionCallback.bind(this),
    )
  }

  _onPropBoxMouseOut(_) {
    this._propToolbar.resetTargetElement()
  }

  _onPropInputKeyDown(_) {
    console.log('ok');
  }

  enablePropEditMode(propName) {
    if (this.$value.hasOwnProperty(propName)) {
      const propElement = findElementChildByAttr(
        this._propWrapperElement,
        'data-ir-prop-key',
        propName,
      )
      this._editedProp.tmpNameElement = findElementChildByAttr(
        propElement,
        'data-ir-pph-name',
      )
      this._editedProp.tmpValueElement = findElementChildByAttr(
        propElement,
        'data-ir-pph-value',
      )
      const nameElement = this._editedProp.tmpNameElement
      const valueElement = this._editedProp.tmpValueElement
      this._editedProp.name = propName
      this._editedProp.value = valueElement.innerText
      this._editedProp.element = propElement
      const nameInput = document.createElement('input')
      const valueInput = document.createElement('input')
      nameInput.setAttribute('type', 'text')
      nameInput.setAttribute('value', nameElement.innerText)
      nameInput.style.width = `${nameElement.clientWidth}px`
      nameInput.addEventListener(
        'keyup',
        this._onPropInputKeyDown.bind(this),
      )
      valueInput.setAttribute('type', 'text')
      valueInput.setAttribute('value', this._editedProp.value)
      valueInput.style.width = `${valueElement.clientWidth}px`
      this._editedProp.nameInputElement = nameInput
      this._editedProp.valueInputElement = valueInput
      this.updateState('editing', true)
    }
  }

  cancelPropEditMode(propName) {
    if (this.$value.hasOwnProperty(propName)) {
      this.updateState('editing', false)
      // this._editedProp.name = null
      // this._editedProp.element = null
      // this._editedProp.nameInputElement = null
      // this._editedProp.valueInputElement = null
      // this._editedProp.tmpNameElement = null
      // this._editedProp.tmpValueElement = null
    }
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

  updateState(state, value, compute = true) {
    if (this.state.hasOwnProperty(state)) {
      this.state[state] = value
    }
    if (compute) {
      this._computeDOM()
    }
  }

  setPlaceholderElement(element) {
    this._placeholderElement = element || null
  }
}
