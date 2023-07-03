if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var container, stats, controls;
	var camera, scene, renderer, light;
	var mesh;

	var clock = new THREE.Clock();

	var mixers = [];

	init();

	function init() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );

		scene = new THREE.Scene();

		// grid
		var gridHelper = new THREE.GridHelper( 28, 28, 0x303030, 0x303030 );
		gridHelper.position.set( 0, - 0.04, 0 );
		scene.add( gridHelper );

		// stats
		stats = new Stats();
		container.appendChild( stats.dom );

		// model
		var manager = new THREE.LoadingManager();
		manager.onProgress = function( item, loaded, total ) {

			console.log( item, loaded, total );

		};

		var onProgress = function( xhr ) {

			if ( xhr.lengthComputable ) {

				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

			}

		};

		var onError = function( xhr ) {
		};

		var loader = new THREE.FBXLoader( manager );
		loader.load( './models/xsi_man_skinning.txt', function( object ) {

			mesh = object;
			mesh.mixer = new THREE.AnimationMixer(mesh);
			mixers.push(mesh.mixer);

			var action = mesh.mixer.clipAction(mesh.animations[0]);
			action.play();

			scene.add(mesh);


		}, onProgress, onError );

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor( 0x000000 );
		container.appendChild( renderer.domElement );

		// controls, camera
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.target.set( 0, 12, 0 );
		camera.position.set( 2, 18, 28 );
		controls.update();

		window.addEventListener( 'resize', onWindowResize, false );

		light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
		light.position.set(0, 1, 0);
		scene.add(light);

		light = new THREE.DirectionalLight(0xffffff, 1.0);
		light.position.set(0, 1, 0);
		scene.add(light);

		// interaction

		var button = document.getElementById("replaceTexture");
        button.addEventListener("click", onReplaceTexture)


				animate();

	}

      // 

	function onReplaceTexture() {
		var textureLoader = new THREE.TextureLoader();
		textureLoader.setCrossOrigin("anonymous");
		textureLoader.load("https://unsplash.it/256", function (texture) {

			// mesh is a group contains multiple sub-objects. Traverse and apply texture to all. 
			mesh.traverse(function (child) {
				if (child instanceof THREE.Mesh) {

					// apply texture
					child.material.map = texture
					child.material.needsUpdate = true;
				}
			});

		});
	}

      //

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				if ( mixers.length > 0 ) {

					for ( var i = 0; i < mixers.length; i ++ ) {

						mixers[ i ].update( clock.getDelta() );

					}

				}

				stats.update();

				render();

			}

			function render() {

				renderer.render( scene, camera );

			}

