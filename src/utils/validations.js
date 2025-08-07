export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

export const isValidIndianMobile = (mobile) => {
  if (!mobile) return false;
  // This regex checks for a 10-digit number that can start with 6, 7, 8, or 9.
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};
