const API_KEY = 'f4058b408f207656f8e588ad47f3e07b';
const locationBtn = document.querySelector('.header__location');
const locationBtnText = document.querySelector('.header__location-text');

clockTimer();
searchPlace();

function searchPlace() {
	const btnSearch = document.querySelector('.header__form-search');
	btnSearch.addEventListener('click', getPlace);
}

async function getPlace() {
	const input = document.querySelector('.header__input');
	if (input.value === '') {
		console.log('выберите место');
	} else {
		const value = input.value;
		console.log(value);
		const urlToGetPlace = `http://api.openweathermap.org/geo/1.0/direct?q=${value}&lang=ru&appid=${API_KEY}`;
		const placeData = await getPlaceData(urlToGetPlace);
		console.log(placeData);
		placeData.forEach((item) => {
			useLatLon(item.lat, item.lon, item.local_names.ru);
		});
	}
}

function useLatLon(lat, lon, name) {
	console.log(lat, lon, name);
	const position = [lat, lon];
	getCurrentWeather(position);
	getWeather(position);
}

async function getPlaceData(url) {
	const response = await fetch(url);
	if (response.ok) {
		const respData = await response.json();
		return respData;
	} else {
		throw new Error('Ошибка при получении данных');
	}
}

function clockTimer() {
	var date = new Date();

	var time = [date.getHours(), date.getMinutes(), date.getSeconds()]; // |[0] = Hours| |[1] = Minutes| |[2] = Seconds|
	var dayOfWeek = [
		'Воскесенье',
		'Понедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота',
	];
	var days = date.getDay();

	if (time[0] < 10) {
		time[0] = '0' + time[0];
	}
	if (time[1] < 10) {
		time[1] = '0' + time[1];
	}
	if (time[2] < 10) {
		time[2] = '0' + time[2];
	}

	var current_time = [time[0], time[1], time[2]].join(':');
	var clock = document.getElementById('clock');
	var day = document.getElementById('dayOfWeek');

	clock.innerHTML = current_time;
	day.innerHTML = dayOfWeek[days];

	setTimeout(clockTimer, 1000);
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
		console.log(dt);
		console.log(temp);
		console.log(main);

		console.log(icon);

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

function setDatatoInfoBox(data) {
	const tempBox = document.querySelector('.info-box__temp-text');
	const tempFeelsLikeBox = document.querySelector('.info-box__temp-span');
	const timeSunriseBox = document.querySelector('.info-box__sunrise-time');
	const timeSunsetBox = document.querySelector('.info-box__sunset-time');
	const weatherType = document.querySelector('.info-box__icon-text');
	const weatherImg = document.querySelector('.info-box__img');
	const windSpeed = document.querySelector('.info-box__wind-data');
	const humidityBox = document.querySelector('.info-box__humidity-data');
	const pressureBox = document.querySelector('.info-box__pressure-data');

	const currentTemp = Math.ceil(Number(data.main.temp));
	const currentTempFeelsLike = Math.ceil(Number(data.main.feels_like));
	console.log(currentTemp, currentTempFeelsLike);

	const timeSunrise = data.sys.sunrise; // Ваша временная метка
	const timeSunset = data.sys.sunset; // Ваша временная метка

	const getSunRiseSunsetTime = (time) => {
		const date = new Date(time * 1000);
		// Получаем значения часов и минут из объекта Date
		const hours = date.getHours();
		const minutes = date.getMinutes();
		return [hours, minutes];
	};

	let timeSun = getSunRiseSunsetTime(timeSunrise);
	let timeSunSet = getSunRiseSunsetTime(timeSunset);
	// Создаем новый объект Date с использованием временной метки

	const [{ description, main, icon }] = data.weather;
	const { speed } = data.wind;
	const currentSpeedWind = Math.ceil(Number(speed));
	const { humidity, pressure } = data.main;

	weatherImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

	weatherType.textContent = description;
	windSpeed.textContent = `${currentSpeedWind} km/h`;
	timeSunriseBox.textContent = `${timeSun}`;
	timeSunsetBox.textContent = `${timeSunSet}`;
	tempBox.textContent = `${currentTemp}°C`;
	tempFeelsLikeBox.textContent = `${currentTempFeelsLike}`;
	humidityBox.textContent = `${humidity} %`;
	pressureBox.textContent = `${pressure}hPa`;
}

function setDatatoTimeBox(data) {
	const cityNameBox = document.querySelector('.time-box__city-name');
	const timeBox = document.querySelector('.time-box__time');
	const timeBoxDay = document.querySelector('.time-box__day');
	const cityName = data.name;
	const daysArray = [
		'Воскресенье',
		'Поедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота',
	];

	const monthArray = [
		'Декабря',
		'Января',
		'Февраля',
		'Марта',
		'Апреля',
		'Мая',
		'Июня',
		'Июля',
		'Августа',
		'Сентября',
		'Октября',
		'Ноября',
	];

	//Устанавливаем часы
	const timestamp = data.dt; // Ваша временная метка
	const date = new Date(timestamp * 1000);
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const day = date.getDate();
	const currentDay = date.getDay();
	const month = date.getMonth() + 1; // Метод getMonth() возвращает значение от 0 до 11, поэтому мы добавляем 1
	const formattedHours = hours.toString().padStart(2, '0');
	const formattedMinutes = minutes.toString().padStart(2, '0');

	timeBox.textContent = `${formattedHours} : ${formattedMinutes}`;
	timeBoxDay.textContent = `${daysArray[currentDay]}, ${day} ${monthArray[month]}`;
	cityNameBox.textContent = cityName;
}

function getDayTime(timeUtc) {
	const daysArray = [
		'Воскресенье',
		'Понедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота',
	];

	const monthArray = [
		'Декабря',
		'Января',
		'Февраля',
		'Марта',
		'Апреля',
		'Мая',
		'Июня',
		'Июля',
		'Августа',
		'Сентября',
		'Октября',
		'Ноября',
	];

	//Устанавливаем часы
	const timestamp = timeUtc; // Ваша временная метка
	const date = new Date(timestamp * 1000);
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const day = date.getDate();
	const currentDay = date.getDay();
	const month = date.getMonth() + 1; // Метод getMonth() возвращает значение от 0 до 11, поэтому мы добавляем 1
	const formattedHours = hours.toString().padStart(2, '0');
	const formattedMinutes = minutes.toString().padStart(2, '0');

	console.log(day, monthArray[month], daysArray[currentDay]);
	return `${day} ${monthArray[month]}`;
}

getDayTime(1698235200);

// const timestamp = 1698157556; // Ваша временная метка
