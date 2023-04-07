import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
interface Points {
  x: number;
  y: number;
  z: number;
}

class CloudPoint {
  private elem;
  private camera;
  private renderer;
  private scene;
  private controls;
  private loading;
  private clock;
  private pointCloud;

  constructor(domID: string, source: string,pointsColor:number) {
    fetch(source)
      .then((response) => {
        response.text().then((text) => {
          // 获取文件内容，转为数组
          const lines = text.split("\r\n");
          let points: Points[] = [];
          lines.forEach((element) => {
            element.match(/^\d/) &&
              points.push({
                x: parseFloat(element.split(" ")[0]),
                y: parseFloat(element.split(" ")[1]),
                z: parseFloat(element.split(" ")[2]),
              });
          });
          // this.clock = new THREE.Clock();
          // 渲染数据
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
          // 控制器，旋转，缩放等
          this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
          );
          // 旋转、平移开启阻尼,也就是惯性,操作手感会更好
          this.controls.enableDamping = true;
          // 监听鼠标、键盘事件
          this.controls.addEventListener("change", this.render);
          const geometry = new THREE.BufferGeometry();
          // 要将数据转化成的格式，相当于把对象数组一维化
          const positions = new Float32Array(points.length * 3);
          points.forEach((point, i) => {
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
          });
          // 这里就是添加点云数据的关键一步
          geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
          );
          const material = new THREE.PointsMaterial({ color: pointsColor });
          // 生成的实体
          this.pointCloud = new THREE.Points(geometry, material);

          this.pointCloud.geometry.rotateX(0.5 * Math.PI);
          // 旋转模型，可调,默认的是和鼠标反着转的
          this.scene.add(this.pointCloud);

          // keepSceneCenter，这个保证一开始展示时物体是在场景中的
          const middle = new THREE.Vector3();
          this.pointCloud.geometry.computeBoundingBox();
          this.pointCloud.geometry.boundingBox.getCenter(middle);
          this.pointCloud.applyMatrix4(
            new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
          );

          // 比例，和鼠标中间缩放比例有关，设置后缩放会流畅很多
          const largestDimension = Math.max(
            this.pointCloud.geometry.boundingBox.max.x,
            this.pointCloud.geometry.boundingBox.max.y,
            this.pointCloud.geometry.boundingBox.max.z
          );
          // 相机位置，可调
          this.camera.position.y = largestDimension * 3;
          this.animate();
        });
      })
      .catch((err) => {
        console.log("文件路径错误或无法加载文件");
        window.alert("文件路径错误或无法加载文件");
      });
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
export { CloudPoint };
