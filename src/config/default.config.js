define(function(require, exports, module){
	exports.data = {
		'app':{
			'title':"ChromeQQ",
			'loading_text':"正在加载...",
			'version':"0.1",
			'current':"smart_qq"
		},
		'global':{
			'default':"smart_qq"
		},
		'nav_position':"top",
		'nav_show':"always_show",
		'nav_auto_hide_timeout':{
			"appear":200,
			"disappear":500
		},
		'nav_style':{
			'bg_color':"rgb(110, 195, 244)",
			'fg_color':"rgb(255, 255, 255)",
			'opacity':{
				'current':100,
				'min':0,
				'max':100
			},
			'height':{
				'current':30,
				'min':30,
				'max':50,
			},
		},
		'smart_qq':{
			'url': "http://w.qq.com",
			'width':{
				'current':1030,
				'min':1030,
				'max':screen.availWidth
			},
			'height':{
				'current':768,
				'min':768,
				'max':screen.availHeight
			},
		},
		'web_qq':{
			'url': "http://web2.qq.com/webqq.html",
			'width':{
				'current':1030,
				'min':1030,
				'max':screen.availWidth
			},
			'height':{
				'current':768,
				'min':768,
				'max':screen.availHeight
			},
		}
	};
});
