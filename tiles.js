document.getElementById('refresh-button').onclick = function() {newGame()}

function newGame(){
    window.location.reload();
}

document.getElementById('game-button').onclick = function() {gameStart()}

function gameStart() {
    // Create the tiles and grid
    document.getElementById('game-button').classList.add('hide')
    const grid = document.querySelector('.game-grid')
    const gameMessage = document.querySelector('#game-over')
    const gridWidth = 820
    const gridHeight = 400
    const tileWidth = 100
    const tileHeight = 20
    const ballDiam = 15
    const winStr = "Winner winner! Thanks for playing. - Evan"
    const loseStr = "You Lose. Thanks for playing. -Evan"
    let xAxDirection = 2
    let yAxDirection = 2
    let timerId

    if((gameMessage.innerHTML = loseStr ) || 
    (gameMessage.innerHTML = winStr)){
        gameMessage.innerHTML = ""
    }

    //Tile class accepts an x and y axis and sets it to the bottom left
    class Tile{
        constructor(xAx, yAx){ 
            this.bottomLeft = [xAx,yAx]
            this.bottomRight = [xAx + tileWidth, yAx]
            this.topLeft = [xAx, yAx + tileHeight]
            this.topRight = [xAx + tileHeight, yAx + tileWidth]
        }
    }

    const allTiles = [
        new Tile(10,370),
        new Tile(110,370),
        new Tile(210,370),
        new Tile(310,370),
        new Tile(410,370),
        new Tile(510,370),
        new Tile(610,370),
        new Tile(710,370),
        new Tile(10,350),
        new Tile(110,350),
        new Tile(210,350),
        new Tile(310,350),
        new Tile(410,350),
        new Tile(510,350),
        new Tile(610,350),
        new Tile(710,350),
    ]

    function addTiles(){
        for(let i = 0; i < allTiles.length; i++){
            const tile = document.createElement('div')
            tile.classList.add('tile')
            tile.style.left = allTiles[i].bottomLeft[0] + 'px' // Sets the x Axis from Tile class
            tile.style.bottom = allTiles[i].bottomLeft[1] + 'px' // Sets the y axis 
            grid.appendChild(tile)
        }
    }

    addTiles()

    //Create the slider
    const slider = document.createElement('div')
    slider.classList.add('slider')

    const sliderStart = [360,10]
    let currentPosition = sliderStart
    drawSlider()
    grid.appendChild(slider)

    function drawSlider(){
        slider.style.left = currentPosition[0] + 'px'
        slider.style.bottom = currentPosition[1] + 'px'
    }

    //Moving the slider
    function slide(e){
        switch(e.key){
            case 'ArrowLeft':
                if(currentPosition[0] > 10){
                    currentPosition[0] -= 15
                    drawSlider()
                }
                break;
            case 'ArrowRight':
                if(currentPosition[0] < 710){
                    currentPosition[0] += 15
                    drawSlider()
                }
                break;
        }
    }

    document.addEventListener('keydown', slide)

    //Create the ball
    const ball = document.createElement('div')
    const ballStart = [405,30]
    let currentBallPosition = ballStart
    ball.classList.add('ball')
    drawBall()
    grid.appendChild(ball)

    function drawBall(){
        ball.style.left = currentBallPosition[0] + 'px'
        ball.style.bottom = currentBallPosition[1] + 'px'
    }

    //Moving the ball
    function moveBall(){
        currentBallPosition[0] += xAxDirection   
        currentBallPosition[1] += yAxDirection
        drawBall() 
        collisionCheck()
    }

    timerId = setInterval(moveBall, 15)

    //Collision check
    function collisionCheck(){
        //Wall collisions
        if(currentBallPosition[0] >= (gridWidth - ballDiam) || 
        currentBallPosition[1] >= (gridHeight - ballDiam) || 
        currentBallPosition[0] <= 0){
            rebound()
        }
        //Bottom collision aka Game over
        if(currentBallPosition[1] <= 0){
            gameOver()
        }
        //Slider collisions
        if((currentBallPosition[0] > currentPosition[0] && currentBallPosition[0] < currentPosition[0] + tileWidth) &&
            (currentBallPosition[1] > currentPosition[1] && currentBallPosition[1] < currentPosition[1] + tileHeight)){
                rebound()
            }
        //Tile collisions and detect a win
        for (let i = 0; i < allTiles.length; i++){
            if(currentBallPosition[0] > allTiles[i].bottomLeft[0] && 
                currentBallPosition[0] < allTiles[i].bottomRight[0] &&
                (currentBallPosition[1] + ballDiam) > allTiles[i].bottomLeft[1] &&
                currentBallPosition[1] < allTiles[i].topLeft[1]){
                    const tiles = Array.from(document.querySelectorAll('.tile'))
                    tiles[i].classList.remove('tile')
                    allTiles.splice(i, 1)
                    rebound()

                    if(allTiles.length === 0){
                        gameWin()
                    }
                }
        }
    }

    function rebound(){
        if(xAxDirection === 2 && yAxDirection === 2){
            yAxDirection = -2
            return
        }
        if(xAxDirection === 2 && yAxDirection === -2){
            xAxDirection = -2
            return
        }
        if(xAxDirection === -2 && yAxDirection === 2){
            xAxDirection = 2
            return
        }
        if(xAxDirection === -2 && yAxDirection === -2){
            yAxDirection = 2
            return
        }
    }

    function gameWin(){
        gameMessage.innerHTML = winStr
        clearInterval(timerId)
        grid.removeChild(ball)
        grid.removeChild(slider)
        document.getElementById('game-button').classList.add('hide')
        document.getElementById('refresh-button').classList.remove('hide')
    }

    function gameOver(){
        gameMessage.innerHTML = loseStr
        clearInterval(timerId)
        grid.removeChild(ball)
        grid.removeChild(slider)
        document.getElementById('game-button').classList.add('hide')
        document.getElementById('refresh-button').classList.remove('hide')
    }
}

