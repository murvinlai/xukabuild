/*
 * Build.js
 */

if (typeof(_XUKA_) == 'undefined') {
	_XUKA_= {};
} 

_XUKA_.init = function () {
	// bind inputs
	for (key in _XUKA_.input) {
		if (_XUKA_.input.hasOwnProperty(key)) {
			$('#' + key)[_XUKA_.input[key].action_type](_XUKA_.input[key].call);
		}
	}
}

_XUKA_.input = {
	build_now : {
		action_type: 'click',
		call: function(){
			console.log("Build now");
			$.ajax({
				type: "POST", 
				url: _XUKA_.url.build + "/build",
				data: {_csrf:_XUKA_.csrftoken},
				success: function(data) {
					console.log(data);
				},
				dataType: 'json'
			});
		}
	},
	select_log: {
		action_type: 'click',
		call: function(){
			console.log("Select Log now");
			var selectedValue = $('#select_log option:selected').val();
			console.log("Select Value: " + selectedValue);
			if (selectedValue == "SELECT ONE" || selectedValue == "") {
				return;
			}
			$.ajax({
				type: "POST", 
				url: _XUKA_.url.build + "/log",
				data: {_csrf:_XUKA_.csrftoken, fileName:selectedValue},
				success: function(data) {
					console.log(data);
					$('#logContentTextArea').val(data.logContent);
				},
				dataType: 'json'
			});
		}
	}
}


$(document).ready(function(){
	_XUKA_.init();
});
