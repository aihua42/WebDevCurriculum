// import pkg from '@apollo/client';
// const { ApolloClient, InMemoryCache, gql } = pkg;
// import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

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

  const userId = idInput.value;
  const nickname = document.getElementById('nickname').value;

  try {
    // const client = new ApolloClient({
    //   uri: 'https://localhost:8080/graphql',
    //   credentials: 'include',
    //   cache: new InMemoryCache(),  // responses are stored in the cache.
    // });

    // const SIGNUP_MUTATION = gql`
    //   mutation Signup($userId: String!, $nickname: String!, $pw: String!) {
    //     signup(userId: $userId, nickname: $nickname, pw: $pw)
    //   }
    // `;

    // const res = await client.mutate({
    //   mutation: SIGNUP_MUTATION,
    //   variables: { userId, nickname, pw },
    // });

    const query = `
      mutation Signup ($userId: String!, $nickname: String!, $pw: String!) {
        signup(userId: $userId, nickname: $nickname, pw: $pw)
      }
    `;

    const url = 'https://localhost:8080/graphql';
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { userId, nickname, pw }
      }),
    });

    const resParsed = await res.json();
    console.log('res from signup: ', resParsed);

    if (res.status === 409) {
      alert(`${userId} already exists!`, '');
      idInput.classList.add('error');
      return;
    }

    if (!res.ok) {
      console.error('Error message from API server during sign up; ', res);
      return;
    }

    alert(`Hello ${nickname}! Please log in!`, '');

    const url2 = 'https://localhost:3030/login';
    window.location.href = url2;  
  } catch (err) {
    console.error('Error during sign up; ', err);
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