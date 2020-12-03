<template>
  <section class="next-holydays-container">
    <h1>Neste holyday</h1>
    <template v-if="holydays !== null">
      <div
        v-for="(holyday, index) in holydays"
        class="next-holyday-card"
        :key="index"
        :class="index === 0 ? 'first' : ''"
      >
        <p class="days-until"> Om {{calcDays(holyday.date)}} dager</p>
        <p class="holyday-name"> {{ holyday.localName }} </p>
        <p class="holyday-date"> {{ holyday.date }} </p>
      </div>
    </template>
    <div v-else>
      Loading..
    </div>
  </section>
</template>

<script>
import { fetchNextHoliday } from '@/utils/fetchApi.js';
import { ref, onMounted } from 'vue';
import { differenceInDays } from 'date-fns';

export default {
  setup() {
    const holydays = ref(null);
    const daysUntil = ref(null);

    onMounted(() => {
      fetchNextHoliday()
        .then((res) => holydays.value = res.slice(0, 5));
    });

    function calcDays(holydayDate) {
      const next = new Date(holydayDate);
      const today = new Date();

      return differenceInDays(next, today) + 1;
    }

    return { holydays, calcDays };
  },
};
</script>

<style lang="scss" scoped>

h1 {
  text-align: center;
}

.next-holydays-container{
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.next-holyday-card {
  display: flex;
  flex-direction: column;
  margin: 1em;
  border: 1px solid #fefefe;
  padding: 1em;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  font-size: 24px;

  &.first {
    font-weight: 700;
    .days-until{
      text-decoration: underline solid #fefefe;
    }
  }

  .holyday-name {
    font-size: 20px;
  }

  .holyday-date {
    font-size: 16px;
  }
}
</style>
