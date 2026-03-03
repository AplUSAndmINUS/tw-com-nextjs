module.exports = async function (req, context) {
  context.log('Test function triggered');

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: 'Test function works!' }),
  };
};
