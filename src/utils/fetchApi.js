export async function fetchHolidays(year) {
  return fetch(`https://date.nager.at/api/v2/publicholidays/${year}/NO`)
    .then((response) => response.json())
    .then((res) => res)
    .catch((err) => {
      console.error(err);
      return 'Could not fetch data from api';
    });
}

export async function fetchNextHoliday() {
  return fetch('https://date.nager.at/api/v2/NextPublicHolidays/NO')
    .then((response) => response.json())
    .then((res) => res)
    .catch((err) => {
      console.error(err);
      return 'Could not fetch data from api';
    });
}

export async function fetchLongWeekend(year) {
  return fetch(`https://date.nager.at/api/v2/LongWeekend/${year}/NO`)
    .then((response) => response.json())
    .then((res) => res)
    .catch((err) => {
      console.error(err);
      return 'Could not fetch data from api';
    });
}
