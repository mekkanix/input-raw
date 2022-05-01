import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'
import {
  findElementParentByClass,
} from './helpers/DOM.js'

export default class PropToolbar {
  _actions = []
  attachedElement = document.createElement('div')
  targetElement = null
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
    this.computeDOM()
  }

  _initDOM() {
    // Base
    this.attachedElement.classList.add('ir__prop-toolbar')
    this.attachedElement.style.display = 'none'
    // Actions
    const actionsElement = document.createElement('div')
    actionsElement.classList.add('ir__prop-toolbar__actions')
    this._actions.map(action => {
      const actionElement = document.createElement('div')
      actionElement.classList.add('ir__prop-toolbar__action')
      actionElement.classList.add(action.class)
      actionElement.addEventListener('click', action.eventHandler)
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
    // DOM mounting
    document.body.appendChild(this.attachedElement)
  }

  _initActions() {
    // Note: `s` stands for `state` in the following callbacks.
    const actions = [
      {
        name: 'edit',
        enabled: s => s.initialized && s.editable && !s.editing,
        class: 'edit',
        eventHandler: this._onEditClick,
        icon: 'edit',
      },
      {
        name: 'validate_edit',
        enabled: s => s.editable && s.editing && !s.errored,
        class: 'validate-edit',
        eventHandler: this._onValidateEditClick,
        icon: 'check',
      },
      {
        name: 'cancel_edit',
        enabled: s => s.editable && s.editing,
        class: 'cancel-edit',
        eventHandler: this._onCancelEditClick,
        icon: 'times',
      },
      {
        name: 'delete',
        enabled: s => s.initialized,
        class: 'delete',
        eventHandler: this._onDeleteClick,
        icon: 'trash',
      },
      {
        name: 'convert_to_object',
        enabled: s => s.initialized && s.toObject,
        class: 'convert2object',
        eventHandler: this._onConvertToObjectClick,
        text: '{}',
      },
      {
        name: 'convert_to_array',
        enabled: s => s.initialized && s.toArray,
        class: 'convert2array',
        eventHandler: this._onConvertToArrayClick,
        text: '[]',
      },
    ]
    this._actions = actions
  }

  // _computeActionsDOM() {
  //   for (const action of this._actions) {
  //     const enabled = action.enabled(this.state)
  //     action.attachedElement.style.display = enabled ? 'block' : 'none'
  //   }
  // }

  computeDOM() {
    // Prop toolbar
    const enabled = !!this.targetElement
    if (enabled) {
      console.log('----------------');
      console.log(this.targetElement);
      const targetAbsPos = this.targetElement.getBoundingClientRect()
      const targetHeight = this.targetElement.clientHeight
      const targetWidth = this.targetElement.clientWidth
      const toolbarPosTop = targetAbsPos.y + targetHeight
      const toolbarPosLeft = targetAbsPos.x + targetWidth
      this.attachedElement.style.top = `${toolbarPosTop - 18}px`
      this.attachedElement.style.left = `${toolbarPosLeft + 2}px`
      // console.log(findElementParentByClass(this.targetElement, 'ir__prop-kname__content'));
      // console.log(this.targetElement.clientWidth);
      // console.log(this.targetElement.getBoundingClientRect());
    }
    this.attachedElement.style.display = enabled ? 'block' : 'none'
    // Actions
    for (const action of this._actions) {
      const enabled = action.enabled(this.state)
      action.attachedElement.style.display = enabled ? 'block' : 'none'
    }
  }

  _onEditClick(e) {
    console.log(e);
  }

  _onValidateEditClick(e) {
    console.log(e);
  }

  _onCancelEditClick(e) {
    console.log(e);
  }

  _onDeleteClick(e) {
    console.log(e);
  }

  _onConvertToObjectClick(e) {
    console.log(e);
  }

  _onConvertToArrayClick(e) {
    console.log(e);
  }

  setTargetElement(element) {
    this.targetElement = element
    this.computeDOM()
  }

  resetTargetElement() {
    this.targetElement = null
    this.computeDOM()
  }

  updateState(prop, value) {
    if (this.state.hasOwnProperty(prop)) {
      this.state[prop] = value
    }
    this.computeDOM()
  }
}
