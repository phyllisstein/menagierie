import { FunctionComponent, memo } from 'react'
import R from 'ramda'
import { Root } from './scene-styles'

const createTransformString = R.pipe(
  R.toPairs,
  R.filter(
    ([key]) =>
      key.includes('scale') ||
      key.includes('translate') ||
      key.includes('rotate'),
  ),
  R.map(([kind, amount]) => {
    if (kind.includes('translate')) {
      return `${ kind }(${ amount }px)`
    }

    if (kind.includes('rotate')) {
      return `${ kind }(${ amount }deg)`
    }

    return `${ kind }(${ amount })`
  }),
  R.prepend('translate3d(-50%, -50%, 0px)'),
  R.join(' '),
)

export interface Props {
  relative?: boolean
  rotate?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  translate?: number
  translateX?: number
  translateY?: number
  translateZ?: number
}

export const Scene: FunctionComponent<Props> = function Scene (props) {
  const {
    children,
    relative: _relative,
    rotate: _rotate,
    rotateX: _rotateX,
    rotateY: _rotateY,
    rotateZ: _rotateZ,
    scale: _scale,
    scaleX: _scaleX,
    scaleY: _scaleY,
    style: styleProp = {},
    translate: _translate,
    translateX: _translateX,
    translateY: _translateY,
    translateZ: _translateZ,
    ...rest
  } = props

  const transform = createTransformString(props)
  const style = { ...styleProp, transform }

  return (
    <Root { ...rest } style={ style }>
      { children }
    </Root>
  )
}
