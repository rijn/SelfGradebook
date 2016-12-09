<template>
  <div id="app" :style="{ minHeight: fullHeight+'px' }">
    <header>
      <ul>
        <li>
          <h3>Self Gradebook</h3>
        </li>
        <li class="right">
          <img src="https://travis-ci.org/rijn/SelfGradebook.svg?branch=master">
        <li>
        <li class="right">
          <a href="https://github.com/rijn/SelfGradebook">Github</a>
        </li>
      </ul>
    </header>
    <router-view></router-view>
    <!-- <hello></hello> -->
  </div>
</template>

<script>
// import Hello from './components/Hello'

export default {
  name: 'app',
  // components: {
    // Hello
  // },
  data () {
    return {
      fullHeight: document.documentElement.clientHeight
    }
  },
  ready () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize () {
      this.fullHeight = document.documentElement.clientHeight
    }
  }
}
</script>

<style lang="less">

@import "~normalize.css/normalize.css";
@import "./styles/color.less";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @text-color;

  width: 100%;
  position: relative;
  padding: 0;
  margin: 0;
  overflow: hidden;
  top: 0;


}

header {
  z-index: 999;
  position: absolute;
  left: 0;
  right: 0;
  ul {
    list-style: none;
    // width: 100%;
    overflow: hidden;
    padding: 0 10px;
    margin: 0;
    li {
      display: inline-block;

      height: 20px;
      line-height: 20px;

      & > h3 {
        display: inline-block;
        padding: 0;
        margin: 0;
        font-weight: 100;
      }

      padding: 20px 10px;

      float: left;
      &.right {
        float: right;
      }
    }
  }
}

a {
  color: @link-color;
  text-decoration: none;
  &:hover {
    color: @link-hover-color;
  }
}

button, .button {
  padding: 7px 14px;
  margin: 7px;
  background: 0;
  border: solid 1px @border-color-base;

  opacity: 0.7;

  border-radius: 4px;
  cursor: pointer;

  display: inline-block;

  &.dark {
    color: @border-color-split;
    border: solid 1px @border-color-split;
  }

  &:hover {
    opacity: 1;
  }
}
</style>
