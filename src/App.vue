<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
export default {
  computed: {
    layout({ $route: { meta } }) {
      return `layout-${meta.layout || 'default'}`
    },
  },
}
</script>

<style lang="scss">
@import '~normalize.css';

html,
body,
#app {
  height: 100%;
  width: 100%;
}

#app {
  background: #fafbfd;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
