import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

function errorDate() {
  iziToast.error({
    pauseOnHover: false,
    position: 'topRight',
    message: 'Please choose a date in the future',
  });
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero({ days, hours, minutes, seconds }) {
  days = days.toString().padStart(2, '0');
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  seconds = seconds.toString().padStart(2, '0');

  return { days, hours, minutes, seconds };
}

function screenUpdate({ days, hours, minutes, seconds }) {
  screenTimer[0].textContent = days;
  screenTimer[1].textContent = hours;
  screenTimer[2].textContent = minutes;
  screenTimer[3].textContent = seconds;
}

function onTickDisplay(time) {
  screenUpdate(addLeadingZero(convertMs(time)));
}

function onClickStart() {
  buttonStart.disabled = true;
  const StartCount = userSelectedDate - Date.now();
  if (StartCount <= 0) {
    errorDate();
    return;
  }
  inputDate.disabled = true;

  onTickDisplay(StartCount);
  const intervalId = setInterval(() => {
    const count = userSelectedDate - Date.now();
    onTickDisplay(count);
    if (count < 1000) {
      inputDate.disabled = false;
      clearInterval(intervalId);
    }
  }, 1000);
}

let userSelectedDate;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= Date.now()) {
      errorDate();
      buttonStart.disabled = true;
    } else {
      buttonStart.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

const buttonStart = document.querySelector('button[data-start]');
const screenTimer = document.querySelectorAll('.timer .value');
const inputDate = document.getElementById('datetime-picker');

buttonStart.addEventListener('click', onClickStart);