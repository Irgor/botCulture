var request  = require('request');
var cheerio = require('cheerio');

//itau;
request('https://www.itaucultural.org.br/secoes/agenda-cultural/?utm_source=GoogleSeach&utm_medium=CPC&utm_campaign=EventoCultural&gclid=Cj0KCQjwoKzsBRC5ARIsAITcwXHSJyixD-M-h0VbUnM751JLKIYSsQEnnuoiovSyfFBpZf_eznNqeRwaAmKiEALw_wcB', function(err, res, body){
	if(err) console.log(err);

	var $ = cheerio.load(body);

	var rs = "[";

	$('.list article').each(function(index){
		var title = $(this).find('.article-content h1 a').text();
		var desc = $(this).find('summary').text();
		var data = $(this).find('.location').text();

		var img = $(this).find('.article-thumbnail a img');


		title = title.replace(/[\\"]/g, '');
		desc = desc.replace(/[\\"]/g, '');
		data = data.replace(/[\\"]/g, '');

		img = $(img).attr('data-src');

		var newDesc = desc.substring(34, desc.length);

		var separado = data.split("onde: ");

		data = separado[0];
		var local = separado[1];

		rs += '{ "nome":"' + title + '",\n"desc":"' + desc + '",\n"data":"' + data + '",\n"img":"' + img + '",\n"local":"' + local + '",\n"localData":""},';
	});


	rs = rs.substr(0, rs.length - 1);
	rs += "]";


	var url = "http://localhost/cultureservice/";


	request.post(url + "cadEvento.php", function(err, res, body){
		console.log(body);
	}).form(rs);

});

 