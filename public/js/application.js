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

function keepAlive() {
  setInterval(function(){
    BOSSAPI.auth.ping({
      error : function(error) {
        alert('error pinging server.');
      }
    });
  }, 60 * 1000);
}

function employee(){
  return $(document).data('employee');
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
          BOSSAPI.utils._handleServerResponse(settings, data);
      }
  });
}