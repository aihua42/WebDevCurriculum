const a = document.querySelector('#sign-up'); 

a.onclick = () => {
  const url = 'http://localhost:3000/signup';
  window.location.href = url;
};

const idInput = document.getElementById('ID');
const pwInput = document.getElementById('pw');
const btn = document.querySelector('button');

btn.onclick = async () => {
  const id = idInput.value;
  const pw = pwInput.value;
  const userData = { id, pw };

  try {
    const url = 'http://localhost:8000/login';
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',  // for cors, must be set, unless can't receive session...
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
 
    if (!res.ok) {
      console.error('Error message from API server during log in; ', err);
      return;
    }

    if (res.status === 204) {
      alert(`${id} is not found!`, '');
      idInput.classList.add('error');
      return;
    }

    if (res.status === 209) {
      alert('Passwords are wrong!', '');
      pwInput.classList.add('error');
      return;
    }

    alert(`Welcome!`, '');

    const url2 = `http://localhost:3000/user/${id}`;
    window.location.href = url2;
  } catch (err) {
    console.error('Error during log in:', err);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // 새로고침 방지

    idInput.classList.remove('error');
    pwInput.classList.remove('error');
  });
});