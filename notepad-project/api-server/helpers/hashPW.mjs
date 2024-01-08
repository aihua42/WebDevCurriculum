import bcrypt from 'bcrypt';

const hashPW = async (pw) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password with the generated salt
  const hashedPW = await bcrypt.hash(pw, salt);

  return hashedPW;
};

export default hashPW;