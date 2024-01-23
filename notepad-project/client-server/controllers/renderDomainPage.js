const renderDomainPage = (req, res) => {
  try {
    res.sendFile('index.html');
  } catch (err) {
    console.error('Error from rendering domain page: ', err instanceof Error ? err.message : err);
  }
};
export default renderDomainPage;
