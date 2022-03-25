import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'
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
  type = 'object'
  value = {}

  constructor() {
    this._initDOM()
  }

  _initDOM() {
    // Base
    this.attachedElement.classList.add('ir__prop-object')
    // Field (wrapper)
    const fieldWrapperElement = document.createElement('div')
    fieldWrapperElement.classList.add('ir__prop-object__field-wrapper')
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
    // fieldWrapperElement.appendChild(knameWrapperElement)
    this.attachedElement.appendChild(fieldWrapperElement)
    this.attachedElement.appendChild(rowActionsElement)
  }

  _updateDOM() {
    for (const [key, value] of Object.entries(this.value)) {
      const nestedElement = document.createElement('div')
      switch (typeof value.type) {
        case 'object':
          nestedElement.classList.add('ir__prop-subobject')
          nestedElement.appendChild(
            document.createElement('div')
              .classList.add('ir__prop__kname-box')
          )
          break
        case 'array':
          nestedElement.classList.add('ir__prop__kname-box')
          break
        case 'primitive':
          break
      }
      console.log(key, value);
    }
  }

  setProp(name, value) {
    this.value[name] = value
    this._updateDOM()
  }
}
