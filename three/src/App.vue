<template>
  <div
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    id="pcdContainer"
    ref="pcdcontainer"
  ></div>
  <!-- v-loding 是element Ui的 -->
</template>

<script>
import { PCDCloudPoint } from "./utils/PCDCloudPoint.ts";
import { CloudPoint } from "./utils/CloudPoint.ts";
export default {
  mounted() {
    // 自己实现的方法暂时还不能像PCDLoader那样获取颜色数据，需要更深的研究three.js提供的load方法解析后的文件中color数据在哪
    // PCDcloudPoint和CloudPoint在后续进行去重合并，因为还有PLYLoader,VTKLoader等，最后一并写入一个工具类中作条件切换
    // cloudPoint(domID:string,source:string,pointsColor:num),颜色只支持0x格式
    // const cloudPoint=new PCDCloudPoint('pcdContainer','/src/assets/精细DEM20220928205906714.pcd')
    const cloudPoint = new CloudPoint(
      "pcdContainer",
      "/src/assets/精细DEM20220928205906714.pcd",
      0xefefef
    );
  },
};
</script>
<style scoped>
#pcdContainer {
  margin: 0 auto;
  width: 70vw;
  height: 70vh;
}
</style>
