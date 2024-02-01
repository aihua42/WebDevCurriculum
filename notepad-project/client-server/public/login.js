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

const a = document.querySelector('#sign-up');
a.onclick = () => {
  const url = 'https://localhost:3000/signup';
  window.location.href = url;
};
const idInput = document.getElementById('ID');
const pwInput = document.getElementById('pw');
const btn = document.querySelector('button');
btn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
  const userId = idInput.value;
  const pw = pwInput.value;
  const userData = { userId, pw };
  try {
    const url = 'https://localhost:8000/login';
    const res = yield fetch(url, {
      method: 'POST',
      credentials: 'include', // for cors, must be set, unless can't receive session...
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      console.error('Error message from API server during log in; ', res);
      return;
    }
    if (res.status === 204) {
      alert(`${userId} is not found!`);
      idInput.classList.add('error');
      return;
    }
    if (res.status === 209) {
      alert('Passwords are wrong!');
      pwInput.classList.add('error');
      return;
    }
    const jsonObj = yield res.json();
    console.log('res when login: ', jsonObj);
    if (jsonObj.refreshToken) {
      localStorage.setItem('refreshToken', jsonObj.refreshToken);
    }
    // alert('Welcome!');
    const url2 = `https://localhost:3000/user/${userId}`;
    window.location.href = url2;
  } catch (err) {
    console.error('Error during log in:', err);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault(); // 새로고침 방지
    idInput.classList.remove('error');
    pwInput.classList.remove('error');
  });
});
// export {};
