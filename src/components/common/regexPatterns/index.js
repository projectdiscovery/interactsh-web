const RegexPatterns = {
  projectName: /^[a-zA-Z0-9.\-_ ]+$/,
  notificationSearch: /^[a-zA-Z0-9 .\-_ ]+$/,
  domainAndIp: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/,
  statusCode: /^[1-5][0-9][0-9]$/,
  port: /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  string: /^[a-zA-Z]*$/,
  contentLength: /^[0-9<>?]*$/
}

export default RegexPatterns;
