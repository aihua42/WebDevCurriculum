import bcrypt from 'bcrypt'

const comparePW = async (pw: string, hashedpw: string): Promise<boolean> => {
  try {
    const isPasswordMatches = await bcrypt.compare(pw, hashedpw)

    return isPasswordMatches
  } catch (err) {
    throw new Error('Fail in "comparePW" function')
  }
}

export default comparePW
