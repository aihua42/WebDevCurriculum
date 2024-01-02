import getPath from '../common-functions/getPath.mjs';

const renderDomainPage = (req, res) => {
  try {
    const separator = 'controllers';
    const pathsToAdd = ['views', 'index.html'];
    const indexPath = getPath(import.meta.url, separator, pathsToAdd);
    res.sendFile(indexPath);
  } catch(err) {
    console.error('Error: ', err.message);
  }
};

export default renderDomainPage;