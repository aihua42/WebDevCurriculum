const idInput = document.getElementById('ID');
const pwInput = document.getElementById('pw');
const cpwInput = document.getElementById('confirm-pw');

const btn = document.querySelector('button');
btn.onclick = async () => {
  const pw = pwInput.value;
  const cpw = cpwInput.value;
  if (pw !== cpw) {
    alert('Passwords do NOT match!', '');

    pwInput.classList.add('error');
    cpwInput.classList.add('error');
    return;
  }

  const id = idInput.value;
  const nickname = document.getElementById('nickname').value;
  const userData = { id, nickname, pw };

  try {
    const url = 'http://localhost:3000/signup';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!res.ok) {
      console.log('Failed to sign up');
      return;
    }

    if (res.status === 209) {
      alert(`${id} already exists!`);
      idInput.classList.add('error');
      return;
    }

    alert(`Hello ${nickname}! Please log in!`, '');

    const url2 = 'http://localhost:3000/login';
    window.location.href = url2;
  } catch (err) {
    console.error('Error during sign up:', err);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    idInput.classList.remove('error');
    pwInput.classList.remove('error');
    cpwInput.classList.remove('error');
  });
});