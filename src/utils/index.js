export const getFoodPosition = (fieldSize, excludes) => {
    while(true){
    //  Math.floorは取りたい数（33）に＋1した数を入れる。35 - 1 -1 = 33 + 1= 34 
    const x = Math.floor(Math.random() * (fieldSize - 1 -1)) + 1;
    const y = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
    //some関数はitem.xとxが＝ならtrueを返す。どちらか一方で良い。そするともっかいwhileで回る。
    const conflict = excludes.some(item => item.x === x && item.y === y)

    if(!conflict){
        //?
    return {x, y}
        }
    }
}



export const initFields = (fieldSize, snake) =>{
    const fields = []
    for (let i=0; i < fieldSize; i++){
        const cols = new Array (fieldSize).fill('')
        fields.push(cols)
    }
    //snakeの現在位置
    fields[snake.y][snake.x] = 'snake'

    //
    const food = getFoodPosition(fieldSize, [snake])
    fields[food.y][food.x] = 'food'

    return fields
}