import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'

export default class PropToolbar {
  _actions = []
  attachedElement = document.createElement('div')
  state = {
    initialized: false,
    editing: false,
    editable: false,
    errored: false,
    toObject: false,
    toArray: false,
  }

  constructor() {
    this.computeActions()
    this._generateDOM()
  }

  computeActions() {
    const state = this.state
    const actions = [
      {
        name: 'edit',
        enabled: state.initialized && state.editable && !state.editing,
        class: 'edit',
        handler: this.onEditClick,
        icon: 'edit',
      },
      {
        name: 'validate_edit',
        enabled: state.editable && state.editing && !state.errored,
        class: 'validate-edit',
        handler: this.onValidateEditClick,
        icon: 'check',
      },
      {
        name: 'cancel_edit',
        enabled: state.editable && state.editing,
        class: 'cancel-edit',
        handler: this.onCancelEditClick,
        icon: 'times',
      },
      {
        name: 'delete',
        enabled: state.initialized,
        class: 'delete',
        handler: this.onDeleteClick,
        icon: 'trash',
      },
      {
        name: 'convert_to_object',
        enabled: state.initialized && state.toObject,
        class: 'convert2object',
        handler: this.onConvertToObjectClick,
        text: '{}',
      },
      {
        name: 'convert_to_array',
        enabled: state.initialized && state.toArray,
        class: 'convert2array',
        handler: this.onConvertToArrayClick,
        text: '[]',
      },
    ]
    this._actions = actions
  }

  updateState(prop, value) {
    if (this.state.hasOwnProperty(prop)) {
      this.state[prop] = value
    }
    this.computeActions()
    this._generateDOM()
  }

  _generateDOM() {
    this.attachedElement.classList.add('ir__prop-toolbar')
    // Actions management
    const actionsElement = document.createElement('div')
    actionsElement.classList.add('ir__prop-toolbar__actions')
    for (const action of this._actions) {
      const actionElement = document.createElement('div')
      actionElement.classList.add('ir__prop-toolbar__action')
      actionElement.classList.add(action.class)
      actionElement.addEventListener('click', action.handler)
      let icnHTML = null
      if (action.icon) {
        const icn = icon({ prefix: 'fas', iconName: action.icon, })
        icnHTML = toHtml(icn.abstract[0])
      } else if (action.text) {
        icnHTML = action.text
      }
      actionElement.innerHTML = icnHTML
      actionsElement.appendChild(actionElement)
    }
    //
    this.attachedElement.appendChild(actionsElement)
  }

  onEditClick(e) {
    console.log(e);
  }

  onValidateEditClick(e) {

  }

  onCancelEditClick(e) {

  }

  onDeleteClick(e) {

  }

  onConvertToObjectClick(e) {

  }

  onConvertToArrayClick(e) {

  }
}
