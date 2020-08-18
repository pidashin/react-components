import React, { useRef } from 'react'
import styles from './index.module.scss'
import { useSprings, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

const contents = ['purple', 'red', 'orange', 'yellow', 'green', 'blue', 'navy']

const width = 300

const POSREFS = {
  ACTIVE: 'ACTIVE',
  PREV: 'PREV',
  NEXT: 'NEXT',
  NONE: 'NONE'
}

const getPos = (idx, length, active) => {
  const prev = active > 0 ? active - 1 : length - 1
  const next = active < length - 1 ? active + 1 : 0

  switch (idx) {
    case active:
      return POSREFS.ACTIVE
    case next:
      return POSREFS.NEXT
    case prev:
      return POSREFS.PREV
    default:
      return POSREFS.NONE
  }
}

const getX = pos => {
  switch (pos) {
    case POSREFS.ACTIVE:
      return 0
    case POSREFS.NEXT:
      return width
    case POSREFS.PREV:
      return -1 * width
    default:
      return -2 * width
  }
}

const LoopSlider = () => {
  const activeIdxRef = useRef(0)

  const [springs, set] = useSprings(contents.length, i => {
    const pos = getPos(i, contents.length, activeIdxRef.current)
    const x = getX(pos)
    const visiable = pos !== POSREFS.NONE
    return { xy: [x, 0], immediate: !visiable }
  })

  const bind = useDrag(({ down, movement: [mx], distance, cancel }) => {
    if (down && distance > width / 2) {
      let next = activeIdxRef.current + (mx > 0 ? -1 : 1)
      if (next > contents.length - 1) {
        next = 0
      } else if (next < 0) {
        next = contents.length - 1
      }
      cancel((activeIdxRef.current = next))
    }

    set(i => {
      const pos = getPos(i, contents.length, activeIdxRef.current)
      const baseX = getX(pos)
      const visiable = pos !== POSREFS.NONE
      
      const finalX = visiable ? baseX + (down ? mx : 0) : mx > 0 ? -2 * width : 2 * width

      return {
        xy: [finalX, 0],
        immediate: !visiable,
      }
    })
  })

  return (
    <div className={styles.slider} style={{ width }}>
      {springs.map(({ xy }, idx) => {
        const transform = xy.interpolate(x => `translate3d(${x}px, 0, 0)`)

        return (
          <animated.div
            {...bind()}
            key={idx}
            className={styles.item}
            style={{
              backgroundColor: contents[idx],
              width,
              transform,
            }}
          >
            {contents[idx]}
          </animated.div>
        )
      })}
    </div>
  )
}

export default LoopSlider
