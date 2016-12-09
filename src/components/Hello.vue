<template>
  <div class="hello">
    <div class="head">

      <div class="container">
        <div class="section">
          <div class="start">
            <img src="../assets/logo.svg">
          </div>
          <h1>Self Gradebook</h1>
          <p>This application is designed to provide visualization and estimated grade for students.</p>
        </div>
        <router-link to="main" class="button dark">Get Start</router-link>
        <a class="button dark" href="https://github.com/rijn/SelfGradebook/wiki">Documents</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Self Gradebook Auto Deploy Test'
    }
  }
}
</script>

<style scoped lang="less">

.container {
  position: absolute;
  overflow: hidden;
  height: 500px;
  width: 100%;
  text-align: center;
  top: 50%;
  margin-top: -250px;
  @media screen and (max-width: 767px) {
    position: relative;
    height: auto;
    width: auto;
    top: 0;
    margin-top: 40px;
  }
}

.section {
  position: relative;
  img {
    max-width: 300px;
    max-height: 300px;
    &:hover {
      opacity: 0.7;
    }
  }
  h1 {
    font-weight: 100;
  }
}

.head {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-image: linear-gradient(33deg, #171f2c 10%, #3c4c62);
  overflow: hidden;
}

</style>
