"use strict";

const signup = document.querySelector("#signupForm");

const signupUser = async (user) => {
  const response = await fetch("http://127.0.0.1:3000/api/v1/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();

  console.log(data);

  if (data.status === "success") {
    window.location.replace("login.html");
    alert("User successfully created");
  } else {
    alert(data.message);
  }
};

signup.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameUser = signup.userName.value;
  const emailUser = signup.email.value;
  const passwordUser = signup.password.value;
  const passwordConfirmationUser = signup.passwordConfirm.value;

  const user = {
    name: nameUser,
    email: emailUser,
    password: passwordUser,
    passwordConfirmation: passwordConfirmationUser,
  };

  await signupUser(user);
});
