//console.log(C("nav_style.bg_color"));
var reset = false;
var Conf = (function(reset)
{
	var instance = null;

	var settings = null;
	// default settings.
	var defaultSettings = {
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
				'current':360,
				'min':250,
				'max':screen.availWidth
			},
			'height':{
				'current':620,
				'min':272,
				'max':screen.availHeight
			},
		},
		'web_qq':{
			'url': "http://web2.qq.com/webqq.html",
			'width':{
				'current':1000,
				'min':620,
				'max':screen.availWidth
			},
			'height':{
				'current':620,
				'min':620,
				'max':screen.availHeight
			},
		}
	};

	load(reset);

	function load(reset)
	{
		if(reset)
		{
			settings = defaultSettings;         
		    chrome.storage.sync.set({'settings':defaultSettings});
		}		
		chrome.storage.sync.get("settings", function(items){
		    if(!items.settings)
		    {
		    	settings = defaultSettings;         
		        //chrome.storage.sync.set({'settings':defaultSettings});	        
		    }
		    else
		    {
		        settings = items.settings;
		    }
		    onload(settings);
		});
	}

	function __construct(){
		return{
			get:function(key){
				if(!key)
				{
					return null;
				}
				var keyArr = key.split(".");
				var testKey = null;
				var testElem = settings ? settings : defaultSettings;
				for(var i=0; i<keyArr.length; i++)
				{				
					testKey = keyArr[i];
					if(!testElem)
					{
						//console.log("Conf get: null element with key:"+ key);
						return null;
					}						
					if(testKey in testElem)
					{
						testElem = testElem[testKey];
					}
					else
					{
						return null;
					}
				}
				return testElem;
			},
			set:function(key, value){
				var keyArr = key.split(".");
				var testKey = null;
				var testElem = settings;
				var parentElem = testElem;
				for(var i=0; i<keyArr.length; i++)
				{				
					testKey = keyArr[i];
					parentElem = testElem;
					if(testKey in testElem)
					{						
						testElem = testElem[testKey];
					}
					else
					{
						testElem[testKey] = {};
						testElem = testElem[testKey];
					}
				}
				parentElem[testKey] = value;
				//settings[key] = value;
				chrome.storage.sync.set({'settings':settings});
			}
		}		
	}
	
	var onload = function(data){};

	return {
		getInstance:function(){
			if(!instance){
				instance = __construct();
			}
			return instance;
		},
		load:function(fn){
			onload = fn;
		},		
	};
})(reset);

var C = function()
{   
    if(arguments.length == 1)
    {
        var key = arguments[0];     
        return Conf.getInstance().get(key);
    }
    else if(arguments.length == 2)
    {
        var key = arguments[0];
        var value = arguments[1];
        return Conf.getInstance().set(key,value);
    }
    else
    {
        return false;
    }   
}

Conf.load(function(data){	
	less.globalVars.nav_height = data.nav_style.height.current + "px";
	less.globalVars.bg_color = data.nav_style.bg_color;
	less.globalVars.fg_color = data.nav_style.fg_color;
	less.globalVars.bg_opacity = data.nav_style.opacity.current + "%";

	var defaultqq = data.global.default;	
	if(defaultqq == "smart_qq")
	{
		less.globalVars.win_width = data.smart_qq.width.current + "px";
		less.globalVars.win_height = data.smart_qq.height.current + "px";
	}
	else if(defaultqq == "web_qq")
	{
		less.globalVars.win_width = data.web_qq.width.current + "px";
		less.globalVars.win_height = data.web_qq.height.current + "px";
	}
	else
	{
		less.globalVars.win_width = "360px";
		less.globalVars.win_height = "620px";
	}
	initSliders(data);
	initSettings(data);
});


var less = {
	fileAsync:true,
	globalVars:{},
	onload:function(e){
			
	}
};
var defaultqq = C("global.default");
if(defaultqq == "smart_qq")
{
	less.globalVars.win_width = C("smart_qq.width.current") + "px";
	less.globalVars.win_height = C("smart_qq.height.current") + "px";
}
else if(defaultqq == "web_qq")
{
	less.globalVars.win_width = C("web_qq.width.current") + "px";
	less.globalVars.win_height = C("web_qq.height.current") + "px";
}
else
{	
	less.globalVars.win_width = "360px";
	less.globalVars.win_height = "620px";
}
less.globalVars.nav_height = C("nav_style.height.current") + "px";
less.globalVars.bg_color = C("nav_style.bg_color");
less.globalVars.bg_opacity = C("nav_style.opacity.current") + "%";
less.globalVars.fg_color = C("nav_style.fg_color");


var isShowOption = false;
function switchQQ(webview, type)
{
    toggleOptionPanel(false);
    updateColor("#a_options", false);
    if(type == "web_qq")
    {
    	C("app.current", "web_qq");
        webview.src = C('web_qq.url');
        window.resizeTo(C("web_qq.width.current"), C("web_qq.height.current"));
    }
    else
    {
    	C("app.current", "smart_qq");
        webview.src = C('smart_qq.url');
        window.resizeTo(C("smart_qq.width.current"), C("smart_qq.height.current"));
    }    
}

function toggleOptionPanel(open)
{
    if(open)
    {
        isShowOption = true;
        $("#d_options").slideDown(700, "easeOutBounce");
    }
    else
    {
        isShowOption = false;
        $("#d_options").slideUp(200, "easeInExpo");
    }    
}
function setBgColor(bgColor, isCheck)
{        
    var colorReg = [
        /^\s*(rgb\(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\))\s*$/i,
        /^\s*#([0-9a-f]{3})\s*$/i,
        /^\s*#([0-9a-f]{6})\s*$/i
    ];
    if(isCheck)
    {
        for(var i in colorReg)
        {
            if(colorReg[i].test(bgColor))
            {
                C("nav_style.bg_color", bgColor);
                less.globalVars.bg_color = C("nav_style.bg_color");
                less.modifyVars({
                    '@bg_color': C("nav_style.bg_color"),                    
                });
                updateColor(aOptions, isShowOption);
                return true;                     
            }
        }        
        return false;
              
    }
    else
    {
        C("nav_style.bg_color", bgColor);
        less.globalVars.bg_color = C("nav_style.bg_color");
        less.modifyVars({
            '@bg_color': C("nav_style.bg_color"),            
        });
        updateColor(aOptions, isShowOption);
        return true;
    }        
}

function updateColor(elem, reverse) 
{
    var bgColor = C("nav_style.bg_color");
    var fgColor = C("nav_style.fg_color");
    if (!reverse) 
    {
    	$(elem).removeClass("pressed").addClass("normal");    	               
    } 
    else 
    {  
    	$(elem).removeClass("normal").addClass("pressed");        
    }
}


function initSliders(settings){
	 // UI code
    var elems = document.querySelectorAll('.js-range');


    var sliderOptions = [{
        klass: 'power-ranger',
        min: settings.nav_style.opacity.min,
        max: settings.nav_style.opacity.max,
        start: settings.nav_style.opacity.current,
        hideRange: true,
        bindKey:"test",
    }, {
        klass: 'power-ranger',
        min: settings.nav_style.height.min,
        max: settings.nav_style.height.max,
        start: settings.nav_style.height.current,
        hideRange: true,
        bindKey:"test",
    }, 
    /*{
        klass: 'power-ranger',
        min: settings.smart_qq.width.min,
        max: settings.smart_qq.width.max,
        start: settings.smart_qq.width.current,
        hideRange: true,
        bindKey:"test",
    }, {
        klass: 'power-ranger',
        min: settings.smart_qq.height.min,
        max: settings.smart_qq.height.max,
        start: settings.smart_qq.height.current,
        hideRange: true,
        bindKey:"test",
    }, {
        klass: 'power-ranger',
        min: settings.web_qq.width.min,
        max: settings.web_qq.width.max,
        start: settings.web_qq.width.current,
        hideRange: true,
        bindKey:"test",
    }, {
        klass: 'power-ranger',
        min: settings.web_qq.height.min,
        max: settings.web_qq.height.max,
        start: settings.web_qq.height.current,
        hideRange: true,
        bindKey:"test",
    }*/
    ];

    var oSliderValue = document.createElement("span");
    $(oSliderValue).addClass("slider_value");
    $(oSliderValue).css({
    	"font-size": "8px",
    	"z-index": "100",
    	"width": "36px",
    	"height": "16px",
    	"text-align": "center",
    	"margin-left": "-10px",
    	"color": "black",    
    	"line-height": "16px",
    	"position": "relative",
    	"margin-top": "-15px",
    	"display": "none",
    	"border-top-left-radius": "3px",
    	"border-top-right-radius": "3px",
    	"border-bottom-right-radius": "3px",
    	"border-bottom-left-radius": "3px",
    	"background": "rgb(255, 255, 255)"
   	});

    var width = window.innerWidth - 145;

    $(".ranger-wrapper").each(function() {        
        $(this).css("width", width);
    });

    sliders = [];
    for (var i = 0; i < elems.length; i++) {
        // set initial value        
        sliders[i] = new Powerange(elems[i], sliderOptions[i]);

        var slider = sliders[i];

        
        var left = (slider.options.start - slider.options.min) / (slider.options.max - slider.options.min) * width - 16;
        left = left < 0 ? 0 : left;

        $(slider.handle).css("left", left);
        $(slider.slider).find(".range-quantity").css("width", left);
        

        // add value text to slider handle
        var oSliderValue1 = $(oSliderValue).clone();
        $(oSliderValue1).text(slider.options.start);

        $(slider.handle).append(oSliderValue1);

        //var isSliderDrag = false;
        var dragingElem = null;
        $(slider.handle).mouseover(function() {
        	if(!$(this).attr("draging") || $(this).attr("draging") == "false")
        	{
            	$(this).find("span.slider_value").css("display", "inline");
            }
        });

        $(slider.handle).mouseout(function() {
        	if(!$(this).attr("draging") || $(this).attr("draging") == "false")
        	{
            	$(this).find("span.slider_value").css("display", "none");
        	}
        });

        $(slider.handle).mousedown(function() {
        	//isSliderDrag = true;
        	$(this).attr("draging", true);
            $(this).find("span.slider_value").css("display", "inline");
            dragingElem = this;
        });

        // change value text when slide the handle
        elems[i].onchange = function() {
            var oSliderValue = $(this).next(".range-bar").find('.slider_value');
            oSliderValue.text(this.value);            
        };                
    }

    $(document).mouseup(function() {
    	if(dragingElem)
    	{
	    	$(dragingElem).attr("draging", false);	            
		    $(dragingElem).find("span.slider_value").css("display", "none");
		    var jValueElem = $(dragingElem).parent("span.range-bar").prev("input.js-range");
		    var bindConf = jValueElem.attr("bindConf");
		    var webview = document.getElementById("qq");
		    C(bindConf, $.trim(jValueElem.val()));
		    switch(bindConf)
		    {
		    	case "nav_style.opacity.current":
		    		less.globalVars.bg_opacity = C(bindConf);
			    	less.modifyVars({
			            '@bg_opacity': C(bindConf),	            
			        });
		        break;
		        case "nav_style.height.current":
		        	less.globalVars.nav_height = C(bindConf);
			        less.modifyVars({
			            '@nav_height': C(bindConf),
			        });
			        webview.style.width = window.innerWidth + "px";
			        webview.style.height = (window.innerHeight - C("nav_style.height.current")) + "px";
			        $(".ranger-wrapper").each(function() {
			            var width = window.innerWidth - 145;
			            $(this).css("width", width);
			        });
			    break;
			    /*
			    case "smart_qq.width.current":
			    case "smart_qq.height.current":
			    	if(C("app.current") ==  "smart_qq")
			    	{			    	
				    	//toggleOptionPanel(false);
	    				//updateColor("#a_options", false);	
			    		window.resizeTo(C("smart_qq.width.current"), C("smart_qq.height.current"));
			    		//$("#d_options").css("display","block");
			    	}			    	
			    break;
			    case "web_qq.width.current":
			    case "web_qq.height.current":
			    	if(C("app.current") ==  "web_qq")
			    	{	
					   	//toggleOptionPanel(false);
		    			//updateColor("#a_options", false);			    	
				    	window.resizeTo(C("web_qq.width.current"), C("web_qq.height.current"));
				    	//$("#d_options").css("display","block");
			    	}
			    break;
			    */
		    }		    
    	}			   
	});
}
function initSettings(settings){
    function checkRadio($radioElems, value)
    {
        $radioElems.each(function(){            
            if($(this).val() == value)
            {
                this.checked = true;
            }
            else
            {
                this.checked = false;
            }
        });
    }

    function checkColorChoser($chooserElems, color)
    {        
        $chooserElems.each(function(){
            // console.log(color);
            // console.log($(this).css("background-color"));
            if($(this).css("background-color") == color)
            {
                $(this).addClass('color_chooser_checked');
            }
            else
            {
                $(this).removeClass('color_chooser_checked');
            }
        });
    }

	var webview = document.getElementById("qq");
    switchQQ(webview, settings.global.default);
    
    var checkRadioArr = {
        'global_default':'global.default',
        'nav_position':'nav_position',
        'nav_show':'nav_show'
    };
    for(name in checkRadioArr)
    {
        eleStr = "#d_options input[name=op_"+name+"]";        
        checkRadio($(eleStr), C(checkRadioArr[name]));
    }
    var checkColorArr = {
        'nav_style_bg_color':'nav_style.bg_color', 
        'nav_style_fg_color':'nav_style.fg_color'
    };
    for(name in checkColorArr)
    {
        eleStr = "#d_options input[name=op_"+name+"]";        
        checkColorChoser($(eleStr), C(checkColorArr[name]));
    }

    switch(C("nav_show"))
    {
    	case "always_show":
    		break;
    	case "auto_hide":
    		$("nav").css({"position":"fixed"});
    		break;
    	case "not_show":
    		$("nav").css({"visibility":"hidden", "position":"fixed"});
    		$("#s_options").css({"visibility":"visible"});
    		break;
    }
}

