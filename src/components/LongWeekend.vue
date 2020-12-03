<template>
  <section v-if="weekends !== null && holidays !== null" class="container">
    <div v-if="nextYears !== null">
      <button v-for="year in nextYears" :key="year" class="button" @click="fetchYear(year)">{{year}}</button>
    </div>

    <div class="info">
      <h1>Long weekends</h1>
      <div class="green"></div>
      <span>Holyday or weekend</span>
      <div class="yellow"></div>
      <span>Need to use vacation day</span>
    </div>

    <div class="weekends-container">
      <div v-for="(weekend, index) in weekends" :key="'asd' + index" class="single-weekend">
        <p class="weekend-title"> Long weekend {{index + 1}} </p>
        <div class="weekend">
          <div v-for="day in weekend.dayCount" class="single-day" :class="checkBridge(weekend, day)">
            <p>{{dayName(weekend, day)}}</p>
          </div>
        </div>
      </div>
    </div>

    <button @click="icsExport">Export weekends to ics file</button>
  </section>
  <section v-else>
    Loading...
  </section>

</template>

<script>
import { fetchLongWeekend, fetchHolidays } from '@/utils/fetchApi.js';
import { ref, onMounted } from 'vue';
import {
  eachDayOfInterval, parseISO, format, isWithinInterval, isWeekend, addYears, getYear,
} from 'date-fns';

export default {
  setup() {
    const weekends = ref(null);
    const holidays = ref(null);
    const nextYears = ref(null);
    const chosenYear = ref(2020)

    onMounted(() => {
      nextYears.value = calcYears();
      fetchLongWeekend(chosenYear.value)
        .then((res) => weekends.value = res);
      fetchHolidays(chosenYear.value)
        .then((res) => holidays.value = onlyDates(res));
    });

    function onlyDates(arr) {
      const dates = [];
      arr.forEach((element) => {
        dates.push(format(parseISO(element.date), 'dd/MM/yyyy'));
      });
      return dates;
    }

    function allDays(weekend) {
      const start = parseISO(weekend.startDate);
      const end = parseISO(weekend.endDate);
      return eachDayOfInterval({ start, end });
    }

    function dayName(weekend, day) {
      const all = allDays(weekend);
      return format(all[day - 1], 'eeee dd, MMMM');
    }

    function checkBridge(weekend, day) {
      if (!weekend.needBridgeDay) {
        return;
      }

      const all = allDays(weekend);
      const currentDay = format(all[day - 1], 'dd/MM/yyyy');
      const exists = holidays.value.includes(currentDay);
      if (exists) {
        return;
      }

      const localDay = all[day - 1];
      const checkWeekend = isWeekend(localDay);

      if (checkWeekend) {
        return;
      }

      return 'bridge-day';
    }

    function fetchYear(year) {
      if(chosenYear.value === year){
        return;
      } else {
        chosenYear.value = year
        fetchLongWeekend(year)
          .then((res) => weekends.value = res);
        fetchHolidays(year)
          .then((res) => holidays.value = onlyDates(res));
      }
    }

    function dayIsBridge(weekend, day) {
      const currentDay = format(day, 'dd/MM/yyyy');
      const exists = holidays.value.includes(currentDay);
      if (exists) {
        return false;
      }
      const checkWeekend = isWeekend(day);
      if (checkWeekend) {
        return false;
      }
      return true
    }

    function icsExport() {
      let cal = ics();
      let exportAbleDates = []
      weekends.value.forEach(weekend => {
        let allDaysInWeekend = allDays(weekend);
        allDaysInWeekend.forEach(day => {
          let dayIsb = dayIsBridge(allDaysInWeekend, day);
          exportAbleDates.push(
            {
              day: day,
              bridge: dayIsb
            }
          )
        });
      });
      exportAbleDates.forEach(day => {
        let formattedDay = format(day.day, 'MM/dd/yyyy');
        if(day.bridge){
          cal.addEvent('Long Weekend! (BRIDGE-DAY)', 'If you use a vacation-day here you will get a long weekend! Exported from holydays.adrianht.no', 'Holyday', formattedDay, formattedDay);
        } else {
          cal.addEvent('Long Weekend!', 'Part of a long weekend! Exported from holydays.adrianht.no', 'Holyday', formattedDay, formattedDay);
        }
      });
      cal.download();
    }

    return {
      weekends, dayName, holidays, checkBridge, nextYears, fetchYear, icsExport
    };
  },
};



function calcYears() {
  let currentDate = new Date();
  const yearArray = [];

  for (let index = 0; index < 5; index++) {
    yearArray.push(getYear(currentDate));
    currentDate = addYears(currentDate, 1);
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

.single-weekend{
  margin-top: 3em;
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
