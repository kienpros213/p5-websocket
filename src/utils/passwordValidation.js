export function passwordValidate(password, confirmPassword, setPasswordError) {
  if (password !== confirmPassword) {
    setPasswordError('the password is not the same');
  } else {
    setPasswordError('');
  }
}
