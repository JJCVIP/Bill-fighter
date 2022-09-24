let keys = {};

let show_hitbox = false;

//Create the Pixi App and add it to a canvas
let app = new PIXI.Application({width:1280, height:720, backgroundColor: 0x2980b9});
PIXI.settings.SCALE_MODE = "nearest";
document.body.appendChild(app.view);

//Creates an entity class
class entity extends PIXI.Sprite{
    constructor(texture,name,x=0,y=0,health=1,speed=1,weight=3,size_x=3,size_y=3,player=false,jumps=2){
        super(texture);
        this.scale.x=size_x;
        this.scale.y=size_y;

        this.size = [size_x, size_y];
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

        this.jumping = false;
        this.active_attack = false;

        this.attacks = {
            neutral: {
                frame: {
                    0: {
                        sprite: app.loader.resources["Bill_kick"].texture,
                        hithox: false,
                    }
                },
                duration: 500,
            }
        }
    }
    gravity(){
        if(checkCollison(this.x,this.y,this.width,this.height)){
            this.falltime=0;
            this.y=checkCollison(this.x,this.y,this.width,this.height,true);
        }else{
            this.falltime+=1
            this.y+=(this.weight*this.falltime/100);
        }
    }
    jump(){
        if(this.jumpsRemaining<1) return;
        clearInterval(this.jumping);
        this.jumpsRemaining-=1;
        this.falltime=1;
        
        this.jumping = setInterval(() => {
            // console.log(this.falltime)
            console.log(this.y);
            if(this.falltime===0){
                setTimeout(() => {
                    this.jumpsRemaining=this.jumps;
                    
                }, 10)
                this.jumping = setInterval(() => {
                    
                }, 1000/60);
            }
            this.y-=11;
        },1000/60)

        // const sleep = (time) => {return new Promise((resolve) => setTimeout(resolve, time))}

        // const jumping = async () => {
        //     for (let i = 0; i < 500; i++) {
        //         if(this.falltime==0){
        //             console.log("jumping");
        //             setTimeout(() => {this.jumpsRemaining=this.jumps}, 10)
        //             break;
        //         }
        //         this.y-=11;
        //         if(this.falltime<0.05&&i>5) break;
        //         await sleep(1000/60);
        //     }
        // }
        
        // jumping()
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
        // if(this.active_attack != false) return;

        // let attack = "neutral"
        // this.active_attack = attack;
        // let data = this.attacks[attack];
        // this.sprite.texture(app.loader.resources["Bill_kick"].texture);
    }

    death(){
        const sleep = (time) => {return new Promise((resolve) => setTimeout(resolve, time))}
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
    .add("Bill_kick", "sprites/bill_kick.png")
    .add("Stage","bricks.png");

app.loader.onComplete.add(doneLoading);
app.loader.load();

//runs when the app loader is complete
function doneLoading(){
    addEntities();
    addObjects();
    startGame();
}
//adds entities to the screen
function addEntities(){
    Bill=new entity(app.loader.resources["Bill"].texture,"Bill",100,100,10,5,21,3,3,false);
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

function checkCollison(x,y,width,height,snap=false) {
    for(const object of objects){
        if(y+height>=object.y && x+width>=object.x && object.x+object.width>= x){
            if(snap){
                return object.y - height;
            }
            return true;
        }
    }
    return false;
}
//gameloop
// function gameLoop(delta){
//     Bill.gravity();
//     if(keys["a"]==true) Bill.moveLeft();
//     if(keys["d"]==true) Bill.moveRight();
//     if(Bill.x<-50 || Bill.x>1330) Bill.death();
// }
function startGame(){
    setInterval(() => {
        Bill.gravity();
        if(keys["a"]==true) Bill.moveLeft();
        if(keys["d"]==true) Bill.moveRight();
        // if(keys["k"]==true) Bill.attack();
        if(Bill.x<-50 || Bill.x>1330) Bill.death();
    }, 1000/60);
}

//keyboard handlers
window.addEventListener('keydown', keyHandler);
window.addEventListener('keyup' ,keysup)
function keyHandler(e) {
    if(e.key == "Spacebar") e.preventDefault();
    keys[e.key] = (e.type == 'keydown');
}
function keysdown(e){keys[e.key]=true;}
function keysup(e){keys[e.key]=false;}

window.addEventListener('keypress',keypressed);
function keypressed(e){if(e.key==" ")Bill.jump();}