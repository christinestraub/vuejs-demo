const DateHelpers = {
  formatMonth: function (date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[date.getMonth()]; // NB JS months indexed at zero
  },
  formatDaySuffix: function (date) {
    const day = date.getDate();
    if ((day === 1) || (day === 21) || (day === 31)) {
      return "st";
    } else if ((day === 2) || (day === 22)) {
      return "nd";
    } else if ((day === 3) || (day === 23)) {
      return "rd";
    } else {
      return "th";
    }
  },
  formatDate: function (date) {
    const month = this.formatMonth(date);
    const day = date.getDate();
    const suffix = this.formatDaySuffix(date);
    return month + " " + day + suffix;
  },
  formatMinutes: function (date) {
    const minutes = date.getMinutes();
    return (minutes < 10) ? '0' + minutes : minutes;
  },
  formatTime: function (date) {
    return date.getHours() + ":" + this.formatMinutes(date);
  }
};

export default DateHelpers
