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
        <div class="chart">
          <div>
            <vue-chart type="doughnut" :data="chartData"></vue-chart>
          </div>
          <div v-if="select.value && select.value.total">
            <h3><span class="light">Total </span>{{select.value.total.toFixed(2)}}</h3>
            <h3><span class="light">Done </span>{{select.value.done.toFixed(2)}}</h3>
            <h3><span class="light">Got </span>{{select.value.got.toFixed(2)}}</h3>
            <h3><span class="light">Lost </span>{{select.value.lost.toFixed(2)}}</h3>
          </div>
          <div>
            <h3><span class="light">Estimate</span></h3>
            <h1 class="light">{{(select.value.got / select.value.done * 100).toFixed(2)}} %</h1>
          </div>
        </div>
        <Score :origin="select.policy" :score="select.score" v-bind:value="select.value" v-on:input="update(arguments[0])"></Score>
      </div>
    </div>
  </div>
</template>

<script>
import Score from './Score'
import VueChart from 'vue-chart'

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
          code: 'CS233',
          name: 'Computer Architecture',
          term: 'Fall 2016',
          flatten: {},
          score: {},
          value: {},
          policy: {
            list: {
              'Lab': {
                iteration: {
                  start: 1,
                  num: 15,
                  proportion: 25 / 15,
                  max: 100
                }
              },
              'Web Homework': {
                proportion: 5,
                max: 100
              },
              'Exam': {
                list: {
                  'Exam 1 Combinational Design': {
                    proportion: 10,
                    max: 100
                  },
                  'Exam 2 FSM': {
                    proportion: 5,
                    max: 100
                  },
                  'Exam 3 Datapath Modification': {
                    proportion: 5,
                    max: 100
                  },
                  'Exam 4 MIPS fundamentals': {
                    proportion: 10,
                    max: 100
                  },
                  'Exam 5 MIPS Advanced': {
                    proportion: 5,
                    max: 100
                  },
                  'Exam 6 Pipelining/Performanc': {
                    list: {
                      'Q1': {
                        proportion: 40 / 100 * 10,
                        max: 40
                      },
                      'Q2': {
                        proportion: 30 / 100 * 10,
                        max: 30
                      },
                      'Q3': {
                        proportion: 30 / 100 * 10,
                        max: 30
                      }
                    }
                  },
                  'Exam 7 Caching': {
                    proportion: 10,
                    max: 100
                  }
                }
              },
              'Final': {
                proportion: 10,
                max: 100
              },
              'Attendance': {
                // proportion: 5,
                list: {
                  'iClickers': {
                    proportion: 3,
                    max: 100
                  },
                  'iClickers Extra': {
                    proportion: 2,
                    max: 100
                  },
                  'Quizzes': {
                    iteration: {
                      start: 1,
                      num: 15,
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
                }
              }
            }
          }
        },
        {
          code: 'CS357',
          name: 'Numercal Method I',
          term: 'Fall 2016',
          flatten: {},
          score: {},
          value: {},
          policy: {
            list: {
              'Examlet': {
                proportion: 50,
                iteration: {
                  start: 1,
                  num: 7,
                  proportion: 50 / 6,
                  max: 100,
                  func (score) {
                    return score < 100 ? score / 100 : 1 + (score - 100) / 11.1111 / (50 / 6)
                  }
                },
                enableFunc (obj) {
                  let min = 'Examlet1'
                  for (let key in obj) {
                    if (!obj.hasOwnProperty(key)) continue
                    if (obj[key] < obj[min]) min = key
                  }
                  for (let key in obj) {
                    if (!obj.hasOwnProperty(key)) continue
                    if (key === min) {
                      obj[key] = false
                    } else {
                      obj[key] = true
                    }
                  }
                  return obj
                }
              },
              'Final Exam': {
                proportion: 25,
                max: 100
              },
              'Homework': {
                list: {
                  'Homework 0 (Main Part)': {
                    proportion: 20 / 7,
                    max: 100
                  },
                  'Homework 1 (Main Part)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 1 (Part 1)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 2 (Main Part)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 2 (Part 1)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 3 (Main Part)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 3 (Part 1)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 4 (Main Part)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 4 (Part 1)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 5 (Main Part)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 5 (Part 1)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 6 (Main Part)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  },
                  'Homework 6 (Part 1)': {
                    proportion: 20 / 7 / 2,
                    max: 100
                  }
                }
              },
              'Piazza Extra Credit': {
                proportion: 1,
                max: 100
              },
              'Online Quizzes': {
                proportion: 5,
                max: 100
              }
            }
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
            this.select.value.total - this.select.value.got - this.select.value.lost,
            this.select.value.got,
            this.select.value.lost
          ]
        }]
      }
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
