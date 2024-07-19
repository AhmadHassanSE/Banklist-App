'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//creating usernames of accounts
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//initializing currentAccount
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  //checking login name and password
  currentAccount = accounts.find(function (acc) {
    if (acc.username === inputLoginUsername.value) {
      return acc;
    }
  });
  if (currentAccount.pin == inputLoginPin.value) {
    containerApp.style.opacity = 100;

    //Displaying UI and Wellcome message
    labelWelcome.textContent = `Wellcome back, ${
      currentAccount.owner.split(' ')[0]
    } `;

    //clearing input fields
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    inputLoginPin.blur();

    //calculate balance and display balance
    calcPrintbalance(currentAccount);

    //displaying summary
    calcDisplaySummary(currentAccount);

    //displaying movements
    displayMovements(currentAccount.movements);
  }
});
//calculate balance and display balance
const calcPrintbalance = function (acc) {
  acc.balance = acc.movements.reduce(function (accc, cur) {
    return accc + cur;
  }, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

//calculate summary and display
const calcDisplaySummary = function (acc) {
  const calcIncome = acc.movements.filter(function (mov) {
    return mov > 0;
  });
  const income = calcIncome.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  labelSumIn.textContent = `${income}EUR`;

  const calcOutcome = acc.movements.filter(function (mov) {
    return mov < 0;
  });
  const outcome = calcOutcome.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}EUR`;

  const deposit = acc.movements.filter(function (mov) {
    return mov > 0;
  });
  const interest = deposit
    .map(function (mov) {
      return mov * (acc.interestRate / 100);
    })
    .filter(function (mov) {
      return mov >= 1;
    });
  const interestrate = interest.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelSumInterest.textContent = `${interestrate}EUR`;
};

//Display movements
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (move, i) {
    let type = move > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${Math.abs(move)}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

let recieveraccount;
// implementing transfer button
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  recieveraccount = accounts.find(function (acc) {
    if (acc.username === inputTransferTo.value) {
      return acc;
    }
  });
  let amount1 = Number(inputTransferAmount.value);
  if (
    inputTransferAmount.value > 0 &&
    currentAccount.balance > inputTransferAmount.value &&
    recieveraccount &&
    recieveraccount !== currentAccount
  ) {
    currentAccount.movements.push(-amount1);
    recieveraccount.movements.push(amount1);
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    inputTransferAmount.blur();

    //calculate balance and display balance
    calcPrintbalance(currentAccount);

    //displaying summary
    calcDisplaySummary(currentAccount);

    //displaying movements
    displayMovements(currentAccount.movements);
  }
});

//setting loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let loanamount = Number(inputLoanAmount.value);
  //function to check if deposit of 10% greater is present
  const checkloan = currentAccount.movements.reduce(function (mov) {
    if ((10 * loanamount) / 100 < mov) {
      return loanamount;
    }
  });

  if (checkloan) {
    currentAccount.movements.push(loanamount);

    //calculate balance and display balance
    calcPrintbalance(currentAccount);

    //displaying summary
    calcDisplaySummary(currentAccount);

    //displaying movements
    displayMovements(currentAccount.movements);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});


