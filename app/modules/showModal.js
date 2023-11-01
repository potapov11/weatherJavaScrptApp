function showModal() {
	const modal = document.querySelector('.modal-dialog');
	const body = document.querySelector('.body');
	body.classList.add('overflow');
	modal.classList.remove('hide');
	setTimeout(() => {
		body.classList.remove('overflow');
		modal.classList.add('hide');
	}, 2000);
}

export { showModal };
