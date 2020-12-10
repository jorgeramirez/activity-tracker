function setupTracker(){/**
 * from https://github.com/CuriousG102/turkey/blob/master/web/turkey/survey/static/survey/js/globals/visibility_changes.js
 */

// helper script file for focus_change auditors
// Set the name of the hidden property and the change event for visibility
var hidden, visibility_change;
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden';
  visibility_change = 'visibilitychange';
} else if (typeof document.mozHidden !== 'undefined') {
  hidden = 'mozHidden';
  visibility_change = 'mozvisibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibility_change = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibility_change = 'webkitvisibilitychange';
}

// used in some of the auditors that track scrolling
var rootElementClass = '.task-suite';
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
(function () {
  var AuditorClicksSpecific = {
    start_date: new Date(),
    clicks_specific: [],
    log_click_content: function (e) {
      var dom = {
        dom_type: e.target.nodeName.toLowerCase(),
        dom_id:
          e.target.id != '' && e.target.id != undefined ? e.target.id : null,
        dom_class:
          e.target.className != '' && e.target.className != undefined
            ? e.target.className
            : null,
        dom_name:
          $(e.target).attr('name') != '' &&
          $(e.target).attr('name') != undefined
            ? $(e.target).attr('name')
            : null,
        time: new Date().getTime() - this.start_date.getTime(),
      };
      this.clicks_specific.push(dom);
    },
    submit_callable: function () {
      return this.clicks_specific;
    },
  };

  var auditor_clicks_specific = Object.create(AuditorClicksSpecific);

  $(document).ready(function () {
    $(document).click(
      auditor_clicks_specific.log_click_content.bind(auditor_clicks_specific)
    );
  });

  window.auditor.register_auditor(
    'clicks_specific',
    auditor_clicks_specific.submit_callable.bind(auditor_clicks_specific)
  );
})();
(function () {
  var AuditorClicksTotal = {
    clicks_total: 0,
    log_click_event: function (e) {
      this.clicks_total += 1;
    },
    submit_callable: function () {
      return {
        count: this.clicks_total,
      };
    },
  };

  var auditor_clicks_total = Object.create(AuditorClicksTotal);

  $(document).ready(function () {
    $(document).click(
      auditor_clicks_total.log_click_event.bind(auditor_clicks_total)
    );
  });

  window.auditor.register_auditor(
    'clicks_total',
    auditor_clicks_total.submit_callable.bind(auditor_clicks_total)
  );
})();
/**
 * Adapted from https://github.com/CuriousG102/turkey/tree/master/web/turkey/survey/static/survey/js/auditors
 */

(function () {
  var AuditorFocusChanges = {
    start_date: new Date(),
    hidden: null,
    focus_changes: [],
    log_focus_changes: function (e) {
      if (document[this.hidden]) {
        var focus_change_time = new Date().getTime();
        this.focus_changes.push({
          time: focus_change_time - this.start_date.getTime(),
        });
      }
    },
    submit_callable: function () {
      return this.focus_changes;
    },
  };

  var auditor_focus_changes = Object.create(AuditorFocusChanges);
  auditor_focus_changes.hidden = hidden;

  document.addEventListener(
    visibility_change,
    auditor_focus_changes.log_focus_changes.bind(auditor_focus_changes),
    false
  );

  window.auditor.register_auditor(
    'focus_changes',
    auditor_focus_changes.submit_callable.bind(auditor_focus_changes)
  );
})();
(function () {
  var AuditorKeypressesTotal = {
    keypresses_total: 0,
    log_keypress_event: function (e) {
      this.keypresses_total += 1;
    },
    submit_callable: function () {
      return {
        count: this.keypresses_total,
      };
    },
  };

  var auditor_keypresses_total = Object.create(AuditorKeypressesTotal);

  $(document).ready(function () {
    $(document).keyup(
      auditor_keypresses_total.log_keypress_event.bind(auditor_keypresses_total)
    );
  });

  window.auditor.register_auditor(
    'keypresses_total',
    auditor_keypresses_total.submit_callable.bind(auditor_keypresses_total)
  );
})();
(function () {
  var AuditorMouseMovementSpecific = {
    start_date: new Date(),
    mouse_movement_specific: [],
    log_mousemove_specific: function (e) {
      this.mouse_movement_specific.push({
        x: e.pageX,
        y: e.pageY,
        time: new Date().getTime() - this.start_date.getTime(),
      });
    },
    submit_callable: function () {
      return this.mouse_movement_specific;
    },
  };

  var auditor_mouse_movement_specific = Object.create(
    AuditorMouseMovementSpecific
  );

  $(window).mousemove(
    _.debounce(function (e) {
      auditor_mouse_movement_specific.log_mousemove_specific.bind(
        auditor_mouse_movement_specific
      )(e);
    }, 250)
  );

  window.auditor.register_auditor(
    'mouse_movement_specific',
    auditor_mouse_movement_specific.submit_callable.bind(
      auditor_mouse_movement_specific
    )
  );
})();
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
(function () {
  var AuditorOnFocusTime = {
    start_date: new Date(),
    hidden: null,
    on_focus_time: 0,
    last_focus_time: null, // switch in focus
    log_on_focus_time: function (e) {
      if (document[this.hidden]) {
        var focus_change_time = new Date().getTime();
        this.on_focus_time += focus_change_time - this.last_focus_time;
      } else {
        this.last_focus_time = new Date().getTime();
      }
    },
    submit_callable: function () {
      var focus_change_time = new Date().getTime();
      this.on_focus_time += focus_change_time - this.last_focus_time;

      return {
        milliseconds: this.on_focus_time,
      };
    },
  };

  var auditor_on_focus_time = Object.create(AuditorOnFocusTime);
  auditor_on_focus_time.hidden = hidden;
  auditor_on_focus_time.last_focus_time = auditor_on_focus_time.start_date.getTime();

  document.addEventListener(
    visibility_change,
    auditor_on_focus_time.log_on_focus_time.bind(auditor_on_focus_time),
    false
  );

  window.auditor.register_auditor(
    'on_focus_time',
    auditor_on_focus_time.submit_callable.bind(auditor_on_focus_time)
  );
})();
(function () {
  var AuditorRecordedTimeDisparity = {
    start_date: new Date(),
    hidden: null,
    on_focus_time: 0,
    last_focus_time: null, // switch in focus
    log_recorded_time_disparity: function (e) {
      if (document[this.hidden]) {
        var focus_change_time = new Date().getTime();
        this.on_focus_time +=
          focus_change_time - this.last_focus_time.getTime();
      } else {
        this.last_focus_time = new Date();
      }
    },
    submit_callable: function () {
      return {
        milliseconds:
          new Date().getTime() - this.start_date.getTime() - this.on_focus_time,
      };
    },
  };

  var auditor_recorded_time_disparity = Object.create(
    AuditorRecordedTimeDisparity
  );
  auditor_recorded_time_disparity.hidden = hidden;
  auditor_recorded_time_disparity.last_focus_time =
    auditor_recorded_time_disparity.start_date;

  document.addEventListener(
    visibility_change,
    auditor_recorded_time_disparity.log_recorded_time_disparity.bind(
      auditor_recorded_time_disparity
    ),
    false
  );

  window.auditor.register_auditor(
    'recorded_time_disparity',
    auditor_recorded_time_disparity.submit_callable.bind(
      auditor_recorded_time_disparity
    )
  );
})();
(function () {
  var AuditorScrolledPixelsSpecific = {
    start_date: new Date(),
    scrolled_pixels_specific: [],
    previous_position_h: 0,
    previous_position_v: 0,
    setup: function () {
      this.previous_position_h = $(rootElementClass).scrollLeft();
      this.previous_position_v = $(rootElementClass).scrollTop();
    },
    log_scroll_specific: function () {
      // horizontal
      var current_position_h = $(rootElementClass).scrollLeft();
      var raw_amount_h = current_position_h - this.previous_position_h;
      // var horizontal = { 'horizontal_position' : current_position_h, 'horizontal_change' : raw_amount_h };
      this.previous_position_h = current_position_h;

      // vertical
      var current_position_v = $(rootElementClass).scrollTop();
      var raw_amount_v = current_position_v - this.previous_position_v;
      // var vertical = { 'vertical_position' : current_position_v, 'vertical_change' : raw_amount_v };
      this.previous_position_v = current_position_v;

      this.scrolled_pixels_specific.push({
        // 'horizontal'    : horizontal,
        // 'vertical'      : vertical
        horizontal_position: current_position_h,
        horizontal_change: raw_amount_h,
        vertical_position: current_position_v,
        vertical_change: raw_amount_v,
        time: new Date().getTime() - this.start_date.getTime(),
      });
    },
    submit_callable: function () {
      return this.scrolled_pixels_specific;
    },
  };

  var auditor_scrolled_pixels_specific = Object.create(
    AuditorScrolledPixelsSpecific
  );
  auditor_scrolled_pixels_specific.setup();

  $(rootElementClass).scroll(
    _.debounce(function (e) {
      auditor_scrolled_pixels_specific.log_scroll_specific.bind(
        auditor_scrolled_pixels_specific
      )();
    }, 250)
  );

  window.auditor.register_auditor(
    'scrolled_pixels_specific',
    auditor_scrolled_pixels_specific.submit_callable.bind(
      auditor_scrolled_pixels_specific
    )
  );
})();
(function () {
  var AuditorScrolledPixelsTotal = {
    scrolled_pixels_total_h: 0,
    previous_position_h: 0,
    scrolled_pixels_total_v: 0,
    previous_position_v: 0,
    setup: function () {
      this.previous_position_h = $(rootElementClass).scrollLeft() || 0;
      this.previous_position_v = $(rootElementClass).scrollTop() || 0;
    },
    log_scroll_event: function () {
      // horizontal
      var current_position_h = $(rootElementClass).scrollLeft();
      if (current_position_h != this.previous_position_h) {
        var raw_amount_h = current_position_h - this.previous_position_h;
        var amount_h = Math.abs(raw_amount_h);
        this.scrolled_pixels_total_h += amount_h;
        this.previous_position_h = current_position_h;
      }

      // vertical
      var current_position_v = $(rootElementClass).scrollTop();
      if (current_position_v != this.previous_position_v) {
        var raw_amount_v = current_position_v - this.previous_position_v;
        var amount_v = Math.abs(raw_amount_v);
        this.scrolled_pixels_total_v += amount_v;
        this.previous_position_v = current_position_v;
      }
    },
    submit_callable: function () {
      return {
        horizontal: this.scrolled_pixels_total_h,
        vertical: this.scrolled_pixels_total_v,
      };
    },
  };

  var auditor_scrolled_pixels_total = Object.create(AuditorScrolledPixelsTotal);
  auditor_scrolled_pixels_total.setup();

  $(rootElementClass).scroll(
    _.debounce(function (e) {
      auditor_scrolled_pixels_total.log_scroll_event.bind(
        auditor_scrolled_pixels_total
      )();
    }, 250)
  );

  window.auditor.register_auditor(
    'scrolled_pixels_total',
    auditor_scrolled_pixels_total.submit_callable.bind(
      auditor_scrolled_pixels_total
    )
  );
})();
(function () {
  var AuditorTotalTaskTime = {
    start_date: new Date(),
    submit_callable: function () {
      return {
        milliseconds: new Date().getTime() - this.start_date.getTime(),
      };
    },
  };

  var auditor_total_task_time = Object.create(AuditorTotalTaskTime);
  window.auditor.register_auditor(
    'total_task_time',
    auditor_total_task_time.submit_callable.bind(auditor_total_task_time)
  );
})();
(function () {
  var AuditorUserAgent = {
    // ua = {},
    uas: '',
    get_user_agent: function () {
      this.uas = navigator.userAgent;
    },
    submit_callable: function () {
      return {
        user_agent: this.uas,
      };
    },
  };

  var auditor_user_agent = Object.create(AuditorUserAgent);

  $(document).ready(function () {
    auditor_user_agent.get_user_agent();
  });

  window.auditor.register_auditor(
    'user_agent',
    auditor_user_agent.submit_callable.bind(auditor_user_agent)
  );
})();
}