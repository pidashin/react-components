import React, { useRef, useEffect, useState } from 'react'
import styles from './index.module.scss'

import defaultImg from './default.jpg'

const random = (max = 2) => Math.floor(Math.random() * Math.floor(max))

const randomArbitrary = (min, max) =>
  Math.floor(Math.random() * (max - min) + min)

const pieceSize = 50

const createClipPath = (ctx, arcSetting) => {
  ctx.save()

  const r = 0.1 * pieceSize
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(r, r)

  ctx.lineTo(r, 0.5 * pieceSize - r)
  ctx.arc(r, 0.5 * pieceSize, r, 1.5 * Math.PI, 0.5 * Math.PI, arcSetting[0])
  ctx.lineTo(r, pieceSize - r)

  ctx.lineTo(0.5 * pieceSize - r, pieceSize - r)
  ctx.arc(0.5 * pieceSize, pieceSize - r, r, Math.PI, 0, arcSetting[1])
  ctx.lineTo(pieceSize - r, pieceSize - r)

  ctx.lineTo(pieceSize - r, 0.5 * pieceSize + r)
  ctx.arc(
    pieceSize - r,
    0.5 * pieceSize,
    r,
    0.5 * Math.PI,
    1.5 * Math.PI,
    arcSetting[2]
  )
  ctx.lineTo(pieceSize - r, r)

  ctx.lineTo(pieceSize - r, r)
  ctx.arc(0.5 * pieceSize, r, r, 0, Math.PI, arcSetting[3])
  ctx.lineTo(r, r)

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.stroke()

  ctx.clip()
  ctx.closePath()
}

const JigsawUnlock = () => {
  const imgRef = useRef()
  const pieceOfPuzzle = useRef()
  const shadow = useRef()

  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const imgNode = imgRef.current
    if (imgNode) {
      const ctx1 = pieceOfPuzzle.current.getContext('2d')
      const ctx2 = shadow.current.getContext('2d')

      const arcSetting = [random(), random(), random(), random()]
      createClipPath(ctx1, arcSetting)
      createClipPath(ctx2, arcSetting)

      const imgW = imgNode.width,
        imgH = imgNode.height

      const sx = randomArbitrary(imgW / 2, imgW - pieceSize * 1.1)
      const sy = random(imgH - pieceSize * 1.1)

      ctx1.drawImage(
        imgNode,
        sx * 4,
        sy * 4,
        pieceSize * 4,
        pieceSize * 4,
        0,
        0,
        pieceSize,
        pieceSize
      )

      ctx2.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx2.fill()

      setOffsetX(sy)
      setOffsetY(sx)
    }
  }, [])

  const [startX, setStartX] = useState(null)
  const [sliderX, setSliderX] = useState(0)
  const [result, setResult] = useState(null)

  const handleMoveStart = e => {
    if (result !== null) {
      return
    }
    setStartX(e.clientX)
  }

  const handleMoving = e => {
    if (!startX) {
      return
    }

    const xMax = imgRef.current.width - pieceSize * 1.1
    let deltaX = e.clientX - startX
    let tmpX = sliderX + deltaX
    tmpX = Math.max(0, tmpX)
    tmpX = Math.min(xMax, tmpX)

    setStartX(e.clientX)
    setSliderX(tmpX)
  }

  const handleMoveEnd = () => {
    const diff = Math.abs(sliderX - offsetY)
    if (diff < 10) {
      setResult(true)
      setSliderX(offsetY)
      alert('success unlock!')
    } else {
      setResult(false)
      alert('failed to unlock!')
    }

    setStartX(null)
  }

  const handleReset = () => {
    setResult(null)
    setSliderX(0)
  }

  return (
    <div className={styles.main}>
      <img ref={imgRef} src={defaultImg} className={styles.img} alt='' />
      <canvas
        ref={pieceOfPuzzle}
        className={styles.piece}
        style={{ top: offsetX, left: sliderX }}
      />
      <canvas
        ref={shadow}
        className={styles.shadow}
        style={{ top: offsetX, left: offsetY }}
      />
      <div className={styles.sliderWrap}>
        slide to unlock
        <div className={styles.progress} style={{ width: sliderX }} />
        <div
          className={`${styles.arrow} ${
            result !== null
              ? result
                ? styles['arrow--success']
                : styles['arrow--failed']
              : ''
          }`}
          style={{ left: sliderX }}
          onMouseDown={handleMoveStart}
          onMouseMove={handleMoving}
          onMouseUp={handleMoveEnd}
        />
      </div>
      <button className={styles.btn} onClick={handleReset}>
        reset
      </button>
    </div>
  )
}

export default JigsawUnlock
