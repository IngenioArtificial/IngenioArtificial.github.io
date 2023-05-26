import * as THREE from './build/three.module.js';

//import Stats from './jsm/libs/stats.module.js';

import { PLYLoader } from './jsm/loaders/PLYLoader.js';
import { FBXLoader } from './jsm/loaders/FBXLoader.js';

let container, stats;

let camera, scene, renderer;

let pointLight;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
			
let rotate = 1;
let snakeMesh;
init();
animate();

function init() {
				
	container = document.createElement( 'div' );
	container.setAttribute("id", "jonas")
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.z = - 4000;

	//

	const r = 'textures/';

	const urls = [
		r + 'px.jpg', r + 'nx.jpg',
		r + 'py.jpg', r + 'ny.jpg',
		r + 'pz.jpg', r + 'nz.jpg'
	];

	const textureCube = new THREE.CubeTextureLoader().load( urls );
	textureCube.colorSpace = THREE.SRGBColorSpace;
	textureCube.mapping = THREE.CubeRefractionMapping;

	scene = new THREE.Scene();
	scene.background = textureCube;

	// LIGHTS

	const ambient = new THREE.AmbientLight( 0xffffff );
	scene.add( ambient );

	pointLight = new THREE.PointLight( 0xffffff, 2 );
	scene.add( pointLight );

	// light representation

	const sphere = new THREE.SphereGeometry( 100, 16, 8 );

	const mesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
	mesh.scale.set( 0.05, 0.05, 0.05 );
	pointLight.add( mesh );

	// material samples

	const cubeMaterial3 = new THREE.MeshPhongMaterial( { color: 0xccddff, envMap: textureCube, refractionRatio: 0.98, reflectivity: 0.9 } );
	const cubeMaterial2 = new THREE.MeshPhongMaterial( { color: 0xccfffd, envMap: textureCube, refractionRatio: 0.985 } );
	const cubeMaterial1 = new THREE.MeshPhongMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.98 } );

	//const textu = new THREE.TextureLoader().load("textures/rut.png")
	//const rutMaterial = new THREE.MeshBasic

	//

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	//stats = new Stats();
	//container.appendChild( stats.dom );

	const fbxLoader = new FBXLoader()
	const loader = new PLYLoader();

	fbxLoader.load( 'models/snake.fbx', function ( geometry ) {
					
		createScene( geometry, cubeMaterial1, cubeMaterial2, cubeMaterial3 );

	} );

	document.addEventListener( 'mousemove', onDocumentMouseMove );
	window.addEventListener( 'resize', onWindowResize );
	document.addEventListener('click', onClick);

}
function onClick() {
	snakeMesh.rotation.y = Math.PI / rotate;
	snakeMesh.rotation.y.needsUpdate = true;
	rotate = rotate + 1;
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function createScene( geometry, m1, m2, m3 ) {

				



	//const textu = new THREE.TextureLoader().load("textures/rut.png")


	//geometry.computeVertexNormals();

	const s = 20.0;

	//let rutMesh = new THREE.Mesh(geometry)



	//let mesh = new THREE.Mesh( geometry, m1 );
	//mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
	geometry.scale.x = geometry.scale.y = geometry.scale.z = s;
	//geometry.rotation.y = Math.PI / 4;
	snakeMesh = geometry
	scene.add(snakeMesh);

	//mesh = new THREE.Mesh( geometry, m2 );
	//mesh.position.x = - 1500;
	//mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
	//scene.add( mesh );

	//mesh = new THREE.Mesh( geometry, m3 );
	//mesh.position.x = 1500;
	//mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
	//scene.add( mesh );

	//var textureLoader = new THREE.TextureLoader();
	//textureLoader.setCrossOrigin("anonymous");
	//textureLoader.load("textures/rut.png", function (texture){
	//	mesh = geometry
	//	mesh.traverse(function (child) {
	//
	//	if (child instanceof THREE.Mesh) {

	//		child.material.map = texture;
	//		child.material.needsUpdate = true;
	//		}
	//	})
	//})

}

function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX ) * 4;
	mouseY = ( event.clientY - windowHalfY ) * 4;

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	//stats.update();

}

function render() {

	const timer = - 0.0002 * Date.now();

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );

	pointLight.position.x = 1500 * Math.cos( timer );
	pointLight.position.z = 1500 * Math.sin( timer );

	renderer.render( scene, camera );

}
