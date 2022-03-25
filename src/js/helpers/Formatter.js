// import { DateTime } from 'luxon'
import {
  NATIVE2STR_TYPES_MAP,
  NATIVESTR2STR_TYPES_MAP,
  NATIVE2NATIVESTR_TYPES_MAP,
} from '../constants.js'

export const formatComponentPath = (cPath, rev = false) => {
  if (!rev) {
    cPath = cPath.replace(/\//gi, '%')
    cPath = cPath.substr(0, cPath.indexOf('.vue'))
    return cPath
  } else {
    return `${cPath.replace(/%/gi, '/')}.vue`
  }
}

export const formatFromNativeType = (type) => {
  for (const [typeName, nativeType] of Object.entries(NATIVE2STR_TYPES_MAP)) {
    if (type === nativeType) {
      return typeName
    }
  }
  return undefined
}

export const formatFromNativeToNativeStrType = (type) => {
  for (const [typeName, nativeType] of Object.entries(NATIVE2NATIVESTR_TYPES_MAP)) {
    if (type === nativeType) {
      return typeName
    }
  }
  return undefined
}

export const formatFromNativeStrType = (type) => {
  for (const [typeName, nStrType] of Object.entries(NATIVESTR2STR_TYPES_MAP)) {
    if (type === nStrType) {
      return typeName
    }
  }
  return undefined
}

export const parsePrimitiveValue = (value, type) => {
  switch (type) {
    case 'null':
      return value
    case 'boolean':
      return Boolean(value)
    case 'string':
      return value
    case 'number':
      return parseInt(value)
    case 'date':
      const dt = 'DATE'//DateTime.fromISO(value)
      return dt.toISO()
  }
  return value
}

export const formatPrimitiveValueToCode = (value, type) => {
  switch (type) {
    case 'null':
      return `${value}`
    case 'string':
      return `"${value}"`
    case 'boolean':
    case 'number':
      return value.toString()
    case 'date':
      const dt = 'DATE'//DateTime.fromISO(value)
      return dt.toISO()
  }
  return value
}

export const convertPropObjectToFields = (obj) => {
  let fmtValue = []
  for (const [name, value] of Object.entries(obj)) {
    const isArray = Array.isArray(value)
    if (typeof value === 'object' && value !== null) { // "Complex" type (e.g. Object, Array)
      if (!isArray) { // - Object
        fmtValue.push({
          name,
          type: '$object',
          rawValue: value,
          value: convertPropObjectToFields(value),
        })
      } else { // - Array
        fmtValue.push({
          name,
          type: '$array',
          rawValue: value,
          value: convertPropArrayToFields(value),
        })
      }
    } else { // Primitive
      fmtValue.push({
        name,
        type: value !== null ? typeof value : 'null',
        rawValue: value,
        value: parsePrimitiveValue(value, typeof value),
      })
    }
  }
  return fmtValue
}

export const convertPropArrayToFields = (arr) => {
  let fmtValue = []
  for (const value of arr) {
    const isArray = Array.isArray(value)
    if (typeof value === 'object' && value !== null) { // "Complex" type (e.g. Object, Array)
      if (!isArray) { // - Object
        fmtValue.push({
          name: null,
          type: '$object',
          rawValue: value,
          value: convertPropObjectToFields(value),
        })
      } else { // - Array
        fmtValue.push({
          name: null,
          type: '$array',
          rawValue: value,
          value: convertPropArrayToFields(value),
        })
      }
    } else { // Primitive
      fmtValue.push({
        name: null,
        type: value !== null ? typeof value : 'null',
        rawValue: value,
        value: parsePrimitiveValue(value, typeof value),
      })
    }
  }
  return fmtValue
}
