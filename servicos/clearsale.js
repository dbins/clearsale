var soap = require('soap');
var moment = require('moment');

var clearSaleAPI = function () {
	this.url = "http://homologacao.clearsale.com.br/integracaov2/service.asmx?WSDL";
	this.entityCode = "A1232877-9D20-4281-B81C-9C9339BA2B10";
};

clearSaleAPI.prototype.sendOrders = function(dadosCliente, dadosCompra){
	var resposta = "";
	
	var objetoSinglePhone = {
		"Type":"", //Tipo de Telefone (Lista de Tipo de Telefone)
		"DDI":"", //DDI do Telefone
		"DDD":"", //DDD do Telefone
		"Number":"", //Número do Telefone
		"Extension":"" //Ramal do Telefone
	};
	
	var objetoPhone = {
		"Phone": objetoSinglePhone		
	};
	
	var objetoAddressPayment = {
		"Street":"", //Nome do logradouro (Sem abreviações)
		"Number":"", //Número do Endereço
		"Comp":"", //Complemento do Endereço (Sem abreviações)
		"County":"", //Bairro do Endereço (Sem abreviações)
		"City":"", //Cidade do Endereço (Sem abreviações)
		"State":"", //Sigla do Estado do Endereço - UF
		"Country":"", //Pais do Endereço (Sem abreviações)
		"ZipCode":"", //CEP do Endereço
		"Reference":"", //Referência do Endereço (Sem abreviações)
	};
	
	var objetoAddress = {
		"Street":"", //Nome do logradouro (Sem abreviações)
		"Number":"", //Número do Endereço
		"Comp":"", //Complemento do Endereço (Sem abreviações)
		"County":"", //Bairro do Endereço (Sem abreviações)
		"City":"", //Cidade do Endereço (Sem abreviações)
		"State":"", //Sigla do Estado do Endereço - UF
		"Country":"", //Pais do Endereço (Sem abreviações)
		"ZipCode":"", //CEP do Endereço
		"Reference":"", //Referência do Endereço (Sem abreviações)
	};
	
	var objetoBillingData = {
		"ID": "", //Código do cliente
		"Type": "", //Pessoa Física ou Jurídica (Lista de Tipos de Pessoa)
		"LegalDocument1": "", //CPF ou CNPJ
		"LegalDocument2": "", //RG ou Inscrição Estadual
		"Name": "", //Nome do cliente
		"BirthDate": "", //Data de Nascimento (yyyy-mm-ddThh:mm:ss)
		"Email": "", //Email
		"Gender": "", //Sexo (Lista de Tipo de Sexo)
		"Address": objetoAddress,
		"Phones" : objetoPhone
	};
	
	var objetoShippingData = {
		"ID": "", //Código do cliente
		"Type": "", //Pessoa Física ou Jurídica (Lista de Tipos de Pessoa)
		"LegalDocument1": "", //CPF ou CNPJ
		"LegalDocument2": "", //RG ou Inscrição Estadual
		"Name": "", //Nome do cliente
		"BirthDate": "", //Data de Nascimento (yyyy-mm-ddThh:mm:ss)
		"Email": "", //
		"Gender": "", //Sexo (Lista de Tipo de Sexo)
		"Address": objetoAddress,
		"Phones" : objetoPhone
	};
	
	var objetoPayment = {
		"Payment": objetoDetalhesPagamento
	};
	
	var objetoDetalhesPagamento = {
		"Sequential": "", //Sequência de realização do pagamento
		"Date": moment.utc().toISOString(), //Data do pagamento (yyyy-mm-ddThh:mm:ss)
		"Amount": "", //Valor cobrado neste pagamento
		"PaymentTypeID": "", //Tipo de Pagamento (Lista de Tipos de Pagamento)
		"QtyInstallments": "", //Quantidade de Parcelas
		"Interest": "", //Taxa de Juros
		"InterestValue": "", //Valor dos Juros
		"CardNumber": "", //Número do Cartão
		"CardBin": "", //Número do BIN do Cartão
		"CardEndNumber": "", //4 últimos digitos do número de cartão
		"CardType": "", //Bandeira do Cartão (Lista de Bandeiras de Cartão)
		"CardExpirationDate": "", //Data da Expiração
		"Name": "", //Nome de Cobrança
		"LegalDocument": "", //Documento da Pessoa de Cobrança
		"Address": objetoAddressPayment,
		"Nsu": "", //Número identificador único de uma transação de cartão
		"Currency": "" //Código da moeda - (Tabela de ID da Moeda)
	};	
	
	var objetoItems = [];
	
	//Gerar 1 para cada item do carrinho!
	var objetoItem = {
		"ID": "", //Código do Produto
		"Name": "", //Nome do Produto
		"ItemValue": "", //Valor Unitário
		"Qty": "", //Quantidade
		"Gift": "", //Presente
		"CategoryID": "", //Código da Categoria do Produto
		"CategoryName": "", //Nome da Categoria do Produto
	};
	objetoItems.push(objetoItem);
	
	var objetoPurchaseInformationData = {
		"LastDateInsertedMail": moment.utc().toISOString(), //Data da última alteração do e-mail. (yyyy-mm-ddThh:mm:ss)
		"LastDateChangePassword":moment.utc().toISOString(), //Data da última alteração da senha.(yyyy-mm-ddThh:mm:ss)
		"LastDateChangePhone":moment.utc().toISOString(), //Data da última alteração do telefone.
		"LastDateChangeMobilePhone":moment.utc().toISOString(), //Data da última alteração do telefone móvel.
		"LastDateInsertedAddress":moment.utc().toISOString(), //Data da última alteração do endereço
		"PurchaseLogged":"1", //Compra logado (Quando sim, enviar 1, caso contrário enviar 0).
		"PurchaseLoggedWithFacebook": "0" //Compra logado através do facebook. (Quando sim, enviar 1, caso contrário 
	};
	
	var ObjetoOrder = {
		"FingerPrint.SessionID": "", //Identificador único da sessão do usuário
		"ID": "", //Código do pedido
		"Date": moment.utc().toISOString(), //Data do pedido (yyyy-mm-ddThh:mm:ss)
		"Email": "", //Email do pedido
		"B2B_B2C": "", //Tipo do ecommerce
		"ShippingPrice": "", //Valor do Frete
		"TotalItems": "", //Valor do Itens
		"TotalOrder": "", //Valor Total do Pedido
		"QtyInstallments": "", //Quantidade de Parcelas
		"DeliveryTimeCD": "", //Prazo de Entrega
		"QtyItems": "", //	Quantidade de Itens
		"QtyPaymentTypes": "", //Quantidade de Pagamentos
		"IP": "", //IP do Pedido
		"ShippingType": "", // ID do Tipo de entrega (Lista ID Tipo Entrega)
		"Gift": "", // Identifica se o pedido é presente
		"GiftMessage": "", // Mensagem de Presente
		"Obs": "", //Observação do Pedido
		"Status": "", //Status do Pedido (na entrada) (Lista de status (de entrada)
		"Reanalise": "", //Marcação que indica se o pedido será reanalisado ou não (1 caso for, 0 caso não)
		"SlaCustom": "", //SLA de análise
		"Origin": "", //Origem do Pedido
		"ReservationDate": "", //Data de reserva de Voo (yyyy-mm-ddThh:mm:ss)
		"Country": "", //Nome do País (somente para pedidos de análise internacional)
		"Nationality": "", //Nome da Nacionalidade(somente para pedidos de análise internacional)
		"Product": "", //ID do produto (Lista de Produtos) //N (somente para pedidos de análise internacional ou clientes que utilizam mais produtos da ClearSale)
		"ListTypeID": "", //ID do tipo de lista (Lista de Tipos de Lista) N (somente para clientes que possuem listas específicas)
		"ListID": "", //ID da lista na loja
		"BillingData" : objetoBillingData,
		"ShippingData": objetoShippingData,
		"Payments": objetoPayment,
		"Items": objetoItems,
		"PurchaseInformationData": objetoPurchaseInformationData
		
		//As seções Passangers e Connections somente são utilizadas em empresas de PASSAGENS AÉREAS, caso não necessite utilizar esse metodos, favor omitir no XML.
		//Nao foram inseridos os nodes referentes a informacoes de hotel
	};
	var objetoCompras = {"Orders": ObjetoOrder};
	var dados = {"ClearSale": objetoCompras};
	console.log(dados);
	soap.createClient(this.url, function(err, client) {
    client.SendOrders(this.entityCode, dados, function(err, result) {
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

