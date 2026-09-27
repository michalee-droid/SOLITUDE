export const WEATHER_LIST = [
    { cond: 'Cerah', tempMin: 28, tempMax: 33, icon: 'sun' },
    { cond: 'Cerah Berawan', tempMin: 26, tempMax: 30, icon: 'cloud-sun' },
    { cond: 'Berawan', tempMin: 24, tempMax: 27, icon: 'cloud' },
    { cond: 'Hujan Gerimis', tempMin: 22, tempMax: 25, icon: 'cloud-drizzle' },
    { cond: 'Hujan Lebat', tempMin: 20, tempMax: 23, icon: 'cloud-rain' }
];

export let currentWeather = { cond: 'Cerah Berawan', temp: 28, icon: 'cloud-sun' };

export function setCurrentWeather(newWeather) {
    currentWeather = newWeather;
}
