<template>
  <div class="score">
    <ul>
      <li v-for="(item, key) in flatten" v-bind:style="{ 'marginLeft': (item.level || 0) * 10 + 'px' }">
        {{key}}
        <span v-if="item.hasOwnProperty('proportion')">{{item.proportion.toFixed(2)}}</span>
        <span v-if="item.hasOwnProperty('_score')">{{item._score.toFixed(2)}}</span>
        <span v-if="item.hasOwnProperty('score')">{{item.score.toFixed(2)}}</span>
        <span v-if="item.hasOwnProperty('enable')">{{item.enable}}</span>
        <input v-if="item.hasOwnProperty('score')" v-model="item.input" @change="refreshGrade(key)">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'score',
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
        return {}
      }
    },
    'value': {
      type: Object,
      default: {
        total: 0
      }
    }
  },
  data () {
    return {
      flatten: null,
      data: {
        got: 0,
        done: 0,
        lost: 0,
        total: 0,
        proportion: 0
      }
    }
  },
  methods: {
    calculateTotal () {
      this.data.got = this.data.done = this.data.total = this.data.lost = 0
      for (var key in this.flatten) {
        if (!this.flatten.hasOwnProperty(key)) continue
        if (this.flatten[key].parent === 'grade') {
          this.data.got += this.flatten[key]._score || this.flatten[key].score || 0
          this.data.total += this.flatten[key].proportion || 0
        }
        if (this.flatten[key].hasOwnProperty('score') && this.flatten[key].input !== '') {
          if (this.flatten[key].enable || false) this.data.done += this.flatten[key].proportion || 0
          if (this.flatten[key].proportion - this.flatten[key].score > 0) {
            this.data.lost += this.flatten[key].proportion - this.flatten[key].score || 0
          }
        }
      }
      this.$emit('input', this.data)
    },
    refreshGrade (key) {
      let flatten = this.flatten
      if (key === 'grade') this.calculateTotal()
      if (!flatten.hasOwnProperty(key)) return
      if (flatten[key].hasOwnProperty('score')) {
        if (flatten[key].hasOwnProperty('func')) {
          /* eslint-disable no-eval */
          flatten[key].score = flatten[key].func(Number(eval(flatten[key].input))) * flatten[key].proportion
        } else {
          /* eslint-disable no-eval */
          flatten[key].score = Number(eval(flatten[key].input)).toFixed(2) * flatten[key].proportion
          if (flatten[key].max > 0) {
            flatten[key].score /= flatten[key].max
          }
        }
        if (flatten[key].hasOwnProperty('enableFunc')) {
          flatten[key].enable = flatten[key].enableFunc(flatten[key])
        }
        this.$set(this.flatten, key, flatten[key])
      } else if (flatten[key].hasOwnProperty('_score')) {
        let temp = Object.assign({}, flatten[key])

        if (temp.hasOwnProperty('enableFunc')) {
          let args = {}
          for (let _key of flatten[key].child) {
            args[_key] = (flatten[_key].score || 0) + (flatten[_key]._score || 0)
          }
          let enable = temp.enableFunc(args)
          for (let _key in enable) {
            let _temp = flatten[_key]
            _temp.enable = enable[_key]
            this.$set(flatten, _key, _temp)
          }
        }

        temp._score = 0
        if (flatten[key].hasOwnProperty('func')) {
          let args = {}
          for (let _key of flatten[key].child) {
            args[_key] = (flatten[_key].score || 0) + (flatten[_key]._score || 0)
          }
          temp._score = flatten[key].func(args)
        } else {
          for (let _key of flatten[key].child) {
            if (flatten[_key].enable || false) temp._score += (flatten[_key].score || 0) + (flatten[_key]._score || 0)
          }
        }

        this.$set(flatten, key, temp)
      }
      this.refreshGrade(flatten[key].parent)
    },
    renderTemplateToList (_key, tpl, level = 0) {
      if (tpl === null) {
        return
      }
      let list = {}
      // if (tpl.hasOwnProperty('func')) {
      //   list = Object.assign({}, list, tpl.func())
      // } else
      if (tpl.hasOwnProperty('list')) {
        for (var key in tpl.list) {
          if (!tpl.list.hasOwnProperty(key)) continue
          list[key] = {
            parent: _key,
            child: [],
            proportion: tpl.list[key].proportion || 0,
            _score: 0,
            enable: true,
            level
          }
          let temp = this.renderTemplateToList(key, tpl.list[key], level + 1)
          if (temp.hasOwnProperty(key)) {
            list[key] = temp[key]
            list[key].parent = _key
          } else {
            for (var i in temp) {
              if (!temp.hasOwnProperty(i)) continue
              if (temp[i].parent === key) {
                if (!tpl.list[key].hasOwnProperty('proportion')) list[key].proportion += temp[i].proportion
                list[key].child.push(i)
              }
            }
            list = Object.assign({}, list, temp)
          }
          if (tpl.list[key].hasOwnProperty('func')) {
            list[key].func = tpl.list[key].func
          }
          if (tpl.list[key].hasOwnProperty('enableFunc')) {
            list[key].enableFunc = tpl.list[key].enableFunc
          }
        }
      } else if (tpl.hasOwnProperty('iteration')) {
        for (let i = 0; i < tpl.iteration.num; i++) {
          list[_key + (tpl.iteration.start + i)] = {
            parent: _key,
            proportion: typeof tpl.iteration.proportion === 'object' ? tpl.iteration.proportion[i] : tpl.iteration.proportion,
            score: 0,
            max: typeof tpl.iteration.max === 'object' ? tpl.iteration.max[i] : tpl.iteration.max || 0,
            input: '',
            enable: true,
            level
          }
          if (tpl.iteration.hasOwnProperty('func')) {
            list[_key + (tpl.iteration.start + i)].func = tpl.iteration.func
          }
          if (tpl.iteration.hasOwnProperty('enable')) {
            list[_key + (tpl.iteration.start + i)].enableFunc = tpl.iteration.enable
          }
        }
      } else {
        // return null
        list[_key] = {
          // parent: _key,
          proportion: tpl.proportion,
          score: 0,
          max: tpl.max || 0,
          input: '',
          enable: true,
          level: level - 1
        }
      }
      return list
    },
    generate () {
      this.flatten = Object.assign({}, this.renderTemplateToList('grade', this.origin))
      this.data.proportion = this.origin.proportion
      console.log(this.flatten)
    }
  },
  created () {
    this.generate()
  },
  watch: {
    origin: {
      handler: function (val, oldVal) {
        this.flatten = val
        this.generate()
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
@import "../styles/color.less";

</style>
