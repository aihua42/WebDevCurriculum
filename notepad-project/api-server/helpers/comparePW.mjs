import bcrypt from 'bcrypt';

const comparePW = async (pw, hashedpw) => {
  try {
    const passwordMatches = await bcrypt.compare(pw, hashedpw);

    if (passwordMatches) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error('Fail in "comparePW" function');
  }
};

export default comparePW;