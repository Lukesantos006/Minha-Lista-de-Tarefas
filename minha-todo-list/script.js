// Adiciona evento para carregar tarefas quando a página abre
window.onload = function () {
  carregarTarefas(); // Carrega as tarefas guardadas no localStorage
};

// Função para adicionar uma nova tarefa
function adicionarTarefa() {
  const inputTexto = document.getElementById("novaTarefa"); // Vai buscar o texto da tarefa
  const inputData = document.getElementById("dataTarefa"); // Vai buscar a data inserida
  const texto = inputTexto.value.trim(); // Remove espaços do texto
  const data = inputData.value.trim(); // Remove espaços da data
  const inputPrioridade = document.getElementById("prioridadeTarefa");
  const prioridade = inputPrioridade.value;


  if (texto !== "") { // Verifica se o texto não está vazio
    const tarefas = obterTarefas(); // Vai buscar a lista atual do localStorage
    const novaTarefa = { texto: texto, data: data, prioridade: prioridade, concluida: false }; // Cria um objeto tarefa com texto, data e status, e prioridade
    tarefas.push(novaTarefa); // Adiciona essa nova tarefa ao array
    guardarTarefas(tarefas); // Guarda no localStorage
    mostrarTarefaNoEcrã(novaTarefa); // Mostra a nova tarefa no ecrã
    atualizarContadorPendentes(); // Atualiza o número de tarefas pendentes após adicionar
    filtrarTarefas(); // Aplica o filtro ativo (caso haja)
    inputTexto.value = ""; // Limpa o campo de texto
    inputData.value = ""; // Limpa o campo de data
    inputPrioridade.value = "baixa"; //define o campo de prioridade para baixa
  }
}

// Função para mostrar a tarefa no ecrã
function mostrarTarefaNoEcrã(tarefa) {
  const lista = document.getElementById("listaTarefas"); // Vai buscar a <ul> onde vamos colocar a tarefa
  const li = document.createElement("li"); // Cria um novo item <li> para representar a tarefa

  if (tarefa.prioridade === "alta") { //cor da borda
  li.style.borderLeft = "8px solid red";
} else if (tarefa.prioridade === "media") {
  li.style.borderLeft = "8px solid orange";
} else {
  li.style.borderLeft = "8px solid green";
}

  const spanTexto = document.createElement("span"); // Cria um <span> para conter o texto e a data da tarefa

  // Adiciona o texto e a data (se existir) ao span
  spanTexto.textContent = tarefa.data ? `${tarefa.texto} (até ${tarefa.data})` : tarefa.texto;

  // Se a tarefa estiver concluída, aplica estilo de riscado
  if (tarefa.concluida) {
    spanTexto.style.textDecoration = "line-through"; // Riscado
    spanTexto.style.color = "gray"; // Cor mais clara
  }

  // Cria o botão de concluir
  const botaoConcluir = document.createElement("button"); // Cria um botão
  botaoConcluir.textContent = "✔️"; // Ícone ou texto para concluir

  // Ação ao clicar no botão de concluir
  botaoConcluir.onclick = () => {
    // Alterna entre riscar ou não o texto
    const estaConcluida = spanTexto.style.textDecoration === "line-through";
    spanTexto.style.textDecoration = estaConcluida ? "none" : "line-through"; // Alterna riscado
    spanTexto.style.color = estaConcluida ? "black" : "gray"; // Alterna cor

    guardarTarefasAtualizadas(); // Atualiza o localStorage com o novo estado
    atualizarContadorPendentes(); // Atualiza o contador sempre que uma tarefa é concluída ou desmarcada
    filtrarTarefas(); // Refiltra a lista com base no novo estado da tarefa
  };

  // Cria o botão de remover
  const botaoRemover = document.createElement("button"); // Cria o botão
  botaoRemover.textContent = "🗑️"; // Ícone ou texto para remover

  // Ação ao clicar no botão de remover
  botaoRemover.onclick = () => {
    li.remove(); // Remove a tarefa do ecrã
    guardarTarefasAtualizadas(); // Atualiza o localStorage
    atualizarContadorPendentes(); // Atualiza o número de pendentes após remoção
    filtrarTarefas(); // Aplica novamente o filtro
  };

  // Agrupa os dois botões num contêiner flexível para alinhamento lado a lado
  const botoesContainer = document.createElement("div"); // Cria um <div> para conter os dois botões
  botoesContainer.style.display = "flex"; // Coloca os botões lado a lado (flexível)
  botoesContainer.style.gap = "6px"; // Espaço entre os dois botões
  botoesContainer.style.alignItems = "center"; // Alinha verticalmente ao centro

  botoesContainer.appendChild(botaoConcluir); // Adiciona o botão de concluir ao contêiner
  botoesContainer.appendChild(botaoRemover); // Adiciona o botão de remover ao contêiner

  li.appendChild(spanTexto); // Adiciona o texto da tarefa ao <li>
  li.appendChild(botoesContainer); // Adiciona os botões ao <li>

  lista.appendChild(li); // Finalmente, adiciona o <li> à <ul> no ecrã
}

// Função que busca tarefas no localStorage
function obterTarefas() {
  const dados = localStorage.getItem("tarefas"); // Vai buscar os dados guardados
  return dados ? JSON.parse(dados) : []; // Converte para array ou devolve vazio
}

// Função que guarda todas as tarefas no localStorage
function guardarTarefas(tarefas) {
  localStorage.setItem("tarefas", JSON.stringify(tarefas)); // Converte para texto e guarda
}

// Atualiza localStorage com o que está no ecrã (reconstrói toda a lista)
function guardarTarefasAtualizadas() {
  const tarefas = []; // Cria uma lista vazia onde vamos guardar as tarefas atualizadas

  const itens = document.querySelectorAll("li"); // Seleciona todos os elementos <li> (cada tarefa na lista)

  itens.forEach(li => {
    const span = li.querySelector("span"); // Vai buscar o elemento <span> que contém o texto da tarefa

    const textoCompleto = span.textContent; // Guarda o texto visível da tarefa (pode incluir a data)

    const match = textoCompleto.match(/^(.*?) \(até (.*?)\)$/); // Usa expressão regular para separar o texto da data

    const texto = match ? match[1] : textoCompleto; // Se encontrar, extrai só o texto da tarefa (antes da data)
    const data = match ? match[2] : ""; // Se encontrar, extrai só a data (depois do "até")

    const concluida = span.style.textDecoration === "line-through"; // Verifica se a tarefa está riscada → tarefa concluída

    let prioridade = "baixa"; // valor padrão

    if (li.style.borderLeft.includes("red")) prioridade = "alta";
    else if (li.style.borderLeft.includes("orange")) prioridade = "media";

    tarefas.push({ texto, data, prioridade, concluida }); // Adiciona um objeto com as 4 informações à lista: texto, prioridade data e se está concluída
  });

  guardarTarefas(tarefas); // Guarda a nova lista de tarefas no localStorage para que se mantenha após recarregar a página
}

// Função para remover tarefa específica
function removerTarefa(texto, data) {
  let tarefas = obterTarefas(); // Vai buscar todas
  tarefas = tarefas.filter(t => t.texto !== texto || t.data !== data); // Remove a correspondente
  guardarTarefas(tarefas); // Guarda a lista nova
}

// Carrega todas as tarefas quando a página abre
function carregarTarefas() {
  const tarefas = obterTarefas(); // Vai buscar tarefas guardadas
  tarefas.sort((a, b) => {
  const ordem = { alta: 1, media: 2, baixa: 3 };
  return ordem[a.prioridade] - ordem[b.prioridade];
  }); 
  tarefas.forEach(tarefa => mostrarTarefaNoEcrã(tarefa));// Mostra todas
  atualizarContadorPendentes(); // Conta pendentes ao carregar a lista
  filtrarTarefas(); // Aplica filtro ativo no carregamento
}

// Função para atualizar o número de tarefas pendentes
function atualizarContadorPendentes() {
  const tarefas = document.querySelectorAll('#listaTarefas li'); // Seleciona todas as tarefas na lista
  let pendentes = 0; // Inicializa o contador

  tarefas.forEach(tarefa => {
    const span = tarefa.querySelector('span'); // Vai buscar o texto da tarefa
    if (span && span.style.textDecoration !== "line-through") {
      pendentes++; // Soma se não estiver riscada (não concluída)
    }
  });

  document.getElementById('contadorPendentes').innerText = `Tarefas pendentes: ${pendentes}`; // Atualiza o texto
}

// Função para filtrar tarefas com base no estado (todas, pendentes ou concluídas)
function filtrarTarefas() {
  const filtro = document.getElementById('filtroEstadoTarefas').value; // Obtém o valor selecionado no filtro
  const tarefas = document.querySelectorAll('#listaTarefas li'); // Seleciona todos os <li>

  tarefas.forEach(tarefa => {
    const span = tarefa.querySelector('span'); // Acede ao texto da tarefa
    const estaConcluida = span && span.style.textDecoration === "line-through"; // Verifica se está riscada

    // Decide mostrar ou ocultar com base no filtro selecionado
    if (filtro === 'todas') {
      tarefa.style.display = 'flex'; // Mostra todas
    } else if (filtro === 'pendentes') {
      tarefa.style.display = estaConcluida ? 'none' : 'flex'; // Só mostra não concluídas
    } else if (filtro === 'concluidas') {
      tarefa.style.display = estaConcluida ? 'flex' : 'none'; // Só mostra concluídas
    }
  });
}