module.exports = {
  cliVersion: `v${require("./package").version}`,
  syntaxVersion: "v1.0",
  parserVersion: `v${require("./package").dependencies.costflow}`,
  defaultConfig: {
    mode: "beancount",
    currency: "CNY",
    timezone: "",
    tag: "#Costflow #CLI",
    account: {
      eob: "Equity:Opening-Balances",
    },
    formula: {},
    alphavantage: "",
    indent: 2,
    lineLength: 50,
    filePath: "",
  },
};
