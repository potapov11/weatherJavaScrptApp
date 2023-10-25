// const locationBtnText = document.querySelector('.header__location-text');
const API_KEY = 'f4058b408f207656f8e588ad47f3e07b';
const locationBtn = document.querySelector('.header__location');
const locationBtnText = document.querySelector('.header__location-text');
// https://openweathermap.org/img/wn/10d@2x.png
//openweathermap.org/img/wn/03n@2x.png

https: locationBtn.addEventListener('click', () => {
	navigator.geolocation.getCurrentPosition(success, error, {
		enableHighAccuracy: true,
	});

	function success({ coords }) {
		const { latitude, longitude } = coords;
		const position = [latitude, longitude];
		if (position !== null) {
			console.log('succes');
		}
		console.log(position);
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
}

async function getCurrentWeather(params) {
	const response = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${params[0]}&lon=${params[1]}&lang=ru&appid=${API_KEY}&units=metric`,
	);
	const respData = await response.json();
	console.log(respData);
	setDatatoTimeBox(respData);
	setDatatoInfoBox(respData);
}

// function extractData(data) {}

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
	console.log(timeSun, timeSunSet);
	// Создаем новый объект Date с использованием временной метки

	console.log(data.weather);
	const [{ description, main, icon }] = data.weather;
	const { speed } = data.wind;
	const currentSpeedWind = Math.ceil(Number(speed));
	const { humidity, pressure } = data.main;
	console.log(humidity, pressure);

	console.log(main, description, icon, currentSpeedWind);

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

// const timestamp = 1698157556; // Ваша временная метка
