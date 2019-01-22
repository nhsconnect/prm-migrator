exports.isNhsNoValid = function(nhsNo) {
    if (nhsNo === '1234567891' || nhsNo === '1234567890') { return true } else { return false }
};