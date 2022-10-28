import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'
import {
  findElementParentByClass,
} from './helpers/DOM.js'

export default class PropToolbar {
  _actions = []
  _rootElement = null
  attachedElement = document.createElement('div')
  targetElement = null
  _hovering = false
  state = {
    initialized: false,
    editing: false,
    editable: false,
    errored: false,
    toObject: false,
    toArray: false,
  }

  constructor(rootElement) {
    this._initActions()
    this._initRootElement(rootElement)
    this._initDOM()
    this.computeDOM()
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

  _initRootElement(element) {
    this._rootElement = element
  }

  _initDOM() {
    // Base
    this.attachedElement.classList.add('ir__prop-toolbar')
    this.attachedElement.style.display = 'none'
    this.attachedElement.addEventListener('mouseover', (e) => {
      console.log('PT over');
      this._hovering = true
      // const pt = findElementParentByClass(e.target, 'ir__prop-toolbar')
      // this.setTargetElement(pt)
    })
    this.attachedElement.addEventListener('mouseout', (e) => {
      console.log(this._hovering, this.targetElement);
      // console.log(this.targetElement);
      // console.log(e.target.classList, e.target.classList.contains('ir__prop-toolbar'));
      // console.log(pt);
      // if (!e.target.classList.contains('ir__prop-toolbar') && !pt) {
      //   this._hovering = false
      //   console.log('PT out');
      // }
      // this._hovering = false
      // const pt = findElementParentByClass(e.target, 'ir__prop-toolbar')
      // if (!pt) {
      //   this.resetTargetElement()
      // }
    })
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
    this._rootElement.appendChild(this.attachedElement)
  }

  computeDOM() {
    // Base handlers
    const enabled = !!this.targetElement
    if (enabled) {
      this._handleEnabledState()
    } else {
      this._handleDisabledState()
    }
    // Actions
    for (const action of this._actions) {
      const enabled = action.enabled(this.state)
      action.attachedElement.style.display = enabled ? 'flex' : 'none'
    }
  }

  _handleEnabledState() {
    // -- Positioning
    const targetAbsPos = this.targetElement.getBoundingClientRect()
    const targetHeight = this.targetElement.clientHeight
    const targetWidth = this.targetElement.clientWidth
    const toolbarPosTop = targetAbsPos.y + targetHeight
    const toolbarPosLeft = targetAbsPos.x + targetWidth
    this.attachedElement.style.top = `${toolbarPosTop - 18}px`
    this.attachedElement.style.left = `${toolbarPosLeft - 2}px`
    this.attachedElement.style.display = 'block'
  }

  _handleDisabledState() {
    this.attachedElement.style.display = 'none'
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
    if (!element) {
      this._hovering = false
    }
    if (!this._hovering) {
      this.targetElement = element
      this.computeDOM()
    }
  }

  resetTargetElement() {
    this.targetElement = null
    this.computeDOM()
  }

  applyTargetElementReset() {
    // console.log(this._hovering);
    // if (!this._hovering) {
    //   this.targetElement = null
    //   this.computeDOM()
    // }
  }

  updateState(prop, value) {
    if (this.state.hasOwnProperty(prop)) {
      this.state[prop] = value
    }
    this.computeDOM()
  }
}
