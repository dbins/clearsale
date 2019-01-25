var soap = require('soap');
var soap2 = require('strong-soap').soap;
//https://loopback.io/doc/en/lb3/Strong-soap.html
var moment = require('moment');
var ip = require('ip');
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');


//https://github.com/vpulim/node-soap
//Homologação
//Web Service:
//https://homologacao.clearsale.com.br/integracaov2/Service.asmx
//https://homologacao.clearsale.com.br/integracaov2/ExtendedService.asmx
//*Para o método UpdateOrderStatus e setOrderListAsReturned, deve ser utilizado o ExtendedService. Para todos os outros deve ser utilizado o Service.asmx.

//Aplicação:
//https://aplicacao.homologacao.clearsale.com.br/Login.aspx
//Produção
//Web Service:
//https://integracao.clearsale.com.br/service.asmx
//https://integracao.clearsale.com.br/ExtendedService.asmx

//*Para o método UpdateOrderStatus e setOrderListAsReturned, deve ser utilizado o ExtendedService. Para todos os outros deve ser utilizado o Service.asmx.
//Aplicação:
//https://aplicacao.clearsale.com.br/Login.aspx



var clearSaleAPI = function () {
	this.url = "http://homologacao.clearsale.com.br/integracaov2/service.asmx?WSDL";
	this.url2 = "https://homologacao.clearsale.com.br/integracaov2/ExtendedService.asmx";
	this.entityCode = "A1232877-9D20-4281-B81C-9C9339BA2B10";
};

//Os campos comentados nao sao obrigatorios

//Codigos de erro que podem ocorrer
//codigo - descricao - reenviar (s/n)
//00 - Transação Concluída - N
//01 - Usuário Inexistente - N
//02 - Erro na validação do XML - S
//03 - Erro ao transformar XML - S
//04 - Erro Inesperado - S
//05 - Pedido já enviado ou não está em reanalise - S
//06 - Erro no Plugin de Entrada - S
//07 - Erro no Plugin de Saída - N

clearSaleAPI.prototype.sendOrders = function(dadosCliente, dadosCompra, fingerprint, dados_pedido){
	var resposta = "";
	
	//Tipos de Telefone
	//0 - Não definido
	//1 - Residencial
	//2 - Comercial
	//3 - Recados
	//4 - Cobrança
	//5 - Temporário
	//6 - Celular
	
	var objetoSinglePhone = {
		"Type":"6", //Tipo de Telefone (Lista de Tipo de Telefone)
		"DDI":"55", //DDI do Telefone
		"DDD": dadosCliente.ddd, //DDD do Telefone
		"Number": dadosCliente.telefone, //Número do Telefone
		"Extension":"" //Ramal do Telefone
	};
	
	var objetoPhone = {
		"Phone": objetoSinglePhone		
	};
	
	var objetoAddressPayment = {
		"Street":dadosCliente.endereco, //Nome do logradouro (Sem abreviações)
		"Number":dadosCliente.numero, //Número do Endereço
		"Comp":dadosCliente.complemento, //Complemento do Endereço (Sem abreviações)
		"County":dadosCliente.bairro, //Bairro do Endereço (Sem abreviações)
		"City":dadosCliente.cidade, //Cidade do Endereço (Sem abreviações)
		"State":dadosCliente.estado, //Sigla do Estado do Endereço - UF
		"Country":"BRASIL", //Pais do Endereço (Sem abreviações)
		"ZipCode":dadosCliente.cep, //CEP do Endereço
		"Reference":"", //Referência do Endereço (Sem abreviações)
	};
	
	var objetoAddress = {
		"Street":dadosCliente.endereco, //Nome do logradouro (Sem abreviações)
		"Number":dadosCliente.numero, //Número do Endereço
		"Comp":dadosCliente.complemento, //Complemento do Endereço (Sem abreviações)
		"County":dadosCliente.bairro, //Bairro do Endereço (Sem abreviações)
		"City":dadosCliente.cidade, //Cidade do Endereço (Sem abreviações)
		"State":dadosCliente.estado, //Sigla do Estado do Endereço - UF
		"Country":"BRASIL", //Pais do Endereço (Sem abreviações)
		"ZipCode":dadosCliente.cep, //CEP do Endereço
		"Reference":"", //Referência do Endereço (Sem abreviações)
	};
	
	var tmp_gender = "";
	if (dadosCliente.genero=="MALE"){
		tmp_gender = "M";
	} else {
		tmp_gender = "F";
	}
	
	var objetoBillingData = {
		"ID": "1", //Código do cliente
		"Type": "1", //Pessoa Física ou Jurídica (Lista de Tipos de Pessoa)
		"LegalDocument1": dadosCliente.CPF, //CPF ou CNPJ
		//"LegalDocument2": "", //RG ou Inscrição Estadual
		"Name": dadosCliente.nome, //Nome do cliente
		"BirthDate": moment(dadosCliente.aniversario).utc().toISOString(), //Data de Nascimento (yyyy-mm-ddThh:mm:ss)
		"Email": dadosCliente.email, //Email
		"Gender": tmp_gender, //Sexo (Lista de Tipo de Sexo)
		"Address": objetoAddress,
		"Phones" : objetoPhone
	};
	
	//Tipo de Pessoa
	//1 - Pessoa Física
	//2 - Pessoa Jurídica
	
	//Tipo de Sexo
	//M - Masculino
	//F - Feminino
	
	//Tipo de Identificação
	//1 - CPF
	//2 - CNPJ
	//3 - RG
	//4 - IE
	//5 - Passaporte
	//6 - CTPS
	//7 - Título Eleitor
		
	
	var objetoShippingData = {
		"ID": "1", //Código do cliente
		"Type": "1", //Pessoa Física ou Jurídica (Lista de Tipos de Pessoa)
		"LegalDocument1": dadosCliente.CPF, //CPF ou CNPJ
		//"LegalDocument2": "", //RG ou Inscrição Estadual
		"Name": dadosCliente.nome, //Nome do cliente
		"BirthDate": moment(dadosCliente.aniversario).utc().toISOString(), //Data de Nascimento (yyyy-mm-ddThh:mm:ss)
		"Email": dadosCliente.email, //
		"Gender": tmp_gender, //Sexo (Lista de Tipo de Sexo)
		"Address": objetoAddress,
		"Phones" : objetoPhone
	};
	
	
	
	//Tipo de Pagamento
	//1 - Cartão de Crédito
	//2 -  Boleto Bancário
	//3 -  Débito Bancário
	//4 -  Débito Bancário – Dinheiro
	//5 -  Débito Bancário – Cheque
	//6 -  Transferência Bancária
	//7 -  Sedex a Cobrar
	//8 -  Cheque
	//9 -  Dinheiro
	//10 - Financiamento
	//11 - Fatura
	//12 - Cupom
	//13 - Multicheque
	//14 - Outros
	
	//OBS: NAO VAMOS MANDAR INFORMACOES SOBRE O CARTAO
	//Bandeira Cartão
	//1 - Diners
	//2 - MasterCard
	//3 - Visa
	//4 - Outros
	//5 - American Express
	//6 - HiperCard
	//7 - Aura
	
	var objetoDetalhesPagamento = {
		//"Sequential": "", //Sequência de realização do pagamento
		"Date": moment.utc().toISOString(), //Data do pagamento (yyyy-mm-ddThh:mm:ss)
		"Amount": "10", //Valor cobrado neste pagamento
		"PaymentTypeID": "2", //Tipo de Pagamento (Lista de Tipos de Pagamento) (PODE SER 2 PARA BOLETO E 1 PARA CARTAO)
		//"QtyInstallments": "", //Quantidade de Parcelas
		//"Interest": "", //Taxa de Juros
		//"InterestValue": "", //Valor dos Juros
		//"CardNumber": "", //Número do Cartão
		//"CardBin": "", //Número do BIN do Cartão
		//"CardEndNumber": "", //4 últimos digitos do número de cartão
		//"CardType": "", //Bandeira do Cartão (Lista de Bandeiras de Cartão)
		//"CardExpirationDate": "", //Data da Expiração
		//"Name": "", //Nome de Cobrança
		//"LegalDocument": "", //Documento da Pessoa de Cobrança
		"Address": objetoAddressPayment,
		//"Nsu": "", //Número identificador único de uma transação de cartão
		"Currency": "986" //Código da moeda - (Tabela de ID da Moeda) BRL - 986 (PAGINA 36 MANUAL INTEGRACAO)
	};	
	
	var objetoPayment = {
		"Payment": objetoDetalhesPagamento
	};
	
	var objetoItems = [];
	
	//Gerar 1 para cada item do carrinho!
	for (index = 0; index < dadosCompra.length; ++index) {
		var objetoItem = {
			"ID": dadosCompra[index].slug, //Código do Produto
			"Name": dadosCompra[index].product, //Nome do Produto
			"ItemValue": dadosCompra[index].total_price, //Valor Unitário
			"Qty": dadosCompra[index].quantity, //Quantidade
			//"Gift": "", //Presente
			//"CategoryID": "", //Código da Categoria do Produto
			//"CategoryName": "", //Nome da Categoria do Produto
		};
		//objetoItems.push({"Item": objetoItem});
		objetoItems.push(objetoItem);
	}
	
	var objetoItemNOVO = {"Item": objetoItems};
	
	var objetoPurchaseInformationData = {
		"LastDateInsertedMail": moment.utc().toISOString(), //Data da última alteração do e-mail. (yyyy-mm-ddThh:mm:ss)
		"LastDateChangePassword":moment.utc().toISOString(), //Data da última alteração da senha.(yyyy-mm-ddThh:mm:ss)
		"LastDateChangePhone":moment.utc().toISOString(), //Data da última alteração do telefone.
		"LastDateChangeMobilePhone":moment.utc().toISOString(), //Data da última alteração do telefone móvel.
		"LastDateInsertedAddress":moment.utc().toISOString(), //Data da última alteração do endereço
		"PurchaseLogged":"1", //Compra logado (Quando sim, enviar 1, caso contrário enviar 0).
		"PurchaseLoggedWithFacebook": "0" //Compra logado através do facebook. (Quando sim, enviar 1, caso contrário 
	};
	
	//Tipos de entrega
	//0 - Outros
	//1 - Normal
	//2 - Garantida
	//3 - ExpressaBR
	//4  - ExpressaSP
	//5  - Alta
	//6  - Econômica
	//7  - Agendada
	//8  - Extra Rápida
	//9  - Impresso
	//10 - Aplicativo
	//11 - Correio
	//12 - Motoboy
	//13 - Retirada Bilheteria
	//14 - Retirada Loja Parceira
	//15 - Cartão de Crédito Ingresso
	//16 - Retirada Loja
	
	//Lista de Status (de entrada)*
	//*Atenção: Ao enviar o status no pedido é importante ressaltar que este pedido será incluso como histórico e não será analisado pela ClearSale. Somente os pedidos que forem enviados com o status 0 – NVO ou que não tiverem o status definido que serão analisados pelo ClearSale.
	
	//0 - Novo (será analisado pelo ClearSale)
	//9 - Aprovado (irá ao ClearSale já aprovado e não será analisado)
	//41 - Cancelado pelo cliente (irá ao ClearSale já cancelado e não será analisado)
	//45 - Reprovado (irá ao ClearSale já reprovado e não será analisado)
	
	//Tipos de Listas
	//NAO VAMOS UTILIZAR
	//1 - Lista Não Cadastrada
	//2 - Lista de Chá de Bebê
	//3 - Lista de Casamento
	//4 - Lista de Desejos
	//5 - Lista de Aniversário
	//6 - Lista de Chá Bar / Chá de Panela
	
	
	var objetoSessionID = {
		"SessionID": fingerprint
	};
	var ObjetoOrder = {
		//Os campos comentados nao sao obrigatorios
		"FingerPrint": objetoSessionID, //Identificador único da sessão do usuário
		"ID": dados_pedido.numero_pedido, //Código do pedido
		"Date": moment.utc().toISOString(), //Data do pedido (yyyy-mm-ddThh:mm:ss)
		"Email": dadosCliente.email, //Email do pedido
		"B2B_B2C": "B2C", //Tipo do ecommerce
		//"ShippingPrice": "", //Valor do Frete

		//Creio que estes dois devem ter o mesmo valor	
		"TotalItems": "10", //Valor do Itens
		"TotalOrder": "10", //Valor Total do Pedido

		"QtyInstallments": "1", //Quantidade de Parcelas
		//"DeliveryTimeCD": "", //Prazo de Entrega
		//"QtyItems": "", //	Quantidade de Itens
		//"QtyPaymentTypes": "", //Quantidade de Pagamentos
		
		"IP": ip.address(), //IP do Pedido
		//"ShippingType": "", // ID do Tipo de entrega (Lista ID Tipo Entrega)
		//"Gift": "", // Identifica se o pedido é presente
		//"GiftMessage": "", // Mensagem de Presente
		//"Obs": "", //Observação do Pedido
		
		"Status": "0", //Status do Pedido (na entrada) (Lista de status (de entrada)
		//"Reanalise": "", //Marcação que indica se o pedido será reanalisado ou não (1 caso for, 0 caso não)
		//"SlaCustom": "", //SLA de análise
		"Origin": "ON STORE", //Origem do Pedido
		//"ReservationDate": "", //Data de reserva de Voo (yyyy-mm-ddThh:mm:ss)
		//"Country": "", //Nome do País (somente para pedidos de análise internacional)
		//"Nationality": "", //Nome da Nacionalidade(somente para pedidos de análise internacional)
		//"Product": "", //ID do produto (Lista de Produtos) //N (somente para pedidos de análise internacional ou clientes que utilizam mais produtos da ClearSale)
		//"ListTypeID": "", //ID do tipo de lista (Lista de Tipos de Lista) N (somente para clientes que possuem listas específicas)
		//"ListID": "", //ID da lista na loja
		"BillingData" : objetoBillingData,
		"ShippingData": objetoShippingData,
		"Payments": objetoPayment,
		"Items": objetoItemNOVO,
		"PurchaseInformationData": objetoPurchaseInformationData
		
		//As seções Passangers e Connections somente são utilizadas em empresas de PASSAGENS AÉREAS, caso não necessite utilizar esse metodos, favor omitir no XML.
		//Nao foram inseridos os nodes referentes a informacoes de hotel
	};
	
	var ObjetoOrders = {"Order": ObjetoOrder};
	var objetoCompras = {"Orders": ObjetoOrders};
	var dados = {"ClearSale": objetoCompras};
	//console.log(dados);
	
	var xmlValues = new xml2js.Builder({headless : true});
	convertedObjects = xmlValues.buildObject(dados);
	var tmp_xml = convertedObjects;
	
	var args = {
		"entityCode": this.entityCode,
		"xml": tmp_xml
	}
	
	var soapOptions = {
		forceSoap12Headers: true
		//connection: 'keep-alive',
		///suppressStack: true,
		//returnFault: false
	};
	
	//var soapHeaders = {
	//	'wsa:Action': 'https://homologacao.clearsale.com.br/integracaov2/Service.asmx?op=SendOrders',
	//	'wsa:To': 'https://homologacao.clearsale.com.br/integracaov2/Service.asmx'
	//};
	
	soap2.createClient(this.url, soapOptions, function(err, client) {
		//console.log(client);
		if (err){
			console.log('erro ao criar cliente');
		}	
		// client.addSoapHeader(soapHeaders);
		//client.setSecurity(new soap.BasicAuthSecurity('username', 'password'));
		//console.log(client);
    //client.addHttpHeader('Content-Type', 'text/xml');
	client.SendOrders(args, function(err, result, body,soapHeader) {
		//Validar o XML gerado
		//console.log('body');
		//console.log(body);
		//console.log(client.lastRequest);
		//console.log(client.lastResponse);
		if (err){
			//console.log(err);
			console.log('erro 1');
			console.log(err.code);
			//console.log(err.body);
			console.log(err.message);
			console.log(err.stack);
			//console.log(err.response);
			//console.log(err.body);
			//console.log(soapHeader)
			//return;
			//console.log(err);
			return;
		}
		//client.describe();
		console.log('sucesso 1');
		//console.log(client.lastResponse);
        //console.log(result);
		//console.log(result);
		
		//StatusCode de retorno	
		//Código Descrição Reenviar
		//00 Transação Concluída N
		//01 Usuário Inexistente N
		//02 Erro na validação do XML S
		//03 Erro ao transformar XML S
		//04 Erro Inesperado S
		//05 Pedido já enviado ou não está em reanalise S
		//06 Erro no Plugin de Entrada S
		//07 Erro no Plugin de Saída N
		
		//convertendo a string XML em JSON
		parseString(result.SendOrdersResult, function (err, result) {
			console.log(result);
			//var resultados = JSON.stringify(result);
			var resultados = result;
			
			//Esses dados sao do PACOTE, que pode ter de 1 a 10 transacoes
			console.log(resultados.PackageStatus.TransactionID[0]);  //IMPORTANTE
			console.log(resultados.PackageStatus.StatusCode[0]); //IMPORTANTE
			console.log(resultados.PackageStatus.Message[0]);
			//Reenviar quando o StatusCode for 2, 3, 4, 5 e 6
			//Pegar o ID do pacote de transacao na ClearSale
			
			
			
			//Consultar o retorno 
			//A consulta do retorno de status deve ser realizada para os pedidos que foram integrados no ClearSale, através do método SendOrders, e tiverem o status informado na TAG <Status> do XML de retorno como AMA (Análise Manual) ou NVO (Novo).
			
			//Status da Compra
			//APA - (Aprovação Automática) – Pedido foi aprovado automaticamente segundo parâmetros definidos na regra de aprovação automática.
			//APM - (Aprovação Manual) – Pedido aprovado manualmente por tomada de decisão de um analista.
			//RPM - (Reprovado Sem Suspeita) – Pedido Reprovado sem Suspeita por falta de contato com o cliente dentro do período acordado e/ou políticas restritivas de CPF (Irregular, SUS ou Cancelados).
			//AMA - (Análise manual) – Pedido está em fila para análise
			//ERR - (Erro) - Ocorreu um erro na integração do pedido, sendo necessário analisar um possível erro no XML enviado e após a correção reenvia-lo.
			//NVO - (Novo) – Pedido importado e não classificado Score pela analisadora (processo que roda o Score de cada pedido).
			//SUS - (Suspensão Manual) – Pedido Suspenso por suspeita de fraude baseado no contato com o “cliente” ou ainda na base ClearSale.
			//CAN - (Cancelado pelo Cliente) – Cancelado por solicitação do cliente ou duplicidade do pedido.
			//FRD - (Fraude Confirmada) – Pedido imputado como Fraude Confirmada por contato com a administradora de cartão e/ou contato com titular do cartão ou CPF do cadastro que desconhecem a compra
			
			//Se ocorrer algum erro este campo nao vai existir
			if (resultados.PackageStatus.Orders){
				var orders = resultados.PackageStatus.Orders;
				orders.forEach(function(order) { 
						console.log(order);
						var tmp_order = order.Order;
						tmp_order.forEach(function(item) { 
							console.log(item);
							console.log(item.ID[0]); //ID DA TRANSACAO EM NOSSO SISTEMA
							console.log(item.Status[0]);  //STATUS NO SISTEMA CLEARSALE
							console.log(item.Score[0]); 
					});
				});
			}
			
		});
		
		
		
		});
		
		client.on('response', function(envelope, message) {
			console.log('testando...');
			//console.log(envelope);
			//console.log(message);
			console.log(message.headers);
		});
		
	});
}


//Este método é de uso obrigatório, utilizado para recuperar os status dos pedidos/propostas que ainda não foram processados. O método retorna os últimos 500 pedidos/propostas que foram finalizados e ainda não foram processados.
clearSaleAPI.prototype.GetReturnAnalysis = function(){
	var soapOptions = {
		forceSoap12Headers: true,
		connection: 'keep-alive',
		suppressStack: true,
		returnFault: true
	};
	var args = {
		"entityCode": this.entityCode,
	}
	
	console.log(args);
	soap.createClient(this.url, soapOptions,function(err, client) {
	client.GetReturnAnalysis(args, function(err, result) {
		console.log(client.lastRequest);
		if (err){
			console.log('erro');
			//console.log(err);
		}
		console.log('sucesso');
        console.log(result);
		
		});
	});
}

//Após o processamento do pedido/proposta, deve ser informado a ClearSale o código do pedido/proposta através do método SetOrderAsReturned, visando que esse pedido/proposta não retorne mais no método GetReturnAnalysis, afinal ele já foi processado.
clearSaleAPI.prototype.SetOrderAsReturned = function(transacao){
	var args = {
		"entityCode": this.entityCode,
		"orderID":transacao
	}
	
	soap.createClient(this.url, function(err, client) {
    client.SetOrderAsReturned(args, function(err, result) {
		if (err){
			console.log('erro');
			console.log(err);
		}
		console.log('sucesso');
        console.log(result);
		
		});
	});
}

//Este método tem o mesmo comportamento do SetOrderAsReturned, porém, aceita uma lista de até 500 pedidos/propostas para serem informados como processados (não retornando mais no método GetReturnAnalysis).
clearSaleAPI.prototype.SetOrderListAsReturned = function(xml){
	
	//O xml deve ter o seguinte formato:
	//<?xml version="1.0" encoding="utf-16"?>
	//<ArrayOfOrder>
	//<Order>
	//<ID>465465</ID>
	//</Order>
	//(....)
	//</ArrayOfOrder>
	
	var args = {
		"entityCode": this.entityCode,
		"xml":xml
	}
	
	soap.createClient(this.url, function(err, client) {
    client.SetOrderListAsReturned(args, function(err, result) {
		if (err){
			console.log('erro');
			console.log(err);
		}
		console.log('sucesso');
        console.log(result);
		
		});
	});
}


//Este método é de uso opcional, utilizado para recuperar o status atual dos pedidos no ClearSale, enviados em um pacote de pedidos. Sendo assim, será possível recuperar o status de todos os pedidos de um determinado pacote através do TransactionID.
clearSaleAPI.prototype.GetPackageStatus = function(packageID){
	
	var args = {
		"entityCode": this.entityCode,
		"packageID":packageID
	}
	
	soap.createClient(this.url, function(err, client) {
    client.GetPackageStatus(args, function(err, result) {
		if (err){
			console.log('erro');
			console.log(err);
		}
		console.log('sucesso');
        console.log(result);
		
		});
	});
}

//Este método é de uso opcional, utilizado para recuperar o status atual dos pedidos no Clear Sale passando pedido a pedido.
clearSaleAPI.prototype.GetOrderStatus = function(orderID){
	var args = {
		"entityCode": this.entityCode,
		"orderID":orderID
	}
	soap.createClient(this.url, function(err, client) {
		client.GetOrderStatus(args, function(err, result) {
			if (err){
				console.log('erro');
				console.log(err);
			}
			console.log('sucesso');
			//console.log(result);
			
			//convertendo a string XML em JSON
			parseString(result.GetOrderStatusResult, function (err, result) {
				console.dir(JSON.stringify(result));
			});
		
		});
	});
}

//Este método é utilizado para recuperar o status atual dos pedidos no Clear Sale passando uma lista de pedidos num formato XML.
clearSaleAPI.prototype.GetOrderSStatus = function(xml){
	//Xml: Xml no formato abaixo.
	//<ClearSale>
	//<Orders>
	//<Order>
	//<ID></ID>
	//</Order>
	//</Orders>
	//</ClearSale>
	
	var args = {
		"entityCode": this.entityCode,
		"xml":xml
	}

	soap.createClient(this.url, function(err, client) {
    client.GetOrderSStatus(args, function(err, result) {
		if (err){
			console.log('erro');
			console.log(err);
		}
		console.log('sucesso');
        console.log(result);
		
		});
	});
}

//Este método é utilizado para recuperar os comentários dos analistas inclusos nos pedidos.
clearSaleAPI.prototype.GetAnalystComments = function(order){
	//getAll: No parâmetro getAll o valor que deve ser inserido será : True ou False.
	//True quando desejar retornar todos os comentários inseridos no pedido.
	//False quando desejar retornar apenas o último comentário inserido no pedido.
	
	var args = {
		"entityCode": this.entityCode,
		"orderID":order,
		"getAll": true
	}
	
	soap.createClient(this.url, function(err, client) {
    client.GetAnalystComments(args, function(err, result) {
		if (err){
			console.log('erro');
			console.log(err);
		}
		console.log('sucesso');
        console.log(result);
		
		});
	});
}

//4.7 WebHook
//LINK DE CALLBACK - VER PAGINA 28 DO MANUAL DE INTEGRACAO

//O método UpdateOrderStatus será utilizado para alterar/atualizar o status do pedido/proposta na ClearSale.
//É de suma importância que a ClearSale seja informada sobre o que aconteceu com o pedido/proposta.

clearSaleAPI.prototype.UpdateOrderStatus = function(orderId, newStatusId, obs){
	//newStatusId: Código do novo status do pedido/proposta, conforme tabela ClearSale abaixo.
	//26 PAGAMENTO APROVADO
	//27 PAGAMENTO REPROVADO
	//obs: Observação do novo status do pedido/proposta, este campo é opcional e tem como tamanho máximo 50 caracteres
	
	var args = {
		"entityCode": this.entityCode,
		"orderID":orderId,
		"newStatusId": newStatusId,
		"obs":obs
	}
	
	
	soap.createClient(this.url2, function(err, client) {
    client.UpdateOrderStatus(args, function(err, result) {
		if (err){
			console.log('erro');
			console.log(err);
		}
		console.log('sucesso');
        console.log(result);
		
		});
	});
}

//O método OrderChargeBack será utilizado para marcar um pedido já integrado e com análise concluída, como chargeback.
clearSaleAPI.prototype.OrderChargeBack = function(Conteudo, Obs){
	//Conteudo: Xml no formato abaixo.
	//<ClearSale>
	//<Orders>
	//<Order>
	//<ID></ID>
	//</Order>
	//</Orders>
	//</ClearSale>
	//Obs: Observações adicionais, este campo é opcional e tem como tamanho máximo 50 caracteres.
	
	var args = {
		"entityCode": this.entityCode,
		"Xml":Conteudo,
		"Note": Obs,
	}

	soap.UpdateOrderStatus(this.url, function(err, client) {
    client.GetAnalystComments(this.entityCode, Conteudo, Obs, function(err, result) {
		if (err){
			console.log('erro');
			console.log(err);
		}
		console.log('sucesso');
        console.log(result);
		
		});
	});
}


	
module.exports = clearSaleAPI;
