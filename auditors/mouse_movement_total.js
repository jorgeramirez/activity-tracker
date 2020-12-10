(function () {
  var AuditorMouseMovementTotal = {
    mouse_movement_total: 0,
    log_mousemove_event: function (e) {
      this.mouse_movement_total += 1;
    },
    submit_callable: function () {
      return {
        amount: this.mouse_movement_total,
      };
    },
  };
  var auditor_mouse_movement_total = Object.create(AuditorMouseMovementTotal);

  $(window).mousemove(
    _.debounce(function (e) {
      auditor_mouse_movement_total.log_mousemove_event.bind(
        auditor_mouse_movement_total
      )();
    }, 250)
  );

  window.auditor.register_auditor(
    'mouse_movement_total',
    auditor_mouse_movement_total.submit_callable.bind(
      auditor_mouse_movement_total
    )
  );
})();
