// gender, baseEntityId, firstName, lastName, type, addresses.addressFields.address2, birthdate, attributes.age, attributes.cohabitants, attributes.alt_phone_number,
let converter = require("json-2-csv");
var fs = require("fs");
const csv = require("csvtojson");

csv()
  .fromFile("./mira_client.csv")
  .then((jsonObj) => {
    processData(jsonObj);
  });

function processData(_data) {
  console.log(_data.length);
  const _modifiedData = _data.map((el) => {
    const _jsonData = JSON.parse(el?.json);

    return {
      client_id: _jsonData?._id,
      first_name: _jsonData?.firstName,
      last_name: _jsonData?.lastName,
      birthdate: _jsonData?.birthdate,
      type: _jsonData?.type,
      address: _jsonData?.addresses
        ?.map((el) => el?.addressFields?.address2)
        ?.join(),
      base_entity_id: _jsonData?.baseEntityId,
      ..._jsonData?.attributes,
    };
  });

  let json2csvCallback = function (err, csv) {
    if (err) throw err;
    fs.writeFile("clients.csv", csv, "utf8", function (err) {
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
    prependHeader: true, // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
  });
}
