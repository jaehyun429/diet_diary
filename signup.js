document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');

    if (password !== confirmPassword) {
        message.textContent = '비밀번호가 일치하지 않습니다.';
        return;
    }

    // 서버로 데이터를 전송하는 코드 추가

    message.style.color = 'green';
    message.textContent = '회원가입이 성공적으로 완료되었습니다!';
    
});
