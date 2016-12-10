<template>
  <div class="main">
    <div class="left">
      <div class="add-course card">
        <span style="float: left">URL</span>
        <input :value.sync="add.url">
        <a class="button">Add Course</a>
      </div>
      <div class="courses card">
        <ul>
          <li v-for="(course, index) in courses" @click="switchCourse(index)">
            <div style="font-size: 0.8em">
              <span style="float: left">{{course.code}}</span>
              <span style="float: right">{{course.term}}</span>
            </div>
            <span style="float: left">{{course.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="card select" v-if="select">
        <span>{{select.code}} {{select.term}}</span>
        <span style="position: absolute; right: 10px; top: 10px;">Last Modified {{select.lastModifiedTime || '[null]'}}</span>
        <h2>{{select.name}}</h2>
        <ul>
          <!-- <template v-for="(item, key) in select.flatten"> -->
            <li v-for="(item, key) in select.flatten" v-bind:style="{ 'marginLeft': (item.level || 0) * 10 + 'px' }">
              {{key}} {{item.proportion.toFixed(2)}}
              <span v-if="item.hasOwnProperty('_score')">{{item._score.toFixed(2)}}</span>
              <span v-if="item.hasOwnProperty('score')">{{item.score.toFixed(2)}}</span>
              <input v-if="item.hasOwnProperty('score')" v-model="item.input" @change="refreshGrade(key)">
            </li>
          <!-- </template> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      add: {
        url: ''
      },
      courses: [
        {
          code: 'CS233',
          name: 'Computer Architecture',
          term: 'Fall 2016',
          flatten: null,
          policy: {
            proportion: 100,
            list: {
              'Lab': {
                // proportion: 25,
                iteration: {
                  start: 1,
                  num: 15,
                  proportion: 25 / 15
                }
              },
              'Web Homework': {
                proportion: 5
              },
              'Exam': {
                // proportion: 55,
                iteration: {
                  start: 1,
                  num: 7,
                  proportion: [10, 5, 5, 10, 5, 10, 10]
                }
              },
              'Final': {
                proportion: 10
              },
              'Attendance': {
                // proportion: 5,
                list: {
                  'iClickers': {
                    proportion: 3
                  },
                  'Quizzes': {
                    proportion: 2
                  }
                }
              }
            }
          }
        },
        {
          code: 'CS225',
          name: 'Data Structure',
          term: 'Fall 2016'
        }
      ],
      select: null
    }
  },
  methods: {
    switchCourse (index) {
      this.select = this.courses[index]
      this.select.flatten = Object.assign({}, this.renderTemplateToList('grade', this.courses[index].policy))
    },
    refreshGrade (key) {
      let flatten = this.select.flatten
      if (!flatten.hasOwnProperty(key)) return
      if (flatten[key].hasOwnProperty('func')) {
        flatten[key].func()
      } else if (flatten[key].hasOwnProperty('score')) {
        /* eslint-disable no-eval */
        flatten[key].score = Number(eval(flatten[key].input)).toFixed(2) * flatten[key].proportion
        this.$set(this.select.flatten, key, flatten[key])
      } else if (flatten[key].hasOwnProperty('_score')) {
        let temp = Object.assign({}, flatten[key])
        temp._score = 0
        for (var _key of flatten[key].child) {
          temp._score += (flatten[_key].score || 0) + (flatten[_key]._score || 0)
        }
        this.$set(this.select.flatten, key, temp)
      }
      this.refreshGrade(flatten[key].parent)
    },
    renderTemplateToList (_key, tpl, level = 0) {
      let list = {}
      if (tpl.hasOwnProperty('func')) {
        list = Object.assign({}, list, tpl.func())
      } else if (tpl.hasOwnProperty('list')) {
        for (var key in tpl.list) {
          if (!tpl.list.hasOwnProperty(key)) continue
          list[key] = {
            parent: _key,
            child: [],
            proportion: 0,
            _score: 0,
            level
          }
          let temp = this.renderTemplateToList(key, tpl.list[key], level + 1)
          if (temp.hasOwnProperty(key)) {
            list[key] = temp[key]
            list[key].parent = _key
          } else {
            for (var i in temp) {
              if (!temp.hasOwnProperty(i)) continue
              list[key].proportion += temp[i].proportion
              list[key].child.push(i)
            }
            list = Object.assign({}, list, temp)
          }
        }
      } else if (tpl.hasOwnProperty('iteration')) {
        if (typeof tpl.iteration.proportion === 'object') {
          for (let i = 0; i < tpl.iteration.num; i++) {
            list[_key + (tpl.iteration.start + i)] = {
              parent: _key,
              // name: _key + (tpl.iteration.start + i),
              proportion: tpl.iteration.proportion[i],
              score: 0,
              input: '',
              level
            }
          }
        } else {
          for (let i = 0; i < tpl.iteration.num; i++) {
            list[_key + (tpl.iteration.start + i)] = {
              parent: _key,
              // name: _key + (tpl.iteration.start + i),
              proportion: tpl.iteration.proportion,
              score: 0,
              input: '',
              level
            }
          }
        }
      } else {
        // return null
        list[_key] = {
          // parent: _key,
          proportion: tpl.proportion,
          score: 0,
          input: '',
          level: level - 1
        }
      }
      return list
    }
  },
  created () {
    this.switchCourse(0)
  }
}
</script>

<style scoped lang="less">
@import "../styles/color.less";

.card {
  margin: 10px;
  border-radius: 3px;
  // border: solid 1px rgba(0,0,0,.1);
  box-shadow: 0 1px 0 0 rgba(0,0,0,.1);
  background: #fff;

  overflow: hidden;
}

.main {
  margin-top: 60px;

  .add-course {
    padding: 10px;
    input {
      width: 100%;
      padding: 5px 0;
      border: none;
      border-bottom: solid 1px @shadow-color;
    }
  }

  .left {
    float: left;
    width: 30%;
  }

  .right {
    float: right;
    width: 70%;
  }

  .courses {

    ul {
      width: 100%;
      list-style: none;
      overflow: hidden;
      padding: 0;
      margin: 0;

      line-height: 1.3em;

      li {
        margin: 0;
        padding: 10px;
        cursor: pointer;
        &:hover {
          background: rgba(0, 0, 0, 0.03);
        }

        overflow: hidden;
        & > * {
          overflow: hidden;
        }

        &:not(:last-child) {
          border-bottom: solid 1px rgba(0, 0, 0, 0.07);
        }
      }
    }
  }

  .select {
    padding: 20px;
    text-align: left;
    position: relative;

    & > * {
      display: block;
    }

    h2 {
      font-weight: 100;
      margin: 10px 0;
    }
  }
}
</style>
