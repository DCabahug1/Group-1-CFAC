export const createUserID = () => {
  // Generate a random number between 1 and 1000000
  const userID = Math.floor(Math.random() * 1000000) + 1;

  return userID;
}