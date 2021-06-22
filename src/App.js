import React,{useCallback,useState, useEffect} from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import {initFields, getFoodPosition} from './utils/index'

const initialPosition = {x: 17, y: 17}//初期位置
const initialValues = initFields(35, initialPosition)//初期位置把握
const defaultInterval = 100
const defaultDifficulty = 3

const Difficulty = [1000, 500, 100, 50, 10]



//ゲームのプレイ状態
const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover'
})

//進む方向
const Direction = Object.freeze({
  up: 'up',
  right: 'right',
  left: 'left',
  down: 'down'
})

//進むのと逆の方向
const OppositeDirection = Object.freeze({
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up'
})

//upでどのように動くかのとこ
const Delta = Object.freeze({
  up: {x: 0, y: -1},
  right: {x: 1, y: 0},
  left: {x: -1, y: 0},
  down: {x: 0, y: 1}
})

//キーボードの矢印の設定
const DirectionKeyCodeMap = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
})

let timer = undefined

//タイマーを止める処理。何度も使うので関数化。
const unsubscribe = () => {
  if(!timer){
    return
  }
  clearInterval(timer)
}


const isCollision = (fieldSize, position) =>{
  //左の壁に当たったとき
  if(position.y < 0 || position.x<0){
    return true;
  }

  //上の壁に当たったとき
  if(position.y > fieldSize -1 || position.x > fieldSize -1){
    return true;
  }
  return false
}

const eatme = (fields, position) => {
  return fields[position.y][position.x] === 'snake'
}

function App() {
  const [fields, setFields] = useState(initialValues)
  const [body, setBody] = useState([])
  const [status, setStatus] = useState(GameStatus.init)
  const [tick, setTick] = useState(0)
  const [direction, setDirection] = useState(Direction.up)
  const [difficulty, setDifficulty] = useState(defaultDifficulty)

  useEffect(() => {
    //初期位置に配置
    setBody([initialPosition])
    //ゲームの時間管理
    const interval = Difficulty[difficulty - 1]
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, interval)
    return unsubscribe//コンポーネントが削除されるときにタイマーも削除。
  }, [difficulty])


  useEffect(() => {
    //positionがundefinedになるため、nullチェック。
    if(body.length === 0 || status !== GameStatus.playing){
      return
    }
    const canContinue = handleMoving()
    if(!canContinue){
      setStatus(GameStatus.gameover)
    }
  }, [tick])

  //ゲームがスタートするとplayingになる。
  const onStart = () => setStatus(GameStatus.playing)

  const onStop = () => setStatus(GameStatus.suspended)

  //gameover後の手順
  const onRestart = () =>{
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval)
    setDirection(Direction.up)
    setStatus(GameStatus.init)
    setBody([initialPosition])
    setFields(initFields(35, initialPosition))
  }

  //??
  const onChangeDirection = useCallback((newDirection) => {
    if(status !== GameStatus.playing){
      return direction
    }
    if(OppositeDirection[direction] === newDirection){
      return
    }
    setDirection(newDirection)
  }, [direction, status])

  //難易度調整
  const onChangeDifficulty = useCallback((difficulty) => {
      if(status !== GameStatus.init){
        return
      }
      if(difficulty < 1 || difficulty > difficulty.length){
        return
      }
      setDifficulty(difficulty)
  },[status, difficulty])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode]
      if(!newDirection){
        return;
      }

      onChangeDirection(newDirection)
    };
    document.addEventListener('keydown', handleKeyDown)
    //イベントリスナーのクリーン
    return() => document.removeEventListener('keydown', handleKeyDown)
  }, [onChangeDirection])

  const handleMoving = () =>{
    const {x,y} = body[0]//現在地を把握
    const delta = Delta[direction]//今の方向による変化量
    const newPosition = {
      x: x + delta.x, 
      y: y + delta.y,
    }
    if(isCollision(fields.length, newPosition) || eatme (fields, newPosition)){

      return false
    }
    //餌を食べる処理
    const newBody = [...body]
    if(fields[newPosition.y][newPosition.x] !== 'food'){
      const removingTrack = newBody.pop()
      fields[removingTrack.y][removingTrack.x] = ''
    }else{
      //newbody配列にnewpositionを追加
      const food = getFoodPosition(fields.length, [...newBody, newPosition])
      fields[food.y][food.x] = 'food'
    }
    fields[newPosition.y][newPosition.x] = 'snake'
    newBody.unshift(newPosition)

    setBody(newBody)
    setFields(fields)//fieldsを更新し、動いたように見える。
    return true
  }


  return(
    <div className='App'>
      <header className='header'>
        <div className='title-container'>
          <h1 className='title'>Snake Game</h1>
        </div>
        <Navigation 
        length={body.length} 
        difficulty={difficulty}
        onChangeDifficulty={onChangeDifficulty} 
         />
      </header>
      <main className='main'>
        <Field fields={fields} />
      </main>
      <footer className='footer'>
      <Button status={status} onStart={onStart} onRestart={onRestart} onStop={onStop} />
      <ManipulationPanel onChange={onChangeDirection} />
      </footer>
    </div>
  );
}

export default App