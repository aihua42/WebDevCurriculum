import getPath from '../utility/getPath.mjs';

const renderDomainPage = (req, res) => {
  try {
    const indexPath = getPath(import.meta.url, 'controllers', ['views', 'index.html']);
    res.sendFile(indexPath);
  } catch(err) {
    console.error('Error: ', err.message);
  }
};

export default renderDomainPage;