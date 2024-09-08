document.addEventListener('DOMContentLoaded', () => {
    // 페이지가 완전히 로드된 후에 실행
    const message = document.getElementById('message');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');

    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // 기본 폼 제출 방지

        const email = emailField.value;
        const password = passwordField.value;
 
        // 간단한 유효성 검사
        if (email === '' || password === '') {
            if (message) { // message가 null이 아닌 경우
                message.textContent = '이메일과 비밀번호를 입력해주세요.';
                message.style.color = 'red'; // 에러 메시지 색상
            }
            return;
        }
        

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            // 응답 상태 코드 확인
            if (!response.ok) {
                const errordata = await response.json(); // 텍스트로 응답을 처리
                if (response.status === 401) {
                    message.style.color = 'red'; // 에러 메시지 색상
                    message.textContent = '이메일 또는 비밀번호가 잘못되었습니다.';
                } else {
                    message.style.color = 'red'; // 에러 메시지 색상
                    message.textContent = '서버와의 통신에 실패했습니다. 다시 시도해주세요.';
                }
                return; // 오류 발생 시 처리를 중지
            }

            const { token, username } = await response.json(); // JSON으로 응답 받기
            console.log('Received token:', token); // 디버깅: 받은 토큰 출력
            localStorage.setItem('token', token); // 로컬 스토리지에 토큰 저장  
            console.log('Received username:',username );
            localStorage.setItem('username', username); // 로컬 스토리지에 사용자 이름 저장
            window.location.href = '/index.html'; // 로그인 성공 시 리디렉션

        } catch (error) {
            if (message) {
                message.style.color = 'red'; // 에러 메시지 색상
                message.textContent = '서버와의 통신에 실패했습니다. 다시 시도해주세요.';
            }
            console.error('로그인 오류:', error);
        }
    });
    emailField.addEventListener('input', clearMessage);
    passwordField.addEventListener('input',clearMessage);

    function clearMessage() {
        if(message) {
            message.textContent = '';
        }
    }
});
