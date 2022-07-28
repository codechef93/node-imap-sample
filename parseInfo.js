const parseInfo = function(result) {
    let name = getValue(result, /.Material Name.*?;/);
    if (name == '') name = getValue(result, /.MaterialName.*?;/);
    let location = getValue(result, /.Storage Location.*?;/);
    if (location == '') location = getValue(result, /.StorageLocation.*?;/);
    let mass = getValue(result, /.Amount.*?;/);
    let date = stringToDate(getValue(result, /.Delivery Date.*?;/));
    if (date == null) date = stringToDate(getValue(result, /.DeliveryDate.*?;/));
    let project = getValue(result, /.Project Name.*?;/);
    if (project == '') project = getValue(result, /.ProjectName.*?;/);

    return { name: name, date: date, project: project, location: location, mass: mass, id: "new" };
};

function getValue(result, regexp) {
    let res = result.match(regexp);
    if (res == null) return '';
    res = res[0];
    res = res.substring(res.indexOf(':') + 1).trim();
	res = res.substring(1, res.length - 2);
	return res;
}

function insertString(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function stringToDate(str) {
    if (str == '') return null;
	str = insertString(str, 4, "-");
	str = insertString(str, 7, "-");
	str += "T00:00:00+0000";

	return new Date(Date.parse(str));
}

module.exports = parseInfo;