'use strict'

const applicationInterface = document.querySelector('.application');
const greetingTextElement = document.querySelector('.greeting');
const movementsContainer = document.querySelector('.movements');
const balanceElement = document.querySelector('.balance__value');
const summaryValueInElement = document.querySelector('.summary__value--in');
const summaryValueOutElement = document.querySelector('.summary__value--out');
const loginButton = document.querySelector('.login__btn');
const loginInputField = document.querySelector('.login__input--user');
const pinInputField = document.querySelector('.login__input--pin');
const transferTo = document.querySelector('.form__input--to');
const transferAmount = document.querySelector('.form__input--amount');
const transferButton = document.querySelector('.form__btn--transfer');
const buttonCloseAccount = document.querySelector('.form__btn--close');
const formInputUserClose = document.querySelector('.form__input--user');
const formInputPinClose = document.querySelector('.form__input--pin');
const logOutButton = document.querySelector('.login__logout');
const buttonSort = document.querySelector('.btn--sort');
const dateNowElement = document.querySelector('.date');
const timerElement = document.querySelector('.timer');
const loanElement = document.querySelector('.loan');
const loanButton = document.querySelector('.form__btn--loan');
const loanInputField = document.querySelector('.form__input--loan-amount');
const currentDateElement = document.querySelector('.date');

const account1 = {
	owner: 'Jonas Scmedtmann',
	movements: [200, 300, -400, 4000, -800, -120, 60, 1200],
	interestRate: 1.2,
	pin: 1111,
	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2022-08-01T14:11:59.604Z',
		'2022-07-27T17:01:17.194Z',
		'2022-07-30T23:36:17.929Z',
		'2022-07-31T10:51:36.790Z',
	],
};

const account2 = {
	owner: 'Vilhelm Great Two',
	movements: [1200, 1300, -1400, 400, -1800, -1120, 160, 100],
	interestRate: 1.24,
	pin: 2222,
	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2020-07-26T12:01:20.894Z',
	],
};

const account3 = {
	owner: 'John Akome',
	movements: [120, 130, -140, 40, -180, -120, 10, 10],
	interestRate: 1.04,
	pin: 3333,
	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2019-11-30T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2020-02-05T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-06-25T18:49:59.371Z',
		'2022-07-30T12:01:20.894Z',
	],
};


const accounts = [account1, account2, account3];
let sorted = false;
let currentAcc, timer;

const createUserNames = function (accs) { //creating new property in the account object (username: first two letters of the initials)
	accs.forEach(acc => {
		acc.username = acc.owner.toLowerCase().split(' ').map(word => word[0]).join('');
	})
};

createUserNames(accounts);

const formatMovementDate = function (date) {
	const calcDaysPassed = (date1, date2) => Math.abs(Math.round((date1 - date2) / (1000 * 60 * 60 * 24)));
	const daysPassed = calcDaysPassed(new Date(), date);
	if (daysPassed === 0) return 'Today';
	if (daysPassed === 1) return 'Yesterday';
	if (daysPassed <= 7) return `${daysPassed} days ago`;
	const day = `${date.getDate()}`.padStart(2, 0);
	const month = `${date.getMonth() + 1}`.padStart(2, 0);
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};

const displayMovement = function (acc, sorted = false) { //function to render all movements(deposit or withdrawal) of the account in ascending or descending order
	movementsContainer.innerHTML = ''; //to empty container with elements
	const movs = sorted ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
	movs.forEach((mov, i) => {
		const date = new Date(acc.movementsDates[i]);
		const displayDate = formatMovementDate(date);
		const type = mov > 0 ? 'deposit' : 'withdrawal'; //determine if movement deposit or withdrawal

		movementsContainer.insertAdjacentHTML("afterbegin",
			`<div class="movements__row">
				<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
				<div class="movements__date">${displayDate}</div>
				<div class="movements__value">${mov.toFixed(2)}€</div>
			</div>`)
	})
}

const calcAndPrintBalance = function (acc) {
	const balance = acc.movements.reduce((acc, val) => acc + val, 0); //using reduce method to boil down all the values from movement array and display it
	balanceElement.textContent = balance.toFixed(2) + '€';
	currentAcc.balance = balance.toFixed(2);
}

const calcAndPrintPosAndNegBalance = function (acc) {
	const posBalance = acc.movements.filter(el => el > 0).reduce((acc, val) => acc + val, 0);
	summaryValueInElement.textContent = posBalance + `€`;
	const negBalalnce = acc.movements.filter(el => el < 0).reduce((acc, val) => acc + val, 0);
	summaryValueOutElement.textContent = negBalalnce.toFixed(2) + `€`;
};

const updateUI = function (currentAcc) {
	displayMovement(currentAcc);
	calcAndPrintBalance(currentAcc);
	calcAndPrintPosAndNegBalance(currentAcc);
};

const logOutFuncttion = function () {
	loginButton.style.display = loginInputField.style.display = pinInputField.style.display = 'block';
	logOutButton.style.display = 'none';
	applicationInterface.style.opacity = 0;
	greetingTextElement.textContent = `Log in to get started`;
};

const startingTimer = function () {
	const timerFunction = () => {
		let minutes = `${Math.trunc(time / 60)}`.padStart(2, 0);
		let seconds = `${time % 60}`.padStart(2, 0);
		timerElement.textContent = `${minutes}:${seconds}`;
		if (time === 0) {
			clearInterval(timer);
			logOutFuncttion();
		};
		time--;
	};
	let time = 300;
	timerFunction();
	const timer = setInterval(timerFunction, 1000);
	return timer;
};

loginButton.addEventListener('click', (e) => {
	e.preventDefault();
	currentAcc = accounts.find(el => el.username === loginInputField.value);
	if (currentAcc?.pin === +pinInputField.value) {
		loginInputField.value = pinInputField.value = '';
		pinInputField.blur();
		applicationInterface.style.opacity = 1;
		loginButton.style.display = loginInputField.style.display = pinInputField.style.display = 'none';
		logOutButton.style.display = 'block';
		const now = new Date();
		const day = `${now.getDate()}`.padStart(2, 0);
		const month = `${now.getMonth() + 1}`.padStart(2, 0);
		const year = now.getFullYear();
		const hour = `${now.getHours()}`.padStart(2, 0);
		const minutes = `${now.getMinutes()}`.padStart(2, 0);
		currentDateElement.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
		updateUI(currentAcc);
		timer = startingTimer();
		greetingTextElement.textContent = `Welcome back, ${currentAcc.owner.split(' ')[0]}`
	}
});

logOutButton.addEventListener('click', (e) => {
	e.preventDefault();
	logOutFuncttion();
	clearInterval(timer);
})

transferButton.addEventListener('click', (e) => {
	e.preventDefault();
	let amountToTransfer = +transferAmount.value;
	let recepient = accounts.find(acc => acc.username === transferTo.value);
	if (amountToTransfer > 0 && recepient && currentAcc.balance >= amountToTransfer && recepient.username !== currentAcc.username) {

		transferAmount.value = transferTo.value = '';
		transferAmount.blur();
		currentAcc.movements.push(-amountToTransfer);
		currentAcc.movementsDates.push(new Date().toISOString());
		recepient.movements.push(amountToTransfer);
		recepient.movementsDates.push(new Date().toISOString());
		updateUI(currentAcc);
		clearInterval(timer);
		timer = startingTimer();
	}
});

buttonCloseAccount.addEventListener('click', (e) => { //implementing delete button using splice and findIndex methods
	e.preventDefault();
	if (formInputUserClose.value === currentAcc.username && +formInputPinClose.value === currentAcc.pin) {
		let indexOfAcc = accounts.findIndex(acc => acc.username === currentAcc.username);
		accounts.splice(indexOfAcc, 1);
		applicationInterface.style.opacity = 0;
		console.log(accounts);
	}
});

loanButton.addEventListener('click', (e) => {
	e.preventDefault();
	let amountToLoan = +Math.floor(loanInputField.value);
	if (amountToLoan > 0 && amountToLoan <= Math.max(...currentAcc.movements) * 3) {
		currentAcc.movements.push(amountToLoan);
		currentAcc.movementsDates.push(new Date().toISOString());
		loanInputField.value = '';
		updateUI(currentAcc);
		clearInterval(timer);
		timer = startingTimer();
	}
});

buttonSort.addEventListener('click', (e) => {
	e.preventDefault();
	displayMovement(currentAcc, !sorted)
	sorted = !sorted;
});
