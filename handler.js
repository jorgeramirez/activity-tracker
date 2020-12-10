/**
 * Adapted from https://github.com/CuriousG102/turkey/blob/master/web/turkey/survey/static/survey/js/mmm_turkey.js
 */

(function () {
  function AuditorHandler() {
    this.auditors = [];
  }

  AuditorHandler.prototype.register_auditor = function (name, callback) {
    this.auditors.push([name, callback]);
  };

  /**
   * Returns an object with the whole trace of the registered auditors.
   */
  AuditorHandler.prototype.dump = function () {
    var log = {};

    $.each(this.auditors, function (_, el) {
      var name = el[0];
      var callback = el[1];
      log[name] = callback();
    });
    return log;
  };

  window.auditor = new AuditorHandler();
})();
