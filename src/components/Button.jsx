import React from 'react'

const Button = ({status,onStart, onRestart, onStop}) =>{
    return(
        <div className='button'>
            {/* 前の式がtrueの時だけ&&が実行される */}
            {status === 'gameover' && <button className='btn btn-gameover' onClick={onRestart}>gameover</button>}
            {status === 'init' && <button className='btn btn-init'  onClick={onStart}>start</button>}
            {status === 'suspended' && <button className='btn btn-suspended' onClick={onStart}>start</button>}
            {status === 'playing' && <button className='btn btn-playing' onClick={onStop}>stop</button>}
        </div>
    )
}

export default Button