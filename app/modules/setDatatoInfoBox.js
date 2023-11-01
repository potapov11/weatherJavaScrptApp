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

export { setDatatoInfoBox };
