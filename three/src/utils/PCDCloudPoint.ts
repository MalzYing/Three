import * as THREE from "three";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class PCDCloudPoint {
 
  private elem;
  private camera;
  private renderer;
  private scene;
  private loader;
  private controls;
  private loading;
  private clock;

  constructor(domID: string, source: string) {
    // scene的初始化不能再data(){}中，否则proxy报错
    this.clock = new THREE.Clock();
    // 获取要渲染的Dom
    this.elem = document.getElementById(domID);
    // 相机
    this.camera = new THREE.PerspectiveCamera(
      // 视野
      20,
      // 纵横比
      this.elem.clientWidth / this.elem.clientHeight,
      // 近平面,这个可能要设为负数，否则看不见
      -1,
      // 远平面，不知道为何设定为正数最后不管多大都不影响，要研究研究
      1
    );
    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    // 背景色,推荐的有303030(灰黑色),efefef(灰白色)
    this.renderer.setClearColor(new THREE.Color(0x303030));
    // 渲染范围和场景范围同步
    this.renderer.setSize(this.elem.clientWidth, this.elem.clientHeight);
    // 这里就是用到canvas的地方，内置了一个canvas标签
    this.elem.appendChild(this.renderer.domElement);
    // console.log(this.renderer.domElement);
    this.scene = new THREE.Scene(); // 场景
    this.loader = new PCDLoader(); //PCD加载器
    // 这里存储this的指向是因为load中this不再指向component
    const THIS = this;
    // 加载PCD文件
    this.loader.load(
      // src/assets/精细DEM20220928205906714.pcd"
      source,
      (points) => {
        console.log(points);
        // 旋转模型，可调,默认的是和鼠标反着转的
        points.geometry.rotateX(0.5 * Math.PI);
        // 模型颜色
        points.material.color = new THREE.Color(0xffffff);
        // 添加入场景
        THIS.scene.add(points);
        // 这一部分是为了让点云图开始展示时位于场景中心
        const middle = new THREE.Vector3();
        points.geometry.computeBoundingBox();
        points.geometry.boundingBox.getCenter(middle);
        points.applyMatrix4(
          new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
        );
        // 比例
        const largestDimension = Math.max(
          points.geometry.boundingBox.max.x,
          points.geometry.boundingBox.max.y,
          points.geometry.boundingBox.max.z
        );
        // 相机位置，可调
        THIS.camera.position.y = largestDimension * 3;
        THIS.animate();
        // 轨道控制器 旋转、平移、缩放，THREEJS自带
        THIS.controls = new OrbitControls(
          THIS.camera,
          THIS.renderer.domElement
        );
        // 旋转、平移开启阻尼,也就是惯性,操作手感会更好
        THIS.controls.enableDamping = true;
        // 监听鼠标、键盘事件
        THIS.controls.addEventListener("change", THIS.render);
      },
      (xhr) => {
        let load = xhr.loaded / xhr.total;
        if (load == 1) {
          THIS.loading = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };
  animate = () => {
    // 默认刷新频率是60/s,如果FPS低的话可以对应进行优化
    requestAnimationFrame(this.animate);
    // 如果FPS低了，data设置calculation,值为delta的和，当和等于真实
    // FPS时间间隔后再render,并置calculation为0
    // let delta = this.clock.getDelta();
    this.controls && this.controls.update();
    this.render();
  };
}
export { PCDCloudPoint };
