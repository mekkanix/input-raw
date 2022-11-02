export const getElementChildByPropKey = (element, key) => {
  for (const child of element.children) {
    const childAttrValue = child.getAttribute('data-ir-prop-key')
    if (childAttrValue && childAttrValue === key) {
      return child
    }
  }
  return null
}

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
