import bcrypt from 'bcrypt'

const hashPW = async (pw: string): Promise<string> => {
  const saltRounds = 10 // the number of iterations performed to generate the salt
  const salt = await bcrypt.genSalt(saltRounds)

  // Hash the password with the generated salt
  const hashedPW = await bcrypt.hash(pw, salt)

  return hashedPW
}

export default hashPW
