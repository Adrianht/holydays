<template>
    <LongWeekend />
    <!-- <NextHoliday /> -->
</template>

<script>
import LongWeekend from '@/components/LongWeekend.vue';
import NextHoliday from '@/components/NextHoliday.vue';

export default {
  name: 'Holidays',
  components: {
    NextHoliday,
    LongWeekend
  },
};
</script>
