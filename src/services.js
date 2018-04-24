const UpworkAPIProxy = function (errHandler, debug) {
  this.debug = debug || false;
  this.httpGetJSON = function (url, handler) {
    if (this.debug) {
      console.log("GET " + url);
    };
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function (struct) {
        handler(struct);
      },
      error: errHandler
    });
  };
};

export default UpworkAPIProxy
