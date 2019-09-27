var request  = require('request');
var cheerio = require('cheerio');
var utf8 = require('utf8');

//sesc
request("https://www.sescsp.org.br/programacao/ajax/homeView.action", function(err, res, body){
	var rs = "[";
	var $ = cheerio.load(body);
	
	$('#holder_results article').each(function(index) {
		var url = 'https://www.sescsp.org.br';
		var nome = $(this).find('.figure-article form a').attr('href');

		request(url + nome, function(err, res, body){
				var $ = cheerio.load(body);

				//none
				var title  = $('body').find('section.half_content h1').text();
				title = title.split('\t');
				title = title[4];
				title = title.replace("\n\n", "");
				
				//desc
				var desc = $('body').find('article.half_content div.rich_content p').text();
				desc = desc.replace(/[\\"]/g, '');
				desc = desc.replace(/\n/g,'');

				desc = desc.replace(/@/g, 'ARROBA');
				desc = desc.replace(/’/g, '');
				desc = desc.replace(/"/g, '');
				desc = desc.replace(/\n/,' ');
				desc = desc.replace("/.\n", ' ');
				desc = desc.replace(/\n\n/g,'');
				desc = desc.replace(/                /g,'');
				desc = desc.replace(/  /g,'');
				desc = desc.replace(/,/g,' ');
				desc = desc.replace(/-/g, ' ');
				desc = desc.replace(/"."/g, ' ');
				desc = desc.replace(/\t/g, '');
				desc = desc.split(/\n/);
								


				//data
				var data = "";
				var data1;
				$('body').find('section.half_content section.block_content_09').each(function(){
					data += $(this).find('.txt_datas_horarios').text();
					data = data.replace(/,/g,'');
					data = data.replace(/\n/g,'');
					data = data.split('\t');
					data1 = data[0] + data[data.length - 8];
				});
				data = data1;

				//img
				var urlImage = "https://www.sescsp.org.br";
				var img = urlImage + $('body').find('div#content article.half_content img').attr('src');
				
				//local
				var local = "Sesc" + $('body').find('header.programacao_unidades h3 span a').text();
				
				//resultado
				rs += '{ "nome":"' + title + '",\n"desc":"' + desc + '",\n"data":"' + data + '",\n"img":"' + img + '",\n"local":"' + local + '",\n"localData":""},';
				if(index == 9){
					rs = rs.substr(0, rs.length - 1);
					rs += "]";

					var url = "http://localhost/cultureservice/";

					request.post(url + "cadEvento.php", function(err, res, body){
						console.log(body);
					}).form(rs);
				}
		});

	});

});



