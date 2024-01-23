/* eslint-disable max-len */
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
  return new (P || (P = Promise))((resolve, reject) => {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const idInput = document.getElementById('ID'); // tsconfig.json에서 설정하거나 패키지 설치로 해결
const pwInput = document.getElementById('pw');
const cpwInput = document.getElementById('confirm-pw');
const btn = document.querySelector('button');
btn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
  const pw = pwInput.value;
  const cpw = cpwInput.value;
  if (pw !== cpw) {
    alert('Passwords do NOT match!');
    pwInput.classList.add('error');
    cpwInput.classList.add('error');
    return;
  }
  const userId = idInput.value;
  const nickname = document.getElementById('nickname').value;
  const userData = { userId, nickname, pw };
  try {
    const url = 'https://localhost:8000/signup';
    const res = yield fetch(url, {
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
});
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signupForm').addEventListener('submit', (event) => {
    event.preventDefault();
    idInput.classList.remove('error');
    pwInput.classList.remove('error');
    cpwInput.classList.remove('error');
  });
});
// export {};
