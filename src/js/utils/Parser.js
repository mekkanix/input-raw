export default class Parser {
  static parsePrimitiveValueFromStr(value)  {
    const nType = typeof value
    if (nType !== 'object') {
      console.log(nType);
      switch (nType) {
        case 'string':
          return String(value)
        case 'number':
          return Number(value)
        case 'boolean':
          return Boolean(value)
      }
    }
  }
}
