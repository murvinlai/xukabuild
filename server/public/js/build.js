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
			$(key)[_XUKA_.input[key].action_type](_XUKA_.input[key].call);
		}
	}
}

_XUKA_.input = {
	build_now : {
		action_type: 'click',
		call: function(){
			console.log("Build now");
		}
	},
	select_log: {
		action_type: 'click',
		call: function(){
			console.log("Select Log now");
		}
	}
}


_XUKA_.init();
