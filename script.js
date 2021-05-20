var fileInput = document.getElementById('fileInput');
var fileDisplayArea = document.getElementById('fileDisplayArea');
var tabela = document.querySelector(".table tbody");
var tmplSource = document.getElementById("tmplLinha").innerHTML;
var tmplHandle = Handlebars.compile(tmplSource);
const operacao = [];
const cliente = [];
const valor = [];
const resumo = [];

fileInput.addEventListener('change', function(e) {
  var file = fileInput.files[0];
  var textType = /text.*/;

  if (file.type.match(textType)) {
    var reader = new FileReader();



    reader.onload = function(e) {
      var content = reader.result;
      const trata = content.split('HISTORICO - 0473  DEVOL.CONTAB.CONVENI');
      const lista =  trata[trata.length -1].split('\n');
      const contem = n =>regexIndexOf(n, "^(02100)", 0) > -1
      const descricao = lista.filter(contem);

      console.log(contem);

      for (let i = 0; i < descricao.length; i++) {
        let linha = descricao[i];
        operacao.push(linha.substr(5, 9));
        cliente.push((linha.substr(17, 38)).trim())
      };

      const contem2 = n => n.indexOf('0,00') > -1
      const valores = lista.filter(contem2);

      for (let i = 0; i < valores.length; i++) {
        let linha2 = valores[i];
        linha2 = (linha2.substr(32, 19)).trim();
        valor.push(linha2);
      };

      for (let i = 0; i < operacao.length; i++) {
        resumo.push({
          operacao: operacao[i],
          nome: cliente[i],
          valor: valor[i]
        });
      }

      var total = valor.reduce((soma, valor) => 
        soma + parseFloat(valor.replace('.','').replace(',','.')), 0
      );

      resumo.sort(function(a, b){
        if(a.nome < b.nome) {
          return -1;
        } else {
          return true;
        }
      });

      let contador = 1
      for (var i = 0; i < resumo.length; i++) {
        var pessoa = {};
        pessoa.NumeroOperacao = resumo[i].operacao;
        pessoa.Cliente = resumo[i].nome;
        pessoa.Valor = resumo[i].valor;
        pessoa.NumeroControle = "cont" + contador
        // preparando fragmento HTML.
        contador++
        var linha = {};
        linha.template = document.createElement("template");;  
        linha.template.innerHTML = tmplHandle(pessoa)
        linha.content = document.importNode(linha.template.content, true);
      
        // inserindo linha na tabela.
        tabela.appendChild(linha.content);
      }
    }

  reader.readAsText(file);	
  } else {
    fileDisplayArea.innerText = "File not supported!"
  }
});

function copiarId(botao) {
  const elemento = botao.id;
  let inputTest = document.createElement("input");
  inputTest.value = elemento;
  document.body.appendChild(inputTest);
  inputTest.select();
  document.execCommand('copy');
  document.body.removeChild(inputTest);
};

function colaconta(botao) {
  const elemento = botao.value;
  let cola = document.getElementById(elemento);
  cola.value = '';
  navigator.clipboard.readText()
  .then((text)=>{
    cola.value = text;
  });
};


function regexIndexOf(string, regex, startpos) {
  var indexOf = string.substring(startpos || 0).search(regex);
  return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};
