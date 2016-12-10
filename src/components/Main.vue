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
        <h3>{{select.value.total}}</h3>
        <Score :origin="select.policy" :score="select.score" v-model="select.value"></Score>
        <!-- <ul>
            <li v-for="(item, key) in select.flatten" v-bind:style="{ 'marginLeft': (item.level || 0) * 10 + 'px' }">
              {{key}} {{item.proportion.toFixed(2)}}
              <span v-if="item.hasOwnProperty('_score')">{{item._score.toFixed(2)}}</span>
              <span v-if="item.hasOwnProperty('score')">{{item.score.toFixed(2)}}</span>
              <input v-if="item.hasOwnProperty('score')" v-model="item.input" @change="refreshGrade(key)">
            </li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<script>
import Score from './Score'

export default {
  name: 'hello',
  components: { Score },
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
          flatten: {},
          score: {},
          value: {},
          policy: {
            proportion: 100,
            list: {
              'Lab': {
                iteration: {
                  start: 1,
                  num: 15,
                  proportion: 25 / 15,
                  func (input) {
                    if (input < 0) input = 0
                    if (input > 13) input = 13
                    if (input <= 10) {
                      return (input / 10)
                    } else {
                      return 1 + (input - 10) / 3 * (2 / 15) / (25 / 15)
                    }
                  }
                }
              },
              'Web Homework': {
                proportion: 5
              },
              'Exam': {
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
    }
  },
  created () {
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
