
const fetch = require('node-fetch')

function check(url, invocationParameters,  expectedResultData, expectedResultStatus) {

    const checkResult = { // this is the object you need to set and return
        urlChecked: url,
        resultData: null,
        resultStatus: null,
        statusTestPassed: null,
        resultDataAsExpected: null
    }

    let par = Object.keys(invocationParameters);

    if (par > 0) {
        checkResult.urlChecked = checkResult.urlChecked + '?' + par[0] + '=' + encodeURI(invocationParameters[par[0]]);

        for (let i=1; i<par.length; i++) {
            checkResult.urlChecked = checkResult.urlChecked + '&' + par[i] + '=' + encodeURI(invocationParameters[par[i]]);
        }
    }

    return fetch(checkResult.urlChecked)
    .then((res) => {
        checkResult.resultStatus = res.status;
        checkResult.statusTestPassed = (checkResult.resultStatus === expectedResultStatus);

        return res.json();
    })
    .then((json) => {
        checkResult.resultData = json;
        checkResult.resultDataAsExpected = compareResults(checkResult.resultData, expectedResultData);

        return checkResult;
    })

}


// funzione che confronta due oggetti semplici e verifica se actual contiene tutti gli attributi di expected, e se per
// questi ha gli stessi valori
function compareResults(expected, actual) {
    if (!expected) return true //always ok if there are no expectations
    if (!actual) return false
    for (let e of Object.keys(expected)) {
        if (actual[e]===undefined || expected[e]!=actual[e]  ) return false
    }
    return true
}

module.exports = check