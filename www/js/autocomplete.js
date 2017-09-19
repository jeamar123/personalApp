// global variables
var acListTotal   =  0;
var acListCurrent = -1;
var acDelay		  = 0;
var length = 1000;
var numAjaxCalls =0;

function setAutoComplete($,field_id, results_id, get_url, location_result)
{
	//console.log(get_url);
	var acResultsId	  = null;
	var acSearchField = null;
	var acURL		  = null;
	var acSearchId	  = null;
	var acResultsDiv  = null;
	
	// initialize vars
	acSearchId  = "#" + field_id;
	acResultsId = "#" + results_id;
	acURL 		= get_url;

	// create the results div
	jQuery("#"+location_result).append('<div class="dropdown" id="' + results_id + '"></div>');
	
	// register mostly used vars
	acSearchField	= jQuery(acSearchId);
	acResultsDiv	= jQuery(acResultsId);
	
	// on blur listener
	acSearchField.blur(function(){ setTimeout(function(){clearAutoComplete(acResultsDiv)},500) });
	
	// on key up listener
	acSearchField.keyup(function (e) 
	{
		if(acSearchField.hasClass('placeholder'))
			acSearchField.removeClass('placeholder');
		
		// get keyCode (window.event is for IE)
		var keyCode = e.keyCode || window.event.keyCode;
		var lastVal = acSearchField.val();
		
		// check for an ENTER or ESC
		if(keyCode == 13 || keyCode == 27){
			clearAutoComplete(acResultsDiv);
			return;
		}
		if(lastVal.length > 1 || lastVal.indexOf("#") == 0)
		{
			// if is text, call with delay
			setTimeout(function () {autoComplete($,lastVal,acSearchField,acResultsId,acURL,acSearchId,acResultsDiv,field_id)}, acDelay);
		}
		else
		{
			clearAutoComplete(acResultsDiv);
		}
	});
}

// treat the auto-complete action (delayed function)
function autoComplete($,lastValue,acSearchField,acResultsId,acURL,acSearchId,acResultsDiv,field_id)
{
	var count = 0;
	// get the field value
	var part = acSearchField.val();
	var userPc= $('#listings-search-zip').val();
	
	var promo = "false";
	//console.log(lastValue);
	// if it's empty clear the resuts box and return
	if(part == ''){
		clearAutoComplete(acResultsDiv);
		return;
	}
	
	// if it's equal the value from the time of the call, allow
	if(lastValue != part){
		return;
	}
	if((field_id.indexOf("listings-search-value")>=0) && ((lastValue.split(" ")).pop()).length < 2) return;
	var str=window.location.protocol + '//' + window.location.hostname + '/'  + acURL + encodeURIComponent(part);

	if(!window.submitted) {
		window.submitted = 'false';
	}
	
	// get remote data as JSON
	if(window.submitted == "false")
			numAjaxCalls++;
	else
		return;
	
	jQuery.getJSON(str,{"userPc":userPc }, function(json){
		
		numAjaxCalls--;
		console.log("numAjaxCalls: " + numAjaxCalls);
		if(window.submitted == "true" && numAjaxCalls >0)
		{
			return;
		}
		else if(window.submitted == "true" && numAjaxCalls ==0)
		{
			window.submitted="false";
			return;
		}

		if(field_id.indexOf("listings-search-value")>=0)
		{
			// get the total of results
			var groupBusinesses = 0;
			var cat = 0;
			var brands = 0;
			var promos = 0;
			var ansLength = 0;
			var hashtags = 0;
			var places = 0;

			if(json['GroupBusinesses'] )
			{
				ansLength += json['GroupBusinesses'].length;
				acListTotal += json['GroupBusinesses'].length;
				groupBusinesses = 1;
			}
			if(json['Hashtags'] )
			{
				ansLength += json['Hashtags'].length;
				acListTotal += json['Hashtags'].length;
				hashtags = 1;
			}
			if(json['promos'])
			{
				ansLength += json['promos'].length;
				acListTotal += json['promos'].length;
				promos = 1;
			}
			if(json['Brands'] )
			{
				ansLength += json['Brands'].length;
				acListTotal += json['Brands'].length;
				brands = 1;
			}
			if(json['Categories'])
			{
				ansLength += json['Categories'].length;
				acListTotal += json['Categories'].length;
				cat = 1;
			}

			if(json['Places'])
			{
				ansLength += json['Places'].length;
				acListTotal += json['Places'].length;
				places = 1;
			}

			// if there are results populate the results div
			if(ansLength > 0)
			{
		
				var newData = '';
				newData += '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel" style="display:block">';
				if(hashtags || groupBusinesses){
					newData += '<li class="disabled"><a tabindex="-1" href="#">' + top.autocomplete.brand_promotions + '</a></li>';	
				}
				if (groupBusinesses) {
					for(i=0; i < json['GroupBusinesses'].length; i++) 
					{
						var text = json['GroupBusinesses'][i].split(',');
						var busName = text[0];
						var distanceText = text[1];
						var businessId = text[2];
						newData += '<li id="cell-'+(count++)+'" class="unselected" data-id="'+businessId+'" value="' + busName + '"><a class="hashtag-link"  tabindex="-1" href="#">' + busName + '</span><span class="pull-right" >'+distanceText+'km</a></li>';
					}
				}
				if (hashtags) {
					for(i=0; i < json['Hashtags'].length; i++) 
					{
						var text = json['Hashtags'][i].split(',');
						var hashtagName = text[0];
						var distanceText = text[1];
						var businessId = text[2];
						newData += '<li id="cell-'+(count++)+'" class="unselected" data-id="'+businessId+'" value="' + hashtagName + '"><a class="hashtag-link"  tabindex="-1" href="#">' + hashtagName + '</span><span class="pull-right" >'+distanceText+'km</a></li>';
					}
				}
				if (promos) {
					newData += '<li class="disabled"><a tabindex="-1" href="#">' + top.autocomplete.deals_n_promotions + '</a></li>';
					for(i=0; i < json['promos'].length; i++) 
					{
						newData += '<li id="cell-'+(count++)+'" class="unselected" value="' + json['promos'][i] + '"><a class="autoComplete-link"  tabindex="-1" href="#">' + json['promos'][i] + '</a></li>';
					}
				}
				if (cat) {
					newData += '<li class="disabled"><a  tabindex="-1" href="#" >' + top.autocomplete.categories + '</a></li>';
					for(i=0; i < json['Categories'].length; i++) 
					{
						newData += '<li id="cell-'+(count++)+'" class="unselected" value="' + json['Categories'][i] + '"><a class="autoComplete-link"  tabindex="-1" href="#" >' + json['Categories'][i] + '</a></li>';
					}
				}
				if (places) {
					newData += '<li class="disabled"><a  tabindex="-1" href="#" >' + top.autocomplete.places + '</a></li>';
					for(i=0; i < json['Places'].length; i++) 
					{
						newData += '<li id="cell-'+(count++)+'" class="unselected" value="' + json['Places'][i] + '"><a class="autoComplete-link"  tabindex="-1" href="#" places >' + json['Places'][i] + '</a></li>';
					}
				}
				if (brands) {
					newData += '<li class="disabled"><a tabindex="-1" href="#">' + top.autocomplete.business_listings + '</a></li>';
					for(i=0; i < json['Brands'].length; i++) 
					{
						var text = json['Brands'][i].split(',');
						var brandName = text[0];
						var distanceText = text[1];
						newData += '<li id="cell-'+(count++)+'" class="unselected" value="' + brandName + '"><a class="autoComplete-link"  tabindex="-1" href="#">' + brandName + '</span><span class="pull-right" >'+distanceText+'km</a></li>';
					}
				}
				// 
				newData += '</ul>';
				//console.log(newData);
				display($,newData,acResultsId,acResultsDiv,acSearchField,"false");
				on_click_autoComplete_link();
			}
			else 
			{
				clearAutoComplete(acResultsDiv);
			}
		}
		else if(field_id == "listings-search-zip" || field_id.indexOf("custom_pc") >=0 )
		{
			//console.log(json['city'].length);
			var ansLength = json['city'].length;
					
			// if there are results populate the results div
			if(ansLength > 0)
			{
				var newData = '';
				newData += '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel" style="display:block">';
				if(field_id.indexOf("mobile")>=0)
				{
					// create a div for each result
					for(i=0; i < json['city'].length; i++) 
					{
						if(i == 0)
							newData += '<li id="cell-'+(count++)+'-' + json['pc'][i] + '" class="unselected" value="' + json['pc'][i] + '"><a class="select-city" tabindex="-1" href="#" class="wordwrap-mobile">' + json['city'][i] + '</a></li>';
						else
							newData += '<li id="cell-'+(count++)+'-' + json['pc'][i] + '" class="unselected" value="' + json['pc'][i] + '"><a class="select-city" tabindex="-1" href="#" class="wordwrap-mobile">' + json['city'][i] + '</a></li>';
					}
				}
				else
				{
					// create a div for each result
					for(i=0; i < json['city'].length; i++) 
					{
						if(i == 0)
						{
							newData += '<li class="disabled"><a tabindex="-1" href="#" >' + 'Select from list' + '</a></li>';
							newData += '<li id="cell-'+(count++)+'-' + json['pc'][i] + '" class="unselected" value="' + json['pc'][i] + '"><a class="select-city" tabindex="-1" href="#">' + json['city'][i] + '</a></li>';
						}
						else
							newData += '<li id="cell-'+(count++)+'-' + json['pc'][i] + '" class="unselected" value="' + json['pc'][i] + '"><a class="select-city" tabindex="-1" href="#">' + json['city'][i] + '</a></li>';
					}
				}
				newData += '</ul>';
				// console.log(newData);
				display($,newData,acResultsId,acResultsDiv,acSearchField,"true");
				on_click_city_link();
			}
			else 
			{
				clearAutoComplete(acResultsDiv);
			}
		}
	});

	function on_click_autoComplete_link()
	{
		$('.autoComplete-link').click(function(event){
			if(event){
				event.preventDefault();
				event.stopImmediatePropagation();
			}

			var attr = $(this).attr('places');
			if (typeof attr !== typeof undefined && attr !== false) {
				top.switchToTab = 'places';
			}			

			var s = $(this).parent().attr('value');
			$("#listings-search-value").val(s);

			if($("#listing-search-form").attr('action') == '')
			{
				$(".nearest-search-submit").click();
			}
			else
			{
				$("#listing-search-form").submit();
			}
		});
		$('.hashtag-link').click(function(){
			var p = $(this).parent()
			var s = p.attr('value');
			var id = p.data("id");
			$("#listings-search-value").val(s);
			itemlinkAction({'id':id,'itemType':'business'},event);
			return false;
		});
	}

	function on_click_city_link()
	{
		$('.select-city').click(function(event){
			if(event){
				event.preventDefault();
				event.stopImmediatePropagation();
			}
			var s = $(this).parent().attr('value');
			$("#" + field_id ).val(s);
			$("#dropdown-postalcode").submit();
			$('button#setpc').click();
		});
	}
}

function display($,newData,acResultsId,acResultsDiv,acSearchField,city)
{
	// update the results div
	acResultsDiv.html(newData);
	acResultsDiv.css("display","block");
	var divs = acResultsDiv.find('li[id^="cell-"]').not('.disabled');
	// on mouse over clean previous selected and set a new one
	var text = "";
	divs.click( function() 
	{
		console.log(this.id);
		if(this.className != "disabled")
		{
			if(city == "true")
			{
				var pc = this.id.split("-");
				console.log(pc[2]);
				acSearchField.val(pc[2]);
				if($('#logo-location').length > 0)
				{
					var $li = $('#logo-location').closest('li');
					$(document.body).off('click');
					if($li.find('div#update-current-pc').length > 0)
					{
						$('#globe-dropdown').append($('#update-current-pc'));
					}
				}
			}
			else	
			{
				console.log($(this).html());
				text = $(this).find('a').html();
				var $searchFields = null;
				if(acSearchField.attr('id').indexOf("listings-search-value")>=0)
				{
					$searchFields = $('[id*="listings-search-value"]');
				}

				if(text.indexOf("<") >= 0)
					$searchFields.val(text.substring(0,text.indexOf("<")).replace(/&amp;/g, 'and'));
				else
					$searchFields.val($(this).text().replace(/&amp;/g, 'and'));
			}
			this.className = "selected";
		}
		clearAutoComplete(acResultsDiv);
		acSearchField.closest('form').submit();
	});	
}
// clear auto complete box
function clearAutoComplete(acResultsDiv)
{
	acResultsDiv.html('');
	acResultsDiv.css("display","none");
}

function getName(url) {
	var arr=url.split("/");
	return arr[1];
}
