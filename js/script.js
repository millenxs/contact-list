const formulario = document.querySelector("form");
const ulPessoas = document.querySelector('ul');
const campoPesquisa = document.querySelector('#pesquisar');

let lista = localStorage.getItem("minhaLista");

if(lista){
    lista = JSON.parse(lista);
} else {
    lista = [];
}

formulario.addEventListener("submit", function(e){
    e.preventDefault(); //não faz o comportamento padrão do formulario

    let novaPessoa = new Object();
    novaPessoa.id = this.id.value || window.uuidv4();
    novaPessoa.nome = this.nome.value;
    novaPessoa.telefone = this.telefone.value;

    const index = lista.findIndex(pessoa => pessoa.id === novaPessoa.id);
    if(index >= 0){
        lista[index] = novaPessoa;
    } else {
        lista.push(novaPessoa);
    }

    this.reset();

    localStorage.setItem("minhaLista", JSON.stringify(lista));
    listar();
});

function listar(filtro=''){
    ulPessoas.innerHTML = "";
    lista.forEach((item) => {
        if(item.nome.toUpperCase().indexOf(filtro.toUpperCase()) >= 0 || item.telefone.toUpperCase().indexOf(filtro.toUpperCase()) >= 0 || item.id.toString().indexOf(filtro) >= 0 || filtro == ''){
            let linha = document.createElement('li');

            let excluirBtn = document.createElement('button');
            excluirBtn.innerHTML = '<i class="fas fa-trash"></i>';
			excluirBtn.classList.add('btn', 'btn-excluir');
            excluirBtn.addEventListener('click', function() {
                excluir(item.id);
            });

            let editarBtn = document.createElement('button');
            editarBtn.innerHTML = '<i class="fas fa-edit"></i>';
			editarBtn.classList.add('btn', 'btn-editar');
            editarBtn.addEventListener('click', function() {
                editar(item.id);
            });

            
            // Atualiza o conteúdo da linha
            linha.innerHTML = `
			<div class="info">Nome: ${item.nome}</div>
			<div class="info">Telefone: ${item.telefone}</div>
            `;

            linha.appendChild(excluirBtn);
            linha.appendChild(editarBtn);

            ulPessoas.appendChild(linha);
        }
    });
}

function aplicarFiltro() {
    const filtro = campoPesquisa.value; // Captura o valor do campo de pesquisa
    listar(filtro); // Aplica o filtro ao listar
}

campoPesquisa.addEventListener('input', aplicarFiltro); // Adiciona o evento para atualizar a lista quando o campo de pesquisa mudar


window.excluir = function(id){
    formulario.reset();
    lista = lista.filter(pessoa => pessoa.id !== id);
    localStorage.setItem("minhaLista", JSON.stringify(lista));
    listar();
}

window.editar = function (id){
    const pessoa = lista.find(pessoa => pessoa.id === id);
    formulario.id.value = pessoa.id;
    formulario.nome.value = pessoa.nome;
    formulario.telefone.value = pessoa.telefone;
}

// Chama a função listar para exibir a lista ao carregar a página
listar();
