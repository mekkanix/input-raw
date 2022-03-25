/**
 * Types ------------------------------------------
 */

// [input] Native
// [output] Str
export const NATIVE2STR_TYPES_MAP = {
  boolean: Boolean,
  text: String,
  number: Number,
  date: Date,
  $object: Object,
  $array: Array,
}
// [input] Native
// [output] HTML-Form Str
export const NATIVE2HTML_FORM_TYPES_MAP = {
  checkbox: Boolean,
  text: String,
  number: Number,
  date: Date,
  $object: Object,
  $array: Array,
}
// [input] Native
// [output] Native Str
export const NATIVE2NATIVESTR_TYPES_MAP = {
  boolean: Boolean,
  string: String,
  number: Number,
  date: Date,
  object: Object,
  array: Array,
}
// [input] Native Str
// [output] Str
export const NATIVESTR2STR_TYPES_MAP = {
  boolean: 'boolean',
  string: 'string',
  number: 'number',
  date: 'date',
  $object: 'object',
  $array: 'array',
}
