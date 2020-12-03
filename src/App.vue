<template>
  <main>
    <router-view/>
  </main>
</template>

<script>

export default {
};
</script>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #2c3e50;
  color: #fff;
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  display: grid;
  place-items: center;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

main{
  margin: 5rem 0;
}

</style>
