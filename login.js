document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    // 간단한 유효성 검사
    if (email === '' || password === '') {
        message.textContent = '이메일과 비밀번호를 입력해주세요.';
        return;
    }

    // 서버와의 통신을 위한 가상 코드 (예: API 호출)
    // 실제로는 fetch 또는 AJAX 등을 사용하여 서버로 데이터를 전송합니다.
    if (email === 'test@example.com' && password === 'password123') {
      window.location.href = `index.html`

        // 여기서 리디렉션을 처리할 수 있습니다.
        // 예: window.location.href = '/dashboard';
    } else {
        message.style.color = 'red';
        message.textContent = '이메일 또는 비밀번호가 잘못되었습니다.';
    }
});
