// gender, baseEntityId, firstName, lastName, type, addresses.addressFields.address2, birthdate, attributes.age, attributes.cohabitants, attributes.alt_phone_number,
let converter = require("json-2-csv");
var fs = require("fs");
const csv = require("csvtojson");

csv()
  .fromFile("./mira_event.csv")
  .then((jsonObj) => {
    processData(jsonObj);
  });

function processData(_data) {
  console.log(_data.length);

  const _modifiedData = _data.map((el) => {
    const _jsonData = JSON.parse(el?.json);

    const _formattedArr = _jsonData?.obs?.map((el) => ({
      [el?.formSubmissionField]: el?.values?.join(),
    }));

    let formattedObj = {};

    _formattedArr.forEach((el) => {
      for (const [key, value] of Object.entries(el)) {
        formattedObj[key] = value;
      }
    });

    let _parsed = _jsonData?.details?.previous_contacts
      ? JSON.parse(_jsonData?.details?.previous_contacts)
      : {};

    if (_parsed?.attention_flag_facts) {
      _parsed = { ..._parsed, ...JSON.parse(_parsed?.attention_flag_facts) };
      delete _parsed.attention_flag_facts;
    }

    console.log(_parsed);

    return {
      eventId: _jsonData?._id,
      providerId: _jsonData?.providerId,
      eventType: _jsonData?.eventType,
      baseEntityId: _jsonData?.baseEntityId,
      locationId: _jsonData?.locationId,
      entityType: _jsonData?.entityType,
      ..._parsed,
      ...formattedObj,
    };
  });

  let json2csvCallback = function (err, csv) {
    if (err) throw err;
    fs.writeFile("events.csv", csv, "utf8", function (err) {
      if (err) {
        console.log(
          "Some error occured - file either not saved or corrupted file saved."
        );
      } else {
        console.log("It's saved!");
      }
    });
  };

  converter.json2csv(_modifiedData, json2csvCallback, {
    prependHeader: true,
  });
}
