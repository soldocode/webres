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


function updateWindow()
        {
            wWidth = parseFloat($('#3Dscene').css('width'));
            wHeight = parseFloat($('#3Dscene').css('height'));
            //viewSize=500;
            aspectRatio=wWidth/wHeight;
            camera.left = -aspectRatio*viewSize/1.5 ;
            camera.right = aspectRatio* viewSize /1.5;
            camera.top = viewSize /1.5;
            camera.bottom = - viewSize/1.5 ;
            camera.updateProjectionMatrix();
            renderer.setSize(wWidth, wHeight);
            cameraControls=new THREE.OrthographicTrackballControls(camera,renderer.domElement);
            render();
        }

window.addEventListener('resize',updateWindow);


function detectObjects()
{
 if (!(detection_in_progress))
 {
    detection_in_progress=true;
    raycaster.setFromCamera( mouse, camera );
    intersection = raycaster.intersectObjects(scene.children,true);
    if (selection.length!=0)
        {
           selection[0].object.material=selection[0].material
           selection.pop();
        }
    if (intersection.length!=0)
    {
        //console.log(intersection.length,' objects detected');
        selection.push({object:intersection[0].object, material:intersection[0].object.material})
        intersection[0].object.material=selectedLine
    }
 }
}

function onMouseMove( event )
	{

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	var rect =document.getElementById("3Dscene").getBoundingClientRect();
    mouse.x = ( (event.clientX - rect.left) /  wWidth ) * 2 - 1;
	mouse.y = - ( (event.clientY - rect.top) /  wHeight ) * 2 + 1;

    detectObjects()


    detection_in_progress=false;

}

window.addEventListener( 'mousemove', onMouseMove, false );


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


//raycaster controls
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var intersection
var selection=[];
var raycasterWorking=false
var detection_in_progress=false;


scene.add(ambientLight);
scene.add(camera);
camera.add( pointLightOne );


//materials
var material = new THREE.MeshLambertMaterial({color: 0x666666});
var material2 = new THREE.MeshLambertMaterial({color: 0xdddddd});
var lineMaterial = new THREE.LineBasicMaterial({color: 0x000000,linewidth: 3});
var selectedLine = new THREE.MeshLambertMaterial({color: 0x6699cc});


//scene objects
var extshape;
var objects={};


render();


