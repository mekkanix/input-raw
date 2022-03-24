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
    this._initActions()
    this._initDOM()
    this._updateDOMFromActions()
  }

  _initDOM() {
    console.log(this._actions);
    // Base
    this.attachedElement.classList.add('ir__prop-toolbar')
    // Actions
    const actionsElement = document.createElement('div')
    actionsElement.classList.add('ir__prop-toolbar__actions')
    this._actions.map(action => {
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
      action.attachedElement = actionElement
      actionsElement.appendChild(actionElement)
    })
    this.attachedElement.appendChild(actionsElement)
  }

  _initActions() {
    // Note: `s` stands for `state` in following callbacks.
    const actions = [
      {
        name: 'edit',
        enabled: s => s.initialized && s.editable && !s.editing,
        class: 'edit',
        handler: this.onEditClick,
        icon: 'edit',
      },
      {
        name: 'validate_edit',
        enabled: s => s.editable && s.editing && !s.errored,
        class: 'validate-edit',
        handler: this.onValidateEditClick,
        icon: 'check',
      },
      {
        name: 'cancel_edit',
        enabled: s => s.editable && s.editing,
        class: 'cancel-edit',
        handler: this.onCancelEditClick,
        icon: 'times',
      },
      {
        name: 'delete',
        enabled: s => s.initialized,
        class: 'delete',
        handler: this.onDeleteClick,
        icon: 'trash',
      },
      {
        name: 'convert_to_object',
        enabled: s => s.initialized && s.toObject,
        class: 'convert2object',
        handler: this.onConvertToObjectClick,
        text: '{}',
      },
      {
        name: 'convert_to_array',
        enabled: s => s.initialized && s.toArray,
        class: 'convert2array',
        handler: this.onConvertToArrayClick,
        text: '[]',
      },
    ]
    this._actions = actions
  }

  _updateDOMFromActions() {
    for (const action of this._actions) {
      const enabled = action.enabled(this.state)
      action.attachedElement.style.display = enabled ? 'block' : 'none'
    }
  }

  updateState(prop, value) {
    if (this.state.hasOwnProperty(prop)) {
      this.state[prop] = value
    }
    this._updateDOMFromActions()
  }

  onEditClick(e) {
    console.log(e);
  }

  onValidateEditClick(e) {
    console.log(e);
  }

  onCancelEditClick(e) {
    console.log(e);
  }

  onDeleteClick(e) {
    console.log(e);
  }

  onConvertToObjectClick(e) {
    console.log(e);
  }

  onConvertToArrayClick(e) {
    console.log(e);
  }
}
