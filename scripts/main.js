let keys = {};

//Create the Pixi App and add it to a canvas
let app = new PIXI.Application({width:1280, height:720, backgroundColor: 0x2980b9});
document.body.appendChild(app.view);

//Creates an entity class
class entity extends PIXI.Sprite{
    constructor(texture,name,x=0,y=0,health=1,speed=1,weight=3,player=false,jumps=2){
        super(texture);
        this.scale.x=3;
        this.scale.y=3;
        this.anchor.set(0);
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
        if(checkCollison(this.x,this.y,this.width,this.height)){
            this.falltime=0;
            this.y-=1;  
        }else{
            this.falltime+=0.01
            this.y+=this.weight;
        }
    }
    jump(){
        if(this.jumpsRemaining<1) return;
        
        if(this.jumpsRemaining>=1){
            this.jumpsRemaining-=1;
            this.falltime=0.01;
        }
        
        const sleep = (time) => {return new Promise((resolve) => setTimeout(resolve, time))}

        const jumping = async () => {
            for (let i = 0; i < 500; i++) {
                if(this.falltime>0.05&&this.y>=app.view.height-(Bill.height/2)-stage.height){
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

    death(){
        const sleep = (time) => {
            return new Promise((resolve) => setTimeout(resolve, time))
        }

        const respawn = async () => {
            for(let i = 0; i<30;i++){
                await sleep(1000/60)
                this.x=620;
                this.y=100;
                this.falltime=0;
                this.jumpsRemaining=2;
            }
        }
        respawn();
    }
}
class object extends PIXI.Sprite{
    constructor(texture,x,y){
        super(texture);
        this.x=x;
        this.y=y;
        this.anchor.set(0);
    }
}

//app loader
app.loader.baseUrl="assets";

app.loader
    .add("Bill","sprites/TempBill.png")
    .add("Stage","bricks.png");

app.loader.onComplete.add(doneLoading);
app.loader.load();

//runs when the app loader is complete
function doneLoading(){
    addEntities();
    addObjects();
    app.ticker.add(gameLoop)
}
//adds entities to the screen
function addEntities(){
    Bill=new entity(app.loader.resources["Bill"].texture,"Bill",100,100,10,5,21,true);
    app.stage.addChild(Bill);
} 

//adds objects to the screen
const objects = [];
function addObjects(){
    stage=new object(app.loader.resources["Stage"].texture,0,0);
    stage.x=100
    stage.y=600
    stage.scale.x=10;
    stage.scale.y=10;
    app.stage.addChild(stage);
    objects.push(stage);
}

function checkCollison(x,y,width,height) {
    for(const object of objects){
        console.log(object.x);
        if(y+height>=object.y && x+width>=object.x && object.x+object.width>= x){
            return true;
        }
    }
    return false;
}
//gameloop
function gameLoop(delta){
    Bill.gravity();
    if(keys["a"]==true) Bill.moveLeft();
    if(keys["d"]==true) Bill.moveRight();
    if(Bill.x<-50 || Bill.x>1330) Bill.death();
    // Bill.y=570;
    // Bill.x=250;
}

//keyboard handlers
window.addEventListener('keydown',keysdown);
window.addEventListener('keyup',keysup)
function keysdown(e){keys[e.key]=true;}
function keysup(e){keys[e.key]=false;}

window.addEventListener('keypress',keypressed);
function keypressed(e){if(e.key==" ")Bill.jump();}