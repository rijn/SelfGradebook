<template>

  <div v-if="origin.list || origin.iteration">
    <li v-bind:class="[score.done > 0 ? 'parent' : '']">
      <span>{{origin.key}}</span>
      <span style="font-size: 12px">{{score.got && score.got.toFixed(2)}} / {{score.total && score.total.toFixed(2)}} ({{score.done && score.done.toFixed(2)}})</span>
    </li>
    <ul>
      <Score v-for="(item, key) in list" :origin="item" :score.sync="scores[key]"></Score>
    </ul>
  </div>
  <li v-else v-bind:class="[input.length > 0 ? 'filled' : '']">
    <span>{{origin.key}}</span>
    <span style="font-size: 12px">({{score.gotCredit}} / {{score.max}} = {{score.got && score.got.toFixed(2)}}) &times; {{score.total && score.total.toFixed(2)}}</span>
    <input v-model="input" @change="calculateScore" />
  </li>
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
    },
    'score': {
      type: Object,
      default () {
        return {
          'input': '',
          'total': 0.0,
          'extra': 0.0,
          'got': 0.0,
          'gotCredit': 0.0,
          'max': 0.0,
          'done': 0.0
        }
      }
    }
  },
  data () {
    return {
      list: [],
      input: '',
      scores: []
    }
  },
  methods: {
    generateList () {
      this.list = []
      if (this.origin.hasOwnProperty('list')) {
        this.list = this.origin.list
      } else {
        this.delegate()
      }

      if (this.list.length > 0) {
        for (let i = 0; i < this.list.length; i++) {
          this.scores.push({
            'input': '',
            'total': 0.0,
            'extra': 0.0,
            'got': 0.0,
            'gotCredit': 0.0,
            'max': 0.0,
            'done': 0.0
          })
        }
      }
    },
    delegate () {
      this.score.max = this.origin.max
      this.score.total = this.origin.proportion || 0
      this.score.extra = this.origin.extra || 0

      this.input = this.origin._input || ''
      this.calculateScore()

      this.emitUpdate()
    },
    calculateScore () {
      /* eslint-disable no-eval */
      this.score.input = this.input
      if (this.input.length > 0) {
        this.score.gotCredit = Number(eval(this.score.input))
        this.score.done = this.score.total
      } else {
        this.score.gotCredit = this.score.done = 0
      }
      this.score.got = this.score.gotCredit / this.score.max * this.score.total

      this.origin._input = this.input

      this.emitUpdate()
    },
    updateResult () {
      this.score.total = this.score.got = this.score.max = this.score.done = this.score.extra = 0
      for (let i = 0; i < this.scores.length; i++) {
        this.score.total += this.scores[i].total
        this.score.got += this.scores[i].got
        this.score.max += this.scores[i].max
        this.score.done += this.scores[i].done
        this.score.extra += this.scores[i].extra
      }
      this.emitUpdate()
    },
    emitUpdate () {
      if (this.$parent.$options.name === 'Score') {
        this.$parent.updateResult()
      } else {
        this.$emit('input', this.score, this.origin)
      }
    }
  },
  created () {
    this.generateList()
  },
  watch: {
    origin: {
      handler: function (val, oldVal) {
        this.origin = val
        this.generateList()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
@import "../styles/color.less";

ul, li {
  list-style: none;
}

ul {
  margin: 0 0 0 30px;
  // padding: 5px 0 5px 10px;
  padding: 0;

  li {
    display: block;

    margin: 10px 0;
    padding: 5px 0 5px 10px;

    border-left: solid 3px @border-color-base;
    &.parent {
      border-left: solid 3px @info-color;
    }
    &.filled {
      border-left: solid 3px @info-color;
    }

    overflow: hidden;

    font-size: 14px;
    line-height: 20px;

    & > * {
      display: inline-block;
      line-height: 20px;
      height: 20px;

      margin: 0;
      padding: 3px;
    }

    & > input {
      float: right;

      border: 0;
      border-bottom: solid 1px @border-color-base;

      transition: border 0.3s ease;

      &:hover {
        border-bottom: solid 1px lighten(@info-color, 20%);
      }

      &:focus {
        border-bottom: solid 1px @info-color;

        & > & {
          border-left: solid 5px @info-color;
        }
      }
    }
  }
}

</style>
