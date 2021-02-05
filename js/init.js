var sceneWidth=window.innerWidth;
var sceneHeight=window.innerHeight;
var camera;
var scene;
var renderer;
var dom;
var dirLight;

var worldRadius=12;  //test 20 //mio 85

var spaceShip;
var composition = [];
var ww = window.innerWidth;
var	wh = window.innerHeight;



var textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin ( 'anonymous' );



var militaryTexture= textureLoader.load('./images/spaceship.jpg');
var spaceShipTexture= textureLoader.load('./images/normal.jpg');




var textureMars= textureLoader.load('./images/mars.jpg');
var textureSat= textureLoader.load('./images/saturn.jpg');
var textureWorld = textureLoader.load('images/earthmap1k.jpg');
var textureSWorld = textureLoader.load('images/earthspec1k.jpg');
var textureRock = textureLoader.load( './images/rock.jpg');
var textureSun = textureLoader.load( './images/sun.jpg');


init();




function init() {

    createScene();

    update();
}



function createScene(){

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setClearColor(0x000000, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( sceneWidth, sceneHeight );
    dom = document.getElementById('MyCanvas');
    dom.appendChild(renderer.domElement);


	addWorld();
    
    addspaceShip();
	
	addSun();
	addLight();


    camera.position.z = 50.5;
    camera.position.y = 80	;

    camera.lookAt(new THREE.Vector3(0,80,0));


}


function addLight(){
    var light = new THREE.HemisphereLight(0xffffff,0x000000, 0.9);
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
	
	
	sunLight = new THREE.PointLight(0xfffafa,5,3000);
    sunLight.add(sunModel);
	sunLight.position.y=540;
    sunLight.position.z=-1100;
	sunLight.position.x=-860;
	
	
	scene.add( sunLight );
	
	sunModel.scale.x+=40;
    sunModel.scale.y+=40;
	sunModel.scale.z+=40;
    
}


	
function addWing(texture){
    var wing = new THREE.Group(),
        composition = [];

    composition['wing'] = new THREE.BoxGeometry( 10, 8, 1.8 );
    composition['wing'].vertices[4].y -= 11;
    composition['wing'].vertices[5].y -= 11;
    composition['wing'].vertices[6].y -= 5;
    composition['wing'].vertices[7].y -= 5;
    composition['wing'].needsUpdate = true;

    composition['wingMesh'] = new THREE.Mesh( composition['wing'],  new THREE.MeshStandardMaterial( {map: texture} ) );

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

}


function addspaceShip(texture){
	spaceShip = new THREE.Object3D();
	
		
    composition['body2'] = new THREE.Mesh( new THREE.CylinderGeometry( 5, 5.2, 15, 32 ),  new THREE.MeshStandardMaterial( {map: texture} ) );
    spaceShip.add(composition['body2']);
	
	addTurret();
	addLegs();

	
	composition['wing1'] = addWing(texture);
    spaceShip.add(composition['wing1']);
	composition['wing1'].position.x=-11.3;
	
	
	composition['wing2'] = addWing(texture);
    spaceShip.add(composition['wing2']);
	composition['wing2'].position.x=+11.3;
	composition['wing2'].rotation.y=(Math.PI / 180) * -180; 
	
	
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
	
	
	composition['up'] = new THREE.Mesh( new THREE.CylinderGeometry( 2, 5, 15, 32 ),  new THREE.MeshStandardMaterial( {map: texture} ) );
	composition['up'].position.y=15.03;
    spaceShip.add(composition['up']);
	
	
	composition['bottom'] = new THREE.Mesh( new THREE.CylinderGeometry( 5, 3, 1.6, 6 ), new THREE.MeshStandardMaterial({color: 0xe6e6df}) );
    composition['bottom'].position.y = -8.5;
    spaceShip.add(composition['bottom']);
	
	composition['window'] = new THREE.Mesh( new THREE.SphereGeometry( 2.3,80,80), new THREE.MeshStandardMaterial({color: 0x25251d}) );
    composition['window'].position.y = 14;
	composition['window'].position.z = 3;
    spaceShip.add(composition['window']);
	
	composition['up1'] = new THREE.Mesh( new THREE.CylinderGeometry( 0.3, 2, 7, 32 ),  new THREE.MeshStandardMaterial( {map: texture} ));
	composition['up1'].position.y=26;
    spaceShip.add(composition['up1']);
	composition['up2'] = new THREE.Mesh( new THREE.CylinderGeometry( 0.3, 0.3, 6, 32 ), new THREE.MeshStandardMaterial({color: 0x25251d}) );
	composition['up2'].position.y=32.5;
    spaceShip.add(composition['up2']);
	

	spaceShip.scale.set(0.4,0.4,0.4);
    spaceShip.position.y = 80;
	spaceShip.position.x = 18;
	
    spaceShip.rotation.x = THREE.Math.degToRad(-70); 
	spaceShip.rotation.z = THREE.Math.degToRad(180); 
    spaceShip.position.z = 2;

    scene.add(spaceShip);
	
}
var flagMilitary=false;
var flagSpaceShip=false;

function updateSpaceShip(){
	

	if (document.getElementById("military").checked && !flagMilitary){
		flagMilitary=true;
		flagSpaceShip=false;
		scene.remove(spaceShip);
		addspaceShip(militaryTexture);
		
	}
	if (document.getElementById("normale").checked && !flagSpaceShip){
		flagSpaceShip=true;
		flagMilitary=false;
		scene.remove(spaceShip);
		addspaceShip(spaceShipTexture);
	}
}


var flagEarth=false;
var flagSaturn=false;
var flagMars=false;

function updatePlanet(){
	

	if (document.getElementById("earth").checked && !flagEarth){
		flagEarth=true;
		flagMars=false;
		flagSaturn=false;
		scene.remove(planetModel);
		addWorld();
		
	}
	if (document.getElementById("mars").checked && !flagMars){
		flagEarth=false;
		flagMars=true;
		flagSaturn=false;
		scene.remove(planetModel);
		addWorldMars();
	}
	if (document.getElementById("saturn").checked && !flagSaturn){
		flagEarth=false;
		flagMars=false;
		flagSaturn=true;
		scene.remove(planetModel);
		addWorldSat();
	}
}



function addWorld(){
    var sides=80;
    var tiers=80; 

    var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
    var sphereMaterial = new THREE.MeshStandardMaterial( {map: textureWorld, specMap: textureSWorld, roughness: 0.5} )
	sphereMaterial.bumpMap = textureLoader.load('./images/earthbump1k.jpg');
	sphereMaterial.bumpScale = 0.8; 


    planetModel = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planetModel.receiveShadow = true;
    planetModel.castShadow=false;
    planetModel.rotation.z=-80;
	

    scene.add( planetModel );
    planetModel.position.y=80; 
    planetModel.position.z=2;
	planetModel.position.x=-15;

	
	
	
	
}


function addWorldSat(){
    var sides=80;
    var tiers=80; 

    var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
    var sphereMaterial = new THREE.MeshStandardMaterial( {map: textureSat, roughness: 0.5} )



    planetModel = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planetModel.receiveShadow = true;
    planetModel.castShadow=false;
    planetModel.rotation.z=-80;
	

    scene.add( planetModel );
    planetModel.position.y=80;
    planetModel.position.z=2;
	planetModel.position.x=-15;

}

function addWorldMars(){
    var sides=80;
    var tiers=80; 

    var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
    var sphereMaterial = new THREE.MeshStandardMaterial( {map: textureMars, roughness: 0.5} )



    planetModel = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planetModel.receiveShadow = true;
    planetModel.castShadow=false;
    planetModel.rotation.z=-80;
	

    scene.add( planetModel );
    planetModel.position.y=80;
    planetModel.position.z=2;
	planetModel.position.x=-15;

}



function update(){
	


	planetModel.rotation.x += 0.01;
	planetModel.rotation.y += 0.01;
	
	
	updateSpaceShip();
	updatePlanet();
	
	spaceShip.rotation.z += 0.01;


	sunModel.rotation.x+=0.01;
	sunModel.rotation.y+=0.01;
	


    renderer.render(scene, camera);  
    requestAnimationFrame(update);
}

