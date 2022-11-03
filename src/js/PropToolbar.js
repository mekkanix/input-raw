import {
  icon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core'
import {
  findElementParentByClass,
  getElementOffsetFromParent,
} from './helpers/DOM.js'

export default class PropToolbar {
  _actions = []
  _rootElement = null
  attachedElement = document.createElement('div')
  _targetPropName = null
  _targetCallback = null
  _targetScope = null
  targetElement = null
  isActive = false
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
        eventHandler: this._onEditClick.bind(this),
        icon: 'edit',
      },
      {
        name: 'validate_edit',
        enabled: s => s.editable && s.editing && !s.errored,
        class: 'validate-edit',
        eventHandler: this._onValidateEditClick.bind(this),
        icon: 'check',
      },
      {
        name: 'cancel_edit',
        enabled: s => s.editable && s.editing,
        class: 'cancel-edit',
        eventHandler: this._onCancelEditClick.bind(this),
        icon: 'times',
      },
      {
        name: 'delete',
        enabled: s => s.initialized,
        class: 'delete',
        eventHandler: this._onDeleteClick.bind(this),
        icon: 'trash',
      },
      // TODO: Later.
      // {
      //   name: 'convert_to_object',
      //   enabled: s => s.initialized && s.toObject,
      //   class: 'convert2object',
      //   eventHandler: this._onConvertToObjectClick.bind(this),
      //   text: '{}',
      // },
      // {
      //   name: 'convert_to_array',
      //   enabled: s => s.initialized && s.toArray,
      //   class: 'convert2array',
      //   eventHandler: this._onConvertToArrayClick.bind(this),
      //   text: '[]',
      // },
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
    // Actions
    const actionsElement = document.createElement('div')
    actionsElement.classList.add('ir__prop-toolbar__actions')
    this._actions.map(action => {
      const actionBoxElement = document.createElement('div')
      actionBoxElement.classList.add('ir__prop-toolbar__action__box')
      actionBoxElement.classList.add(action.class)
      const actionElement = document.createElement('div')
      actionElement.classList.add('ir__prop-toolbar__action')
      actionElement.addEventListener('click', action.eventHandler)
      let icnHTML = null
      if (action.icon) {
        const icn = icon({ prefix: 'fas', iconName: action.icon, })
        icnHTML = toHtml(icn.abstract[0])
      } else if (action.text) {
        icnHTML = action.text
      }
      actionElement.innerHTML = icnHTML
      action.attachedElement = actionBoxElement
      actionBoxElement.appendChild(actionElement)
      actionsElement.appendChild(actionBoxElement)
    })
    this.attachedElement.appendChild(actionsElement)
    // DOM mounting
    this._rootElement.appendChild(this.attachedElement)
    // Events
    this.attachedElement.addEventListener(
      'mouseover',
      this._onMouseOver.bind(this)
    )
    // Note: Pseudo-"mouseout" is managed by listening to & checking
    // for PT on all `body`-related "mouseover" events' targets.
    // It's far more simple to manage than listening to real "mouseout"
    // events and recursively checking events' propagations related
    // to the PT element.
    document.body.addEventListener(
      'mouseover',
      this._onMouseOut.bind(this)
    )
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
    // Positioning
    const offset = getElementOffsetFromParent(this.targetElement, 'ir-root')
    const targetWidth = this.targetElement.clientWidth
    this.attachedElement.style.left = `${offset.x + targetWidth - 2}px`
    this.attachedElement.style.top = `${offset.y - 1}px`
    // States
    this.attachedElement.style.display = 'block'
  }

  _handleDisabledState() {
    if (!this.isActive) {
      this.attachedElement.style.display = 'none'
    }
  }

  _onMouseOver(_) {
    this.isActive = true
  }

  _onMouseOut(e) {
    const isHovering = findElementParentByClass(e.target, 'ir__prop-toolbar')
    if (!this.targetElement && !isHovering) {
      this.isActive = false
      this.computeDOM()
    }
  }

  /**
   * Buttons' handlers
   */

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
    const cb = this._targetCallback
    if (this._targetScope && cb && typeof cb === 'function') {
      // Clean removal of raw property (array, object)
      if (Array.isArray(this._targetScope)) {
        const idx = parseInt(this._targetPropName)
        this._targetScope.splice(idx, 1)
      } else if (typeof this._targetScope === 'object') {
        delete this._targetScope[this._targetPropName]
      }
      // By-prop callback
      this._targetCallback('delete', this._targetPropName)
      // Reset internal `targetElement`-related data
      // this._targetScope = null
      // this._targetCallback = null
      // Reset local DOM
      this.isActive = false
      this.computeDOM()
    }
  }

  // _onConvertToObjectClick(e) {
  //   console.log(e);
  // }

  // _onConvertToArrayClick(e) {
  //   console.log(e);
  // }

  setTarget(scope, propName, element, actionCallback) {
    this._targetScope = scope
    this._targetPropName = propName
    this._targetCallback = actionCallback
    this.targetElement = element
    this.isActive = true
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
