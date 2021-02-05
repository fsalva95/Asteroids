var sceneWidth=window.innerWidth;
var sceneHeight=window.innerHeight;

var rollingSpeed=0.0001;

var planetRadius=85; //100  //test 20 //mio 85
var particleGeometry;
var propellerGeometry;
var propeller;
var explosionParticleCount=60;
var explosionValue =1.06;
var particles;
var camera;
var scene;
var renderer;
var dom;


var speedPlanetRotation= 0.01 ;





//asteroids
 var maxWidth = 100;
var maxHeight = 100;
var maxDepth = 100;


var dirLight;
var composition = [];
var diff=5;
var ww = window.innerWidth;
var	wh = window.innerHeight;
var pointCloud;
var asteroids = [];
var sunModel;
var explosionGeometry;
var explosion;
var worldAsteroids = [];
var spaceShip;
var sunLight;
var bullets = [];
var lifeRocks = [];

var textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin ( 'anonymous' );





var flagA=false;
var flagD=false;
var flagS=false;
var flagW=false;
var flagFire=false;
var fireCollision=false;
var flagFireDuringCollision=true;
var spaceShipDestroyed=false;
var disableStabilization=false; //per fermare la stabilizzazione dell aereo
var canShoot=true;
var flagEnd=false;


var maxleft=-8;
var maxright=8;
var maxdown=-0.6;
var maxup=0.6;
var controlSpeed=0.05;
var controlRotation=0.1;
var sizeWorldAsteroids;
var lifeRock=120;
var lifeSpaceShip=100;
var v=0;  //per rinculo
var v1=0;  //per rinculo





var energyText;
var powerText;
var energyBar;
var powerBar;
var distanceText;
var powervalue=0;
var distanceValue;
var distancevalue=0; 
var bulletPower=0;


var textureMars= textureLoader.load('./images/mars.jpg');
var textureSat= textureLoader.load('./images/saturn.jpg');
var militaryTexture= textureLoader.load('./images/spaceship.jpg');
var textureWorld = textureLoader.load('./images/earthmap1k.jpg');
var textureSWorld = textureLoader.load('./images/earthspec1k.jpg');
var textureRock = textureLoader.load( './images/rock.jpg');
var textureSun = textureLoader.load( './images/sun.jpg');


init();




function init() {

    createScene();
 
    update();
}




function createScene(){

    hasCollided=false;
  

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setClearColor(0x000000, 1);
	renderer.setSize( sceneWidth, sceneHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    dom = document.getElementById('MyCanvas');
    dom.appendChild(renderer.domElement);


    addStars();
	sphericalHelper = new THREE.Spherical();

	
	
	
	
	const urlParams = new URLSearchParams(window.location.search);
	var myParam = urlParams.get('shipTexture');
	console.log(myParam);
	if (myParam=="normal"){
		militaryTexture= textureLoader.load('./images/normal.jpg');
	}
	
	myParam = urlParams.get('planetTexture');
	console.log(myParam);
	if (myParam=="earth") addWorld();
	else if (myParam=="mars") addPlanetMars();
	else addPlanetSaturn();
	
	myParam = urlParams.get('difficulty');
	console.log(myParam);
	if (myParam=="easy"){
		speedPlanetRotation=0.007;
		lifeSpaceShip=140;
		
	}else if (myParam=="hard"){
		speedPlanetRotation=0.015;
		lifeSpaceShip=60;
	}

	addSpaceShip();
	addLight();
	addSun();
	createAsteroids();
    addExplosion();
	document.onkeydown = keyDown;
    document.onkeyup = keyUp;
	
	sizeWorldAsteroids=worldAsteroids.length;


    addHTML();
    camera.position.z = 50.5;
    camera.position.y = 80	;

    camera.lookAt(new THREE.Vector3(0,80,0));

}

function update(){
	
		
		if (!canShoot){
			powervalue-=0.5;
			if (powervalue<=0){
				canShoot=true;
			}
		}else  {
			if (powervalue>0){
				powervalue-=0.25;
			}
			
		}
		powerBar.value=powervalue;
		
		if (!disableStabilization){
			distancevalue+=1;
			distanceValue.innerHTML=distancevalue;
		}
		if (flagEnd){
			endHTML();
		}

		asteroidsLogic();
		doExplosion();
		propellerExecution();
		updateSpaceshipMovements();
		bulletCollision();
	
		composition['turretbase1'].rotation.y+=0.1;
		composition['turretbase2'].rotation.y+=0.1;
	
		composition['weaponbody1'].rotation.y+=0.25;
		composition['weaponbody2'].rotation.y+=0.25;

		for (var i=0 ; i< bullets.length; i++){
			if (bullets[i] === undefined ) continue;
			if (bullets[i].alive == false){
				bullets.splice(i,1);
				continue;
			}

			
			bullets[i].position.z-=bullets[i].velocity.y;
			
		}
		
		if (!hasCollided  && !spaceShipDestroyed){
			planet.rotation.x += speedPlanetRotation;
			controlSpeed=0.05;
			controlRotation=0.1;
			
		}else{
			if (spaceShipDestroyed){
				planet.rotation.x += 0;
			}
			else{
				controlSpeed=0.01;
				controlRotation=0.01;
				planet.rotation.x += 0.004;
			}
		}

		
		if (!flagEnd){
			sunModel.rotation.x+=0.01;
			sunModel.rotation.y+=0.01;
			
			pointCloud.rotation.x -= 0.0001;
			pointCloud.rotation.z -= 0.0001;
			if (asteroids !== null){
			asteroids.forEach(function(obj){
				  obj.rotation.x += 0.01;
				  obj.rotation.y += 0.01;
				  obj.rotation.z += 0.01;
			}); 
			}
			if (worldAsteroids !== null){
			worldAsteroids.forEach(function(obj){
				  obj.rotation.x += 0.01;
				  obj.rotation.y += 0.01;
				  //obj.rotation.z += 0.01;
			}); 
			}   
		}
		if (flagLeg){
			
			legMovements();
			
		}

	
    renderer.render(scene, camera);
    requestAnimationFrame(update);
}

function addHTML(){


	energyText = document.createElement('div');
	energyText.style.position = 'absolute';
	energyText.style.color = 'red';
	energyText.style.textAlign = 'center';
	energyText.style.bottom = '94.5%';
    energyText.style.left = '75%';
	energyText.innerHTML= 'Energy:';
	document.body.appendChild(energyText);
	
	
	energyBar = document.createElement('progress');
	energyBar.style.width = '80%';
	energyBar.value=lifeSpaceShip;
	energyBar.max=lifeSpaceShip;
	energyText.appendChild(energyBar);
	
	powerText = document.createElement('div');
	powerText.style.position = 'absolute';
	powerText.style.color = 'red';
	powerText.style.textAlign = 'center';
	powerText.style.bottom = '94.5%';
    powerText.style.left = '87%';
	powerText.innerHTML= 'Power:';
	document.body.appendChild(powerText);
	
	
	powerBar = document.createElement('progress');
	powerBar.style.width = '80%';
	powerBar.style.background = 'blue';
	powerBar.value=80;
	powerBar.max=100;
	powerBar.innerHTML=100;
	powerText.appendChild(powerBar);
	
	
	distanceText = document.createElement('div');
	distanceText.style.position = 'absolute';
	distanceText.style.color = 'red';
	distanceText.style.textAlign = 'center';
	distanceText.style.bottom = '89.5%';
    distanceText.style.left = '68%';
	distanceText.innerHTML= 'Distance:';
	document.body.appendChild(distanceText);
	
	
	distanceValue = document.createElement('div');
	distanceValue.style.textAlign = 'center';
	distanceValue.style.fontSize = '40px';
	distanceValue.innerHTML=distancevalue;
	distanceText.appendChild(distanceValue);
	
	
	
  
}




function addLight(){
    var light = new THREE.HemisphereLight(0xffffff,0x000000, 0.9)
    scene.add(light);
    dirLight = new THREE.DirectionalLight( 0xffffff, 0.8);
    dirLight.position.set( 13,10,-6 );
    scene.add(dirLight);

}





function addSun(){
	var sunGeometry = new THREE.SphereGeometry( 5, 80, 80);
    var sunMaterial = new THREE.MeshLambertMaterial( {
    map: textureSun,
    shading: THREE.SmoothShading,
    opacity: .5, transparent: false } );
	
	sunModel = new THREE.Mesh( sunGeometry, sunMaterial );
    sunModel.receiveShadow = true;
    sunModel.castShadow=false;
	
	
	sunLight = new THREE.PointLight(0xfffafa,5,3000)   //400
    sunLight.add(sunModel);
	sunLight.position.y=540; //test 75  //mio -18
    sunLight.position.z=-1100;
	sunLight.position.x=-860;
	
	
	scene.add( sunLight );
	
	sunModel.scale.x+=40;
    sunModel.scale.y+=40;
	sunModel.scale.z+=40;
    
	
	
	
}


function keyDown(keyEvent){
	
	if (!disableStabilization){
	
		if ( keyEvent.keyCode === 37 || keyEvent.code == 'KeyA') {//left
			flagA=true;

		} else if ( keyEvent.keyCode === 39 || keyEvent.code == 'KeyD') {//right
			flagD=true;

		}else if ( keyEvent.keyCode === 38 || keyEvent.code == 'KeyW'){//up

			flagW=true;
		} else if ( keyEvent.keyCode === 40 || keyEvent.code == 'KeyS'){//down

			flagS=true;
		}
			
		if ( keyEvent.keyCode === 32 && flagFireDuringCollision && canShoot) { //space
			flagFire=true;
			powervalue+=5;
			powerBar.value=powervalue;
			if (powervalue>=100){
				canShoot=false;
			}
			
			if (flagFire){
				var bullet= new THREE.Mesh(
					new THREE.SphereGeometry(0.18,8,8),
					new THREE.MeshBasicMaterial({color:0xb60303})
				);
				
				bullet.velocity= new THREE.Vector3(0,1.5,0);
				var pos= new THREE.Vector3();
				pos.setFromMatrixPosition(composition['weapontop1'].matrixWorld);
				bullet.position.x=pos.x;
				bullet.position.y=pos.y;
				bullet.position.z=pos.z;
				
				
				bullet.alive = true;
				setTimeout(function(){
					bullet.alive = false;
					scene.remove(bullet);
					},1000);
					
				bullets.push(bullet);
				
				scene.add(bullet);
				
				var bullet1= new THREE.Mesh(
					new THREE.SphereGeometry(0.18,8,8),
					new THREE.MeshBasicMaterial({color:0xb60303})
				);
				
				bullet1.velocity= new THREE.Vector3(0,1.5,0);
				
				var pos1= new THREE.Vector3();
				pos1.setFromMatrixPosition(composition['weapontop2'].matrixWorld);
				bullet1.position.x=pos1.x;
				bullet1.position.y=pos1.y;
				bullet1.position.z=pos1.z;
				
				
				bullet1.alive = true;
				setTimeout(function(){
					bullet1.alive = false;
					scene.remove(bullet1);
					},1000);
					
				bullets.push(bullet1);
				
				scene.add(bullet1);
				
				var bullet2= new THREE.Mesh(
					new THREE.SphereGeometry(0.18,8,8),
					new THREE.MeshBasicMaterial({color:0xb60303})
				);
				
				bullet2.velocity= new THREE.Vector3(0,1.5,0);
				
				var pos2= new THREE.Vector3();
				pos2.setFromMatrixPosition(composition['turrettop1'].matrixWorld);
				bullet2.position.x=pos2.x;
				bullet2.position.y=pos2.y;
				bullet2.position.z=pos2.z;
				
				
				bullet2.alive = true;
				setTimeout(function(){
					bullet2.alive = false;
					scene.remove(bullet2);
					},1000);
					
				bullets.push(bullet2);
				
				scene.add(bullet2);
				
				var bullet3= new THREE.Mesh(
					new THREE.SphereGeometry(0.18,8,8),
					new THREE.MeshBasicMaterial({color:0xb60303})
				);
				
				bullet3.velocity= new THREE.Vector3(0,1.5,0);
				
				var pos3= new THREE.Vector3();
				pos3.setFromMatrixPosition(composition['turrettop2'].matrixWorld);
				bullet3.position.x=pos3.x;
				bullet3.position.y=pos3.y;
				bullet3.position.z=pos3.z;
				
				
				bullet3.alive = true;
				setTimeout(function(){
					bullet3.alive = false;
					scene.remove(bullet3);
					},1000);
					
				bullets.push(bullet3);
				
				scene.add(bullet3);
				
				
				
				if (composition['turretbase1'].position.y<=v){
					composition['turretbase1'].position.y = (8 - composition['turretbase1'].position.y)*0.35+ composition['turretbase1'].position.y;
					
				}else if(composition['turretbase1'].position.y>=v+1){
	
					composition['turretbase1'].position.y = (v-2 - composition['turretbase1'].position.y)*0.35+ composition['turretbase1'].position.y;
				}
				if (composition['turretbase2'].position.y<=v1){
					composition['turretbase2'].position.y = (8 - composition['turretbase2'].position.y)*0.35+ composition['turretbase2'].position.y;
					
				}else if(composition['turretbase2'].position.y>=v1+1){
	
					composition['turretbase2'].position.y = (v1-2 - composition['turretbase2'].position.y)*0.35+ composition['turretbase2'].position.y;
				}
			}
			
			
		}
	}


}


function keyUp(keyEvent){
	
	if (!disableStabilization){
	
		if ( keyEvent.keyCode === 38 || keyEvent.code == 'KeyW'){//up

			flagW=false;
		}

		else if ( keyEvent.keyCode === 37 || keyEvent.code == 'KeyA'){//left

			flagA=false;
		}
		else if ( keyEvent.keyCode === 39 || keyEvent.code == 'KeyD'){//right

			flagD=false;
		}
		else if ( keyEvent.keyCode === 40 || keyEvent.code == 'KeyS'){//down
			flagS=false;
		}
		if ( keyEvent.keyCode === 32) { //space
			flagFire=false;

		}
	}
}

function legMovements(){

	
	if (start){
		
		
		if (composition['leg11'].rotation.x>THREE.Math.degToRad(-30) && composition['leg21'].rotation.x>THREE.Math.degToRad(-30) &&
		composition['leg31'].rotation.x<THREE.Math.degToRad(30) && composition['lrot1'].rotation.x>THREE.Math.degToRad(-15) &&
		composition['lrot2'].rotation.x>THREE.Math.degToRad(-15) && composition['lrot3'].rotation.x>THREE.Math.degToRad(-15)){
			composition['leg11'].rotation.x-=THREE.Math.degToRad(1);
			composition['leg21'].rotation.x-=THREE.Math.degToRad(1);
			composition['leg31'].rotation.x+=THREE.Math.degToRad(1);
			composition['lrot1'].rotation.x-=THREE.Math.degToRad(1);
			composition['lrot2'].rotation.x-=THREE.Math.degToRad(1);
			composition['lrot3'].rotation.x-=THREE.Math.degToRad(1);
			
			
			
		}else{
			start=false;
		}
			
		
		
	}
	if (!start){ 
		if (composition['leg11'].rotation.x>=THREE.Math.degToRad(30) || bol1){
			bol1=true;
			composition['leg11'].rotation.x-=THREE.Math.degToRad(2);
			composition['lrot1'].rotation.x= (THREE.Math.degToRad(0) - composition['lrot1'].rotation.x)*(0.15)+ composition['lrot1'].rotation.x;

		
		}
		
		if (composition['leg11'].rotation.x<=THREE.Math.degToRad(-20) || !bol1){
			bol1=false;
			composition['leg11'].rotation.x+=THREE.Math.degToRad(2);
			composition['lrot1'].rotation.x-= THREE.Math.degToRad(2);

		}
		if (composition['leg21'].rotation.x>=THREE.Math.degToRad(30) || bol2){
			bol2=true;
			composition['leg21'].rotation.x-=THREE.Math.degToRad(2);
			composition['lrot2'].rotation.x= (THREE.Math.degToRad(0) - composition['lrot2'].rotation.x)*(0.15)+ composition['lrot2'].rotation.x;

		
		}
		
		if (composition['leg21'].rotation.x<=THREE.Math.degToRad(-20) || !bol2){
			bol2=false;
			composition['leg21'].rotation.x+=THREE.Math.degToRad(2);
			composition['lrot2'].rotation.x-= THREE.Math.degToRad(2);

		}
		
		if (composition['leg31'].rotation.x>=THREE.Math.degToRad(30) || bol3){
			bol3=true;
			composition['leg31'].rotation.x-=THREE.Math.degToRad(2);
			composition['lrot3'].rotation.x= (THREE.Math.degToRad(0) - composition['lrot3'].rotation.x)*(0.15)+ composition['lrot3'].rotation.x;

		
		}
		
		if (composition['leg31'].rotation.x<=THREE.Math.degToRad(-20) || !bol3){
			bol3=false;
			composition['leg31'].rotation.x+=THREE.Math.degToRad(2);
			composition['lrot3'].rotation.x-= THREE.Math.degToRad(2);

		}
	
	}
	
	
	
	
	
	
}

var flagLeg=false;
var bol1=false;
var bol2=false;
var bol3=false;
var start=false;

function updateSpaceshipMovements(){
	
	if (flagA==false && flagD==false && flagS==false && flagW==false && !disableStabilization){
														
		spaceShip.rotation.x= (THREE.Math.degToRad(-70) - spaceShip.rotation.x)*controlRotation+ spaceShip.rotation.x;
		spaceShip.rotation.y= (0 - spaceShip.rotation.y)*controlRotation+ spaceShip.rotation.y;
		spaceShip.rotation.z= (0 - spaceShip.rotation.z)*controlRotation+ spaceShip.rotation.z;
		composition['rot1'].rotation.y= (THREE.Math.degToRad(0) - composition['rot1'].rotation.y)*(controlRotation)+ composition['rot1'].rotation.y;
		composition['rot2'].rotation.y= (THREE.Math.degToRad(0) - composition['rot2'].rotation.y)*(controlRotation)+ composition['rot2'].rotation.y;
	
		if (!flagLeg){
			composition['lrot1'].rotation.x= (THREE.Math.degToRad(0) - composition['lrot1'].rotation.x)*(controlRotation)+ composition['lrot1'].rotation.x;
			composition['lrot2'].rotation.x= (THREE.Math.degToRad(0) - composition['lrot2'].rotation.x)*(controlRotation)+ composition['lrot2'].rotation.x;
			composition['lrot3'].rotation.x= (THREE.Math.degToRad(0) - composition['lrot3'].rotation.x)*(controlRotation)+ composition['lrot3'].rotation.x;
		}
		if (composition['lrot1'].rotation.x<=THREE.Math.degToRad(0)){
			
			flagLeg=true;
			start=true;
			
		}	
	}
	else{
		if (!disableStabilization){
			if (flagA==true){
				if (spaceShip.position.x>maxleft){
					spaceShip.position.x= (-10 - spaceShip.position.x)*controlSpeed+ spaceShip.position.x;
				}
				spaceShip.rotation.y= (THREE.Math.degToRad(-45) - spaceShip.rotation.y)*controlRotation+ spaceShip.rotation.y;
				composition['rot1'].rotation.y= (THREE.Math.degToRad(-90) - composition['rot1'].rotation.y)*(controlRotation+0.1)+ composition['rot1'].rotation.y;
				composition['rot2'].rotation.y= (THREE.Math.degToRad(90) - composition['rot2'].rotation.y)*(controlRotation+0.1)+ composition['rot2'].rotation.y;
				
			}else if (flagD==true){
				if (spaceShip.position.x<maxright){
					spaceShip.position.x= (10 - spaceShip.position.x)*controlSpeed+ spaceShip.position.x;
				}
				
				spaceShip.rotation.y= (THREE.Math.degToRad(45) - spaceShip.rotation.y)*controlRotation+ spaceShip.rotation.y;
				composition['rot1'].rotation.y= (THREE.Math.degToRad(-90) - composition['rot1'].rotation.y)*(controlRotation+0.1)+ composition['rot1'].rotation.y;
				composition['rot2'].rotation.y= (THREE.Math.degToRad(90) - composition['rot2'].rotation.y)*(controlRotation+0.1)+ composition['rot2'].rotation.y;
				
			}
			else if (flagS==true){
				spaceShip.rotation.x= (THREE.Math.degToRad(-110) - spaceShip.rotation.x)*(controlRotation)+ spaceShip.rotation.x;
				spaceShip.position.y= (maxdown - spaceShip.position.y)*(controlSpeed+0.02)+ spaceShip.position.y;
				composition['rot1'].rotation.y= (THREE.Math.degToRad(-90) - composition['rot1'].rotation.y)*(controlRotation+0.1)+ composition['rot1'].rotation.y;
				composition['rot2'].rotation.y= (THREE.Math.degToRad(90) - composition['rot2'].rotation.y)*(controlRotation+0.1)+ composition['rot2'].rotation.y;
			}else if (flagW==true){
				spaceShip.rotation.x= (THREE.Math.degToRad(-30) - spaceShip.rotation.x)*(controlRotation)+ spaceShip.rotation.x;
				spaceShip.position.y= (maxup - spaceShip.position.y)*(controlSpeed+0.02)+ spaceShip.position.y;
				composition['rot1'].rotation.y= (THREE.Math.degToRad(-90) - composition['rot1'].rotation.y)*(controlRotation+0.1)+ composition['rot1'].rotation.y;
				composition['rot2'].rotation.y= (THREE.Math.degToRad(90) - composition['rot2'].rotation.y)*(controlRotation+0.1)+ composition['rot2'].rotation.y;
			}
			flagLeg=false;
			composition['lrot1'].rotation.x= (THREE.Math.degToRad(-90) - composition['lrot1'].rotation.x)*(controlRotation+0.1)+ composition['lrot1'].rotation.x;
			composition['lrot2'].rotation.x= (THREE.Math.degToRad(-90) - composition['lrot2'].rotation.x)*(controlRotation+0.1)+ composition['lrot2'].rotation.x;
			composition['lrot3'].rotation.x= (THREE.Math.degToRad(-90) - composition['lrot3'].rotation.x)*(controlRotation+0.1)+ composition['lrot3'].rotation.x;

		}

		
		
	}
	
	composition['turretbase1'].position.y= (0-composition['turretbase1'].position.y)*0.3+ composition['turretbase1'].position.y;
	composition['turretbase2'].position.y= (0-composition['turretbase2'].position.y)*0.3+ composition['turretbase2'].position.y;
	

	
	
}


function addWorld(){
    var sides=80;
    var tiers=80; 

    var sphereGeometry = new THREE.SphereGeometry( planetRadius, sides,tiers);
    var sphereMaterial = new THREE.MeshStandardMaterial( {map: textureWorld, specMap: textureSWorld, roughness: 0.9} )
	sphereMaterial.bumpMap = textureLoader.load('./images/earthbump1k.jpg');
	sphereMaterial.bumpScale = 0.8;



    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.receiveShadow = true;
    planet.castShadow=false;
    planet.rotation.z=-80;

    scene.add( planet );
    planet.position.y=-18;   //test 75  //mio -18
    planet.position.z=2;
    addWorldAsteroids();
	
	
	
	
}


function addPlanetMars(){
    var sides=80;
    var tiers=80; 

    var sphereGeometry = new THREE.SphereGeometry( planetRadius, sides,tiers);
    var sphereMaterial = new THREE.MeshStandardMaterial( {map: textureMars, roughness: 0.9} )

    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.receiveShadow = true;
    planet.castShadow=false;
    planet.rotation.z=-80;
	

    scene.add( planet );
    planet.position.y=-18; 
    planet.position.z=2;
    addWorldAsteroids();

	
}


function addPlanetSaturn(){
    var sides=80;
    var tiers=80; 

    var sphereGeometry = new THREE.SphereGeometry( planetRadius, sides,tiers);
    var sphereMaterial = new THREE.MeshStandardMaterial( {map: textureSat, roughness: 15} )

    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.receiveShadow = true;
    planet.castShadow=false;
    planet.rotation.z=-80;
	

    scene.add( planet );
    planet.position.y=-18; 
    planet.position.z=2;
    addWorldAsteroids();

	
}


function addWing(){
    var wing = new THREE.Group(),
        composition = [];

    composition['wing'] = new THREE.BoxGeometry( 10, 8, 1.8 );
    composition['wing'].vertices[4].y -= 11;
    composition['wing'].vertices[5].y -= 11;
    composition['wing'].vertices[6].y -= 5;
    composition['wing'].vertices[7].y -= 5;
    composition['wing'].needsUpdate = true;

    composition['wingMesh'] = new THREE.Mesh( composition['wing'],  new THREE.MeshStandardMaterial( {map: militaryTexture} ) );

    wing.add(composition['wingMesh']);

    composition['bottomwing'] = new THREE.BoxGeometry( 2, 9, 2 );
    composition['bottomwing'].vertices[4].y -= 0.5;
    composition['bottomwing'].vertices[5].y -= 0.5;
    composition['bottomwing'].vertices[4].x -= 1;
    composition['bottomwing'].vertices[5].x -= 1;

    composition['bottomwing'].vertices[6].y -= 1;
    composition['bottomwing'].vertices[7].y -= 1;
    composition['bottomwing'].vertices[6].x += 1;
    composition['bottomwing'].vertices[7].x += 1;
    composition['bottomwing'].needsUpdate = true;

    composition['bottomwingMesh'] = new THREE.Mesh( composition['bottomwing'], new THREE.MeshStandardMaterial({color: 0x333333}));
	composition['bottomwingMesh'].position.x=5.3;
    wing.add(composition['bottomwingMesh']);
	

	


    return wing;
}

function addLegs(){
	
	
	composition['leg11'] = new THREE.Mesh( new THREE.BoxGeometry(1.2,1.2,3),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['body2'].add(composition['leg11']);
	composition['leg11'].position.x+=2.5;
	composition['leg11'].position.z-=5.5;
	composition['leg11'].position.y-=2;	
	composition['lrot1'] = new THREE.Mesh( new THREE.SphereGeometry(1,80,80),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['lrot1'].position.z-=1.4;
	composition['leg11'].add(composition['lrot1']);
	composition['leg12'] = new THREE.Mesh( new THREE.BoxGeometry(1,1,3),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['lrot1'].add(composition['leg12']);
	composition['leg12'].position.z-=2;
	composition['wheel11']= new THREE.Mesh( new THREE.CylinderGeometry(1.3,1.3,0.8,16),  new THREE.MeshStandardMaterial({color: 0x0f0e0d}));
	composition['leg12'].add(composition['wheel11']);
	composition['wheel11'].position.z-=1.5;
	composition['wheel11'].position.x+=0.7;
	composition['wheel11'].rotation.z+=THREE.Math.degToRad(-90);
	composition['wheel12']= new THREE.Mesh( new THREE.CylinderGeometry(1.3,1.3,0.8,16),  new THREE.MeshStandardMaterial({color: 0x0f0e0d}));
	composition['leg12'].add(composition['wheel12']);
	composition['wheel12'].position.z-=1.5;
	composition['wheel12'].position.x-=0.7;
	composition['wheel12'].rotation.z+=THREE.Math.degToRad(-90);
	
	
	
	composition['leg21'] = new THREE.Mesh( new THREE.BoxGeometry(1.2,1.2,3),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['body2'].add(composition['leg21']);
	composition['leg21'].position.x-=2.5;
	composition['leg21'].position.z-=5.5;
	composition['leg21'].position.y-=2;	
	composition['lrot2'] = new THREE.Mesh( new THREE.SphereGeometry(1,80,80),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['lrot2'].position.z-=1.4;
	composition['leg21'].add(composition['lrot2']);
	composition['leg22'] = new THREE.Mesh( new THREE.BoxGeometry(1,1,3),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['lrot2'].add(composition['leg22']);
	composition['leg22'].position.z-=2;
	composition['wheel21']= new THREE.Mesh( new THREE.CylinderGeometry(1.3,1.3,0.8,16),  new THREE.MeshStandardMaterial({color: 0x0f0e0d}));
	composition['leg22'].add(composition['wheel21']);
	composition['wheel21'].position.z-=1.5;
	composition['wheel21'].position.x+=0.7;
	composition['wheel21'].rotation.z+=THREE.Math.degToRad(-90);
	composition['wheel22']= new THREE.Mesh( new THREE.CylinderGeometry(1.3,1.3,0.8,16),  new THREE.MeshStandardMaterial({color: 0x0f0e0d}));
	composition['leg22'].add(composition['wheel22']);
	composition['wheel22'].position.z-=1.5;
	composition['wheel22'].position.x-=0.7;
	composition['wheel22'].rotation.z+=THREE.Math.degToRad(-90);
	
	
	
	composition['leg31'] = new THREE.Mesh( new THREE.BoxGeometry(1.2,1.2,3),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['body2'].add(composition['leg31']);
	composition['leg31'].position.z-=5.5;
	composition['leg31'].position.y+=6.5;	
	composition['lrot3'] = new THREE.Mesh( new THREE.SphereGeometry(1,80,80),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['lrot3'].position.z-=1.4;
	composition['leg31'].add(composition['lrot3']);
	composition['leg32'] = new THREE.Mesh( new THREE.BoxGeometry(1,1,3),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['lrot3'].add(composition['leg32']);
	composition['leg32'].position.z-=2;
	composition['wheel31']= new THREE.Mesh( new THREE.CylinderGeometry(1.3,1.3,0.8,16),  new THREE.MeshStandardMaterial({color: 0x0f0e0d}));
	composition['leg32'].add(composition['wheel31']);
	composition['wheel31'].position.z-=1.5;
	composition['wheel31'].position.x+=0.7;
	composition['wheel31'].rotation.z+=THREE.Math.degToRad(-90);
	composition['wheel32']= new THREE.Mesh( new THREE.CylinderGeometry(1.3,1.3,0.8,16),  new THREE.MeshStandardMaterial({color: 0x0f0e0d}));
	composition['leg32'].add(composition['wheel32']);
	composition['wheel32'].position.z-=1.5;
	composition['wheel32'].position.x-=0.7;
	composition['wheel32'].rotation.z+=THREE.Math.degToRad(-90);


	



}

function addTurret(){
	var wing = new THREE.Group();
	composition['base1'] = new THREE.Mesh( new THREE.BoxGeometry(1.3,1.4,1.4),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['body2'].add(composition['base1']);
	composition['base1'].position.x+=4;
	composition['base1'].position.z+=4;
	composition['base1'].rotation.y+=THREE.Math.degToRad(-45)
	composition['base2'] = new THREE.Mesh( new THREE.BoxGeometry(1.3,1.4,1.4),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['body2'].add(composition['base2']);
	composition['base2'].position.x-=4;
	composition['base2'].position.z+=4;
	composition['base2'].rotation.y+=THREE.Math.degToRad(45)
	
	
	composition['rot1'] = new THREE.Mesh( new THREE.SphereGeometry(1.1,80,80),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['rot1'].position.x+=1.4;
	composition['base1'].add(composition['rot1']);
	composition['rot2'] = new THREE.Mesh( new THREE.SphereGeometry(1.1,80,80),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['rot2'].position.x-=1.4;
	composition['base2'].add(composition['rot2']);
	
	composition['base1top'] = new THREE.Mesh( new THREE.BoxGeometry(1.5,1.2,1.2),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['base1top'].position.x+=1.6;
	composition['rot1'].add(composition['base1top']);
	composition['base2top'] = new THREE.Mesh( new THREE.BoxGeometry(1.5,1.2,1.2),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['base2top'].position.x-=1.6;
	composition['rot2'].add(composition['base2top']);
	
	composition['turretbase1']= new THREE.Mesh( new THREE.CylinderGeometry(1.3,1.3,5,16),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase1'].position.x+=1.5;
	composition['turretbase1'].position.y+=0.5;
	composition['base1top'].add(composition['turretbase1']);
	composition['turretbase1'].scale.set(1.1,1.1,1.1);
	composition['turretbase2']= new THREE.Mesh( new THREE.CylinderGeometry(1.3,1.3,5,16),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase2'].position.x-=1.5;
	composition['turretbase2'].position.y+=0.5;
	composition['base2top'].add(composition['turretbase2']);
	composition['turretbase2'].scale.set(1.1,1.1,1.1);
		
	composition['turretr1']= new THREE.Mesh( new THREE.CylinderGeometry(0.3,0.3,3,8),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase1'].add(composition['turretr1']);
	composition['turretr1'].position.y+=4;
	composition['turretr1'].position.x+=0.7;
	composition['turretr2']= new THREE.Mesh( new THREE.CylinderGeometry(0.3,0.3,3,8),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase1'].add(composition['turretr2']);
	composition['turretr2'].position.y+=4;
	composition['turretr2'].position.x-=0.7;
	composition['turretr3']= new THREE.Mesh( new THREE.CylinderGeometry(0.3,0.3,3,8),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase1'].add(composition['turretr3']);
	composition['turretr3'].position.y+=4;
	composition['turretr3'].position.z+=0.7;
	composition['turretr4']= new THREE.Mesh( new THREE.CylinderGeometry(0.3,0.3,3,8),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase1'].add(composition['turretr4']);
	composition['turretr4'].position.y+=4;
	composition['turretr4'].position.z-=0.7;
	composition['turrettop1']= new THREE.Mesh( new THREE.CylinderGeometry(1.3,1.3,0.5,16),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase1'].add(composition['turrettop1']);
	composition['turrettop1'].position.y+=4.7;
	composition['turretl1']= new THREE.Mesh( new THREE.CylinderGeometry(0.3,0.3,3,8),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase2'].add(composition['turretl1']);
	composition['turretl1'].position.y+=4;
	composition['turretl1'].position.x+=0.7;
	composition['turretl2']= new THREE.Mesh( new THREE.CylinderGeometry(0.3,0.3,3,8),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase2'].add(composition['turretl2']);
	composition['turretl2'].position.y+=4;
	composition['turretl2'].position.x-=0.7;
	composition['turretl3']= new THREE.Mesh( new THREE.CylinderGeometry(0.3,0.3,3,8),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase2'].add(composition['turretl3']);
	composition['turretl3'].position.y+=4;
	composition['turretl3'].position.z+=0.7;
	composition['turretl4']= new THREE.Mesh( new THREE.CylinderGeometry(0.3,0.3,3,8),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase2'].add(composition['turretl4']);
	composition['turretl4'].position.y+=4;
	composition['turretl4'].position.z-=0.7;
	composition['turrettop2']= new THREE.Mesh( new THREE.CylinderGeometry(1.3,1.3,0.5,16),  new THREE.MeshStandardMaterial({color: 0xb6b5b2}));
	composition['turretbase2'].add(composition['turrettop2']);
	composition['turrettop2'].position.y+=4.7;
	
	
	
	v= composition['turretbase1'].position.y;
	v1= composition['turretbase2'].position.y;
	
	//spaceShip.rotation.z=THREE.Math.degToRad(90)
}

function addSpaceShip(){

	
	
	spaceShip = new THREE.Object3D();
	composition['body2'] = new THREE.Mesh( new THREE.CylinderGeometry( 5, 5.2, 15, 32 ),  new THREE.MeshStandardMaterial( {map: militaryTexture} ) );
    spaceShip.add(composition['body2']);
	
	addTurret();
	addLegs();

	
	
	composition['wing1'] = addWing();
    spaceShip.add(composition['wing1']);
	composition['wing1'].position.x=-11.3;
	
	
	composition['wing2'] = addWing();
    spaceShip.add(composition['wing2']);
	composition['wing2'].position.x=+11.3;
	composition['wing2'].rotation.y=(Math.PI / 180) * -180;  //simmetria
	
	
	composition['weaponbody1'] = new THREE.Mesh( new THREE.CylinderGeometry( 1.3, 1.3, 3, 8 ), new THREE.MeshStandardMaterial({color: 0x25251d}));
	composition['weaponbody1'].position.x=-17.2;
	composition['weaponbody1'].position.z=0;
	composition['weaponbody1'].position.y=-8;
    spaceShip.add(composition['weaponbody1']);
	composition['weapontop1'] = new THREE.Mesh( new THREE.CylinderGeometry( 0, 1.3, 2.5, 8 ), new THREE.MeshStandardMaterial({color: 0x25251d}));
	composition['weapontop1'].position.y+=2.5;
    composition['weaponbody1'].add(composition['weapontop1']);
	
	
	composition['weaponbody2'] = new THREE.Mesh( new THREE.CylinderGeometry( 1.3, 1.3, 3, 8 ), new THREE.MeshStandardMaterial({color: 0x25251d}));
	composition['weaponbody2'].position.x=+17.2;
	composition['weaponbody2'].position.z=0;
	composition['weaponbody2'].position.y=-8;
    spaceShip.add(composition['weaponbody2']);
	composition['weapontop2'] = new THREE.Mesh( new THREE.CylinderGeometry( 0, 1.3, 2.5, 8 ), new THREE.MeshStandardMaterial({color: 0x25251d}));
	composition['weapontop2'].position.y+=2.5;
    composition['weaponbody2'].add(composition['weapontop2']);
	
	var geomBlade = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1);
	var matBlade = new THREE.MeshPhongMaterial({
    color: 0xb6b5b2,
    shading: THREE.FlatShading
	});
	var blade1 = new THREE.Mesh(geomBlade, matBlade);
	blade1.scale.set(0.08,0.08,0.08);
	blade1.position.y-=1.3;

	blade1.castShadow = true;
	blade1.receiveShadow = true;

	var blade2 = blade1.clone();
	blade1.rotation.y = Math.PI / 2;
	blade1.rotation.x = Math.PI / 2;
	blade2.rotation.z = Math.PI / 2;


	blade2.castShadow = true;
	blade2.receiveShadow = true;

	composition['weaponbody2'].add(blade1);
	composition['weaponbody2'].add(blade2);
	
	var geomBlade1 = new THREE.BoxGeometry(1, 80, 10, 1, 1, 1);
	var matBlade1 = new THREE.MeshPhongMaterial({
    color: 0xb6b5b2,
    shading: THREE.FlatShading
	});
	var blade3 = new THREE.Mesh(geomBlade1, matBlade1);
	blade3.scale.set(0.08,0.08,0.08);
	blade3.position.y-=1.3;

	blade3.castShadow = true;
	blade3.receiveShadow = true;

	var blade4 = blade3.clone();
	blade3.rotation.y = Math.PI / 2;
	blade3.rotation.x = Math.PI / 2;
	blade4.rotation.z = Math.PI / 2;


	blade4.castShadow = true;
	blade4.receiveShadow = true;

	composition['weaponbody1'].add(blade3);
	composition['weaponbody1'].add(blade4);
	
	
	composition['up'] = new THREE.Mesh( new THREE.CylinderGeometry( 2, 5, 15, 32 ),  new THREE.MeshStandardMaterial( {map: militaryTexture} ) );
	composition['up'].position.y=15.03;
    spaceShip.add(composition['up']);
	
	
	composition['bottom'] = new THREE.Mesh( new THREE.CylinderGeometry( 5, 3, 1.6, 6 ), new THREE.MeshStandardMaterial({color: 0xe6e6df}) );
    composition['bottom'].position.y = -8.5;
    spaceShip.add(composition['bottom']);
	
	composition['window'] = new THREE.Mesh( new THREE.SphereGeometry( 2.3,80,80), new THREE.MeshStandardMaterial({color: 0x25251d}) );
    composition['window'].position.y = 14;
	composition['window'].position.z = 3;
    spaceShip.add(composition['window']);
	
	composition['up1'] = new THREE.Mesh( new THREE.CylinderGeometry( 0.3, 2, 7, 32 ),  new THREE.MeshStandardMaterial( {map: militaryTexture} ));
	composition['up1'].position.y=26;
    spaceShip.add(composition['up1']);
	composition['up2'] = new THREE.Mesh( new THREE.CylinderGeometry( 0.3, 0.3, 6, 32 ), new THREE.MeshStandardMaterial({color: 0x25251d}) );
	composition['up2'].position.y=32.5;
    spaceShip.add(composition['up2']);
	
	
	
	composition['propeller1'] = addPropeller();
	composition['propeller1'].scale.set(0.5,0.8,0.4);
    composition['propeller1'].position.y=-15;  
    composition['propeller1'].position.x=-2.6;    
    composition['propeller1'].position.z=-2;
    spaceShip.add(composition['propeller1']);


	spaceShip.scale.set(0.12,0.12,0.12);
    spaceShip.position.y = 81.5;
	maxup=spaceShip.position.y+2;
	maxdown=spaceShip.position.y-3;
	
    spaceShip.rotation.x = THREE.Math.degToRad(-70);
    spaceShip.position.z = 40;

    scene.add(spaceShip);
	
}






function addStars() {

	var material1 = new THREE.PointsMaterial({
      color: 0x555555
    });
    
    var geometry1 = new THREE.Geometry();
    var x, y, z;
    for(var i=0;i<2000;i++){
      x = (Math.random() * ww *2) - ww;
      y = (Math.random() * wh * 2) - wh;
      z = (Math.random() * 3000) - 1500;
      
      geometry1.vertices.push(new THREE.Vector3(x, y, z));
    };
    
    pointCloud = new THREE.Points(geometry1, material1);
    scene.add(pointCloud);
  
}




function createAsteroids(){
  var maxWidth = 100;
  var maxHeight = 100;
  var maxDepth = 100;

  for(var i=0;i<200;i++){
    asteroids.push(createRocks(2+Math.random()*5,1800,maxWidth,maxHeight,maxDepth));
  }
  
  
  for(var i=0;i<200;i++){
    asteroids.push(createRocks1(2+Math.random()*5,1800,maxWidth,maxHeight,maxDepth));
  }

  
}

function createRocks(size,spreadX,maxWidth,maxHeight,maxDepth){
	

	
	var rockgeometry = new THREE.DodecahedronGeometry(size, 1);
	rockgeometry.vertices.forEach(function(v){
    v.x += (0-Math.random()*(size/4));
    v.y += (0-Math.random()*(size/4));
    v.z += (0-Math.random()*(size/4));
  });

  var rocktexture = new THREE.MeshStandardMaterial({color:0xD05F2F,
										map: textureRock,
                                        shading: THREE.FlatShading,
										aoMapIntensity: 1,
                                            roughness: 0.8,
                                      metalness: 1
                                        });  
  
  var obj = new THREE.Mesh(rockgeometry, rocktexture);
  obj.castShadow = true;
  obj.receiveShadow = false;
  obj.scale.set(1+Math.random()*0.4,1+Math.random()*0.8,1+Math.random()*0.4);
									
  var x = spreadX-Math.random()*spreadX*Math.random()*Math.random()+200; 
  var centeredness = (1-(Math.abs(x)/(maxWidth/2)));
  var y = (maxHeight/2-Math.random()*maxHeight)*centeredness;
  var z = (maxDepth/2-Math.random()*maxDepth)*centeredness;
  obj.position.set(400+x*Math.random(),y,z);   // 100 700 100
  obj.r = {};
  obj.r.x = Math.random() * 0.005;
  obj.r.y = Math.random() * 0.005;
  obj.r.z = Math.random() * 0.005;
  
  planet.add(obj);
  
  return obj;
  
}


function createRocks1(size,spreadX,maxWidth,maxHeight,maxDepth){
	

	
	var rockgeometry = new THREE.DodecahedronGeometry(size, 1);
	rockgeometry.vertices.forEach(function(v){
    v.x += (0-Math.random()*(size/4));
    v.y += (0-Math.random()*(size/4));
    v.z += (0-Math.random()*(size/4));
  });
 
  var rocktexture = new THREE.MeshStandardMaterial({color:0xD05F2F,
										map: textureRock,
                                        shading: THREE.FlatShading,
										aoMapIntensity: 1,
                                            roughness: 0.8,
                                      metalness: 1
                                        });  
  
  var obj = new THREE.Mesh(rockgeometry, rocktexture);
  obj.castShadow = true;
  obj.receiveShadow = false;
  obj.scale.set(1+Math.random()*0.4,1+Math.random()*0.8,1+Math.random()*0.4);

  var x = -1*(spreadX-Math.random()*spreadX*Math.random()+Math.random()*300);
  var centeredness = (1-(Math.abs(x)/(maxWidth/2)));
  var y = -(maxHeight/2-Math.random()*maxHeight)*centeredness;
  var z = -(maxDepth/2-Math.random()*maxDepth)*centeredness;

  obj.position.set(400+x*Math.random(),y,z); 
  obj.r = {};
  obj.r.x = Math.random() * 0.005;
  obj.r.y = Math.random() * 0.005;
  obj.r.z = Math.random() * 0.005;
  obj.rotation.y=(Math.PI / 180) * -180;   //aggiunto per simmetria
  planet.add(obj);
  
  return obj;
  
}


function createRock(){
	
	var size= 2+Math.random()*3;
	
	
	
	var rockgeometry = new THREE.DodecahedronGeometry(size, 1);
	rockgeometry.vertices.forEach(function(v){
    v.x += (0-Math.random()*(size/4));
    v.y += (0-Math.random()*(size/4));
    v.z += (0-Math.random()*(size/4));
  });
 
  var rocktexture = new THREE.MeshStandardMaterial({color:0xD05F2F,
										map: textureRock,
                                        shading: THREE.FlatShading,
										aoMapIntensity: 1,
                                   
                                            roughness: 0.8,
                                      metalness: 1
                                        });  
  
  var obj = new THREE.Mesh(rockgeometry, rocktexture);
  obj.castShadow = true;
  obj.receiveShadow = false;
  var value=0.6+Math.random()*0.2;
  obj.scale.set(value,value,value);
  obj.position.y=0;   
  obj.rotation.y=(Math.random()*(Math.PI));
  obj.rotation.x=(Math.random()*(Math.PI));
  obj.rotation.z=(Math.random()*(Math.PI));

  lifeRocks.push(lifeRock);

  
  return obj;
  
}





function addWorldAsteroids(){
    var numRocks=150;   /////////diff
    var gap=6.28/150;
    for(var i=0;i<numRocks;i++){
        addRock(i*gap, true);
        addRock(i*gap, false);
    }
}
function addRock(row, isLeft){
    var newRock;
    var altitude=101+(Math.random() * 6) + 1;
 
    newRock=createRock();
	worldAsteroids.push(newRock); ///////////////////////////
	lifeRocks.push(lifeRock);
    var forestAreaAngle=0;
    if(isLeft){
        forestAreaAngle=1.5+Math.random()*1.2; //0.1
    }else{    //168 146 intervallo
        forestAreaAngle=1.48-Math.random()*1.2; //0.1
    }
    sphericalHelper.set( altitude, forestAreaAngle, row );
    
    newRock.position.setFromSpherical( sphericalHelper );
    var rollingGroundVector=planet.position.clone().normalize();
    var RockVector=newRock.position.clone().normalize();
    newRock.quaternion.setFromUnitVectors(RockVector,rollingGroundVector);
	
    planet.add(newRock);
}



function generateAsteroids(pos){
	if (worldAsteroids.length < sizeWorldAsteroids){
		
		console.log(worldAsteroids.length);
		
		var newRock;
		var altitude=101+(Math.random() * 6) + 1;
	 
		newRock=createRock();
		worldAsteroids.push(newRock); 
		var forestAreaAngle=0
		var gap=6.28/(sizeWorldAsteroids/2);///////////////////////////////mod
		forestAreaAngle=1.55+Math.random()*(1.63-1.55); //0.1
		var value = pos+sizeWorldAsteroids/2;
		sphericalHelper.set( altitude, forestAreaAngle, gap*(value) );
		newRock.position.setFromSpherical( sphericalHelper );
		var rollingGroundVector=planet.position.clone().normalize();
		var RockVector=newRock.position.clone().normalize();
		newRock.quaternion.setFromUnitVectors(RockVector,rollingGroundVector);
		
		
		planet.add(newRock);
		
		console.log(worldAsteroids.length);
	}
	
	
}



function asteroidsLogic(){
    var loss=20;
    var oneRock;
    var asteroidsPos = new THREE.Vector3();
    var asteroidsToRemove=[];
    worldAsteroids.forEach( function ( element, index ) {
        oneRock=worldAsteroids[ index ];
        asteroidsPos.setFromMatrixPosition( oneRock.matrixWorld );

        if(asteroidsPos.distanceTo(spaceShip.position)<4.2){//check collision

            hasCollided=true;
			var index=worldAsteroids.indexOf(oneRock);
			worldAsteroids.splice(index,1);
			lifeRocks.splice(index,1);///////////////////////////
			oneRock.visible=false;
			
			///////////////////////////////////
			scene.updateMatrixWorld();
			var vector = new THREE.Vector3();
			vector.setFromMatrixPosition( oneRock.matrixWorld );
			console.log(vector);
			//////////////////////////////////////////////
			
			
			
			explode(vector.x,vector.y,vector.z);
			
			
			lifeSpaceShip-=20;
			energyBar.value=lifeSpaceShip;
			if (lifeSpaceShip<=0){
				disableStabilization=true;
				spaceShipDestroyed=true;
				var targetX = spaceShip.position.x + (-7 + Math.random()*14);
				var targetY = spaceShip.position.y + (-1 + -Math.random()*4);
				var speed = 1.5;
				TweenMax.to(spaceShip.rotation, speed, {y: THREE.Math.degToRad(720)});
				TweenMax.to(composition['turretbase1'].rotation, speed, {x: THREE.Math.degToRad(360*3)});
				TweenMax.to(composition['turretbase2'].rotation, speed, {x: THREE.Math.degToRad(-360*3)});
				TweenMax.to(spaceShip.position, speed, {x:targetX, y:targetY,z:-0.3*Math.random(), delay:Math.random() *.1, ease:Power2.easeOut, onComplete:function(){
					
					explode(spaceShip.position.x,spaceShip.position.y,spaceShip.position.z);
					spaceShip.visibility=false;
					scene.remove(spaceShip);
					flagEnd=true;
					
				}});
				
				
			}
	
        }
    });

}



function addPropeller(){
    propellerGeometry = new THREE.Geometry();
    for (var i = 0; i < 100; i ++ ) {
        var vertex = new THREE.Vector3();
        propellerGeometry.vertices.push( vertex );
    }

	 var pMaterial = new THREE.PointsMaterial({
      color: 0xaa5502,
      size: 0.4,
	  map: textureLoader.load('./images/clouds.png'),
	  transparent: true
    });
    propeller = new THREE.Points( propellerGeometry, pMaterial );
    propeller.visible=true;

    return propeller;
}



function propellerExecution(){
  
    for (var i = 0; i < 100; i ++ ) { 
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 10;
        vertex.y = Math.random() * 15;
        vertex.z = Math.random() * 10;
        propellerGeometry.vertices[i]=vertex;
    }
	propellerGeometry.verticesNeedUpdate = true;
}


function bulletCollision(){
	var oneRock;
	var b;
    var asteroidsPos = new THREE.Vector3();
    worldAsteroids.forEach( function ( element, index ) {
        oneRock=worldAsteroids[ index ];
        asteroidsPos.setFromMatrixPosition( oneRock.matrixWorld );
		bullets.forEach( function ( element, i ) {
			b=bullets[i];
			var vector1 = new THREE.Vector3();
			vector1.setFromMatrixPosition( b.matrixWorld );
			if(asteroidsPos.distanceTo(vector1)<4) {
				bullets[i].alive = false;
				scene.remove(bullets[i]);
				fireCollision=true;

				
				
				if (lifeRocks[index]<=0){
				
					var index1=worldAsteroids.indexOf(oneRock);
					worldAsteroids.splice(index1,1);
					lifeRocks.splice(index,1); ////////
					oneRock.visible=false;
					
					///////////////////////////////////
					scene.updateMatrixWorld();
					var vector = new THREE.Vector3();
					vector.setFromMatrixPosition( oneRock.matrixWorld );
					console.log(vector);
					//////////////////////////////////////////////
					
					
					
					explode(vector.x,vector.y,vector.z);
				}else {
					var speed = 0.4+Math.random()*0.2;
					lifeRocks[index]-=20;
					//ANIMAZIONE
					TweenMax.to(oneRock.rotation, speed, {x:Math.random()*8, y:Math.random()*8});
				}
			}
		});
	});
	
	
	
}


function addExplosion(){
    explosionGeometry = new THREE.Geometry();
    for (var i = 0; i < explosionParticleCount; i ++ ) {
        var vertex = new THREE.Vector3();
        explosionGeometry.vertices.push( vertex );
    }
	
    var material = new THREE.PointsMaterial({
        color: 0x9b7207,
        size: 1.5, //0.8
        map: textureLoader.load('./images/spark.png'),
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    explosion = new THREE.Points( explosionGeometry, material );
    scene.add( explosion );
    explosion.visible=false;  
	
	
	
	
	
}

function doExplosion(){
    if(!explosion.visible)return;
    for (var i = 0; i < explosionParticleCount; i ++ ) {
        explosionGeometry.vertices[i].multiplyScalar(explosionValue);
    }
    if(explosionValue>1.005){
        explosionValue-=0.001;
    }else{
        explosion.visible=false;
		hasCollided=false;
    }
    explosionGeometry.verticesNeedUpdate = true;
}
function explode(x,y,z){
    explosion.position.y=y
    explosion.position.z=z
    explosion.position.x=x;

    for (var i = 0; i < explosionParticleCount; i ++ ) {
        var vertex = new THREE.Vector3();
		if (i<explosionParticleCount/4){
			vertex.x = -0.2+Math.random() * 5; //0.4
			vertex.y = -0.2+Math.random() * 5; 
			vertex.z = -0.2+Math.random() * 5;
		}else if (i>explosionParticleCount/4 && i<explosionParticleCount/2){
			vertex.x = -0.2+Math.random() * -5; 
			vertex.y = -0.2+Math.random() * -5; 
			vertex.z = -0.2+Math.random() * -5;	
		}else if (i>explosionParticleCount/2 && i<3*explosionParticleCount/4){
			vertex.x = -0.2+Math.random() * 5; 
			vertex.y = -0.2+Math.random() * -5; 
			vertex.z = -0.2+Math.random() * -5;	
		}else{
			vertex.x = -0.2+Math.random() * -5; 
			vertex.y = -0.2+Math.random() * 5; 
			vertex.z = -0.2+Math.random() * 5;	
			
		}
        explosionGeometry.vertices[i]=vertex; 

		
		}
    explosionValue=1.07;
    explosion.visible=true;
}



function endHTML () {
	
    var endText = document.createElement('div');
    endText.style.position = 'absolute';
	endText.innerHTML = "GAME OVER";
    endText.style.textAlign = "center";
	endText.style.left= '35%';
    endText.style.color = "red";
    endText.style.fontSize="70px"

    endText.style.top = '40%';

    document.body.appendChild(endText);

	
	var reloadButton= document.getElementById("restartButton");
	reloadButton.style="position:absolute; left:43%; top:55%; visibility: visible;"
}
