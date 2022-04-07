import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'
import {
  findElementChildByClass,
  findElementParentByClass,
} from './helpers/DOM.js'

export default class PropArray {
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
  propType = 'array'
  $value = []
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
    this.attachedElement.classList.add('ir__prop-array')
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
    // Row actions
    const rowActionsElement = document.createElement('div')
    rowActionsElement.classList.add('ir__prop__row-actions')
    for (const rowAction of this._rowActions) {
      const rowActionElement = document.createElement('div')
      rowActionElement.classList.add('ir__prop__row-action')
      rowActionElement.classList.add('ir__prop__action')
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
    for (const [i, childPropValue] of this.$value.entries()) {
      if (!this._hasDOMPropIdx(i)) {
        let childPropElement = null
        switch (childPropValue.propType) {
          case 'object':
              childPropElement = this._generateDOMPartObjectProp(i, childPropValue)
              if (childPropValue.state.open) {
                childPropElement.classList.add('ir__prop--open')
              }
            break
          case 'array':
              childPropElement = this._generateDOMPartArrayProp(i, childPropValue)
              if (childPropValue.state.open) {
                childPropElement.classList.add('ir__prop--open')
              }
            break
          case 'primitive':
              childPropElement = this._generateDOMPartPrimitiveProp(i, childPropValue)
            break
        }
        childPropElement.classList.add('ir__prop')
        childPropElement.setAttribute('data-ir-prop-idx', i)
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

  _hasDOMPropIdx(key) {
    for (const element of this._propWrapperElement.children) {
      const propKey = element.getAttribute('data-ir-prop-idx')
      if (propKey === key.toString()) {
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

  _generateDOMPartObjectProp(index, objectValue) {
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
    const keyIcnElement = document.createElement('div')
    keyIcnElement.classList.add('ir__prop-kname__icn')
    const icn = icon({ prefix: 'fas', iconName: 'caret-right', })
    const icnHTML = toHtml(icn.abstract[0])
    keyIcnElement.innerHTML = icnHTML
    // -- Text
    const propKeyIdxElement = document.createElement('div')
    propKeyIdxElement.classList.add('ir__prop-kname__idx')
    propKeyIdxElement.innerHTML = index
    const idxColonElement = document.createElement('div')
    idxColonElement.classList.add('ir__prop-kname__colon')
    idxColonElement.innerHTML = ':'
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
    knameContentElement.appendChild(propKeyIdxElement)
    knameContentElement.appendChild(idxColonElement)
    knameContentElement.appendChild(keyIcnElement)
    knameContentElement.append(placeholderElement)
    nameElement.appendChild(knameContentElement)

    // Building: prop value
    objectValue.attachedElement.classList.add('ir__prop-array--nested')

    // Main DOM building
    element.appendChild(nameElement)
    element.appendChild(objectValue.attachedElement)
    return element
  }

  _generateDOMPartArrayProp(index, arrayValue) {
    // Building: main wrapper
    const element = document.createElement('div')
    element.classList.add('ir__prop-subarray')

    // Building: prop key
    const nameElement = document.createElement('div')
    nameElement.classList.add('ir__prop-kname-box')
    nameElement.addEventListener('click', this._onKNameBoxClick.bind(this))
    const knameContentElement = document.createElement('div')
    knameContentElement.classList.add('ir__prop-kname__content')
    // -- Icon
    const keyIcnElement = document.createElement('div')
    keyIcnElement.classList.add('ir__prop-kname__icn')
    const icn = icon({ prefix: 'fas', iconName: 'caret-right', })
    const icnHTML = toHtml(icn.abstract[0])
    keyIcnElement.innerHTML = icnHTML
    // -- Text
    const propKeyIdxElement = document.createElement('div')
    propKeyIdxElement.classList.add('ir__prop-kname__idx')
    propKeyIdxElement.innerHTML = index
    const idxColonElement = document.createElement('div')
    idxColonElement.classList.add('ir__prop-kname__colon')
    idxColonElement.innerHTML = ':'
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
    knameContentElement.appendChild(propKeyIdxElement)
    knameContentElement.appendChild(idxColonElement)
    knameContentElement.appendChild(keyIcnElement)
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
    // Building: prop index
    const kNameBoxElement = document.createElement('div')
    kNameBoxElement.classList.add('ir__prop-kname-box')
    const keyNameContentElement = document.createElement('div')
    keyNameContentElement.classList.add('ir__prop-kname__content')
    const idxElement = document.createElement('div')
    idxElement.classList.add('ir__prop-kname__idx')
    idxElement.innerHTML = key
    const idxColonElement = document.createElement('div')
    idxColonElement.classList.add('ir__prop-kname__colon')
    idxColonElement.innerHTML = ':'
    keyNameContentElement.append(idxElement)
    keyNameContentElement.append(idxColonElement)
    kNameBoxElement.append(keyNameContentElement)
    // nameElement.appendChild(keyNameColonElement)
    // Building: prop value
    const valueElement = document.createElement('div')
    valueElement.classList.add('ir__prop-value')
    valueElement.appendChild(primitiveValue.attachedElement)
    // Main DOM building
    element.appendChild(kNameBoxElement)
    element.appendChild(valueElement)
    return element
  }

  _onKNameBoxClick(e) {
    // const kNameBoxElement = findElementParentByClass(e.target, 'ir__prop-kname-box')
    const propElement = findElementParentByClass(e.target, 'ir__prop')
    const propKeyName = propElement.getAttribute('data-ir-prop-idx')
    const prop = this._getPropByKey(propKeyName)
    prop.updateState('open', !prop.state.open)
  }

  addProp(value) {
    this.$value.push(value)
    this._computeDOM()
  }

  updateState(state, value) {
    const stateValue = this.state[state]
    if (this.state.hasOwnProperty(state) && stateValue !== value) {
      this.state[state] = value
      this._computeDOM()
    }
  }

  setPlaceholderElement(element) {
    this._placeholderElement = element || null
  }
}
