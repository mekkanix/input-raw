export default class PropObject {
  attachedElement = document.createElement('div')

  constructor() {
    this._initDOM()
  }

  _initDOM() {
    // Base
    this.attachedElement.classList.add('ir__prop-object')
    // Field (wrapper)
    const fieldWrapperElement = document.createElement('div')
    fieldWrapperElement.classList.add('ir__prop-object__field-wrapper')
    // Keyname (wrapper)
    const knameWrapperElement = document.createElement('div')
    knameWrapperElement.classList.add('ir__prop-object__kname-wrapper')
    // Structure
    fieldWrapperElement.appendChild(knameWrapperElement)
    this.attachedElement.appendChild(fieldWrapperElement)
  }
}
