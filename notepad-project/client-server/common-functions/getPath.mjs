import path from "path";
import { fileURLToPath } from "url";

const getPath = (url, separator = null, pathsToAdd = null) => {
  const __filename = fileURLToPath(url);
  const __dirname = path.dirname(__filename);

  const serverPath = separator ? __dirname.split(separator)[0] : __dirname;
  const result = pathsToAdd ? path.join(serverPath, ...pathsToAdd) : serverPath;

  return result;
};

export default getPath;