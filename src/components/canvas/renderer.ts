import * as conf from './conf'
import { State } from './state'
const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
}

const toDoubleHexa = (n: number) =>
  n < 16 ? '0' + n.toString(16) : n.toString(16)

export const rgbaTorgb = (rgb: string, alpha = 0) => {
  let r = 0
  let g = 0
  let b = 0
  if (rgb.startsWith('#')) {
    const hexR = rgb.length === 7 ? rgb.slice(1, 3) : rgb[1]
    const hexG = rgb.length === 7 ? rgb.slice(3, 5) : rgb[2]
    const hexB = rgb.length === 7 ? rgb.slice(5, 7) : rgb[3]
    r = parseInt(hexR, 16)
    g = parseInt(hexG, 16)
    b = parseInt(hexB, 16)
  }
  if (rgb.startsWith('rgb')) {
    const val = rgb.replace(/(rgb)|\(|\)| /g, '')
    const splitted = val.split(',')
    r = parseInt(splitted[0])
    g = parseInt(splitted[1])
    b = parseInt(splitted[2])
  }

  r = Math.max(Math.min(Math.floor((1 - alpha) * r + alpha * 255), 255), 0)
  g = Math.max(Math.min(Math.floor((1 - alpha) * g + alpha * 255), 255), 0)
  b = Math.max(Math.min(Math.floor((1 - alpha) * b + alpha * 255), 255), 0)
  return `#${toDoubleHexa(r)}${toDoubleHexa(g)}${toDoubleHexa(b)}`
}

const clear = (ctx: CanvasRenderingContext2D) => {
  const { height, width } = ctx.canvas
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
}

const drawCirle = (
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number },
  color: string
) => {
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(x, y, conf.RADIUS, 0, 2 * Math.PI)
  ctx.fill()
}

export const render = (ctx: CanvasRenderingContext2D) => (state: State) => {
  clear(ctx)
  ctx.font = '96px arial'
  ctx.strokeText(`life ${state.player.life}`, 20, 100)
  ctx.strokeText(
    `balls life ${state.pos
      .map((p) => p.life)
      .reduce((acc, val) => acc + val, 0)}`,
    20,
    200
  )
  state.pos.map((c) =>
    drawCirle(
      ctx,
      c.coord,
      rgbaTorgb(COLORS.RED, (conf.BALLLIFE - c.life) * (1 / conf.BALLLIFE))
    )
  )
  drawCirle(
    ctx,
    state.player.coord,
    rgbaTorgb(
      COLORS.BLUE,
      (conf.PLAYERLIFE - state.player.life) * (1 / conf.PLAYERLIFE)
    )
  )
  if (state.endOfGame) {
    const text = state.pos.length > 0 ? 'YOU LOSE' : 'YOU WIN'
    ctx.font = '48px'
    ctx.strokeText(text, state.size.width / 2 - 200, state.size.height / 2)
  }
}
