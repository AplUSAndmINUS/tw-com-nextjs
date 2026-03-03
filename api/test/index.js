module.exports = async function (context, req) {
  context.log('Test function triggered');

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: 'Test function works!' }),
  };
};
