/**
 * Find-by: Custom attribute
 * Deprecated (-> findElementChildByAttr).
 */

export const getElementChildByPropKey = (element, key) => {
  for (const child of element.children) {
    const childAttrValue = child.getAttribute('data-ir-prop-key')
    if (childAttrValue && childAttrValue === key) {
      return child
    }
  }
  return null
}

/**
 * Find-by: CSS class
 */

export const getElementChildByClass = (element, cssClass) => {
  for (const child of element.children) {
    if (child.classList.contains(cssClass)) {
      return child
    }
  }
  return null
}

export const findElementChildByClass = (element, cssClass) => {
  for (const child of element.children) {
    if (child.classList.contains(cssClass)) {
      return child
    } else {
      return findElementChildByClass(child, cssClass)
    }
  }
  return null
}

export const findElementParentByClass = (element, cssClass) => {
  if (!element || element.classList.contains(cssClass)) {
    return element
  } else if (element.parentElement) {
    return findElementParentByClass(element.parentElement, cssClass)
  }
  return null
}

/**
 * Find-by: Attr
 */
export const findElementChildByAttr = (element, name, val = null) => {
  for (const child of element.children) {
    const hasAttrWithVal = val && child.getAttribute(name) == val
    const hasAttrWithoutVal = val == null && child.hasAttribute(name)
    if (hasAttrWithoutVal || hasAttrWithVal) {
      return child
    } else {
      const nestedChild = findElementChildByAttr(child, name, val)
      if (nestedChild) {
        return nestedChild
      }
    }
  }
  return null
}

export const getElementOffsetFromParent = (element, cssClass) => {
  if (!findElementParentByClass(element, cssClass)) {
    return null
  }
  const parent = element.parentElement
  let offset = {
    x: element.offsetLeft,
    y: element.offsetTop,
  }
  if (parent && !parent.classList.contains(cssClass)) {
    const parentOffset = getElementOffsetFromParent(parent, cssClass)
    offset.x += parentOffset.x
    offset.y += parentOffset.y
  }
  return offset
}
