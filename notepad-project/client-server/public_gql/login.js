const a = document.querySelector('#sign-up'); 

a.onclick = () => {
  const url = 'https://localhost:3030/signup';
  window.location.href = url;
};

const idInput = document.getElementById('ID');
const pwInput = document.getElementById('pw');
const btn = document.querySelector('button');

btn.onclick = async () => {
  const userId = idInput.value;
  const pw = pwInput.value;
  const userData = { userId, pw };
  console.log('user data when login: ', userData);

  try {
    const query = `
      mutation Login($userId: String!, $pw: String!) {
        login(userId: $userId, pw: $pw) {
          refreshToken
        }
      }
    `;

    const url = 'https://localhost:8080/graphql';
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: userData
      }),
    });
 
    if (!res.ok) {
      console.error('Error message from API server during log in; ', res);
      return;
    }

    if (res.status === 404) {
      alert(`${userId} is not found!`, '');
      idInput.classList.add('error');
      return;
    }

    if (res.status === 409) {
      alert('Passwords are wrong!', '');
      pwInput.classList.add('error');
      return;
    }

    const jsonObj = await res.json();
  
    if (jsonObj['data'] && jsonObj['data']['login']) {
      localStorage.setItem('refreshToken', jsonObj.data.login.refreshToken);
    }
    
    alert(`Welcome!`, '');

    const url2 = `https://localhost:3030/user/${userId}`;
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