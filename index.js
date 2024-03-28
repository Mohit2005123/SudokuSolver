let array=[
    ['.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.'],
    ['.','.','.','.','.','.','.','.','.']
];
let errorheading= document.querySelector('h2');
let refresh= document.querySelector('.refresh');
let cell= document.querySelectorAll('.grid-cell');
for(let i=0; i<cell.length; i++){
    cell[i].innerHTML= `<input type="text" maxLength="1">`;
    cell[i].classList.add(i);
}
let inputs= document.querySelectorAll('input');
for(let i=0; i<inputs.length; i++){
    inputs[i].classList.add(i);
};
inputs[0].focus();
let xindex=0;
let yindex=0;
document.addEventListener('keydown', (event)=>{

    if(event.code=='ArrowRight' && yindex<8){
        yindex++;
        inputs[(9*xindex)+yindex].focus();
       
    }
    else if(event.code=='ArrowLeft' && yindex>0){
        yindex--;
        inputs[(9*xindex)+yindex].focus();
    }
    else if(event.code=='ArrowUp' && xindex>0){
        xindex--;
        inputs[(9*xindex)+(yindex)].focus();
    }
    else if(event.code=='ArrowDown' && xindex<8){
        xindex++;
        inputs[(9*xindex)+yindex].focus();
    }

});

let solvebtn= document.querySelector('button');

for(let i=0; i<inputs.length; i++){
    inputs[i].addEventListener('input', (event)=>{
        let inputvalue= parseInt(event.target.value);
        if(isNaN(inputvalue) || inputvalue<1 || inputvalue>9){
            event.target.value='';
        }
    });
}

solvebtn.addEventListener('click', ()=>{
    for(let i=0; i<array.length; i++){
        for(let j=0; j<array[0].length; j++){
            if(inputs[(9*i)+j].value!=''){
                array[i][j]= inputs[(9*i)+j].value;
            }
        }
       
    }

    let solution= solve(array);
    if(solution== false){
        errorheading.innerText=`The soduku cannot be solved`;
    }
    else{
        console.log('Solved');
        console.log(array);
        for(let i=0; i<array.length; i++){
            for(let j=0; j<array[0].length; j++){
                inputs[(9*i)+j].value= array[i][j];
            }
        }
        for(let i=0; i<inputs.length; i++){
            inputs[i].addEventListener('keydown', (event)=>{
                event.preventDefault();
            })
        }
    }
    for(let i=0; i<array.length; i++){
        for(let j=0; j<array[0].length; j++){
            array[i][j]='.';
        }
    }
});
refresh.addEventListener('click', ()=>{
    location.reload();
})
function solve(array){
    if (recursion(array, 0, 0)) {
        return array; // Return the solved array
    }
    return false;
}

function recursion(array, row, column){
    // Base case: when the end of the puzzle is reached
    if(row == 9){
        return true;
    }

    // If the current cell is not empty, move to the next cell
    if(array[row][column] != "."){
        // Move to the next cell
        let [nextRow, nextColumn] = getNextPosition(row, column);
        return recursion(array, nextRow, nextColumn);
    }

    // Try numbers from 1 to 9 in the current cell
    let issafefound= false;
    for(let num = 1; num <= 9; num++){
        if(issafe(array, row, column, num)){
            array[row][column] = num.toString(); // Convert num to string
            // Move to the next cell
            let [nextRow, nextColumn] = getNextPosition(row, column);
            if(recursion(array, nextRow, nextColumn)){
                return true; // If a solution is found, return true
            }
            // Backtrack
            array[row][column] = ".";
            issafefound= true;
        }
    }
    if(issafefound== false){
        return false;
    }
    // If no solution is found, return false
    return false;
}

function issafe(array, row, column, num){
    num = num.toString(); // Convert num to string
    // Check row
    for(let i = 0; i < 9; i++){
        if(array[row][i] == num){
            return false;
        }
    }
    
    // Check column
    for(let i = 0; i < 9; i++){
        if(array[i][column] == num){
            return false;
        }
    }
    
    // Check subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if(array[startRow + i][startCol + j] == num){
                return false;
            }
        }
    }
    return true;
}

function getNextPosition(row, column){
    // Move to the next column
    column++;
    // If the end of the row is reached, move to the next row
    if(column == 9){
        column = 0;
        row++;
    }
    return [row, column];
}
