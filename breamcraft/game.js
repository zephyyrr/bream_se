(function(window, document, Logic, undefined) {

$(function() {
	var World = $('<div id="world" tabindex="0">');

	var UI = {};
	
	 UI.topbar = $('<div id="topbar">').addClass('ui-component');
	 
	 UI.panel = $('<div id="panel">').addClass('ui-component');
	 
	 UI.minimap = $('<div id="minimap">').addClass('ui-component');
	 
	 
	 $(document.body).append(World);
	 $(document.body).append(UI.topbar);
	 $(document.body).append(UI.panel);
	 $(document.body).append(UI.minimap);
	 
	 window.World = World;
	 window.UI = UI;
	 
	 Logic.applyTo(World);
});

})(window, document, Logic);