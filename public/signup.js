document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
        message.textContent = '비밀번호가 일치하지 않습니다.';
        message.style.color = 'red';
        return;
    }

    try {
        // 회원가입 API 호출
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        });

        // 응답 확인
        if (response.ok) {
            const responseData = await response.json();
            message.textContent = responseData.message; // 서버에서 받은 메시지
            message.style.color = 'green';
            
            // 일정 시간 후 리디렉션 처리
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1000); // 1초 후 리디렉션
        } else {
            const errorData = await response.json();
            message.textContent = `회원가입 실패: ${errorData.message}`;
            message.style.color = 'red';
        }
    } catch (error) {
        message.textContent = '서버와의 통신 중 오류가 발생했습니다.';
        message.style.color = 'red';
    }
});
