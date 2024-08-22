// console.log('Hiiiii')
window.addEventListener('load', function (params) {
    const canvas = document.getElementById('canvas1');
    const ctx  = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 500;


    class inputhandler{
        constructor(game){
            this.game = game;
            window.addEventListener('keydown', (e)=> {
                
                if (((e.key === 'ArrowUp' || (e.key === 'ArrowDown') )) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);

                }
                else if( e.key === ' '){
                    this.game.player.shootTop();
                }
                else if (e.key === 'd' ) {
                    this.game.debug = !this.game.debug;
                }
                // console.log(this.game.keys);
            });
            window.addEventListener('keyup',e=>{
                if (this.game.keys.indexOf(e.key)> -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
                    
                }
            })

        }

    }
    class Projectile{
        constructor(game, x,y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 36.25;
            this.height = 20;
            this.speed = Math.random()* 0.2 + 2.8;
            this.markForDeletion = false;
            this.image = document.getElementById('fireball');
            this.frameX = 0;
            this.maxFrame = 3;
            this.timer = 0;
            this.fps = 20;
            this.interval = 1000/this.fps;
            



        }
        update(deltaTime){
            this.x += this.speed;
            if (this.timer > this.interval) {
                if (this.frameX < this.maxFrame){
                    this.frameX++;
                }
                else{
                    this.frameX = 0;
                }
                this.timer = 0;
    
                
            }

            else{
                this.timer += deltaTime;
            }
            

            if (this.x > (this.game.width * 0.8)) this.markForDeletion = true;

        }
        draw(context){
            // context.fillStyle = 'yellow';
            // context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,this.frameX* this.width,0,this.width,this.height, this.x,this.y, this.width, this.height)
        }
    }
    class Shield{
        constructor(game){
            this.game = game;
            this.width = this.game.player.width;
            this.height = this.game.player.height;
            this.frameX = 0;
            this.maxFrame = 24;
            this.image = document.getElementById('shield');
            this.timer = 0;
            this.fps = 30;
            this.interval = 1000/this.fps;

        }

        update(deltaTime){
            
            
            if (this.frameX <= this.maxFrame){ 
                if (this.timer > this.interval) {
                    this.frameX++;
                    this.timer = 0
                    
                }
                else{
                    this.timer += deltaTime;

                }
                
            }

        }

        draw(context){
            context.drawImage(this.image, this.frameX*this.width,0 ,this.width,this.height,this.game.player.x, this.game.player.y, this.width, this.height)
        }

        reset(){
            this.frameX = 0;
            this.game.sound.shield();
        }
    }
    class SoundController{
        constructor(){
            this.powerUpSound = document.getElementById('powerup');
            this.powerDownSound = document.getElementById('powerdown');
            this.explosionSound = document.getElementById('explosion');
            this.shotSound = document.getElementById('shot');
            this.hitSound = document.getElementById('hit');
            this.shieldSound = document.getElementById('shieldSound');
            
        }
        powerUp(){
            this.powerUpSound.currentTime = 0;
            this.powerUpSound.play();
        }
        powerDown(){
            this.powerDownSound.currentTime = 0;
            this.powerDownSound.play();
        }
        explosion(){
            this.explosionSound.currentTime = 0;
            this.explosionSound.play();
        }
        shot(){
            this.shotSound.currentTime = 0;
            this.shotSound.play();
        }
        hit(){
            this.hitSound.currentTime = 0;
            this.hitSound.play();
        }
        shield(){
            this.shieldSound.currentTime = 0;
            this.shieldSound.play();
        }
    }
    class Particle{
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('gears');
            this.frameX = Math.floor(Math.random()*3);
            this.frameY = Math.floor(Math.random()*3);
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1); 
            this.size = this.spriteSize * this.sizeModifier;
            this.speedX = Math.random() * 6 - 3 ;
            this.speedY = Math.random() * -15 ;
            this.gravity = 0.5;
            this.markForDeletion = false
            this.angle  = 0;
            this.va = Math.random() * 0.2 - 0.1;
            this.bounced = 0;
            this.buttomBouncedBoundary = Math.random() * 100  + 60


        }
        update(){
            
            this.angle += this.va;
            this.speedY += this.gravity;
            this.x -= this.speedX + this.game.speed;
            this.y  += this.speedY;
            if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.markForDeletion = true;

            if (this.y > this.game.height - this.buttomBouncedBoundary && this.bounced<2){
                this.bounced++
                this.speedY *= -0.7;
            }
            // console.log(this.speedX)
            // console.log(Math.floor(this.x) + ' and ' + Math.floor(this.y));
            // console.log(Math.floor(this.speedX) + ' and ' + Math.floor(this.speedY));
        }

        draw(context){
            context.save();
            context.translate(this.x, this.y)
            context.rotate(this.angle)
            context.drawImage( this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, 0, 0 , this.size* -0.5 , this.size*-0.5)
            context.restore();
        }


    }
    class Player{
        constructor(game){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame =37;
            this.speedY = 0;
            this.maxSpeed = 5;
            this.projectiles = [];
            this.image = document.getElementById('player');
            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit= 10000;


            
        }

        update(deltaTime){
            if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed ;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            this.y += this.speedY; 
            //vertical boundaries
            if (this.y > this.game.height - this.height*0.5) this.y = this.game.height - this.height*0.5;
            else if(this.y < 0 - this.height*0.5) this.y = 0 - this.height*0.5;
            // handle projection
            this.projectiles.forEach(projectile =>{
                projectile.update(deltaTime);
            })

            this.projectiles = this.projectiles.filter(projectile => !projectile.markForDeletion)
            // console.log(this.projectiles)

            if (this.frameX < this.maxFrame){
                this.frameX++;
            }
            else{
                this.frameX = 0  
            }

            // powerup
            if(this.powerUp){
                if(this.powerUpTimer > this.powerUpLimit){
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0;
                    this.game.sound.powerDown();
                }
                else{
                
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1;
                    this.game.ammo += 0.1;


            }
        }
        }
        draw(context){
            // context.fillStyle = 'black';
            this.projectiles.forEach(projectile => {
                projectile.draw(context);

            })

            
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image , this.frameX * this.width , this.frameY * this.height, this.width , this.height,  this.x, this.y , this.width, this.height)
            
        }
        shootTop(){
            if (this.game.ammo > 0 ) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30))   
                this.game.ammo--; 
            }

            this.game.sound.shot();
            if(this.powerUp) this.shootBottom();
        }

        shootBottom(){
            if (this.game.ammo > 0 ) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175))   
                this.game.ammo--; 
            }
        }


        enterPowerUp(){
            this.powerUpTimer = 0;
            this.powerUp = true;
            if (this.game.ammo < this.game.maxAmmo) {
                this.game.ammo = this.game.maxAmmo;

            }
            this.game.sound.powerUp();
            
            
        }

    }
    

    class Enemy{
        constructor(game){
            this.game = game;
            this.x = this.game.width;
            this.y = this.game.height;
            this.speedX = Math.random()* -0.5 - 0.5;
            // console.log(this.speedX);
            this.markForDeletion = false;
            this.lives = 5;
            this.score = this.lives;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
            

        }
        update(){
            this.x += this.speedX - this.game.speed;
            if (this.x + this.width < 0) {
                this.markForDeletion = true;
                
            }

            if (this.frameX < this.maxFrame){
                this.frameX++;
            }
            else this.frameX = 0;
        }
        draw(context){
            if (this.game.debug) {
                context.strokeRect(this.x, this.y,this.width, this.height);

                context.font = '20px Helvertica '
                context.fillText(this.lives, this.x, this.y);

            }
                
            
            context.drawImage(this.image,this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)
            
        }

    }

    class Angular_fish extends Enemy{
        constructor(game){
            super(game);
            this.lives = 5;
            this.width = 228;
            this.height = 169;
            this.y = 20 + (Math.random()*(this.game.height * 0.9 - this.height));
            this.image = document.getElementById('angler1')
            this.frameY = Math.floor( Math.random() * 3 );
            // console.log(this.frameY);


        }



    }
    class Angular_fish2 extends Enemy{
        constructor(game){
            super(game);
            
            this.lives = 6;
            this.width = 213;
            this.height = 165;
            this.y = 20 + (Math.random()*(this.game.height * 0.95 - this.height));
            this.image = document.getElementById('angler2')
            this.frameY = Math.floor( Math.random() *  2 );
            // console.log(this.frameY);


        }
    }


    class Lucky_fish extends Enemy{
        constructor(game){
            super(game);
            this.type = 'lucky'
            this.score = 5;
            this.lives = 3;
            this.width = 99;
            this.height = 95;
            this.y = 20 + (Math.random()*(this.game.height * 0.95 - this.height));
            this.image = document.getElementById('lucky')
            this.frameY = Math.floor( Math.random() *  2 );
            // console.log(this.frameY);
            


        }
    }
    class hive_whale extends Enemy{
        constructor(game){
            super(game);
            this.type = 'hive'
            this.lives = 20;
            this.width = 400;
            this.height = 227;
            this.y = ((this.game.height * 0.95 - this.height));
            this.image = document.getElementById('hivewhale')
            this.frameY = 0;
            this.score = this.lives;
            this.speedX =  Math.random() * -1.2 - 0.2;
            
            // console.log(this.frameY);


        }
    }

    class Drone extends Enemy{
        constructor(game, x,y){
            super(game);
            this.type = 'drone'
            this.lives = 3;
            this.width = 115;
            this.height = 95;
            this.y = y;
            this.x = x;
            this.image = document.getElementById('drone')
            this.frameY = Math.floor(Math.random()*2);
            this.score = this.lives;
            this.speedX =  Math.random() * -4.2 - 0.5;
            
            // console.log(this.frameY);


        }
    }
    class BlubWhale extends Enemy{
        constructor(game){
            super(game);
            this.lives = 20;
            this.width = 270;
            this.height = 219;
            this.y = (Math.random()*(this.game.height * 0.95 - this.height));
            this.image = document.getElementById('bulbwhale')
            this.frameY = Math.floor(Math.random()*2);
            this.score = this.lives;
            this.speedX =  Math.random() * -1.2 - 0.2;
            
            // console.log(this.frameY);


        }
    }

    class Moon_fish extends Enemy{
        constructor(game){
            super(game);
            this.lives = 10;
            this.width = 227;
            this.height = 240;
            this.y = (Math.random()*(this.game.height * 0.95 - this.height));
            this.image = document.getElementById('moonfish')
            this.frameY = 0;
            this.score = this.lives;
            this.speedX =  Math.random() * -1.2 - 2;
            this.type = 'moon'
            
            // console.log(this.frameY);


        }
    }

    class Stalker extends Enemy{
        constructor(game){
            super(game);
            this.lives = 5;
            this.width = 243;
            this.height = 123;
            this.y =Math.random()*((this.game.height * 0.95 - this.height));
            this.image = document.getElementById('stalker')
            this.frameY = 0;
            this.score = this.lives;
            this.speedX =  Math.random() * -1 - 1;
            
            
            // console.log(this.frameY);


        }
    }
    class Razorfin extends Enemy{
        constructor(game){
            super(game);
            this.lives = 7;
            this.width = 187;
            this.height = 149;
            this.y = Math.random()*((this.game.height * 0.95 - this.height));
            this.image = document.getElementById('razorfin')
            this.frameY = 0;
            this.score = this.lives;
            this.speedX =  Math.random() * -1 - 1;
            
            
            // console.log(this.frameY);


        }
    }

        

    
    class Layer{
        constructor(game, image, speedModifier){
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;



        }
        update(){
            // console.log(this.x + this.width);
            if (this.x <= -this.width) this.x = 0;
            this.x -= this.game.speed * this.speedModifier;
        }

        draw(context){
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }

    }
    class Background{
        constructor(game){
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');

            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1);
            this.layer4 = new Layer(this.game, this.image4, 1.5);
            this.layers = [this.layer1,this.layer2,this.layer3];
        }
        update(){
            this.layers.forEach(layer => layer.update());

        }
        draw(context){
            this.layers.forEach(layer => layer.draw(context))
            

        }

    }

    class Explosion{
        constructor(game, x, y){
            this.game= game;
            this.x = x;
            this.y = y;
            this.frameX = 0;
            this.spriteHeight = 200;
            this.fps = 25;
            this.timer = 0;
            this.interval = 1000/this.fps;
            this.markedForDeletion = false;
            this.maxFrame = 8;
            this.spriteWidth = 200;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x - this.width * 0.5;
            this.y = y - this.height * 0.5;
        }

        update(deltaTime){
            this.x -= this.game.speed; 

            if(this.timer > this.interval){
                this.frameX++;
                this.timer = 0;
            }
            else{
                this.timer += deltaTime;
            }

            if(this.frameX > this.maxFrame){
                this.markedForDeletion = true;
                

            } 

            

        }
        draw(context){
            context.drawImage(this.image,this.frameX*this.spriteWidth ,0,this.spriteWidth ,this.spriteHeight, this.x, this.y, this.width , this.height)
        }
    }
    class SmokeExplosion extends Explosion{
        constructor(game,x,y){
            super(game ,x, y);
            this.image = document.getElementById('smokeExplosion')
            
        }


    }

    class FireExplosion extends Explosion{
        constructor(game,x,y){
            super(game ,x, y);
            this.image = document.getElementById('fireExplosion')  
            
        }


        
    }


    class UI{
        constructor(game){
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Bangers';
            this.color = 'white';


        }
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            //score
            context.font = this.fontSize + 'px ' + this.fontFamily;
            context.fillText('Score: '+ this.game.score, 20,40);

            // timer
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Timer: ' + formattedTime , 20, 95);

            //game over messages

            if (this.game.gameOver){
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score > this.game.winningScore){
                    message1 = 'You Rock!';
                    message2 = 'Well Done!'

                }
                else{
                    message1 = 'You lose!';
                    message2 = 'Try again next time!'
                }

                context.font = '75px ' + this.fontFamily;
                context.fillText(message1, this.game.width*0.5, this.game.height*0.5 - 20)
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2, this.game.width*0.5, this.game.height*0.5 + 20)

            }

            // ammo
            if (this.game.player.powerUp) context.fillStyle ='#ffffbd'

            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5*i, 50, 3, 20);       
            }
            context.restore();

        }

    }
    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.Background = new Background(this);
            this.player = new Player(this);
            this.input  = new inputhandler(this);
            this.ui = new UI(this);
            this.sound = new SoundController();
            this.shield = new Shield(this);
            this.enemies = [];
            this.keys = [];
            this.Particles = [];
            this.explosions = [];
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.enemyTimer= 0;
            this.ammoInterval = 500;
            this.enemyInterval = 2000;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 75;
            this.gameTime = 0;
            this.timeLimit = 30000;
            this.speed = 2;
            this.debug = false;
        }

        update(deltaTime){
            if (this.ammo > this.maxAmmo+20) {
                console.log(this.ammo);
                this.ammo = this.maxAmmo + 20;

            }
            
            // console.log(this.ammoTimer );
            if (!this.gameOver) this.gameTime += deltaTime;
            if(this.gameTime > this.timeLimit) this.gameOver = true;
            this.player.update(deltaTime);
            this.Background.update();
            this.Background.layer4.update();


            if (this.ammoTimer >  this.ammoInterval) {
                
                if (this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
                

            } else {              
                this.ammoTimer += deltaTime;            
            }

            this.shield.update(deltaTime)
            this.Particles.forEach(particle => particle.update())
            this.Particles = this.Particles.filter(particle => !particle.markForDeletion);
            this.explosions.forEach(explosion => explosion.update(deltaTime))
            this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);

            console.log(this.explosions);

            this.enemies.forEach(enemy =>{
                enemy.update();
                if (this.checkCollision(this.player, enemy)) {
                    this.sound.hit();
                    this.shield.reset();
                    enemy.markForDeletion = true;

                    this.addExplosion(enemy);

                    for (let i = 0; i < enemy.score; i++) {
                        this.Particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height*0.5 ))
                    }
                    
                    if (enemy.type === 'lucky'){
                        // console.log('nopee');
                        this.player.enterPowerUp();
                    } 
                    else if(!this.gameOver){
                        this.score--;
                    }

                    
                }

                this.player.projectiles.forEach(projectile =>{
                    if (this.checkCollision(projectile, enemy)){
                        enemy.lives--;
                        // for (let i = 0; i < 10; i++) {
                            this.Particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height*0.5 ))
                            // }
                            
                        projectile.markForDeletion = true;
                        this.addExplosion(enemy);
                        if (enemy.lives <= 0){
                            this.sound.explosion();
                            enemy.markForDeletion = true;
                            for (let i = 0; i < enemy.score; i++) {
                                this.Particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height*0.5 ))
                            }

                            if (enemy.type === 'moon'){
                                this.player.enterPowerUp();
                            } 

                            if (enemy.type === 'hive') {
                                 for (let i = 0; i < 5; i++) { 
                                    
                                    this.enemies.push(new Drone(this,enemy.x + Math.random()*enemy.width, enemy.y + Math.random()*enemy.height*0.5))

                                 }
                            }

                           if (!this.gameOver) this.score += enemy.score;

                            // if(this.score > this.winningScore) this.gameOver = true; 
                        }

                    }
                })
            })
            this.enemies = this.enemies.filter(enemy=> !enemy.markForDeletion)

            if(this.enemyTimer > this.enemyInterval && !this.gameOver){
                this.addEnemy();
                this.enemyTimer = 0

            }else{
                this.enemyTimer += deltaTime;
            }


        }
        draw(context){
            this.Background.draw(context);
            this.player.draw(context);
            this.shield. draw(context)
            this.ui.draw(context);
            this.Particles.forEach(particle => particle.draw(context));
            this.explosions.forEach(explosion => explosion.draw(context));
            this.enemies.forEach(enemy =>{
                enemy.draw(context);
            });

            this.Background.layer4.draw(context);
        }

        
        addEnemy(){
            const randomize = Math.random();
            if (randomize < 0.1) this.enemies.push(new Angular_fish(this));
            else if(randomize < 0.3) this.enemies.push(new Stalker(this));
            else if(randomize < 0.5) this.enemies.push(new Razorfin(this));
            else if(randomize < 0.6) this.enemies.push(new Angular_fish2(this));
            else if(randomize < 0.7) this.enemies.push(new hive_whale(this));
            else if(randomize < 0.8) this.enemies.push(new BlubWhale(this));
            else if(randomize < 0.9) this.enemies.push(new Moon_fish(this));
            else this.enemies.push(new Lucky_fish(this));

            // console.log(this.enemies);
        }

        addExplosion(enemy){
            const randomize = Math.random();
            if (randomize < 0.5) this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width*0.5, enemy.y + enemy.height*0.5));
            else{
                this.explosions.push(new FireExplosion(this, enemy.x + enemy.width*0.5, enemy.y + enemy.height*0.5));
            }
            // console.log(this.explosions);
        }


        checkCollision(rect1,rect2){
            return(   rect1.x < rect2.x + rect2.width &&
                        rect1.x + rect1.width > rect2.x &&
                        rect1.y < rect2.y + rect2.height &&
                        rect1.y + rect1.height > rect2.y )

        }

    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    //  animation loop
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        // console.log(deltaTime);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        requestAnimationFrame(animate);  
    }
    animate(0);

})