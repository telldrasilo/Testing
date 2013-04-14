// ��������� �������������. ����������� ������� � �.�. 
function initPage() {
	// ��������� �� ���� ������� '�������� �� ������'
	jQuery("a[id^=report_message]").click(function() {
		var taskid = this.id.replace(/report_message_/, '');		// ��������� taskid
		var e_area_id = "#error_area_"+taskid;
		var jErrorArea = jQuery(e_area_id);
		jErrorArea											// � ���������� ����� #error_area_[0-9]+ ����������...
			.slideToggle(250)									// ������ slide
			.find("input[name=cancel]").click(function() {			// �� ������ '������' - ������ slideUp   
				jQuery(e_area_id).slideUp(250);
			})	
			.end()													// ��������� ����� � ���������� ����
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
                        "��������� ������� ���������");
                });
            }
            else
            {
                jErrorArea.slideUp(250, function() {// ������ ������
                    showStatusMessage(jQuery("p#status_message_"+taskid),
                    "� ���������, ���� ��������� �� ������� ��������. ���������� � ������������",
                    function() {
                        jErrorArea.slideDown(250);
                     }, "unsuccess");
                });
            }
        }, 'json'
    );
}// function ajaxSendMessage(jErrorArea)

// ���������� ��������� �� ������ �������
function showStatusMessage(jPanelObject, message, fn, className) {
	className = typeof(className) == "undefined" ? "success" : className;		// �������� ��������� �� ���������
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