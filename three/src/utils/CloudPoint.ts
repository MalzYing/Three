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

  constructor(domID: string, source: string, pointsColor?: number) {
    fetch(source)
      .then((response) => {
        response.text().then((text) => {
          // 获取文件内容，转为数组
          const lines = text.split("\r\n");

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
          
          // 几何体与材质
          const geometry = new THREE.BufferGeometry();
          const material = new THREE.PointsMaterial({ size: 0.005 });
          // 这里是先将每行的点数据化成对象再加入数组，后续发现没必要
          // lines.forEach((element) => {
          //   element.match(/^\d/) &&
          //     points.push({
          //       x: parseFloat(element.split(" ")[0]),
          //       y: parseFloat(element.split(" ")[1]),
          //       z: parseFloat(element.split(" ")[2]),
          //     });
          // });
          // const positions = new Float32Array(points.length * 3);
          // let points: Points[] = [];
          // points.forEach((point, i) => {
          //   positions[i * 3] = point.x;
          //   positions[i * 3 + 1] = point.y;
          //   positions[i * 3 + 2] = point.z;
          // });

          // 先判断存不存在color列
          let hasRGB = false;
          for (let i = 0; i <= 20; i++) {
            if (lines[i].includes("FIELDS") && lines[i].includes("rgb")) {
              hasRGB = true;
              break;
            }
          }
          //这两个要添加的数组决定了图形的显示
          const positions: number[] = [];
          const colors: number[] = [];
          lines.forEach((element) => {
            if (element.match(/^\d/)) {
              positions.push(
                parseFloat(element.split(" ")[0]),
                parseFloat(element.split(" ")[1]),
                parseFloat(element.split(" ")[2])
              );
              if (hasRGB) {
                const float = parseFloat(element.split(" ")[3]);
                let rgb = float;
                // treat float values as int
                // 四字节数组，每一个数字都是用32位二进制表示
                const farr = new Float32Array(1);
                farr[0] = float;
                // 也就是说，完全可以把Float32Array直接转化成Int32Array,理论上来说，短的转长的也是不丢精度的
                rgb = new Int32Array(farr.buffer)[0];
                // 就不研究算法原理了,总之这样之后就得到了color一维数组
                const r = (rgb >> 16) & 0x0000ff;
                const g = (rgb >> 8) & 0x0000ff;
                const b = (rgb >> 0) & 0x0000ff;
                colors.push(r / 255, g / 255, b / 255);
              }
            }
          });
          // 如果是float数组要用Float32Buffer，否则会报无法解析的错误
          geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
          );
          if (colors.length > 0 && !pointsColor){
            geometry.setAttribute(
              "color",
              new THREE.Float32BufferAttribute(colors, 3)
            );
            material.vertexColors = true;
          }
          else material.color=new THREE.Color(pointsColor)
      
          // 决定每个点加颜色一定要写明这个属性
       
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
