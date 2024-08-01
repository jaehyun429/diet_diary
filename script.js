const monthYear = document.getElementById('monthYear');
const daysContainer = document.getElementById('days');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');

let currentDate = new Date();

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.innerText = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    daysContainer.innerHTML = '';

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        daysContainer.appendChild(emptyDiv);
    }

    for (let date = 1; date <= lastDateOfMonth; date++) {
        const dateDiv = document.createElement('div');
        dateDiv.innerText = date;

        if (date === new Date().getDate() && 
            year === new Date().getFullYear() && 
            month === new Date().getMonth()) {
            dateDiv.classList.add('today');
        }

        daysContainer.appendChild(dateDiv);
    }
}

prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

renderCalendar();
