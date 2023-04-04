<template>
  
</template>

<script>
import * as THREE from 'three'
export default {

    mounted() {
        //三要素之场景，相机，渲染器
        const scene = new THREE.Scene()
        //相机的四个参数是,fov角度:num，aspect ratio长宽比:num,(是一个比值)，近截面(num)和远截面(num)
        //后续可能调整参数，比如宽高比改成绑定的dom元素的clientWidth/clientHeight,近面可能要设为负数
        const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
        //渲染器，会将相机拍摄范围内的场景实际展示到挂载的元素
        const renderer=new THREE.WebGLRenderer();
        //设置renderer的宽高，一半与相机同步即可，当然也可以根据需要调节
        renderer.setSize(window.innerWidth,window.innerHeight)
        //注意这里，如果是挂载于特定的元素上需要将(document.body改成对应的dom元素)
        //renderer.domElement是threeJS提供的展示用canvas元素，不用变
        document.body.appendChild(renderer.domElement)

    }

}
</script>

<style>
   
</style>