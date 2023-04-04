<template>
  <div></div>
</template>

<script>
export default {

}
// # Import necessary libraries for threeJS
import * as THREE from 'three';

// # Create a scene
const scene = new THREE.Scene();

// # Create a camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, -1, 1000 );

// # Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// # Create a geometry for the motion trajectory
const geometry = new THREE.BufferGeometry();
const positions = [];

// # Add positions to the geometry
positions.push( 0, 0, 0 );
positions.push( 0, 10, 0 );
positions.push( 10, 10, 0 );

// # Add the positions to the geometry
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );

// # Create a material for the motion trajectory
const material = new THREE.LineBasicMaterial( { color: 0x000000 } );

// # Create the motion trajectory
const trajectory = new THREE.Line( geometry, material );
scene.add( trajectory );

// # Animate the motion trajectory
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();

</script>

<style>

</style>