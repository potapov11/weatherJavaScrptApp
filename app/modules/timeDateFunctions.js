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

export { getDayTime, setDatatoTimeBox };
