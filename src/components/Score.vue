<template>
  <ul v-if="origin.list">
    <li>
      {{origin.key}}
    </li>
    <li v-for="(item, key) in origin.list">
      <Score :origin="item"></Score>
    </li>
  </ul>
  <ul v-else-if="origin.iteration">
    <li>
      {{origin.key}}
    </li>
  </ul>
  <ul v-else>
    <li>
      {{origin.key}}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Score',
  props: {
    'origin': {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
  },
  watch: {
    origin: {
      handler: function (val, oldVal) {
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
@import "../styles/color.less";

</style>
