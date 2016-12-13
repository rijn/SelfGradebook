<template>
  <ul v-if="origin.list || origin.iteration">
    <li>
      {{origin.key}}
      {{score.got && score.got.toFixed(2)}} / {{score.total && score.total.toFixed(2)}} ({{score.done && score.done.toFixed(2)}})
    </li>
    <li v-for="(item, key) in list">
      <Score :origin="item" :score.sync="scores[key]"></Score>
    </li>
  </ul>
  <ul v-else>
    <li>
      {{origin.key}}
      ({{score.gotCredit}} / {{score.max}} = {{score.got && score.got.toFixed(2)}}) &times; {{score.total && score.total.toFixed(2)}}
      <input v-model="input" @change="calculateScore" />
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
      // } else if (this.origin.hasOwnProperty('iteration')) {
      //   for (let i = 0; i < this.origin.iteration.num; i++) {
      //     this.list.push({
      //       key: this.origin.key + (this.origin.iteration.start + i),
      //       proportion: this.origin.iteration.proportion,
      //       max: this.origin.iteration.max
      //       // _input: (this.origin._input[i]) || ''
      //     })
      //   }
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

      /* copy input for iteration */
      // if (this.origin.hasOwnProperty('iteration')) {
      //   let _input = []
      //   console.log(this.list.length)
      //   for (let i = 0; i < this.list.length; i++) {
      //     _input.push(this.list[i]._input || '')
      //   }
      //   console.log(_input)
      //   // this.origin._input = _input
      // }

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

</style>
