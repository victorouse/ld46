import * as A from 'attain'
import m from 'mithril'
import * as R from 'ramda'
import b from 'bss'

const styles = {
  game: b`

  `,
  player: ([x, y]) => b`
    d flex;
    h 100;
    w 100;
    bc blue;
    jc center;
    ai center;
    color white;
    transition: 0.1s all;
    transform: translate(${x}px, ${y}px);
  `,
}

const s = A.stream

const Input = A.type('Input', [
  'Up',
  'UpRight',
  'UpLeft',
  'Down',
  'DownLeft',
  'DownRight',
  'Left',
  'Right',
  'Jump',
])

const FLOOR = 700

const Player = ({ x, y }) => {
  const $position = s.of([x, y])
  const $velocity = s.of(50)
  const $gravity = s.of(20)

  return {
    $position,
    addGravity: () => {
      const [currentX, currentY] = $position()
      if (currentY + $gravity() <= FLOOR) {
        $position([currentX, currentY + $gravity()])
      } else {
        $position([currentX, FLOOR])
      }
    },
    updatePosition: input => {
      if (!input) return
      const [currentX, currentY] = $position()
      const updatedCoords = Input.fold({
        Up: () => [currentX, currentY - $velocity() - 200],
        UpRight: () => [currentX + $velocity(), currentY - $velocity() - 200],
        UpLeft: () => [currentX - $velocity(), currentY - $velocity() - 200],
        Down: () => [currentX, currentY + $velocity()],
        DownRight: () => [currentX + $velocity(), currentY + $velocity()],
        DownLeft: () => [currentX - $velocity(), currentY + $velocity()],
        Left: () => [currentX - $velocity(), currentY],
        Right: () => [currentX + $velocity(), currentY],
        Jump: () => [currentX, currentY - 400],
      })(input)

      $position(updatedCoords)
    },
  }
}

const initControls = () => {
  const $inputs = s.of({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
  })

  document.addEventListener('keydown', e => {
    const current = $inputs()

    const key = {
      ArrowUp: { ...current, ArrowUp: true },
      ArrowDown: { ...current, ArrowDown: true },
      ArrowLeft: { ...current, ArrowLeft: true },
      ArrowRight: { ...current, ArrowRight: true },
      Space: { ...current, Space: true },
    }[e.code]

    $inputs(key)
    e.preventDefault()
  })

  document.addEventListener('keyup', e => {
    const current = $inputs()

    const key = {
      ArrowUp: { ...current, ArrowUp: false },
      ArrowDown: { ...current, ArrowDown: false },
      ArrowLeft: { ...current, ArrowLeft: false },
      ArrowRight: { ...current, ArrowRight: false },
      Space: { ...current, Space: false },
    }[e.code]

    $inputs(key)
    e.preventDefault()
  })

  return $inputs.map(({ ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Space }) => {
    switch (true) {
      case ArrowUp && ArrowLeft:
        return Input.UpLeft()

      case ArrowUp && ArrowRight:
        return Input.UpRight()

      case ArrowDown && ArrowLeft:
        return Input.DownLeft()

      case ArrowDown && ArrowRight:
        return Input.DownRight()

      case ArrowUp:
        return Input.Up()

      case ArrowLeft:
        return Input.Left()

      case ArrowRight:
        return Input.Right()

      case ArrowDown:
        return Input.Down()

      case ArrowDown:
        return Input.Down()

      case Space:
        return Input.Jump()
    }
  })
}

const $gameLoop = s.raf()
const $input = initControls()
const player = Player({ x: 0, y: 700 })

s.merge([$gameLoop, $input]).map(() => {
  m.redraw()
  player.addGravity()
})

$input.map(player.updatePosition)

const Game = () =>
  m('div', [
    m('h1', 'hey dickhead'),
    m('.game' + styles.game, m('.player' + styles.player(player.$position()))),
  ])

m.mount(document.getElementById('app'), {
  view: () => Game(),
})
