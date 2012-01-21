//http://stackoverflow.com/questions/3629183/why-doesnt-indexof-work-on-an-array-ie8
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

Array.prototype.each = function(block)
{
  for(var i = 0 ; i < this.length ; i++) {
    block(this[i]);
  }
};

(function($) {
  $.fn.loading = function(params) {
    params = $.extend( { message: 'Loading' }, params);
    this.each(function() {
      var $t = $(this);
      
      if(params.message != undefined) {
        $t.append('<div class="ui-loader loading"><span class="ui-icon ui-icon-loading spin"></span><h1>' + params.message + '</h1></div>');
        $t.find('.loading').css('display','block').css('margin-top','35px');
      }
      else {
        $t.find('.loading').remove();
      }
      $t.trigger('create');
    });
    return this;
  };
})(jQuery);


function keepAlive() {
  setInterval(function(){
    BOSSAPI.auth.ping({
      error : function(error) {
        $(document).trigger('onSessionError', error);
      }
    });
  }, 60 * 1000);
}

function formatMeetingTime(meeting) {
  return meeting.start_date.toString('h:mm tt');
}
function formatMeetingDate(meeting) {
  return meeting.start_date.toString('ddd, MMMM d, yyyy');
}
function formatMeetingDuration(meeting) {
  return (meeting.duration / 60) + ' mins';
}


function findNextMeeting(date, meetings) {
  var next = undefined;
  if(meetings != undefined) {
    for(var i = 0 ; i < meetings.length ; i++) {
      var meeting = meetings[i];
      if(meeting.start_date >= date) {
        if(next == undefined || next.start_date > meeting.start_date) {
          next = meeting;
        }
      }
    } 
  }
  return next;
}

function createMeeting(settings) {

  settings['data'] = BOSSAPI.includeSecureParams(settings['data'])

  if(settings['url'] == undefined) {
    settings['url'] = BOSSAPI.utils.formatString( '{url}schedule/meeting/create.json' ,{ url : BOSSAPI._url }); 
  }

  if(settings['success'] == undefined) {
    settings['success'] = function(data) {
      alert('You need to properly handle your results.');
    };
  }

  if(settings['error'] == undefined) {
    settings['error'] = function() {
      alert('Failed to create meeting.  Please retry later and if the problem persists contact support.');
    };
  }

  $.ajax({
      url : settings.url,
      data : settings.data,
      dataType : 'jsonp',
      type : 'GET',
      success : function(data) {
          BOSSAPI.utils._handleServerResponse(settings, data);
      }
  });
}

function retrieveProducts(settings) {

  settings['data'] = BOSSAPI.includeSecureParams(settings['data'])

  if(settings['url'] == undefined) {
    settings['url'] = BOSSAPI.utils.formatString( '{url}employee/products.json' ,{ url : BOSSAPI._url }); 
  }

  if(settings['success'] == undefined) {
    settings['success'] = function(data) {
      alert('You need to properly handle your product results.');
    };
  }

  if(settings['error'] == undefined) {
    settings['error'] = function() {
      alert('Failed to load your employee products.  Please retry later and if the problem persists contact support.');
    };
  }

  $.ajax({
      url : settings.url,
      data : settings.data,
      dataType : 'jsonp',
      type : 'GET',
      success : function(data) {
          BOSSAPI.utils._handleServerResponse(settings, data);
      }
  });
}

function createDateSelection(onDateSelect) {
  var bar = $('<div class="ui-bar standalone"></div>');
  bar.append('<input class="mobiscroll" ></input>');
  bar.find('.mobiscroll').val(Date.today().toString('MM/dd/yyyy')).scroller({
    onSelect : function(e) {
      var d = bar.find('.mobiscroll').scroller('getDate');
      if(onDateSelect != undefined) {
        onDateSelect(d);
      }
    }
  });
  return bar;
}

function retrieveBook(settings) {

  settings['data'] = BOSSAPI.includeSecureParams(settings['data'])

  if(settings['url'] == undefined) {
    settings['url'] = BOSSAPI.utils.formatString( '{url}employee/clients.json' ,{ url : BOSSAPI._url }); 
  }

  if(settings['success'] == undefined) {
    settings['success'] = function(data) {
      alert('You need to properly handle your book results.');
    };
  }

  if(settings['error'] == undefined) {
    settings['error'] = function() {
      alert('Failed to load your customer book.  Please retry later and if the problem persists contact support.');
    };
  }

  $.ajax({
      url : settings.url,
      data : settings.data,
      dataType : 'jsonp',
      type : 'GET',
      success : function(data) {
          BOSSAPI.utils._handleServerResponse(settings, data);
      }
  });
}

function searchSchedule(settings) {

  settings['data'] = BOSSAPI.includeSecureParams(settings['data'])

  if(settings['url'] == undefined) {
    settings['url'] = BOSSAPI.utils.formatString( '{url}employee/schedule.json' , { url : BOSSAPI._url }); 
  }

  if(settings['success'] == undefined) {
    settings['success'] = function(data) {
      alert('You need to properly handle your search results.');
    };
  }

  if(settings['error'] == undefined) {
    settings['error'] = function() {
      alert('Failed to search schedule.  Please retry later and if the problem persists contact support.');
    };
  }

  $.ajax({
      url : settings.url,
      data : settings.data,
      dataType : 'jsonp',
      type : 'GET',
      success : function(data) {

          if(data['availability'] != undefined) {
            for(var i = 0 ; i < data.availability.length ; i++) {
              data.availability[i].start_date = new Date(data.availability[i].start_date * 1000);
              data.availability[i].end_date = new Date(data.availability[i].end_date * 1000);
            }
          }

          if(data['meetings'] != undefined) {
            for(var i = 0 ; i < data.meetings.length ; i++) {
              data.meetings[i].start_date = new Date(data.meetings[i].start_date * 1000);
              data.meetings[i].end_date = new Date(data.meetings[i].end_date * 1000);
            }
          }

          BOSSAPI.utils._handleServerResponse(settings, data);
      }
  });
}

function setTemplatedContainerContent(container, items, template) {
  container.empty();
  for(var i = 0 ; i < items.length ; i++) {
    container.append(template(items[i]));
  }
  container.trigger('create');
}

function searchMemberInteraction(settings) {
  settings['data'] = $.extend({ 
    ssoid : BOSSAPI._ssoid,
    employee_number : employee().id,
    publish : 'true,false', //Both published and non-published schedules.
  },settings['data']);
  BOSSAPI.scheduling.meetings.search(settings);
}

function searchMemberPackages(settings) {
  settings['data'] = $.extend({ 
    ssoid : BOSSAPI._ssoid,
    employee_number : employee().id
  },settings['data']);
  searchPackages(settings);
}

function searchPackages(settings) {
  settings = $.extend({ 
    url : BOSSAPI.utils.formatString( '{url}member/packages.json' , { url : BOSSAPI._url }),
    success : function(data) {
      alert('You need to properly handle your search results.');
    },
    error : function(error) {
      alert('Failed to search member packages.  Please retry later and if the problem persists contact support.');
    }
  }, settings);

  $.ajax({
      url : settings.url,
      data : BOSSAPI.includeSecureParams(settings['data']),
      dataType : 'jsonp',
      type : 'GET',
      success : function(data) {
          if(data['error'] == undefined) {
            for(var i = 0 ; i < data.length ; i++) {
              data[i] = data[i].gift_certificate;
            }
          }
          BOSSAPI.utils._handleServerResponse(settings, data);
      }
  });
}

function searchMembers(settings) {

  settings['data'] = BOSSAPI.includeSecureParams(settings['data'])

  if(settings['url'] == undefined) {
    settings['url'] = BOSSAPI.utils.formatString( '{url}mms/member/search.json' , { url : BOSSAPI._url }); 
  }

  if(settings['success'] == undefined) {
    settings['success'] = function(data) {
      alert('You need to properly handle your search results.');
    };
  }

  if(settings['error'] == undefined) {
    settings['error'] = function() {
      alert('Failed to search members.  Please retry later and if the problem persists contact support.');
    };
  }

  $.ajax({
      url : settings.url,
      data : settings.data,
      dataType : 'jsonp',
      type : 'GET',
      success : function(data) {

          if(data['member'] && data.member['member_id'] != undefined) { 
            data.member = [data.member]; 
          }

          BOSSAPI.utils._handleServerResponse(settings, data);
      }
  });
}