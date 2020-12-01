<template>
  <section v-if="weekends !== null && holidays !== null" class="container">
    <div v-if="nextYears !== null">
      <button v-for="year in nextYears" :key="year" class="button" @click="fetchYear(year)">{{year}}</button>
    </div>
    <div class="info">
      <h1>Long weekends</h1>
      <div class="green"></div>
      <span>Holyday</span>
      <div class="yellow"></div>
      <span>Need to use vacation day</span>
    </div>
    
    <div class="weekends-container">
      <div v-for="(weekend, index) in weekends" :key="'asd' + index" class="weekend">
        <div v-for="day in weekend.dayCount" class="single-day" :class="checkBridge(weekend, day)">
          <p>{{dayName(weekend, day)}}</p>
        </div>
      </div>
    </div>
    
  </section>
  <section v-else>
    Loading...
  </section>
</template>

<script>
import { fetchLongWeekend, fetchHolidays } from '@/utils/fetchApi.js';
import { ref, onMounted } from 'vue';
import { eachDayOfInterval, parseISO, format, isWithinInterval, isWeekend, addYears, getYear } from 'date-fns'

export default {
  setup() {
    const weekends = ref(null);
    const holidays = ref(null);
    const nextYears = ref(null)

    onMounted(() => {
      nextYears.value = calcYears()
      fetchLongWeekend(2020)
        .then(res => weekends.value = res)
      fetchHolidays(2020)
        .then(res => holidays.value = onlyDates(res))
    });

    function onlyDates(arr){
      let dates = [];
      arr.forEach(element => {
        dates.push(format(parseISO(element.date), 'dd/MM/yyyy'))
      });
      return dates;
    }

    function allDays(weekend) {
      let start = parseISO(weekend.startDate);
      let end = parseISO(weekend.endDate);
      return eachDayOfInterval({start: start, end: end})
    }

    function dayName(weekend, day){
      let all = allDays(weekend)
      return format(all[day - 1], 'eeee dd, MMMM')
    }

    function checkBridge(weekend, day){
      if(!weekend.needBridgeDay){
        return;
      }

      let all = allDays(weekend);
      let currentDay = format(all[day -1], 'dd/MM/yyyy');
      let exists = holidays.value.includes(currentDay); 
      if(exists){
        return;
      }
      
      let localDay = all[day - 1];
      let checkWeekend = isWeekend(localDay);

      if(checkWeekend){
        return;
      }

      return 'bridge-day'
    }

    function fetchYear(year) {
      fetchLongWeekend(year)
        .then(res => weekends.value = res)
      fetchHolidays(year)
        .then(res => holidays.value = onlyDates(res))
    }

    return { weekends, dayName, holidays, checkBridge, nextYears, fetchYear }
  },
};

function calcYears() {
  let currentDate = new Date();
  let yearArray = [];

  for (let index = 0; index < 5; index++) {
    yearArray.push(getYear(currentDate))
    currentDate = addYears(currentDate, 1)
  }

  return yearArray;
}



</script>

<style lang="scss" scoped>
.container {
  width: 90%;
  height: auto;
  display: grid;
  grid-gap: 2em;
  place-items: center;
}

.weekend {
  margin: 1em 0;
  display: flex;
  align-self: center;
  flex-wrap: wrap;

  .single-day {
    display: grid;
    place-items: center;
    width: 100px;
    height: 100px;
    border: 1px solid green;
    padding: 1em;

    &.bridge-day {
      border: 1px solid yellow;
    }
  }
}
.info {
  align-self: center;
  display: grid;
  grid-template: auto / max-content 1fr;
  gap: .5em;
  h1 {
    grid-column: 1 / -1;
  }
}
.green, .yellow {
  width: 20px;
  height: 20px;
}
.green {
  border: 2px solid green;
}

.yellow {
  border: 1px solid yellow;
}

button {
    display: inline-block;
    border: none;
    padding: 1rem;
    margin: .5rem;
    border-radius: 4px;
    text-decoration: none;
    background: #5E82A7;
    color: #ffffff;
    font: inherit;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
    transition: background 250ms ease-in-out, transform 150ms ease;
}

button:hover,
button:focus {
    background: #A6BACE;
}

button:focus {
    outline: 1px solid #fff;
    outline-offset: -4px;
}

button:active {
    transform: scale(0.99);
}
</style>
