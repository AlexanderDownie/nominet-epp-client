function dataToString(data) {
  let string = data.toString('utf-8').trim().replace(/\uFFFD/g, '');
  let index = string.indexOf('<');
  if (index !== -1) {
    string = string.substring(index);
  }
  return string;
}

function parseJSXML(data) {
  const resultCode = data?.epp?.response?.result?.$?.code;
  const resultText = data?.epp?.response?.result?.msg.trim();
  const clientTransactionId = data?.epp?.response?.trID?.clTRID;

  return {
    eppResultCode: resultCode,
    eppResultText: resultText,
    clientTransactionId: clientTransactionId
  }
}

module.exports = { dataToString, parseJSXML };