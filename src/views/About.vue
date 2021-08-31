<template>
  <div class="about">
    <map-ctt></map-ctt>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MapCtt from "@/components/MapCtt.vue";

export default defineComponent({
  components: {
    MapCtt,
  },
});
</script>

<style lang="less" scoped>
.about {
  width: 100vw;
  height: 100vh;
}
</style>
