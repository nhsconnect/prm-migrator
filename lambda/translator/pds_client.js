const soapRequest = require('easy-soap-request');

exports.verifyNhsNumber = async function (nhsNumber) {
    const url = 'https://graphical.weather.gov/xml/SOAP_server/ndfdXMLserver.php';
    const headers = {
        'user-agent': 'sampleTest',
        'Content-Type': 'text/xml;charset=UTF-8',
        'soapAction': 'https://graphical.weather.gov/xml/DWMLgen/wsdl/ndfdXML.wsdl#LatLonListZipCode',
    };

    let xml = 'put the real xml in here please';
    const { response } = await soapRequest(url, headers, xml, 10000); //?
    return response.body.includes('SMSP-0000');
}