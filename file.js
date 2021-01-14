const os = require("os");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const config = require("./config");

const initConfig = async function (filePath) {
  const isFileExist = await checkFileExist(filePath);
  if (!isFileExist) {
    await createFile(filePath, JSON.stringify(config.defaultConfig, null, 4));
    return { isNew: true };
  }

  const userConfig = require(filePath);
  if (userConfig.filePath && userConfig.filePath[0] === "~") {
    userConfig.filePath = userConfig.filePath.replace(/^~/, os.homedir());
  }
  return userConfig;
};

const checkFileExist = function (filePath) {
  return new Promise(function (resolve, reject) {
    fs.access(filePath, fs.F_OK, function (err) {
      if (err) {
        return resolve(false);
      }
      resolve(true);
    });
  });
};

const createFile = async function (filePath, content) {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  fs.writeFileSync(filePath, content, "utf8", function (err) {
    console.log(err);
  });
};

const appendToLedger = async function (filePath, output) {
  filePath = path.resolve(filePath);
  const isFileExist = await checkFileExist(filePath);
  if (!isFileExist) {
    await createFile(filePath, "; Costflow CLI https://costflow.io\n\n");
  }

  fs.appendFileSync(filePath, output + "\n\n", "utf8", function (err) {
    console.log(err);
  });
};

const parseLedgerPath = function (filePath, date) {
  const dateArr = filePath.match(/%(.*)%/g);
  if (dateArr && dateArr.length) {
    const dateStr = dateArr[0];
    const dateInPath = dayjs(date).format(
      dateStr.substr(1, dateStr.length - 2)
    );
    filePath = filePath.replace(dateStr, dateInPath);
  }
  return filePath;
};

module.exports = {
  initConfig,
  checkFileExist,
  createFile,
  parseLedgerPath,
  appendToLedger,
};
