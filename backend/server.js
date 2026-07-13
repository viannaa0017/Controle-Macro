const express =
    require('express');

const cors =
    require('cors');

const fs =
    require('fs');

const path =
    require('path');

const multer =
    require('multer');

const XLSX =
    require('xlsx');

const usuariosPath = path.join(__dirname, 'usuarios.json');

const API = 'https://controle-macro-api.onrender.com';

/* ===================================== */
/* APP */
/* ===================================== */

const app =
    express();

app.use(cors());

app.use(express.json());

/* ===================================== */
/* PASTAS */
/* ===================================== */

const uploadsPath =
    path.join(
        __dirname,
        'uploads'
    );

const macrosPath =
    path.join(
        __dirname,
        'macros.json'
    );

const excelLidoPath =
    path.join(
        __dirname,
        'excel-lido.json'
    );

/* ===================================== */
/* CRIAR PASTAS */
/* ===================================== */

if (
    !fs.existsSync(
        uploadsPath
    )
) {

    fs.mkdirSync(
        uploadsPath
    );

}

/* ===================================== */
/* CRIAR JSON */
/* ===================================== */

if (
    !fs.existsSync(
        macrosPath
    )
) {

    fs.writeFileSync(
        macrosPath,
        '[]'
    );

}

if (
    !fs.existsSync(
        excelLidoPath
    )
) {

    fs.writeFileSync(
        excelLidoPath,
        '{}'
    );

}

/* ===================================== */
/* STATIC */
/* ===================================== */

app.use(
    '/uploads',
    express.static(
        uploadsPath
    )
);

/* ===================================== */
/* FUNÇÕES */
/* ===================================== */

function lerJSON(caminho) {

    return JSON.parse(

        fs.readFileSync(
            caminho,
            'utf8'
        )

    );

}

function salvarJSON(
    caminho,
    dados
) {

    fs.writeFileSync(

        caminho,

        JSON.stringify(
            dados,
            null,
            4
        )

    );

}

/* ===================================== */
/* MULTER */
/* ===================================== */

const storage =
    multer.diskStorage({

        destination:
            uploadsPath,

        filename:
            (req, file, cb) => {

                cb(
                    null,
                    file.originalname
                );

            }

    });

const upload =
    multer({

        storage

    });

/* ===================================== */
/* UPLOAD EXCEL */
/* ===================================== */

app.post(

    '/upload',

    upload.single(
        'arquivo'
    ),

    (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    erro:
                        'Nenhum arquivo enviado'

                });

            }

            const arquivo =
                req.file.path;

            const workbook =
                XLSX.readFile(
                    arquivo
                );

            const resultado = {};

            /* ===================================== */
            /* LER TODAS AS ABAS */
            /* ===================================== */

            workbook.SheetNames.forEach(

                (nomeAba) => {

                    const aba =
                        workbook.Sheets[
                            nomeAba
                        ];

                    const dados = [];

                    /* ===================================== */
                    /* COLUNA B E E */
                    /* ===================================== */

                    for (
                        let i = 2;
                        i <= 400;
                        i++
                    ) {

                        const atividade =
                            aba[
                                `B${i}`
                            ]?.v;

                        const qtdeUS =
                            aba[
                                `E${i}`
                            ]?.v;

                        if (

                            atividade &&
                            qtdeUS

                        ) {

                            dados.push({

                                atividade:
                                    String(
                                        atividade
                                    ),

                                qtdeUS:
                                    Number(
                                        qtdeUS
                                    )

                            });

                        }

                    }

                    if (
                        dados.length > 0
                    ) {

                        resultado[
                            nomeAba
                        ] = dados;

                    }

                }

            );

            salvarJSON(
                excelLidoPath,
                resultado
            );

            console.log(
                'Excel lido:',
                resultado
            );

            res.json({

                sucesso: true,

                dados: resultado

            });

        } catch (erro) {

            console.log(
                erro
            );

            res.status(500).json({

                erro:
                    'Erro ao ler Excel'

            });

        }

    }

);

/* ===================================== */
/* EXCEL LIDO */
/* ===================================== */

app.get(
    '/excel-lido',
    (req, res) => {

        try {

            const dados =
                lerJSON(
                    excelLidoPath
                );

            res.json(
                dados
            );

        } catch {

            res.json({});

        }

    }
);

/* ===================================== */
/* SALVAR MACRO */
/* ===================================== */

app.post(
    '/macros',
    (req, res) => {

        try {

            const {

                numero,
                equipe,
                descricao,
                atividades,
                totalUS

            } = req.body;

            const macros =
                lerJSON(
                    macrosPath
                );

            const novaMacro = {

                id:
                    Date.now(),

                numero,

                equipe,

                descricao,

                atividades:
                    atividades || [],

                totalUS:
                    totalUS || 0

            };

            macros.push(
                novaMacro
            );

            salvarJSON(
                macrosPath,
                macros
            );

            res.json({

                sucesso: true

            });

        } catch (erro) {

            console.log(
                erro
            );

            res.status(500).json({

                erro:
                    'Erro ao salvar macro'

            });

        }

    }
);

/* ===================================== */
/* LISTAR MACROS */
/* ===================================== */

app.get(
    '/macros',
    (req, res) => {

        try {

            const macros =
                lerJSON(
                    macrosPath
                );

            res.json(
                macros
            );

        } catch {

            res.json([]);

        }

    }
);

/* ===================================== */
/* EXCLUIR MACRO */
/* ===================================== */

app.delete(
    '/macros/:id',
    (req, res) => {

        try {

            const id =
                Number(
                    req.params.id
                );

            let macros =
                lerJSON(
                    macrosPath
                );

            macros =
                macros.filter(

                    (macro) =>

                        macro.id !== id

                );

            salvarJSON(
                macrosPath,
                macros
            );

            res.json({

                sucesso: true

            });

        } catch {

            res.status(500).json({

                erro:
                    'Erro ao excluir macro'

            });

        }

    }
);

/* ===================================== */
/* LISTAR ARQUIVOS */
/* ===================================== */

app.get(
    '/arquivos',
    (req, res) => {

        try {

            const arquivos =
                fs.readdirSync(
                    uploadsPath
                );

            res.json(
                arquivos
            );

        } catch {

            res.json([]);

        }

    }
);

/* ===================================== */
/* DOWNLOAD */
/* ===================================== */

app.get(
    '/download/:nome',
    (req, res) => {

        const arquivo =
            path.join(

                uploadsPath,

                req.params.nome

            );

        if (
            fs.existsSync(
                arquivo
            )
        ) {

            res.download(
                arquivo
            );

        } else {

            res.status(404).json({

                erro:
                    'Arquivo não encontrado'

            });

        }

    }
);

/* ===================================== */
/* EXCLUIR ARQUIVO */
/* ===================================== */

app.delete(
    '/arquivos/:nome',
    (req, res) => {

        try {

            const arquivo =
                path.join(

                    uploadsPath,

                    req.params.nome

                );

            if (
                fs.existsSync(
                    arquivo
                )
            ) {

                fs.unlinkSync(
                    arquivo
                );

            }

            res.json({

                sucesso: true

            });

        } catch {

            res.status(500).json({

                erro:
                    'Erro ao excluir arquivo'

            });

        }

    }
);

/* ===================================== */
/* LOGIN */
/* ===================================== */

app.post('/login', (req, res) => {

    try {

        const { usuario, senha } = req.body;

        if (!fs.existsSync(usuariosPath)) {

            return res.status(500).json({

                sucesso: false,

                mensagem: 'Arquivo usuarios.json não encontrado.'

            });

        }

        const usuarios = lerJSON(usuariosPath);

        const usuarioEncontrado = usuarios.find((u) => {

            return (

                u.usuario === usuario &&

                u.senha === senha

            );

        });

        if (!usuarioEncontrado) {

            return res.status(401).json({

                sucesso: false,

                mensagem: 'Usuário ou senha inválidos.'

            });

        }

        res.json({

            sucesso: true,

            usuario: usuarioEncontrado.usuario,

            perfil: usuarioEncontrado.perfil

        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({

            sucesso: false,

            mensagem: 'Erro ao realizar login.'

        });

    }

});

/* ===================================== */
/* LISTAR USUÁRIOS */
/* ===================================== */

app.get('/usuarios', (req, res) => {

    try {

        const usuarios = lerJSON(usuariosPath);

        res.json(usuarios);

    } catch (erro) {

        console.log(erro);

        res.status(500).json({

            sucesso: false,

            mensagem: 'Erro ao listar usuários.'

        });

    }

});

/* ===================================== */
/* CRIAR USUÁRIO */
/* ===================================== */

app.post('/usuarios', (req, res) => {

    try {

        const { usuario, senha, perfil } = req.body;

        const usuarios = lerJSON(usuariosPath);

        const existe = usuarios.find(u => u.usuario === usuario);

        if (existe) {

            return res.status(400).json({

                sucesso: false,

                mensagem: 'Usuário já existe.'

            });

        }

        usuarios.push({

            id: Date.now(),

            usuario,

            senha,

            perfil

        });

        salvarJSON(usuariosPath, usuarios);

        res.json({

            sucesso: true

        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({

            sucesso: false,

            mensagem: 'Erro ao criar usuário.'

        });

    }

});

/* ===================================== */
/* EXCLUIR USUÁRIO */
/* ===================================== */

app.delete('/usuarios/:id', (req, res) => {

    try {

        const id = Number(req.params.id);

        let usuarios = lerJSON(usuariosPath);

        usuarios = usuarios.filter(u => u.id !== id);

        salvarJSON(usuariosPath, usuarios);

        res.json({

            sucesso: true

        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({

            sucesso: false,

            mensagem: 'Erro ao excluir usuário.'

        });

    }

});

/* ===================================== */
/* PORTA */
/* ===================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

/* ===================================== */
/* DASHBOARD */
/* ===================================== */

app.get('/dashboard', (req, res) => {

    try {

        const macros = lerJSON(macrosPath);

        const excel = lerJSON(excelLidoPath);

        const usuarios = lerJSON(usuariosPath);

        let totalAtividades = 0;

        Object.keys(excel).forEach(aba => {

            totalAtividades += excel[aba].length;

        });

        let totalUS = 0;

        macros.forEach(macro => {

            totalUS += Number(macro.totalUS || 0);

        });

        res.json({

            totalMacros: macros.length,

            totalUsuarios: usuarios.length,

            totalAtividades,

            totalUS

        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({

            erro: "Erro ao carregar dashboard."

        });

    }

});