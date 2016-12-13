<template>
  <div class="main">
    <div class="left">
      <div class="add-course card">
        <span style="float: left">URL</span>
        <input v-model="add.url">
        <a class="button" @click="addCourse">Add Course</a>
      </div>
      <div class="courses card">
        <ul>
          <li v-for="(course, index) in courses" @click="switchCourse(index)">
            <div style="font-size: 0.8em">
              <span style="float: left">{{course.key}}</span>
              <span style="float: right">{{course.term}}</span>
            </div>
            <span style="float: left">{{course.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="card select" v-if="select">
        <span>{{select.key}} {{select.term}}</span>
        <span style="position: absolute; right: 10px; top: 10px;">Last Modified {{select.lastModifiedTime || '[null]'}}</span>
        <h2>{{select.name}}</h2>
        <div class="chart">
          <div>
            <vue-chart type="doughnut" :data="chartData"></vue-chart>
          </div>
          <div v-if="select.score && select.score.total">
            <h3><span class="light">Total </span>{{select.score.total.toFixed(2)}}</h3>
            <h3><span class="light">Done </span>{{select.score.done.toFixed(2)}}</h3>
            <h3><span class="light">Got </span>{{select.score.got.toFixed(2)}}</h3>
            <!-- <h3><span class="light">Lost </span>{{select.score.lost.toFixed(2)}}</h3> -->
          </div>
          <div>
            <h3><span class="light">Estimate</span></h3>
            <h1 class="light">{{(select.score.got / select.score.done * 100).toFixed(2)}} %</h1>
          </div>
        </div>
        <!-- <Score :origin="select.policy" :score="select.score" v-bind:value="select.value" v-on:input="update(arguments[0])"></Score> -->
        <Score :origin="select.policy" :score="select.score" v-on:input="update(arguments[0])"></Score>
      </div>
    </div>
  </div>
</template>

<script>
import Score from './Score'
import VueChart from 'vue-chart'
import store from 'store'

export default {
  name: 'hello',
  components: { Score, VueChart },
  data () {
    return {
      add: {
        url: ''
      },
      chartData: {
        labels: ['REMAIN', 'GOT', 'LOST'],
        datasets: [{
          backgroundColor: ['#7f7f7f', '#36A2EB', '#FF6384'],
          data: [67, 30, 3]
        }]
      },
      courses: [
        {
          key: 'CS233',
          name: 'Computer Architecture',
          term: 'Fall 2016',
          flatten: {},
          score: {},
          value: {},
          policy: {
            key: 'CS233',
            list: [
              {
                key: 'Lab',
                iteration: {
                  start: 1,
                  num: 15,
                  proportion: 25 / 15,
                  max: 100
                }
              },
              {
                key: 'Web Homework',
                proportion: 5,
                max: 100
              },
              {
                key: 'Exam',
                list: [
                  {
                    key: 'Exam 1 Combinational Design',
                    proportion: 10,
                    max: 100
                  },
                  {
                    key: 'Exam 2 FSM',
                    proportion: 5,
                    max: 100
                  },
                  {
                    key: 'Exam 3 Datapath Modification',
                    proportion: 5,
                    max: 100
                  },
                  {
                    key: 'Exam 4 MIPS fundamentals',
                    proportion: 10,
                    max: 100
                  },
                  {
                    key: 'Exam 5 MIPS Advanced',
                    proportion: 5,
                    max: 100
                  },
                  {
                    key: 'Exam 6 Pipelining/Performanc',
                    list: [
                      {
                        key: 'Q1',
                        proportion: 40 / 100 * 10,
                        max: 40
                      },
                      {
                        key: 'Q2',
                        proportion: 30 / 100 * 10,
                        max: 30
                      },
                      {
                        key: 'Q3',
                        proportion: 30 / 100 * 10,
                        max: 30
                      }
                    ]
                  },
                  {
                    key: 'Exam 7 Caching',
                    proportion: 10,
                    max: 100
                  }
                ]
              },
              {
                key: 'Final',
                proportion: 10,
                max: 100
              },
              {
                key: 'Attendance',
                list: [
                  {
                    key: 'iClickers',
                    proportion: 3,
                    max: 100
                  },
                  {
                    key: 'iClickers Extra',
                    extra: 2,
                    max: 100
                  },
                  {
                    key: 'Quizzes',
                    iteration: {
                      start: 1,
                      num: 15,
                      max: 10,
                      proportion: 2 / 15,
                      func (input) {
                        if (input < 0) input = 0
                        if (input > 13) input = 13
                        if (input <= 10) {
                          return (input / 10)
                        } else {
                          return 1 + (input - 10) / 3 * (2 / 15) / (2 / 15)
                        }
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      ],
      select: null
    }
  },
  methods: {
    switchCourse (index) {
      this.select = this.courses[index]
    },
    update (value) {
      this.select.value = value
      this.chartData = {
        datasets: [{
          data: [
            this.select.score.total - this.select.score.done,
            this.select.score.got,
            this.select.score.done - this.select.score.got
          ]
        }]
      }
    },
    addCourse () {
      console.log(this.add.url)
      this.$http.get(this.add.url).then((response) => {
        console.log(response)
      }, (response) => {
        console.log(response)
      })
    }
  },
  created () {
    this.switchCourse(0)

    if (!store.enabled) {
    }
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

    .chart {
      width: 100%;
      overflow: hidden;
      & > div {
        width: 25%;
        padding-right: 5%;
        display: block;
        position: relative;
        float: left;
      }
    }
  }
}

.light {
  font-weight: 100;
}
</style>
