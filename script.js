let keys = {};

//Create the Pixi App and add it to a canvas
let app = new PIXI.Application({width:1280, Height:1080});
document.body.appendChild(app.view);

//Creates an entity class
class entity extends PIXI.Sprite{
    constructor(texture,name,x=0,y=0,health=1,speed=1,weight=3,player=false,jumps=2){
        super(texture);
        this.scale.x=3;
        this.scale.y=3;
        this.anchor.set(0.5);
        this.name=name;
        this.x=x;
        this.y=y;
        this.health=health;
        this.speed=speed;
        this.weight=weight;
        this.player=player;
        this.jumps=jumps;
        this.falltime=0;
        this.jumpsRemaining=jumps;
    }
    gravity(){
        if(this.y>=app.view.height-(Bill.height/2)){
            this.falltime=0;
            this.y=app.view.height-(Bill.height/2)
            return;
        }
        if(this.y<app.view.height-(Bill.height/2)+1){
            this.falltime+=0.01; 
            this.y+=this.falltime*this.weight;
        }
    }
    jump(){
        if(this.jumpsRemaining<1){
            return;
        }
        if(this.jumpsRemaining>=1){
            this.jumpsRemaining-=1;
            this.falltime=0.01;
        }
        
        const sleep = (time) => {
            return new Promise((resolve) => setTimeout(resolve, time))
        }

        const jumping = async () => {
            for (let i = 0; i < 500; i++) {
                if(this.falltime>0.05&&this.y>=app.view.height-(Bill.height/2)){
                    setTimeout(() => {this.jumpsRemaining=this.jumps}, 10)
                    break;
                }
                await sleep(1000/60)
                this.y-=11;
                if(this.falltime<0.05&&i>5){
                    break;

                }
            }
        }
        
        jumping()
    }
    moveLeft(){
        this.x-=this.speed;
    }

    moveRight(){
        this.x+=this.speed
    }
    fall(){

    }
    attack(){

    }
}

//app loader
app.loader.baseUrl="assets";

app.loader
    .add("Bill","sprites/TempBill.png");

app.loader.onComplete.add(doneLoading);
app.loader.load();

//runs when the app loader is complete
function doneLoading(){
    addEntities();
    app.ticker.add(gameLoop)
}
//adds entities to the screen
function addEntities(){
    Bill=new entity(app.loader.resources["Bill"].texture,"Bill",100,100,10,5,21,true);
    app.stage.addChild(Bill);
} 
//gameloop
function gameLoop(delta){
    Bill.gravity();
    if(keys["a"]==true){
        Bill.moveLeft();
    }
    if(keys["d"]==true){
        Bill.moveRight();
    }
}

//keyboard handlers
window.addEventListener('keydown',keysdown);
window.addEventListener('keyup',keysup)
function keysdown(e){
    keys[e.key]=true;
}
function keysup(e){
    keys[e.key]=false;
}
window.addEventListener('keypress',keypressed);
function keypressed(e){
    if(e.key==" "){
        Bill.jump();
    }
}