document.addEventListener('DOMContentLoaded', () => {
    const greeting = document.getElementById('greeting');
    const username = localStorage.getItem('username');

    if (username) {
        greeting.textContent = `${username}님의 하루를 기록하세요`; // 사용자 이름을 포함한 인사말
    }

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

        // 해당 날짜의 기록이 있는지 확인
        const storedData = localStorage.getItem(`diary-${year}-${month + 1}-${date}`);
        if (storedData) {
            const dot = document.createElement('span');
            dot.classList.add('dot'); // 점 스타일 클래스 추가
            dateDiv.appendChild(dot);
        }

            if (date === new Date().getDate() && 
                year === new Date().getFullYear() && 
                month === new Date().getMonth()) {
                dateDiv.classList.add('today');
            }
            dateDiv.addEventListener('click', function() {
                window.location.href = 'diary.html'; // diary.html로 이동
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
});
