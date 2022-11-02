import InputRaw from './src/js/InputRaw.js'
import './src/sass/main.sass'

const getFormattedConfig = (config) => {
  return {}
}

// Entrypoint (lib. interface)

// let inputRaw = null
function InputRawLib(selector, config = null) {
  let initError = false
  let selectorAsConfig = false
  let inputRaw = null
  if (typeof selector === 'object' && !config) {
    selectorAsConfig = true
    if (typeof selector !== 'object') {
      console.error('[InputRaw] You must specify a configuration object.')
      initError = true
      return
    }
  } else {
    if (typeof selector !== 'string') {
      console.error('[InputRaw] The provided element selector is not of type "string".')
      initError = true
      return
    }
    if (typeof config !== 'object') {
      console.error('[InputRaw] You must specify a valid configuration object.')
      initError = true
      return
    }
  }
  // Valid configuration
  if (!initError) {
    const autoMount = !selectorAsConfig
    const computedConf = selectorAsConfig ? selector : config
    const computedSelector = !selectorAsConfig ? selector : null
    const formattedConf = getFormattedConfig(computedConf)
    inputRaw = new InputRaw(
      computedSelector,
      formattedConf,
      autoMount
    )
  }

  // Public API

  // WARNING: To avoid performance issues when the user creates a big
  // amount of IR instances, only the last IR instance created is
  // stored in the `inputRaw` local var., by replacing the old one(s),
  // meaning that Public API's methods & props can only interact with
  // the last created IR instance.

  InputRawLib.mount = (selector) => {
    inputRaw.init(selector)
  }

  return InputRawLib
}

// Public API

// InputRawLib.mount = function(selector) {
//   inputRaw.init(selector)
// }

export default InputRawLib
