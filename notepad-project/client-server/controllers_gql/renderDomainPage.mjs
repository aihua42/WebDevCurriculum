const renderDomainPage = (req, res) => {
  try {
    res.sendFile('index.html');
  } catch(err) {
    console.error('Error from rendering domain page: ', err.message);
  }
};

export default renderDomainPage;