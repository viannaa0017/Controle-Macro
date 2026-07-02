const API = 'https://controle-macro-api.onrender.com';

/* ==============================S======= */
/* VARIÁVEIS */
/* ===================================== */

let atividadesSelecionadas = [];

let totalUS = 0;

let todasAtividades = [];

/* ===================================== */
/* ENVIAR EXCEL */
/* ===================================== */

async function enviarExcel() {

    const input =
        document.getElementById(
            'arquivoExcel'
        );

    if (!input) return;

    if (!input.files.length) {

        alert(
            'Selecione um arquivo Excel.'
        );

        return;

    }

    const formData =
        new FormData();

    formData.append(
        'arquivo',
        input.files[0]
    );

    try {

        const resposta =
            await fetch(

                `${API}/upload`,

                {
                    method: 'POST',
                    body: formData
                }

            );

        const resultado =
            await resposta.json();

        if (!resultado.sucesso) {

            throw new Error();

        }

        alert(
            'Excel carregado com sucesso!'
        );

        await carregarExcelLido();

        await carregarSelectAtividades();

    } catch (erro) {

        console.error(erro);

        alert(
            'Erro ao enviar Excel.'
        );

    }

}

/* ===================================== */
/* LISTAR ABAS EXCEL */
/* ===================================== */

async function carregarExcelLido() {

    const lista =
        document.getElementById(
            'listaExcel'
        );

    if (!lista) return;

    try {

        const resposta =
            await fetch(
                `${API}/excel-lido`
            );

        const dados =
            await resposta.json();

        lista.innerHTML = '';

        Object.keys(dados).forEach(

            (aba) => {

                lista.innerHTML += `

                    <div class="macro-card">

                        <strong>
                            ${aba}
                        </strong>

                        <br>

                        ${dados[aba].length}
                        atividades

                    </div>

                `;

            }

        );

    } catch (erro) {

        console.error(erro);

    }

}

/* ===================================== */
/* CARREGAR ATIVIDADES */
/* ===================================== */

async function carregarSelectAtividades() {

    const select =
        document.getElementById(
            'selectAtividade'
        );

    if (!select) return;

    try {

        const resposta =
            await fetch(
                `${API}/excel-lido`
            );

        const dados =
            await resposta.json();

        todasAtividades = [];

        Object.keys(dados).forEach(

            (aba) => {

                dados[aba].forEach(

                    (atividade) => {

                        todasAtividades.push(
                            atividade
                        );

                    }

                );

            }

        );

        renderizarAtividades(
            todasAtividades
        );

    } catch (erro) {

        console.error(
            erro
        );

    }

}

/* ===================================== */
/* RENDERIZAR ATIVIDADES */
/* ===================================== */

function renderizarAtividades(listaAtividades) {

    const select =
        document.getElementById(
            'selectAtividade'
        );

    if (!select) return;

    select.innerHTML = `

        <option value="">
            Selecione uma atividade
        </option>

    `;

    listaAtividades.forEach(

        (atividade) => {

            const option =
                document.createElement(
                    'option'
                );

            option.value =
                JSON.stringify(
                    atividade
                );

            option.textContent =

                atividade.atividade ||

                atividade.descricao ||

                'Sem nome';

            select.appendChild(
                option
            );

        }

    );

}

/* ===================================== */
/* FILTRAR ATIVIDADES */
/* ===================================== */

function filtrarAtividades() {

    const texto =
        document.getElementById(
            'pesquisaAtividade'
        ).value.toLowerCase();

    const filtradas =
        todasAtividades.filter(

            (atividade) =>

                atividade.atividade
                    .toLowerCase()
                    .includes(texto)

        );

    renderizarAtividades(
        filtradas
    );

}

/* ===================================== */
/* ADICIONAR ATIVIDADE */
/* ===================================== */

function adicionarAtividade() {

    const select =
        document.getElementById(
            'selectAtividade'
        );

    if (!select) return;

    if (!select.value) {

        return;

    }

    const atividade =
        JSON.parse(
            select.value
        );

    atividadesSelecionadas.push(
        atividade
    );

    atualizarListaAtividades();

}

/* ===================================== */
/* LISTA DE ATIVIDADES */
/* ===================================== */

function atualizarListaAtividades() {

    const lista =
        document.getElementById(
            'atividadesSelecionadas'
        );

    if (!lista) return;

    lista.innerHTML = '';

    totalUS = 0;

    atividadesSelecionadas.forEach(

        (atividade, index) => {

            totalUS += Number(
                atividade.qtdeUS || 0
            );

            lista.innerHTML += `

                <div class="macro-card">

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            gap:20px;
                        "
                    >

                        <div>

                            <strong>

                                ${atividade.atividade}

                            </strong>

                            <br>

                            US:
                            ${atividade.qtdeUS}

                        </div>

                        <button
                            class="btn-delete-mini"
                            onclick="removerAtividade(${index})"
                        >

                            X

                        </button>

                    </div>

                </div>

            `;

        }

    );

    const total =
        document.getElementById(
            'totalUS'
        );

    if (total) {

        total.innerText =
            totalUS.toFixed(4);

    }

}

/* ===================================== */
/* REMOVER ATIVIDADE */
/* ===================================== */

function removerAtividade(index) {

    atividadesSelecionadas.splice(
        index,
        1
    );

    atualizarListaAtividades();

}

/* ===================================== */
/* SALVAR MACRO */
/* ===================================== */

async function atribuirMacro() {

    const numeroMacro =
        document.getElementById(
            'numeroMacro'
        )?.value;

    const equipe =
        document.getElementById(
            'equipeMacro'
        )?.value;

    const descricao =
        document.getElementById(
            'descricaoMacro'
        )?.value;

    if (

        !numeroMacro ||

        !equipe ||

        atividadesSelecionadas.length === 0

    ) {

        alert(
            'Preencha os dados da macro.'
        );

        return;

    }

    const macro = {

        numero: numeroMacro,

        equipe,

        descricao,

        atividades:
            atividadesSelecionadas,

        totalUS

    };

    try {

        await fetch(

            `${API}/macros`,

            {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json'

                },

                body: JSON.stringify(
                    macro
                )

            }

        );

        window.location.href =
            'macros.html';

    } catch (erro) {

        console.error(
            erro
        );

        alert(
            'Erro ao salvar macro.'
        );

    }

}

/* ===================================== */
/* CARREGAR MACROS */
/* ===================================== */

async function carregarMacros() {

    const lista =
        document.getElementById(
            'listaMacros'
        );

    if (!lista) return;

    try {

        const resposta =
            await fetch(
                `${API}/macros`
            );

        const macros =
            await resposta.json();

        lista.innerHTML = '';

        if (!macros.length) {

            lista.innerHTML = `

                <div class="macro-card">

                    Nenhuma macro cadastrada.

                </div>

            `;

            return;

        }

        [...macros]
            .reverse()
            .forEach(

                (macro) => {

                    let atividadesHTML = '';

                    if (
                        macro.atividades
                    ) {

                        macro.atividades.forEach(

                            (atividade) => {

                                atividadesHTML += `

                                    <li>

                                        ${atividade.atividade}

                                        - US:

                                        ${atividade.qtdeUS}

                                    </li>

                                `;

                            }

                        );

                    }

                    lista.innerHTML += `

                        <div class="macro-card">

                            <div class="macro-actions">

                                <button
                                    class="btn-delete-mini"
                                    onclick="excluirMacro(${macro.id})"
                                >

                                    X

                                </button>

                            </div>

                            <h3>

                                Macro:
                                ${macro.numero}

                            </h3>

                            <p>

                                <strong>
                                    Equipe:
                                </strong>

                                ${macro.equipe}

                            </p>

                            <p>

                                <strong>
                                    Descrição:
                                </strong>

                                ${macro.descricao}

                            </p>

                            <p>

                                <strong>
                                    Total US:
                                </strong>

                                ${Number(
                                    macro.totalUS || 0
                                ).toFixed(4)}

                            </p>

                            <h4>

                                Atividades

                            </h4>

                            <ul>

                                ${atividadesHTML}

                            </ul>

                        </div>

                    `;

                }

            );

    } catch (erro) {

        console.error(
            erro
        );

    }

}

/* ===================================== */
/* EXCLUIR MACRO */
/* ===================================== */

async function excluirMacro(id) {

    await fetch(
        `${API}/macros/${id}`,
        {
            method: 'DELETE'
        }
    );

    carregarMacros();

}

/* ===================================== */
/* INICIALIZAÇÃO */
/* ===================================== */

window.onload = () => {

    carregarExcelLido();

    carregarSelectAtividades();

    carregarMacros();

};

/* ===================================== */
/* VOLTAR DASHBOARD */
/* ===================================== */

function voltarDashboard() {

    window.location.href =
        'dashboard.html';

}