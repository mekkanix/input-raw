import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'

export default class PropPrimitive {
  attachedElement = document.createElement('div')
  type = 'primitive'
  value = null

  constructor(value) {
    this.value = value
    this._initDOM()
  }

  _initDOM() {
    // Base
    this.attachedElement.classList.add('ir__primitive-value')
  }

  setValue(value) {
    this.value = value
  }
}
