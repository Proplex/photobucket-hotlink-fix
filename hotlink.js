chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
	var headers = details.requestHeaders;

	if( details.url.match(/photobucket/) ){
		var newHeaders = {};
		var refererFound = false;

		refererUrl = details.url;
		if( details.url.match(/albums\/[^\/]+\/([^\/]+)\//) ){
			var user = /albums\/[^\/]+\/([^\/]+)\//.exec(details.url);
			var refererUrl = 'http://photobucket.com/gallery/user/' + user[1] + '/media/';
		}

		for( var i = 0, l = headers.length; i < l; ++i ) {
			if( headers[i].name == 'Referer' ){
				refererFound = true;
				headers[i].value = refererUrl;
			}
		}
		if( !refererFound ){ headers.push( { name: 'Referer', value: refererUrl } ); }
	}

	return {'requestHeaders':headers};
},{urls: [ "<all_urls>" ]},['requestHeaders','blocking']);

chrome.webRequest.onBeforeRequest.addListener(function(details){
	var url = details.url;

	if( url.match(/^.+\.wp\.com\/((?:.+\.)?photobucket\.com\/.+)/) ){
		url = url.replace(/^.+\.wp\.com\/((?:.+\.)?photobucket\.com\/.+)/, 'https://$1');
		return {redirectUrl: url};
	}

	if( url.match(/photobucket/) ){
		var pUrl = new URL(url);
		if( !pUrl.searchParams.get('hotlinkfix') ){
			var date = new Date().getTime();
			pUrl.searchParams.set('hotlinkfix', date);
		}

		return {'redirectUrl': pUrl.href};
	}
},{urls: [ "<all_urls>" ]},['blocking']);
