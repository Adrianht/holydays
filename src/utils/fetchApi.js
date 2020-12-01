// return fetch(`https://date.nager.at/api/v2/publicholidays/${year}/NO`)
// return fetch(`https://date.nager.at/api/v2/NextPublicHolidays/NO`)
// return fetch(`https://date.nager.at/api/v2/LongWeekend/${year}/NO`)

export async function fetchHolidays(year) {
  return fetch(`http://localhost:3000/allHolidays?year=${year}`,)
    .then((response) => response.json())
    .then((res) => res)
    .catch((err) => {
      console.error(err);
      return 'Could not fetch data from api';
    });
}

export async function fetchNextHoliday() {
  return fetch('http://localhost:3000/nextHoliday')
    .then((response) => response.json())
    .then((res) => res)
    .catch((err) => {
      console.error(err);
      return 'Could not fetch data from api';
    });
}

export async function fetchLongWeekend(year) {
  return fetch(`http://localhost:3000/longWeekend?year=${year}`)
    .then((response) => response.json())
    .then((res) => res)
    .catch((err) => {
      console.error(err);
      return 'Could not fetch data from api';
    });
}
