export function emailValidate(email, setEmailError, setEmailIsValid) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!email.match(emailRegex)) {
    setEmailError('Invalid email address');
    setEmailIsValid(false);
  } else {
    setEmailError('');
    setEmailIsValid(true);
  }
}
