const now = new Date();
const dateTime = `${now.getFullYear()}${(now.getMonth() + 1)
  .toString()
  .padStart(2, 0)}${now
  .getDate()
  .toString()
  .padStart(2, 0)}-${now
  .getHours()
  .toString()
  .padStart(2, 0)}${now
  .getMinutes()
  .toString()
  .padStart(2, 0)}`;

module.exports = dateTime;
