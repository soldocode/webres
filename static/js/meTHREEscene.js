////////////////////////////////////////////////////////////////////////////////////////////
//
//  meTHREEscene.js - define makeEasy-THREE.js scene
//  Soldini Riccardo - 2015
//  
//  riccardo.soldini@gmail.com
//
//  last update: 01/05/17
//
//
/////////////////////////////////////////////////////////////////////////////////////////////


function render()
       {	
		requestAnimationFrame(render);
		TWEEN.update();
                cameraControls.update();
                renderer.render(scene, camera);
  	};


////////////////////////////////////////////////////////////////////////////////////////////


var wWidth = parseFloat($('#3Dscene').css('width'));
var wHeight = parseFloat($('#3Dscene').css('height'));
var viewSize=500;
var aspectRatio=wWidth/wHeight;


//renderer
var renderer = new THREE.WebGLRenderer({alpha: true,antialias:true});
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
renderer.setSize(wWidth, wHeight);
document.getElementById("3Dscene").appendChild(renderer.domElement);

// create scene
var scene = new THREE.Scene();


//lighting
var ambientLight = new THREE.AmbientLight(0x888888);
var pointLightOne = new THREE.PointLight(0xffffff,0.6);
pointLightOne.position.set(600, 300, 1000).normalize();


//camera
var camera = new THREE.OrthographicCamera(-aspectRatio*viewSize/1.5,
                                           aspectRatio* viewSize/1.5,
                                           viewSize/1.5,
                                           -viewSize/1.5, -100000, 100000 );
camera.position.z= 8000;
camera.position.y= 0;
camera.position.x= 0;
camera.lookAt(new THREE.Vector3(0,0,0));


//camera controls
var cameraControls = new THREE.OrthographicTrackballControls(camera,renderer.domElement);


scene.add(ambientLight);
scene.add(camera);
camera.add( pointLightOne );


//materials
var material = new THREE.MeshLambertMaterial({color: 0x666666});
var material2 = new THREE.MeshLambertMaterial({color: 0xdddddd});
var lineMaterial = new THREE.LineBasicMaterial({color: 0x000000});


//scene objects
var extshape;
var objects={};


render();


