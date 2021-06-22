import React from 'react'

const Field = ({fields}) =>{
    return(
        <div className='field'>
            {
                fields.map((row) => {
                    return row.map((column) => {
                        //配列の中身がクラス名に適用される。columnにはsnakeとかが入る。
                        return <div className={`dots ${column}`}></div>
                    })
                })
            }
            
        </div>
    )
}

export default Field;