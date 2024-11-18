//canvasEl -> canvas Element
//canvasContext -> Elemento do canvas

//fillRect(x Inicial, y Inicial, x Largura (px, %), y Altura (px, %))
//Os parâmetros x e y na função fillRect usam coordenadas TopDown para Y e LeftRight para X, ou seja as coordenadas iniciais são sempre partindo da esquerda pra direita e de cima para baixo

const canvasEl = document.querySelector("canvas"), 
      canvasContext = canvasEl.getContext("2d"),
      gapX = 10

const mouse ={x: 0, y: 0}

//Objeto field - o campo em si
const field = {
    w: window.innerWidth,
    h: window.innerHeight,

    draw: function(){
        //Desenha o campo
        canvasContext.fillStyle = "#286047";
        canvasContext.fillRect(0, 0, this.w, this.h)
    }
}

//Objeto line - as linhas do campo
const line = {
    w: 15,
    h: field.h,

    draw: function(){
        //Cor da linha central e das raquetes
        canvasContext.fillStyle = "#ffffff";

        //Desenha a linha central
        canvasContext.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    }
}

//Objeto leftPaddle - Raquete Esquerda
const leftPaddle = {
    x: gapX,
    y: 300,
    w: line.w,
    h: 200,

    _move: function(){
        this.y = mouse.y - (this.h / 2)
    },

    draw: function(){
        canvasContext.fillStyle = "#ffffff"
        canvasContext.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    }
}

//Objeto rightPaddle - Raquete Direita
const rightPaddle = {
    x:     field.w - line.w - gapX,
    y:     300,
    w:     line.w,
    h:     200,
    speed: 5.5,

    _move: function(){
        if(this.y + this.h /2 < ball.y + ball.r){
            this.y += this.speed
        }
        else{
            this.y -= this.speed
        }
    },

    speedUp: function(){
        this.speed += 2
    },

    draw: function(){
        canvasContext.fillStyle = "#ffffff"
        canvasContext.fillRect(this.x, this.y, this.w, this.h)

        this._move()
    }
}

//objeto score - placar
const score = {
    human:    0,
    computer: 0,

    increaseHuman: function(){
        this.human++
    },
    increaseComputer: function(){
        this.computer++
    },
    
    draw: function(){
        canvasContext.font = "Bold 72px Calibri";
        canvasContext.textAlign = "center";
        canvasContext.textBaseline = "top";
        canvasContext.fillStyle = "#01341d";

        //Escreve o placar lado esquerdo
        canvasContext.fillText(
            this.human, field.w / 4, 50);

        //Escreve o placar do lado direito
        canvasContext.fillText(
            this.computer, field.w / 4 + field.w / 2, 50);
    }
}

//Objeto ball - Bolinha 
const ball = {
    x:            300,
    y:            200,
    r:            20,
    speed:        5,
    directionX:   1,
    directionY:   1,

    _calcPosition: function(){
        //verifica se o player 1 fez ponto (x > largura do campo)
        if(this.x > field.w - this.r - rightPaddle.w - gapX){
            //verifica se a raquete do bot está na direção da bola
            if(this.y + this.r > rightPaddle.y &&
               this.y - this.r < rightPaddle.y + rightPaddle.h){
                //rebote da bola invertendo o sinal de X
                this._reverseX()
                //aumenta a velocidade da bolinha quando alguém rebate
                this._speedUp()
            }
            else{
                //pontuar o player 1
                score.increaseHuman()
                this._pointUp()
            }
        }

        //verifica se o bot fez um ponto (x < 0)
        if(this.x < this.r + leftPaddle.w + gapX){
            if(this.y > leftPaddle.y &&
               this.y < leftPaddle.y + leftPaddle.h 
            ){
                this._reverseX()
                this._speedUp()
            }
            else{
                score.increaseComputer()
                this._pointUp()
            }
        }

        //verifica as laterais superior e inferior do campo
        if((this.y - this.r < 0 && this.directionY < 0) ||
           (this.y > field.h - this.r && this.directionY > 0)
        ){
            //rebate a bola invertendo o sinal do eixo Y
            this._reverseY()
        }
    },

    _reverseX: function(){
        this.directionX *= -1
    },
    _reverseY: function(){
        this.directionY *= -1
    },

    _speedUp: function(){
        this.speed += 1
    },

    _pointUp: function(){
        //reseta a velocidade da bolinha toda vez que alguém pontua
        this.speed = 5

        this.x = field.w / 2
        this.y = field.h / 2
    },

    _move: function(){
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
    },

    draw: function(){
        canvasContext.fillStyle = "#ffffff"
        canvasContext.beginPath()
        canvasContext.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        canvasContext.fill()

        this._calcPosition()
        this._move()
    }
}

function setup(){
    canvasEl.width = canvasContext.width = field.w;
    canvasEl.height = canvasContext.height = field.h;
}

function draw(){
    field.draw()
    line.draw()

    leftPaddle.draw()
    rightPaddle.draw()

    score.draw()

    ball.draw()
}

//animateFrame é uma propriedade da função window que neste caso está executando uma API
//API que suaviza a animação da bolinha - compativel com vários navegadores
window.animateFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
})()

function main(){
    animateFrame(main)
    draw()
}

setup()
main()

canvasEl.addEventListener('mousemove', function(e){
    mouse.x = e.pageX
    mouse.y = e.pageY
})