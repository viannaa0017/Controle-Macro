/* ARRAY LOCAL */

let macros = JSON.parse(localStorage.getItem("macros")) || [];

/* SALVAR */

function atribuirMacro(){

    const numero = document.getElementById("numeroMacro").value;

    const equipe = document.getElementById("equipeMacro").value;

    const descricao = document.getElementById("descricaoMacro").value;

    if(numero === "" || equipe === "" || descricao === ""){

        return;

    }

    const macro = {

        numero,
        equipe,
        descricao

    };

    macros.push(macro);

    localStorage.setItem(
        "macros",
        JSON.stringify(macros)
    );

    limparCampos();

}

/* MOSTRAR */

function atualizarMacros(){

    const lista = document.getElementById("listaMacros");

    const total = document.getElementById("totalMacros");

    if(!lista) return;

    lista.innerHTML = "";

    total.innerHTML = `${macros.length} macros`;

    macros.forEach((macro, index) => {

        lista.innerHTML += `

            <div class="macro-item">

                <div 
                    class="macro-header"
                    onclick="toggleMacro(${index})"
                >

                    <h3>
                        Macro Nº ${macro.numero}
                    </h3>

                    <span class="expand-icon">
                        +
                    </span>

                </div>

                <div 
                    class="macro-details hidden"
                    id="macro-${index}"
                >

                    <p>
                        <strong>Equipe:</strong>
                        ${macro.equipe}
                    </p>

                    <p>
                        <strong>Serviço:</strong>
                        ${macro.descricao}
                    </p>

                    <button 
                        class="delete-button"
                        onclick="excluirMacro(${index})"
                    >
                        Excluir Macro
                    </button>

                </div>

            </div>

        `;

    });

}

/* ABRIR DETALHES */

function toggleMacro(index){

    document
        .getElementById(`macro-${index}`)
        .classList.toggle("hidden");

}

/* EXCLUIR */

function excluirMacro(index){

    macros.splice(index, 1);

    localStorage.setItem(
        "macros",
        JSON.stringify(macros)
    );

    atualizarMacros();

}

/* LIMPAR */

function limparCampos(){

    document.getElementById("numeroMacro").value = "";

    document.getElementById("equipeMacro").value = "";

    document.getElementById("descricaoMacro").value = "";

}

/* INICIAR */

atualizarMacros();