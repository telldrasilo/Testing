// всяческая инициализация. навешивание событий и т.д. 
function initPage() {
	// пробегаем по всем ссылкам 'сообщить об ошибке'
	jQuery("a[id^=report_message]").click(function() {
		var taskid = this.id.replace(/report_message_/, '');		// извлекаем taskid
		var e_area_id = "#error_area_"+taskid;
		var jErrorArea = jQuery(e_area_id);
		jErrorArea											// к текстовому полям #error_area_[0-9]+ навешиваем...
			.slideToggle(250)									// эффект slide
			.find("input[name=cancel]").click(function() {			// на кнопки 'Отмена' - эффект slideUp   
				jQuery(e_area_id).slideUp(250);
			})	
			.end()													// переходим снова к текстовому полю
			.find("input[name=send_message]").click(function() {
				ajaxSendMessage(jErrorArea);		
			}); 
	});
}

function ajaxSendMessage(jErrorArea)
{
    var fioid = jErrorArea.find("input[name=fioid]").val();
    var taskid = jErrorArea.find("input[name=taskid]").val();
    var message = jErrorArea.find("textarea[name=message]").val();

    jQuery.post('/ajax/ajax_messages.php',
        {action: 'addTaskErrorMessage', taskid: taskid, fioid:fioid, message:message},
        function(data)
        {
            if (data.result == 0)
            {
                jErrorArea.slideUp(250, function() {
                        showStatusMessage(jQuery("p#status_message_"+taskid),
                        "Сообщение успешно добавлено");
                });
            }
            else
            {
                jErrorArea.slideUp(250, function() {// Пришла ошибка
                    showStatusMessage(jQuery("p#status_message_"+taskid),
                    "К сожалению, ваше сообщение не удалось добавить. Обратитесь в техподдержку",
                    function() {
                        jErrorArea.slideDown(250);
                     }, "unsuccess");
                });
            }
        }, 'json'
    );
}// function ajaxSendMessage(jErrorArea)

// отобразить сообщение на панели статуса
function showStatusMessage(jPanelObject, message, fn, className) {
	className = typeof(className) == "undefined" ? "success" : className;		// эмуляция параметра по умолчанию
	jPanelObject.addClass(className).html("&nbsp;").slideDown(200, function() {
		jPanelObject.text(message).oneTime(1000, function() {
			if (fn) {
				jPanelObject.slideUp(50, function() {fn; jPanelObject.removeClass(className);});
			} else {
				jPanelObject.slideUp(50, function() {jPanelObject.removeClass(className); });
			}
		});
	});
}