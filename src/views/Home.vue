<template>
  <div class="home">
    <map-view></map-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MapView from "@/components/MapView.vue";

export default defineComponent({
  components: {
    MapView,
  },
});
</script>

<style lang="less" scoped>
.home {
  width: 100vw;
  height: 100vh;
}
</style>
