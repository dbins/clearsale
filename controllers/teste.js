var servicoClearSale = require('./../servicos/clearsale.js');

module.exports = function (app){
	app.get("/", function(req,res){
		var api = new servicoClearSale();
		
		var cliente = {};
		cliente.CPF = "44444444444";
		cliente.email = "bins.br@gmail.com";
		cliente.id = "0";
		cliente.nome = "DANIEL";
		cliente.sobrenome = "BINS";
		cliente.genero = "MALE";
		cliente.aniversario = "1970-04-01";
		cliente.ddd = "11";
		cliente.telefone = "911111111";
		cliente.endereco = "RUA CASTRO ALVES";
		cliente.bairro = "ACLIMACAO";
		cliente.cidade = "SAO PAULO";
		cliente.estado = "SP";
		cliente.pais = "BR";
		cliente.numero = "1";
		cliente.cep = "01523001";
		cliente.complemento = "";
		
		var dadosCompra = [];
		var tmp_item = {};
		tmp_item.mall =  "NAO TEM NO ENDPOINT DE SHOPPINGS";
		tmp_item.store = "TESTE";
		tmp_item.product ="BOLA QUADRADA";
		tmp_item.quantity = "1";
		tmp_item.unity_price ="100";
		tmp_item.total_price = "100";
		dadosCompra.push(tmp_item);
		
		
		api.sendOrders(cliente, dadosCompra);
		res.render("teste/index");
	});
	
}
