export default class PropToolbar {
  attachedElement = document.createElement('div')

  constructor() {
    this.attachedElement.classList.add('input-raw__prop-toolbar')
    const actionsElement = document.createElement('div')
    actionsElement.classList.add('input-raw__prop-toolbar__actions')
    this.attachedElement.appendChild(actionsElement)
  }
}
