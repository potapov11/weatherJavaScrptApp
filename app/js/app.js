const API_KEY = 'f4058b408f207656f8e588ad47f3e07b';
const locationBtn = document.querySelector('.header__location');
import { clockTimer } from '../modules/clockTimer.js';
import { getDayTime, setDatatoTimeBox } from '../modules/timeDateFunctions.js';
import { setDatatoInfoBox } from '../modules/setDatatoInfoBox.js';
import { showModal } from '../modules/showModal.js';

clockTimer();
searchPlace();

function searchPlace() {
	const btnSearch = document.querySelector('.header__form-search');
	const formSearch = document.querySelector('.header__form');
	btnSearch.addEventListener('click', getPlace);
	formSearch.addEventListener('submit', function (event) {
		event.preventDefault();
		showModal();
		getPlace();
	});
}

async function getPlace() {
	const input = document.querySelector('.header__input');
	const value = input.value;
	// console.log(value);
	const urlToGetPlace = `http://api.openweathermap.org/geo/1.0/direct?q=${value}&lang=ru&appid=${API_KEY}`;
	console.log(urlToGetPlace);
	const placeData = await getPlaceData(urlToGetPlace);
	console.log(placeData);
	if (placeData && placeData.length > 0) {
		placeData.forEach((item) => {
			const position = [item.lat, item.lon];
			getCurrentWeather(position);
			getWeather(position);
		});
	} else {
		console.log('Ошибка при получении данных места');
	}
}

async function getPlaceData(url) {
	try {
		const response = await fetch(url);
		if (response.ok) {
			const respData = await response.json();
			return await respData;
		} else {
			throw new Error('Ошибка при получении данных');
		}
	} catch (error) {
		console.error('Error ' + error.message);
		throw error;
	}
}

locationBtn.addEventListener('click', () => {
	navigator.geolocation.getCurrentPosition(success, error, {
		enableHighAccuracy: true,
	});

	function success({ coords }) {
		const { latitude, longitude } = coords;
		const position = [latitude, longitude];
		if (position !== null) {
			console.log('succes');
		}
		getWeather(position);
		getCurrentWeather(position);
	}
	function error({ message }) {
		console.log(message);
	}
});

async function getWeather(params) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/forecast?lat=${params[0]}&lon=${params[1]}&lang=ru&appid=${API_KEY}&units=metric`,
	);
	const respData = await response.json();
	console.log(respData);
	setDatato5DayForecast(respData);
}

async function getCurrentWeather(params) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${params[0]}&lon=${params[1]}&lang=ru&appid=${API_KEY}&units=metric`,
	);
	const respData = await response.json();
	// console.log(respData);
	setDatatoTimeBox(respData);
	setDatatoInfoBox(respData);
}

function setDatato5DayForecast(data) {
	let weatherArr = data.list.map((item, i) => {
		if (i % 5 === 0) {
			return item;
		}
	});
	weatherArr = weatherArr.filter((element) => element !== undefined);
	console.log(weatherArr);

	let forecastLines = Array.from(document.querySelectorAll('.forecast-box__line'));
	console.log(forecastLines);
	for (let i = 0; i < forecastLines.length; i++) {
		const {
			dt,
			main: { temp },
			weather: [{ main, icon }],
		} = weatherArr[i];

		let spanTemp = forecastLines[i].querySelector('span');
		spanTemp.textContent = `${Math.ceil(temp)} °C`;

		let iconDiv = forecastLines[i].querySelector('div');
		iconDiv.style.backgroundImage = `url(https://openweathermap.org/img/wn/${icon}@2x.png)`;

		let timeText = forecastLines[i].querySelector('p');
		let currentDate = getDayTime(dt);
		currentDate = currentDate.split(',');
		timeText.textContent = currentDate;
	}
}
