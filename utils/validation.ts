export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return 'Email or User ID is required';
  }
  const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
  // If user enters an ID (e.g. officer.sharma or ID001) vs email
  if (email.includes('@') && !emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  if (email.trim().length < 3) {
    return 'Identifier must be at least 3 characters';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 4) {
    return 'Password must be at least 4 characters';
  }
  return null;
}

export function validateLoginForm(email: string, password?: string) {
  const emailError = validateEmail(email);
  const passwordError = password !== undefined ? validatePassword(password) : null;
  
  return {
    isValid: !emailError && !passwordError,
    emailError,
    passwordError,
  };
}
