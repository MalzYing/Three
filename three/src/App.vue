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
import { CloudPoint } from "./utils/CloudPoint.ts";
export default {
  mounted() {
    // cloudPoint(domID:string,source:string,pointsColor?:num)
    // 不设定第三个选项则展示原有颜色属性，设置了则覆盖，格式只能为0x
    const cloudPoint = new CloudPoint(
      "pcdContainer",
      "/src/assets/精细DEM20220928205906714.pcd",
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
