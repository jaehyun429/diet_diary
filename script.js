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
        dateDiv.addEventListener('click', function() {
            // 날짜와 관련된 정보와 함께 diary.html로 이동
            window.location.href = `http://127.0.0.1:5500/diary.html`;
        });

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

//정재현님은 바보다ㅋㅋ 기업: 자넨 해고일세!
