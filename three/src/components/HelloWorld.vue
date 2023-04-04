<!--这是看到的另一份代码，用以比对研究-->
<!-- <template>
 
  <div style="height: 100%; width: 100%">
 
    <div id="three" style="height: 100%; width: 100%"></div>
    
 
  </div>
 
</template>
 
 
 
<script lang="ts">
 
// 引入Three.js
 
import * as THREE from "three";
 
// 引入PCD加载器
 
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js"; // 注意是examples/jsm
 
// 引入模型控制器
 
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // 放大缩小旋转等控制操作
 
// 创建一个时钟对象Clock
 
var clock = new THREE.Clock();
 
// 设置渲染频率为30FBS，也就是每秒调用渲染器render方法大约30次
 
var FPS = 30;
 
var renderT = 1 / FPS; //单位秒  间隔多长时间渲染渲染一次
 
// 声明一个变量表示render()函数被多次调用累积时间
 
// 如果执行一次renderer.render，timeS重新置0
 
var timeS = 0;
 
export default {
 
 
  data() {
 
    return {
 
      animationId: null,
 
      elem: null,
 
      scene: null,
 
      // mesh: null, //网格模型对象
 
      camera: null, //相机对象
 
      renderer: null, //渲染器对象
 
      loader: null,
 
      controls: null,
      
      publicPath: "/" // public
 
    };
 
  },
 
  beforeDestroy() {
 
    this.destroyModel();
 
  },
 
  created() {},
 
  mounted() {
 
    // 初始化模型
    
    this.initModel(`${this.publicPath}src/assets/jiqi.pcd`, "three")
 
  },
  methods: {
 
    initModel(pcdPath, domName) {
 
      console.log("开始初始化模型文件");
 
      this.elem = document.getElementById(domName);
 
      // 相机CanvasRenderer
 
      this.camera = new THREE.PerspectiveCamera(
 
        30, // 视野
 
        this.elem.clientWidth / this.elem.clientHeight, // 纵横比
 
        0.1, // 近平面
 
        1000 // 远平面
 
      );
 
      // 渲染器
 
      this.renderer = new THREE.WebGLRenderer({
 
        antialias: true,
 
        alpha: true
 
      });
 
      this.renderer.setClearColor(new THREE.Color(0x303030)); // 背景色
 
      this.renderer.setSize(this.elem.clientWidth, this.elem.clientHeight);
 
      this.elem.appendChild(this.renderer.domElement);
 
      this.scene = new THREE.Scene(); // 场景
 
      this.loader = new PCDLoader(); //PCD加载器
 
      const THIS = this;
 
      //第一层  捕捉报错
 
      try {
 
        //加载PCD文件
 
        THIS.loader.load(
 
          pcdPath,
 
          function(points) {
 
            console.log(points);
            console.log('啊？');
            
            console.log(points.geometry.attributes.position.array);
 
            // 模型点位大小
 
            // points.material.size = 0.02;
 
            points.material.color = new THREE.Color(0x00ffff); // 模型颜色
 
            THIS.scene.add(points);
 
            // 构造盒子
 
            var middle = new THREE.Vector3();
 
            points.geometry.computeBoundingBox();
 
            points.geometry.boundingBox.getCenter(middle);
 
            points.applyMatrix4(
 
              new THREE.Matrix4().makeTranslation(
 
                -middle.x,
 
                -middle.y,
 
                -middle.z
 
              )
 
            );
 
            // 比例
 
            var largestDimension = Math.max(
 
              points.geometry.boundingBox.max.x,
 
              points.geometry.boundingBox.max.y,
 
              points.geometry.boundingBox.max.z
 
            );
 
            THIS.camera.position.y = largestDimension * 1;
 
            THIS.animate();
 
            THIS.controls = new OrbitControls(
 
              THIS.camera,
 
              THIS.renderer.domElement
 
            );
 
            THIS.controls.addEventListener("change", THIS.animate); // 监听鼠标、键盘事件  放大缩小等
 
          },
 
          function(xhr) {
 
            // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
 
          },
          //第二层 捕捉报错
          function(error) {
            THIS.$Message.error("模型地址不对，请稍候再试！");
 
          }
 
        );
 
      } catch (error) {
        THIS.$Message.error("模型地址不对，请稍候再试！");
 
      }
 
    },
    
    // 监听鼠标、键盘事件  放大缩小等
 
    animate() {
      this.animationId = requestAnimationFrame(this.animate);
 
      //.getDelta()方法获得两帧的时间间隔
 
      // var T = clock.getDelta();
 
      // timeS = timeS + T;
 
      // requestAnimationFrame默认调用render函数60次，通过时间判断，降低renderer.render执行频率
 
      // if (timeS > renderT) {
 
        // 控制台查看渲染器渲染方法的调用周期，也就是间隔时间是多少
 
        // console.log(`调用.render时间间隔`, timeS * 1000 + "毫秒");
 
        this.renderer.render(this.scene, this.camera); //执行渲染操作
       
 
        //renderer.render每执行一次，timeS置0
 
        timeS = 0;
 
     
 
    },
 
    // 销毁模型
 
    destroyModel() {
 
      console.log("销毁模型");
 
      clearTimeout();
 
      try {
 
        this.scene.clear();
 
        this.renderer.dispose();
 
        this.renderer.forceContextLoss();
 
        this.renderer.content = null;
 
        cancelAnimationFrame(this.animationId); // 去除animationFrame
 
        const gl = this.renderer.domElement.getContext("webgl");
 
        gl && gl.getExtension("WEBGL_lose_context").loseContext();
 
        console.log("销毁成功");
 
      } catch (e) {
 
        console.log(e);
 
        console.log("销毁失败");
 
      }
 
    }
 
  }
 
};
 
</script>
<style  scoped>
</style> -->
