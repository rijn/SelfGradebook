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
      <div class="card select" v-if="select !== null">
        <span>{{courses[select].key}} {{courses[select].term}}</span>
        <span style="position: absolute; right: 10px; top: 10px;">Last Modified {{courses[select].lastModifiedTime || '[null]'}}</span>
        <h2>{{courses[select].name}}</h2>
        <div class="chart">
          <div>
            <vue-chart type="doughnut" :data="chartData"></vue-chart>
          </div>
          <div v-if="courses[select].score && courses[select].score.total">
            <h3><span class="light">Total </span>{{Number(courses[select].score.total).toFixed(2)}}</h3>
            <h3><span class="light">Done </span>{{courses[select].score.done.toFixed(2)}}</h3>
            <h3><span class="light">Got </span>{{courses[select].score.got.toFixed(2)}}</h3>
            <!-- <h3><span class="light">Lost </span>{{select.score.lost.toFixed(2)}}</h3> -->
          </div>
          <div>
            <h3><span class="light">Estimate</span></h3>
            <h1 class="light">{{(courses[select].score.got / courses[select].score.done * 100).toFixed(2)}} %</h1>
          </div>
        </div>
        <!-- <Score :origin="select.policy" :score="select.score" v-bind:value="select.value" v-on:input="update(arguments[0])"></Score> -->
        <Score :origin="courses[select].policy" :score="courses[select].score" v-on:input="update(arguments[0], arguments[1])"></Score>
      </div>
      <a class="button warning" @click="removeCourse">Remove Course</a>
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
          data: [1, 0, 0]
        }]
      },
      courses: [
      ],
      select: null
    }
  },
  methods: {
    switchCourse (index) {
      this.select = index
    },
    update (value, origin) {
      this.courses[this.select].score = value
      let score = this.courses[this.select].score
      this.chartData = {
        datasets: [{
          data: [
            score.total - score.done,
            score.got,
            score.done - score.got
          ]
        }]
      }

      this.courses[this.select].policy = origin
      // console.log(this.courses)
      store.set('courses', this.courses)
    },
    processIteration (obj) {
      if (obj.hasOwnProperty('list')) {
        for (let i = 0; i < obj.list.length; i++) {
          obj.list[i] = this.processIteration(obj.list[i])
        }
      } else if (obj.hasOwnProperty('iteration')) {
        obj.list = []
        for (let i = 0; i < obj.iteration.num; i++) {
          obj.list.push({
            key: obj.key + (obj.iteration.start + i),
            max: obj.iteration.max,
            proportion: obj.iteration.proportion
          })
        }
      }
      return obj
    },
    addCourse () {
      this.$http.get(this.add.url).then((response) => {
        response.json().then((data) => {
          data.url = this.add.url

          /* process all iteration */
          data.policy = this.processIteration(data.policy)
          console.log(data)

          this.add.url = ''
          this.courses.push(data)
          store.set('courses', this.courses)
          this.switchCourse(this.courses.length - 1)
        })
      }, (response) => {
        console.log(response)
      })
    },
    removeCourse () {
      this.select = null
      this.courses.splice(this.select, 1)
      store.set('courses', this.courses)
    }
  },
  created () {
    if (!store.enabled) {
    }

    /* read from storage */
    this.courses = store.get('courses') || []
    console.log(store.get('courses'))
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
