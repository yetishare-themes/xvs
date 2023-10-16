



// Replace Checkboxes
function replaceCheckboxes()
{
	var $ = jQuery;
	
	$(".checkbox-replace:not(.flow-cb-replacement), .radio-replace:not(.flow-cb-replacement)").each(function(i, el)
	{
		var $this = $(el),
			$input = $this.find('input:first'),
			$wrapper = $('<label class="cb-wrapper" />'),
			$checked = $('<div class="checked" />'),
			checked_class = 'checked',
			is_radio = $input.is('[type="radio"]'),
			$related,
			name = $input.attr('name');
		

		$this.addClass('flow-cb-replacement');
		
		
		$input.wrap($wrapper);
		
		$wrapper = $input.parent();
		
		$wrapper.append($checked).next('label').on('click', function(ev)
		{	
			$wrapper.click();
		});
		
		$input.on('change', function(ev)
		{	
			if(is_radio)
			{
				//$(".flow-cb-replacement input[type=radio][name='"+name+"']").closest('.flow-cb-replacement').removeClass(checked_class);
				$(".flow-cb-replacement input[type=radio][name='"+name+"']:not(:checked)").closest('.flow-cb-replacement').removeClass(checked_class);
			}
			
			if($input.is(':disabled'))
			{
				$wrapper.addClass('disabled');
			}
			
			$this[$input.is(':checked') ? 'addClass' : 'removeClass'](checked_class);
			
		}).trigger('change');
	});
}



function setupToolTips()
{
    $('[data-toggle="tooltip"]').each(function (i, el)
    {
        var $this = $(el),
                placement = attrDefault($this, 'placement', 'top'),
                trigger = attrDefault($this, 'trigger', 'hover'),
                popover_class = $this.hasClass('tooltip-secondary') ? 'tooltip-secondary' : ($this.hasClass('tooltip-primary') ? 'tooltip-primary' : ($this.hasClass('tooltip-default') ? 'tooltip-default' : ''));

        $this.tooltip({
            placement: placement,
            trigger: trigger,
            container: 'body'
        });

        $this.on('shown.bs.tooltip', function (ev)
        {
            var $tooltip = $this.next();

            $tooltip.addClass(popover_class);
        });
    });
}

function clearToolTips() {
    $('.tooltip').hide();         
}


function processMoveFiles()
{
    selectedValue = $("#moveFolderId option:selected").val();
    moveFilesIntoFolder(selectedValue);
    $('.modal').modal('hide');
}


// added by AW
function processAjaxForm(ele, callback)
{
    // show loader
    showLoaderModal();
    
    // find form
    var form = $(ele).parents('form');

    // submit form via ajax
    $.ajax({
        type: "POST",
        url: $(form).attr('action'),
        data: $(form).serializeArray(),
        success: function(data) {
            if(data.success == true)
            {
                // hide loader
                hideLoaderModal();
                
                // notification
                if(data.msg.length > 0)
                {
                    showSuccessNotification('Success', data.msg);
                }

                // callback
                if(typeof(callback) != 'undefined')
                {
                    callback(data);
                }
            }
            else
            {
                // hide loader
                hideLoaderModal();
                
                // error
                showErrorNotification('Error', data.msg);
            }
        },
        dataType: 'json'
    });
}



function processMoveFiles()
{
    selectedValue = $("#moveFolderId option:selected").val();
    moveFilesIntoFolder(selectedValue);
    $('.modal').modal('hide');
}

// Element Attribute Helper
function attrDefault($el, data_var, default_val)
{
	if(typeof $el.data(data_var) != 'undefined')
	{
		return $el.data(data_var);
	}
	
	return default_val;
}

function showSuccessNotification(title, message)
{
    var opts = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr.success(message, title, opts);
}


function showInfoNotification(title, message)
{
    var opts = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr.info(message, title, opts);
}

function sleep(milliseconds)
{
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++)
    {
        if ((new Date().getTime() - start) > milliseconds)
        {
            break;
        }
    }
}

var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

(function ($) {
      $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
          this.trigger(ev);
          return el.apply(this, arguments);
        };
      });
    })(jQuery);
    
; (function (define) {
	define(['jquery'], function ($) {
		return (function () {
			var version = '2.0.1';
			var $container;
			var listener;
			var toastId = 0;
			var toastType = {
				error: 'error',
				info: 'info',
				success: 'success',
				warning: 'warning'
			};

			var toastr = {
				clear: clear,
				error: error,
				getContainer: getContainer,
				info: info,
				options: {},
				subscribe: subscribe,
				success: success,
				version: version,
				warning: warning
			};

			return toastr;

			//#region Accessible Methods
			function error(message, title, optionsOverride) {
				return notify({
					type: toastType.error,
					iconClass: getOptions().iconClasses.error,
					message: message,
					optionsOverride: optionsOverride,
					title: title
				});
			}

			function info(message, title, optionsOverride) {
				return notify({
					type: toastType.info,
					iconClass: getOptions().iconClasses.info,
					message: message,
					optionsOverride: optionsOverride,
					title: title
				});
			}

			function subscribe(callback) {
				listener = callback;
			}

			function success(message, title, optionsOverride) {
				return notify({
					type: toastType.success,
					iconClass: getOptions().iconClasses.success,
					message: message,
					optionsOverride: optionsOverride,
					title: title
				});
			}

			function warning(message, title, optionsOverride) {
				return notify({
					type: toastType.warning,
					iconClass: getOptions().iconClasses.warning,
					message: message,
					optionsOverride: optionsOverride,
					title: title
				});
			}

			function clear($toastElement) {
				var options = getOptions();
				if (!$container) { getContainer(options); }
				if ($toastElement && $(':focus', $toastElement).length === 0) {
					$toastElement[options.hideMethod]({
						duration: options.hideDuration,
						easing: options.hideEasing,
						complete: function () { removeToast($toastElement); }
					});
					return;
				}
				if ($container.children().length) {
					$container[options.hideMethod]({
						duration: options.hideDuration,
						easing: options.hideEasing,
						complete: function () { $container.remove(); }
					});
				}
			}
			//#endregion

			//#region Internal Methods

			function getDefaults() {
				return {
					tapToDismiss: true,
					toastClass: 'toast',
					containerId: 'toast-container',
					debug: false,

					showMethod: 'fadeIn', //fadeIn, slideDown, and show are built into jQuery
					showDuration: 300,
					showEasing: 'swing', //swing and linear are built into jQuery
					onShown: undefined,
					hideMethod: 'fadeOut',
					hideDuration: 1000,
					hideEasing: 'swing',
					onHidden: undefined,

					extendedTimeOut: 1000,
					iconClasses: {
						error: 'toast-error',
						info: 'toast-info',
						success: 'toast-success',
						warning: 'toast-warning'
					},
					iconClass: 'toast-info',
					positionClass: 'toast-top-right',
					timeOut: 5000, // Set timeOut and extendedTimeout to 0 to make it sticky
					titleClass: 'toast-title',
					messageClass: 'toast-message',
					target: 'body',
					closeHtml: '<button>&times;</button>',
					newestOnTop: true
				};
			}

			function publish(args) {
				if (!listener) {
					return;
				}
				listener(args);
			}

			function notify(map) {
				var
					options = getOptions(),
					iconClass = map.iconClass || options.iconClass;

				if (typeof (map.optionsOverride) !== 'undefined') {
					options = $.extend(options, map.optionsOverride);
					iconClass = map.optionsOverride.iconClass || iconClass;
				}

				toastId++;

				$container = getContainer(options);
				var
					intervalId = null,
					$toastElement = $('<div/>'),
					$titleElement = $('<div/>'),
					$messageElement = $('<div/>'),
					$closeElement = $(options.closeHtml),
					response = {
						toastId: toastId,
						state: 'visible',
						startTime: new Date(),
						options: options,
						map: map
					};

				if (map.iconClass) {
					$toastElement.addClass(options.toastClass).addClass(iconClass);
				}

				if (map.title) {
					$titleElement.append(map.title).addClass(options.titleClass);
					$toastElement.append($titleElement);
				}

				if (map.message) {
					$messageElement.append(map.message).addClass(options.messageClass);
					$toastElement.append($messageElement);
				}

				if (options.closeButton) {
					$closeElement.addClass('toast-close-button');
					$toastElement.prepend($closeElement);
				}

				$toastElement.hide();
				if (options.newestOnTop) {
					$container.prepend($toastElement);
				} else {
					$container.append($toastElement);
				}


				$toastElement[options.showMethod](
					{ duration: options.showDuration, easing: options.showEasing, complete: options.onShown }
				);
				if (options.timeOut > 0) {
					intervalId = setTimeout(hideToast, options.timeOut);
				}

				$toastElement.hover(stickAround, delayedhideToast);
				if (!options.onclick && options.tapToDismiss) {
					$toastElement.click(hideToast);
				}
				if (options.closeButton && $closeElement) {
					$closeElement.click(function (event) {
					   if( event.stopPropagation ) {
                          event.stopPropagation();
                       } else if( event.cancelBubble !== undefined && event.cancelBubble !== true ) {
                          event.cancelBubble = true;
                       }
						hideToast(true);
					});
				}

				if (options.onclick) {
					$toastElement.click(function () {
						options.onclick();
						hideToast();
					});
				}

				publish(response);

				if (options.debug && console) {
					console.log(response);
				}

				return $toastElement;

				function hideToast(override) {
					if ($(':focus', $toastElement).length && !override) {
						return;
					}
					return $toastElement[options.hideMethod]({
						duration: options.hideDuration,
						easing: options.hideEasing,
						complete: function () {
							removeToast($toastElement);
							if (options.onHidden) {
								options.onHidden();
							}
							response.state = 'hidden';
							response.endTime = new Date(),
							publish(response);
						}
					});
				}

				function delayedhideToast() {
					if (options.timeOut > 0 || options.extendedTimeOut > 0) {
						intervalId = setTimeout(hideToast, options.extendedTimeOut);
					}
				}

				function stickAround() {
					clearTimeout(intervalId);
					$toastElement.stop(true, true)[options.showMethod](
						{ duration: options.showDuration, easing: options.showEasing }
					);
				}
			}
			function getContainer(options) {
				if (!options) { options = getOptions(); }
				$container = $('#' + options.containerId);
				if ($container.length) {
					return $container;
				}
				$container = $('<div/>')
					.attr('id', options.containerId)
					.addClass(options.positionClass);
				$container.appendTo($(options.target));
				return $container;
			}

			function getOptions() {
				return $.extend({}, getDefaults(), toastr.options);
			}

			function removeToast($toastElement) {
				if (!$container) { $container = getContainer(); }
				if ($toastElement.is(':visible')) {
					return;
				}
				$toastElement.remove();
				$toastElement = null;
				if ($container.children().length === 0) {
					$container.remove();
				}
			}
			//#endregion

		})();
	});
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
	if (typeof module !== 'undefined' && module.exports) { //Node
		module.exports = factory(require('jquery'));
	} else {
		window['toastr'] = factory(window['jQuery']);
	}
}));    

function widgetLoadImage(id, url)
{
    if($('#main-ajax-container').length)
    {
        showFile(id);
        return false;
    }

    window.location = url;
}

function widgetLoadAlbum(id, url)
{
    if($('#main-ajax-container').length)
    {
        loadImages('folder', id);
        return false;
    }

    window.location = url;
}

var engine1 = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title', 'thumbnail', 'id'),
	queryTokenizer: Bloodhound.tokenizers.obj.whitespace('title', 'thumbnail', 'id'),
	identify: "id",
	remote: {
		url: ACCOUNT_WEB_ROOT+'/ajax/search_widget?type=images&query=%QUERY',
		wildcard: '%QUERY',
		rateLimitWait: 100
	}
});

var engine2 = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title', 'thumbnail', 'id'),
	queryTokenizer: Bloodhound.tokenizers.obj.whitespace('title', 'thumbnail', 'id'),
	identify: "id",
	remote: {
		url: ACCOUNT_WEB_ROOT+'/ajax/search_widget?type=folders&query=%QUERY',
		wildcard: '%QUERY',
		rateLimitWait: 100
	}
});
 
$('#top-search .typeahead').typeahead({
		minLength: 3, // send AJAX request only after user type in at least 3 characters
		highlight: true,
		cache: false,
		hint: false
	},
	{
		name: 'search-result',
		source: engine1,
		display: 'none',
		limit: 8,
		valueKey: 'id',
		templates: {
			header: function(obj) { return '<h3 class="group-title">Files</h3>'; },
			notFound: '<h3 class="group-title">Files</h3><div class="search-widget-no-results">No files found in search.</div>',
			suggestion: Handlebars.compile('<div><a href="{{url}}" onClick=\'widgetLoadImage({{id}}, "{{url}}"); return false;\'><img src="{{thumbnail}}" class="listing-image-thumbnail"/> <span class="listing-image-title">{{title}}</span><span class="listing-image-sub-title">{{folder_name}}</span><div class="clear"></div></a></div>')
		}
	},
	{
		name: 'search-result2',
		source: engine2,
		display: 'none',
		limit: 8,
		valueKey: 'id',
		templates: {
			header: function(obj) { return '<h3 class="group-title">Folders</h3>'; },
			notFound: '<h3 class="group-title">Folders</h3><div class="search-widget-no-results">No folders found in search.</div>',
			suggestion: Handlebars.compile('<div><a href="{{url}}" onClick=\'widgetLoadAlbum({{id}}, "{{url}}"); return false;\'><img src="{{thumbnail}}" class="listing-image-thumbnail"/> <span class="listing-image-title">{{title}}</span><span class="listing-image-sub-title">{{total_files}}</span><div class="clear"></div></a></div>')
		}
}).on('typeahead:asyncrequest', function() {
	//$('.Typeahead-spinner').show();
})
.on('typeahead:asynccancel typeahead:asyncreceive', function() {
	//$('.Typeahead-spinner').hide();
});

var bgFill = false;

function bookmarksite(title, url)
{
    if (window.sidebar) // firefox
        window.sidebar.addPanel(title, url, "");
    else if (window.opera && window.print) { // opera
        var elem = document.createElement('a');
        elem.setAttribute('href', url);
        elem.setAttribute('title', title);
        elem.setAttribute('rel', 'sidebar');
        elem.click();
    }
    else if (document.all)// ie
        window.external.AddFavorite(url, title);
}

function showHideStatsTab(id)
{
    if ($("currentTab").value.length > 0)
    {
        $($("currentTab").value).style.display = "none";
    }
    $("currentTab").value = id;
    $(id).style.display = "block";
    return false;
}

function showHideTip(ele)
{
    $('.formTip').addClass('hidden');
    $('#' + ele.id + 'Tip').removeClass('hidden');
}

function bytesToSize(bytes, precision)
{
    var kilobyte = 1024;
    var megabyte = kilobyte * 1024;
    var gigabyte = megabyte * 1024;
    var terabyte = gigabyte * 1024;

    if ((bytes >= 0) && (bytes < kilobyte)) {
        return bytes + ' B';

    } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
        return (bytes / kilobyte).toFixed(precision) + ' KB';

    } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
        return (bytes / megabyte).toFixed(precision) + ' MB';

    } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
        return (bytes / gigabyte).toFixed(precision) + ' GB';

    } else if (bytes >= terabyte) {
        return (bytes / terabyte).toFixed(precision) + ' TB';

    } else {
        return bytes + ' B';
    }
}

function humanReadableTime(seconds)
{
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);

    rs = '';
    if (numhours > 0)
    {
        if (numhours != 1)
        {
            rs += numhours + " "+t('uploader_hours');
        }
        else
        {
            rs += numhours + " "+t('uploader_hour');
        }
        rs += " ";
    }
    if (numminutes > 0)
    {
        if (numminutes != 1)
        {
            rs += numminutes + " "+t('uploader_minutes');
        }
        else
        {
            rs += numminutes + " "+t('uploader_minute');
        }
        rs += " ";
    }
    if (numseconds != 1)
    {
        rs += numseconds + " "+t('uploader_seconds');
    }
    else
    {
        rs += numseconds + " "+t('uploader_second');
    }

    return rs;
}

function browserXHR2Support()
{
    if (new XMLHttpRequest().upload)
    {
        return true;
    }

    return false;
}

function htmlEntities(str)
{
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function createRandomAPIKey(eleId)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 64; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    $('#'+eleId).val(text);
}

	$(document).ready(function()
	{

	// Datepicker
		if($.isFunction($.fn.datepicker))
		{
			$(".datepicker").each(function(i, el)
			{
				var $this = $(el),
					opts = {
						format: attrDefault($this, 'format', 'mm/dd/yyyy'),
						startDate: attrDefault($this, 'startDate', ''),
						endDate: attrDefault($this, 'endDate', ''),
						daysOfWeekDisabled: attrDefault($this, 'disabledDays', ''),
						startView: attrDefault($this, 'startView', 0),
						rtl: rtl()
					},
					$n = $this.next(),
					$p = $this.prev();
								
				$this.datepicker(opts);
				
				if($n.is('.input-group-addon') && $n.has('a'))
				{
					$n.on('click', function(ev)
					{
						ev.preventDefault();
						
						$this.datepicker('show');
					});
				}
				
				if($p.is('.input-group-addon') && $p.has('a'))
				{
					$p.on('click', function(ev)
					{
						ev.preventDefault();
						
						$this.datepicker('show');
					});
				}
			});
		}
		
		
		
		
		// Timepicker
		if($.isFunction($.fn.timepicker))
		{
			$(".timepicker").each(function(i, el)
			{
				var $this = $(el),
					opts = {
						template: attrDefault($this, 'template', false),
						showSeconds: attrDefault($this, 'showSeconds', false),
						defaultTime: attrDefault($this, 'defaultTime', 'current'),
						showMeridian: attrDefault($this, 'showMeridian', true),
						minuteStep: attrDefault($this, 'minuteStep', 15),
						secondStep: attrDefault($this, 'secondStep', 15)
					},
					$n = $this.next(),
					$p = $this.prev();
				
				$this.timepicker(opts);
				
				if($n.is('.input-group-addon') && $n.has('a'))
				{
					$n.on('click', function(ev)
					{
						ev.preventDefault();
						
						$this.timepicker('showWidget');
					});
				}
				
				if($p.is('.input-group-addon') && $p.has('a'))
				{
					$p.on('click', function(ev)
					{
						ev.preventDefault();
						
						$this.timepicker('showWidget');
					});
				}
			});
		}
		
		
		
		
		// Colorpicker
		if($.isFunction($.fn.colorpicker))
		{
			$(".colorpicker").each(function(i, el)
			{
				var $this = $(el),
					opts = {
						//format: attrDefault($this, 'format', false)
					},
					$n = $this.next(),
					$p = $this.prev(),
					
					$preview = $this.siblings('.input-group-addon').find('.color-preview');
				
				$this.colorpicker(opts);
				
				if($n.is('.input-group-addon') && $n.has('a'))
				{
					$n.on('click', function(ev)
					{
						ev.preventDefault();
						
						$this.colorpicker('show');
					});
				}
				
				if($p.is('.input-group-addon') && $p.has('a'))
				{
					$p.on('click', function(ev)
					{
						ev.preventDefault();
						
						$this.colorpicker('show');
					});
				}
				
				if($preview.length)
				{
					$this.on('changeColor', function(ev){
						
						$preview.css('background-color', ev.color.toHex());
					});
					
					if($this.val().length)
					{
						$preview.css('background-color', $this.val());
					}
				}
			});
		}
		
		
		
		
		// Date Range Picker
		if($.isFunction($.fn.daterangepicker))
		{
			$(".daterange").each(function(i, el)
			{
				// Change the range as you desire
				var ranges = {
					'Today': [moment(), moment()],
					'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
					'Last 7 Days': [moment().subtract('days', 6), moment()],
					'Last 30 Days': [moment().subtract('days', 29), moment()],
					'This Month': [moment().startOf('month'), moment().endOf('month')],
					'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
				};
				
				var $this = $(el),
					opts = {
						format: attrDefault($this, 'format', 'MM/DD/YYYY'),
						timePicker: attrDefault($this, 'timePicker', false),
						timePickerIncrement: attrDefault($this, 'timePickerIncrement', false),
						separator: attrDefault($this, 'separator', ' - '),
					},
					min_date = attrDefault($this, 'minDate', ''),
					max_date = attrDefault($this, 'maxDate', ''),
					start_date = attrDefault($this, 'startDate', ''),
					end_date = attrDefault($this, 'endDate', '');
				
				if($this.hasClass('add-ranges'))
				{
					opts['ranges'] = ranges;
				}	
					
				if(min_date.length)
				{
					opts['minDate'] = min_date;
				}
					
				if(max_date.length)
				{
					opts['maxDate'] = max_date;
				}
					
				if(start_date.length)
				{
					opts['startDate'] = start_date;
				}
					
				if(end_date.length)
				{
					opts['endDate'] = end_date;
				}
				
				
				$this.daterangepicker(opts, function(start, end)
				{
					var drp = $this.data('daterangepicker');
					
					if($this.is('[data-callback]'))
					{
						$($this).parent().children('input').val(start.format('YYYY-MM-DD')+'|'+end.format('YYYY-MM-DD'));
					}
					
					if($this.hasClass('daterange-inline'))
					{
						$this.find('span').html(start.format(drp.format) + drp.separator + end.format(drp.format));
					}
				});
			});
		}
		
		
		
		
		// Input Mask
		if($.isFunction($.fn.inputmask))
		{
			$("[data-mask]").each(function(i, el)
			{
				var $this = $(el),
					mask = $this.data('mask').toString(),
					opts = {
						numericInput: attrDefault($this, 'numeric', false),
						radixPoint: attrDefault($this, 'radixPoint', ''),
						rightAlignNumerics: attrDefault($this, 'numericAlign', 'left') == 'right'
					},
					placeholder = attrDefault($this, 'placeholder', ''),
					is_regex = attrDefault($this, 'isRegex', '');
				
					
				if(placeholder.length)
				{
					opts[placeholder] = placeholder;
				}
				
				switch(mask.toLowerCase())
				{
					case "phone":
						mask = "(999) 999-9999";
						break;
						
					case "currency":
					case "rcurrency":
					
						var sign = attrDefault($this, 'sign', '$');;
						
						mask = "999,999,999.99";
						
						if($this.data('mask').toLowerCase() == 'rcurrency')
						{
							mask += ' ' + sign;
						}
						else
						{
							mask = sign + ' ' + mask;
						}
						
						opts.numericInput = true;
						opts.rightAlignNumerics = false;
						opts.radixPoint = '.';
						break;
						
					case "email":
						mask = 'Regex';
						opts.regex = "[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,4}";
						break;
					
					case "fdecimal":
						mask = 'decimal';
						$.extend(opts, {
							autoGroup		: true,
							groupSize		: 3,
							radixPoint		: attrDefault($this, 'rad', '.'),
							groupSeparator	: attrDefault($this, 'dec', ',')
						});
				}
				
				if(is_regex)
				{
					opts.regex = mask;
					mask = 'Regex';
				}
				
				$this.inputmask(mask, opts);
			});
		}
	});