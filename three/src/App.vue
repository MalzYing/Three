<template>
  <div
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    id="pcdContainer"
    ref="pcdcontainer"
  >
</div>
  <!-- <canvas
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    id="pcdContainer"
    ref="pcdcontainer"
  >
  </canvas> -->

  <!-- v-loding 是element Ui的 -->

</template>

<script>
import * as THREE from "three";

import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import ShowTrace from './components/ShowTrace.vue';
export default {
  created() {},
  data() {
    return {
      // elem: null,
      // scene: null,
      // camera: null,
      // renderer: null,
      // loader: null,
      // controls: null,
      // clock: new THREE.Clock(),
      // loading: true,
      // pointcloud: null,
    };
  },
  beforeMount() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //变量的初始化不可以在data()内进行，否则会出现proxy不可修改的bug
      (this.clock = new THREE.Clock()),
        (this.elem = document.getElementById("pcdContainer")); //获取要渲染的Dom
      // 相机
      this.camera = new THREE.PerspectiveCamera(
        10, // 视野
        this.elem.clientWidth / this.elem.clientHeight, // 纵横比
        -1, // 近平面,这个可能要设为负数，否则看不见
        1 // 远平面，不知道为何设定为正数最后不管多大都不影响，要研究研究
      );
      // 渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      this.renderer.setClearColor(new THREE.Color(0x303030)); // 背景色,推荐的有303030(灰黑色),efefef(灰白色)
      this.renderer.setSize(this.elem.clientWidth, this.elem.clientHeight); //渲染范围和场景范围同步
      this.elem.appendChild(this.renderer.domElement); //这里就是用到canvas的地方，内置了一个canvas标签
      // console.log(this.renderer.domElement);
      this.scene = new THREE.Scene(); // 场景
      this.loader = new PCDLoader(); //PCD加载器
      const THIS = this;
      //加载PCD文件
      this.loader.load(
        //src/assets/精细DEM20220928205906714.pcd"
        "/src/assets/精细DEM20220928205906714.pcd",
        function (points) {
          points.geometry.rotateX(0.5 * Math.PI); //旋转模型，可调

          console.log(points.geometry);
          points.material.vertexColors = THREE.VertexColors;
          // points.material.color.setRGB(1, 0, 0); // 设置默认颜色
          //下一步需要考虑的是当PCD文件中存在颜色数据时如何呈现
          // 遍历点并将颜色转换为THREE.Color对象
          for (let i = 0; i < points.geometry.attributes.position.count; i++) {
            const r = points.geometry.attributes.color.array[i * 3];
            const g = points.geometry.attributes.color.array[i * 3 + 1];
            const b = points.geometry.attributes.color.array[i * 3 + 2];
            const color = new THREE.Color(r, g, b);
           
            points.geometry.attributes.color.setXYZ(
              i,
              color.r,
              color.g,
              color.b
            );
          }
          // points.material.color = new THREE.Color(0xff0000); // 模型颜色
          THIS.scene.add(points); //添加入场景
          //这一部分是为了让点云图开始展示时位于场景中心
          var middle = new THREE.Vector3();
          points.geometry.computeBoundingBox();
          points.geometry.boundingBox.getCenter(middle);
          points.applyMatrix4(
            new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
          );
          // 比例
          var largestDimension = Math.max(
            points.geometry.boundingBox.max.x,
            points.geometry.boundingBox.max.y,
            points.geometry.boundingBox.max.z
          );
          THIS.camera.position.y = largestDimension * 3; //相机位置，可调
          THIS.animate();
          //轨道控制器 旋转、平移、缩放
          THIS.controls = new OrbitControls(
            THIS.camera,
            THIS.renderer.domElement
          );
          THIS.controls.enableDamping = true; //旋转、平移开启阻尼
          THIS.controls.addEventListener("change", THIS.render); // 监听鼠标、键盘事件
        },
        function (xhr) {
          let load = xhr.loaded / xhr.total;
          if (load == 1) {
            THIS.loading = false;
          }
        },
        function (error) {
          console.log(error);
        }
      );
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      let delta = this.clock.getDelta();
      if (this.controls) {
        this.controls.update(delta);
      }
      requestAnimationFrame(this.animate);
      this.render();
    },
  },
  computed: {},
  watch: {},
};
</script>
<style scoped>
#pcdContainer {
  width: 1920px;
  height: 1080px;
}
</style>
