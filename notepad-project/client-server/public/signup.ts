const idInput = document.getElementById('ID') as HTMLInputElement; // tsconfig.json에서 설정하거나 패키지 설치로 해결
const pwInput = document.getElementById('pw') as HTMLInputElement;
const cpwInput = document.getElementById('confirm-pw') as HTMLInputElement;

const btn = document.querySelector('button') as HTMLButtonElement;
btn.onclick = async () => {
  const pw = pwInput.value;
  const cpw = cpwInput.value;
  if (pw !== cpw) {
    alert('Passwords do NOT match!');

    pwInput.classList.add('error');
    cpwInput.classList.add('error');
    return;
  }

  const userId = idInput.value;
  const nickname = (document.getElementById('nickname') as HTMLInputElement).value;
  const userData = { userId, nickname, pw };

  try {
    const url = 'https://localhost:8000/signup';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      console.error('Error message from API server during sign up; ', res);
      return;
    }

    if (res.status === 209) {
      alert(`${userId} already exists!`);
      idInput.classList.add('error');
      return;
    }

    alert(`Hello ${nickname}! Please log in!`);

    const url2 = 'https://localhost:3000/login';
    window.location.href = url2;
  } catch (err) {
    console.error('Error during sign up; ', err);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  (document.getElementById('signupForm') as HTMLFormElement).addEventListener('submit', (event) => {
    event.preventDefault();

    idInput.classList.remove('error');
    pwInput.classList.remove('error');
    cpwInput.classList.remove('error');
  });
});
