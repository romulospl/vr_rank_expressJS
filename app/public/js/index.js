
const BASE_URL = 'https://192.168.137.1'
const posicaoInicial = "0 1.7 -44.78514"
const posicaoCentralizada = "0.03156 1.3189 -0.83031"
const tempoDeAnimacao = 8000
const pontuacaoFinal = 200
// const limiteDeItens = 20
const limiteDeItens = 20 // tem que ser sempre o dobro do objetivo
let pontuacao = 0

const CONFIG = {
    showQuestions: false,
    qtdDeStartPosicaoInicial: 0
}

const CONFIG_TEMPORIZADOR = {
    // Configura se o projeto terá ou não temporizador
    hasTime: false,
}

const QUESTIONARIO = {
    questionInUse: null
}


function formatError(error) {
    return {
        message: error.message,
        stack: error.stack,
        name: error.name
    };
}

/* 

Atualizar os valores dos modelos para terem 3 possíveis respostas.

será modificado para
-1 = negativo
0 = neutro
1 = positivo

*/
const valorModels = [
    { id: 'aditivo-de-combustivel', value: 1, altura: -0.4572 },
    { id: 'bateria', value: 1, altura: -0.538 },
    { id: 'correia-dentada', value: 1, altura: -0.528 },
    { id: 'disco-de-freio', value: 1, altura: -0.528 },
    { id: 'filtro-de-ar', value: 1, altura: -0.528 },
    { id: 'filtro-de-aro-condicionado', value: 1, altura: -0.528 },
    { id: 'filtro-de-combustivel', value: 1, altura: -0.528 },
    { id: 'filtro-de-oleo', value: 1, altura: -0.528 },
    { id: 'oleo-sintetico', value: 1, altura: -0.528 },
    { id: 'pastilha-de-freio', value: 1, altura: -0.528 },
    { id: 'vela-de-ignicao', value: 1, altura: -0.528 },

    // negativos
    { id: 'bateria-descarregada', value: -1, altura: 4.682 },
    { id: 'disco-de-freio-deteriorado', value: -1, altura: 4.852 },
    { id: 'filtro-de-ar-sujo', value: -1, altura: 4.642 },
    { id: 'filtro-de-combustivel-abarrotado', value: -1, altura: 4.802 },
    { id: 'filtro-de-oleo-compurscado', value: -1, altura: 4.802 },
    { id: 'pastilha-de-freio-gasta', value: -1, altura: 4.802 },
    { id: 'pneu-furado', value: -1, altura: 4.702 },
    { id: 'radiador-quebrado', value: -1, altura: 4.702 },
    { id: 'reservatorio-de-oleo-vazio', value: -1, altura: 4.702 },
    { id: 'vela-de-ignicao-queimada', value: -1, altura: 4.882 },

    // neutros
    { id: 'cabo-de-bateria', value: 0, altura: 1.982 },
    { id: 'chave-de-roda', value: 0, altura: 1.982 },
    { id: 'extintor-de-incendio', value: 0, altura: 1.982 },
    { id: 'jogo-de-parafusos', value: 0, altura: 1.982 },
    { id: 'luz-de-neve', value: 0, altura: 1.982 },
    { id: 'macaco-hidraulico', value: 0, altura: 1.982 },
    { id: 'manual-do-proprietario', value: 0, altura: 1.982 },
    { id: 'reservatorio-de-agua', value: 0, altura: 1.982 },
    { id: 'spray-desengripante', value: 0, altura: 1.982 },
    { id: 'tapete', value: 0, altura: 1.982 },
]

const questions = [
    { id: 'question1', value: "B", altura: 0 },
    { id: 'question2', value: "B", altura: 0 },
    { id: 'question3', value: "B", altura: 0 },
    { id: 'question4', value: "D", altura: 0 },
    { id: 'question5', value: "B", altura: 0 },
    { id: 'question6', value: "B", altura: 0 },
    { id: 'question7', value: "B", altura: 0 },
    { id: 'question8', value: "B", altura: 0 },
    { id: 'question9', value: "C", altura: 0 },
    { id: 'question10', value: "B", altura: 0 },
    { id: 'question11', value: "B", altura: 0 },
    { id: 'question12', value: "B", altura: 0 },
    { id: 'question13', value: "B", altura: 0 },
    { id: 'question14', value: "B", altura: 0 },
    { id: 'question15', value: "B", altura: 0 },
    { id: 'question16', value: "B", altura: 0 },
    { id: 'question17', value: "B", altura: 0 },
    { id: 'question18', value: "B", altura: 0 }
];

function getQuestionValue(id) {
    const filtro = questions.filter(q => q.id == id)
    return filtro[0]
}

function showLog(message, color, timer) {
    var texto = document.getElementById('log');
    texto.setAttribute('visible', 'true')
    texto.setAttribute('material', {
        color: 'black'
    })
    texto.setAttribute('text', {
        value: message,
        color: color || 'red'
    })
    setTimeout(() => {
        texto.setAttribute('visible', 'false')
    }, timer || 4000)
}

function showLog2(message, color, timer) {
    var texto = document.getElementById('log2');
    texto.setAttribute('visible', 'true')
    texto.setAttribute('material', {
        color: 'black'
    })
    texto.setAttribute('text', {
        value: message,
        color: color || 'blue'
    })
    setTimeout(() => {
        texto.setAttribute('visible', 'false')
    }, timer || 6000)
}

function getError(error) {
    return error.message
}


function sendScore(score) {
    fetch(BASE_URL + '/score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            const e = getError(error)
            showLog(e)
            // sendLog(`index.js - goal-object - sendScore - Error: ${JSON.stringify(formatError(error))}`);
        });
}

function sendLog(message) {
    fetch('https://192.168.1.11:3000/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            // sendLog(`index.js - goal-object - sendLog - Error: ${JSON.stringify(formatError(error))}`);/
        });
}


class ManipuladorObjects {

    constructor(elemento) {
        this.el = elemento
    }

    addAnimation(to, dur, property) {
        this.el.setAttribute('animation', {
            property: property || 'position',
            to: to || `0 0 0`,
            dur: dur || 5500,
            easing: 'linear',
            loop: false
        })
    }

    deleteAnimation() {
        this.el.removeAttribute('animation')
    }

    getElementId() {
        return this.el.getAttribute("id")
    }

    setPosition(to) {
        this.el.setAttribute('position', to)
    }

    removeAttribute(atributo) {
        this.el.removeAttribute(atributo)
    }

    addAttribute(atribute, value) {
        console.log(value)
        if (!value) value = ""
        this.el.setAttribute(atribute, value)
    }

    getAttribute(atribute) {
        this.el.getAttribute(atribute)
    }

    getPosition(dado) {
        if (dado == "x") return this.el.getAttribute('position').x
        if (dado == "y") return this.el.getAttribute('position').y
        if (dado == "z") return this.el.getAttribute('position').z
        return this.el.getAttribute('position')
    }

    addClass(classe) {
        this.el.classList.add(classe)
    }

    removeClass(classe) {
        this.el.classList.remove(classe)
    }

    getDataset(dataset) {
        for (const chave in this.el.dataset) {
            if (this.el.dataset.hasOwnProperty(chave) && this.el.dataset.hasOwnProperty(dataset)) {
                const valor = this.el.dataset[chave];
                if (valor == 'true') return true
                if (valor == 'false') return false
                return valor
            }
        }
        return null
    }
}

function isCollision(area, target) {
    if (area == '') return
    var areaTridimensional = area;
    var objetoPosicao = target.object3D.position.clone(); // Posição do objeto
    var areaTridimensionalPosicao = areaTridimensional.object3D.position.clone(); // Posição da área tridimensional
    var areaTridimensionalEscala = areaTridimensional.getAttribute('scale').clone(); // Escala da área tridimensional

    if (
        objetoPosicao.x >= areaTridimensionalPosicao.x - areaTridimensionalEscala.x / 2 &&
        objetoPosicao.x <= areaTridimensionalPosicao.x + areaTridimensionalEscala.x / 2 &&
        objetoPosicao.y >= areaTridimensionalPosicao.y - areaTridimensionalEscala.y / 2 &&
        objetoPosicao.y <= areaTridimensionalPosicao.y + areaTridimensionalEscala.y / 2 &&
        objetoPosicao.z >= areaTridimensionalPosicao.z - areaTridimensionalEscala.z / 2 &&
        objetoPosicao.z <= areaTridimensionalPosicao.z + areaTridimensionalEscala.z / 2
    ) {
        return true
    } else {
        return false
    }
}


AFRAME.registerComponent('collision', {
    schema: {
        area: { default: '' },
    },
    tick: function () {
        if (this.data.area == '') return
        var areaTridimensional = document.querySelector(`${this.data.area}`);

        if (!areaTridimensional) return
        var objetoPosicao = this.el.object3D.position.clone(); // Posição do objeto
        var areaTridimensionalPosicao = areaTridimensional.object3D.position.clone(); // Posição da área tridimensional
        var areaTridimensionalEscala = areaTridimensional.getAttribute('scale').clone(); // Escala da área tridimensional

        if (
            objetoPosicao.x >= areaTridimensionalPosicao.x - areaTridimensionalEscala.x / 2 &&
            objetoPosicao.x <= areaTridimensionalPosicao.x + areaTridimensionalEscala.x / 2 &&
            objetoPosicao.y >= areaTridimensionalPosicao.y - areaTridimensionalEscala.y / 2 &&
            objetoPosicao.y <= areaTridimensionalPosicao.y + areaTridimensionalEscala.y / 2 &&
            objetoPosicao.z >= areaTridimensionalPosicao.z - areaTridimensionalEscala.z / 2 &&
            objetoPosicao.z <= areaTridimensionalPosicao.z + areaTridimensionalEscala.z / 2
        ) {
            this.el.emit('collisionstarted'); // emite o inicio da colisão
        } else {
            // this.el.emit('isnotcolision');
            this.el.emit('collisionended'); // emite o fim da colisão
        }

    }
});

let somAmbiente = document.querySelector('#fundo-sound')
let atributo = 'src: #fundo-sound-model;autoplay: true; volume: 0.2; loop: true'

setTimeout(() => somAmbiente.setAttribute('sound', atributo), 2000)


// GOALS



function getInfoModelo(id) {
    const regex = /(-left|-right)/g;
    let elementoId = id.replace(regex, "")
    return valorModels.filter(v => v.id == elementoId)[0]
}

function sortearGoal(el) {
    let filhos = el.children
    let indiceAleatorio = Math.floor(Math.random() * filhos.length)
    let elementoAleatorio = filhos[indiceAleatorio]
    let valor = getInfoModelo(elementoAleatorio.id).value == 1 ? true : false
    return { sorteado: document.getElementById(elementoAleatorio.id), value: getInfoModelo(elementoAleatorio.id).value }
}

function getInfoQuestion(id) {
    return questions.filter(v => v.id == id)[0]
}

function sortearQuestion(el) {
    let filhos = el.children
    let indiceAleatorio = Math.floor(Math.random() * filhos.length)
    let elementoAleatorio = filhos[indiceAleatorio]
    return { sorteado: document.getElementById(elementoAleatorio.id), value: getInfoQuestion(elementoAleatorio.id).value, altura: getInfoQuestion(elementoAleatorio.id).altura }
}

function getTempoAleatorio() {
    // return (Math.floor(Math.random() * (2 - 1 + 1)) + 1) * 1000;
    return 2000
}

function atualizarPontuacao() {
    document.querySelector('#pontuacao').setAttribute('text', {
        value: `${pontuacao}`,
        color: 'green'
    })
}
let modelosEscolhidos = []

setInterval(function () {
    atualizarPontuacao()
    // console.log(modelosEscolhidos)
    // if (modelosEscolhidos.length > 5) {
    //     console.log(modelosEscolhidos)
    //     console.log("para a vinda dos itens")
    // }
}, 100);

setInterval(function () {

})

const somPontuado = document.querySelector('#pontuado-som')
const somWrong = document.querySelector('#wrong-sound')
const somSucess = document.querySelector('#sucess-sound')

const msgPontuacaoAtingida = document.querySelector('#msg-desafio-concluido')

function showPontuacaoAtingida() {
    msgPontuacaoAtingida.setAttribute('visible', 'true')
    setTimeout(() => msgPontuacaoAtingida.setAttribute('visible', 'false'), 5000)
}



/*
STATUS:
{
    'pronto' : PRONTO PARA INICIAR
    'iniciado': INICIO
    'hoverStart': HOVER START
    'aguardando': AGUARDANDO O RESTART OU OUTRO GOAL FINALIZAR O FLUXO
}
*/

AFRAME.registerComponent('goal-object', {
    schema: {
        toPosition: { default: '0 0 16.15' },
        caixaSustentavel: { default: '' },
        caixaNaoSustentavel: { default: '' },
    },
    init: function () {
        try {
            this.manipulador = new ManipuladorObjects(this.el)
            this.posicaoAlvo = this.data.toPosition
            this.bindMethods()

            this.otherGoals = document.querySelectorAll(`[goal-object]:not([id="${this.manipulador.getElementId()}"])`);
            this.caixaSustentavel = document.querySelector(this.data.caixaSustentavel)
            this.caixaNaoSustentavel = document.querySelector(this.data.caixaNaoSustentavel)
            this.placar = document.querySelector('#pontuacao')
            let buttonStart = document.querySelector('#button-start-contato')
            let temporizador = document.querySelector('#tempo')

            buttonStart.addEventListener('startgame', this.startPressionado)
            temporizador.addEventListener('tempoesgotado', this.resetarGoal)
            this.el.addEventListener('hover-start', this.irParaAreaCentralizada)
            this.el.addEventListener('collisionstarted', this.reiniciarGoal)
            this.placar.addEventListener('pontuacaoatingida', this.resetarGoal)

            const self = this
            this.otherGoals.forEach(function (elemento) {
                elemento.addEventListener('resetarGoal', self.resetarGoal)
                elemento.addEventListener('liberarmodelo', self.liberarStatus)
            });
        } catch (error) {
            showLog(error)
            console.log(error)
        }
    },
    bindMethods: function () {
        this.resetarGoal = this.resetarGoal.bind(this)
        this.liberarStatus = this.liberarStatus.bind(this)
        this.startPressionado = this.startPressionado.bind(this)
        this.irParaPosicaoInicial = this.irParaPosicaoInicial.bind(this)
        this.iniciarJogo = this.iniciarJogo.bind(this)
        this.reiniciarGoal = this.reiniciarGoal.bind(this)
        this.adicionarAnimacao = this.adicionarAnimacao.bind(this)
        this.removerAnimacao = this.removerAnimacao.bind(this)
        this.removerModelo = this.removerModelo.bind(this)
        this.irParaAreaCentralizada = this.irParaAreaCentralizada.bind(this)
        this.selecionarModelo = this.selecionarModelo.bind(this)
        this.verificarCaixotePositivo = this.verificarCaixotePositivo.bind(this)
        this.resetarOpcoesCaixote = this.resetarOpcoesCaixote.bind(this)
    },
    resetarGoal: function () {
        try {
            this.status = 'aguardando'
            this.removerAnimacao()
            this.reiniciarGoal()
        } catch (error) {
            sendLog(`index.js - goal-object - resetarGoal - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    reiniciarGoal: function () {
        try {
            this.removerModelo()
            this.irParaPosicaoInicial()
            setTimeout(() => {
                if (pontuacao >= pontuacaoFinal) {
                    // this.endGame()
                    return
                } else {
                    this.iniciarJogo()
                }
            }, 500)
        } catch (error) {
            showLog(error)
            showLog2("reiniciarGoal")
            console.log(error)
        }
    },
    removerModelo: function () {
        try {
            let manipuladorModeloSorteado = new ManipuladorObjects(this.modeloSorteado)
            if (manipuladorModeloSorteado.getPosition("y") > -2) {
                manipuladorModeloSorteado.setPosition(`${manipuladorModeloSorteado.getPosition("x")} ${manipuladorModeloSorteado.getPosition("y") - 10} ${manipuladorModeloSorteado.getPosition("z")}`)
            }
        } catch (error) {
            showLog(error)
            showLog2("removerModelo")
            console.log(error)
        }
    },
    liberarStatus: function () {
        try {
            this.status = 'pronto'
            this.reiniciarGoal()
        } catch (error) {
            showLog(error)
            console.log(error)
            showLog2("liberarStatus")
        }
    },
    startPressionado: function () {
        try {
            this.status = 'pronto'
            this.irParaPosicaoInicial()
            this.iniciarJogo()
        } catch (error) {
            showLog(error)
            console.log(error)
            showLog2("startPressionado")
        }
    },
    iniciarJogo: function () {
        try {
            if (this.status === 'pronto') {
                this.selecionarModelo()
                setTimeout(() => this.adicionarAnimacao(), getTempoAleatorio())
                this.status = 'iniciado'
            }
        } catch (error) {
            showLog(error)
            console.log(error)
            showLog2("iniciarJogo")
        }
    },
    irParaPosicaoInicial: function () {
        try {
            this.manipulador.setPosition(posicaoInicial)
            if (this.status === 'aguardando') return
            this.status = 'pronto'
            this.el.addEventListener('hover-start', this.irParaAreaCentralizada)
        } catch (error) {
            showLog(error)
            console.log(error)
            showLog2("irParaPosicaoInicial")
        }
    },
    selecionarModelo: function () {
        try {
            let modeloSorteado = sortearGoal(this.el)
            let manipuladorModeloSorteado = new ManipuladorObjects(modeloSorteado.sorteado)
            while (modelosEscolhidos.includes(manipuladorModeloSorteado.getElementId())) {
                modeloSorteado = sortearGoal(this.el)
                manipuladorModeloSorteado = new ManipuladorObjects(modeloSorteado.sorteado)
            }

            this.modeloSorteado = modeloSorteado.sorteado
            this.pontuacao = modeloSorteado.value

            // console.log(`pontuação: ${this.modeloSorteado}`)
            modelosEscolhidos.push(manipuladorModeloSorteado.getElementId())
            let infoModelo = getInfoModelo(manipuladorModeloSorteado.getElementId())
            if (manipuladorModeloSorteado.getPosition("y") < -2) {
                manipuladorModeloSorteado.setPosition(`${manipuladorModeloSorteado.getPosition("x")} ${infoModelo.altura} ${manipuladorModeloSorteado.getPosition("z")}`)
            }
        } catch (error) {
            sendLog(`index.js - goal-object - selecionarModelo - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    adicionarAnimacao: function () {
        try {
            if (CONFIG.qtdDeStartPosicaoInicial >= limiteDeItens) CONFIG.showQuestions = true
            if (CONFIG.qtdDeStartPosicaoInicial >= limiteDeItens) this.el.emit('limitreached')
            if (CONFIG.qtdDeStartPosicaoInicial >= limiteDeItens) return
            this.removerAnimacao()
            this.manipulador.addAnimation(this.posicaoAlvo, tempoDeAnimacao)
            CONFIG.qtdDeStartPosicaoInicial++
        } catch (error) {
            sendLog(`index.js - goal-object - adicionarAnimacao - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    removerAnimacao: function () {
        try {
            this.manipulador.deleteAnimation()
        } catch (error) {
            sendLog(`index.js - goal-object - removerAnimacao - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    irParaAreaCentralizada: function () {
        try {
            if (this.status != 'iniciado') return
            this.el.removeEventListener('hover-start', this.irParaAreaCentralizada)
            this.status = 'hoverStart'
            this.el.emit('resetarGoal')
            let tempo = 2000
            this.removerAnimacao()
            this.manipulador.addAnimation(posicaoCentralizada, tempo)
            this.manipulador.removeAttribute('hoverable')
            setTimeout(() => {
                this.caixaSustentavel.addEventListener('collisionstarted', this.verificarCaixotePositivo)
                this.caixaNaoSustentavel.addEventListener('collisionstarted', this.resetarOpcoesCaixote)
                this.manipulador.addAttribute('grabbable')
                this.removerAnimacao()
            }, (tempo + 500))

        } catch (error) {
            sendLog(`index.js - goal-object - irParaAreaCentralizada - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    verificarCaixotePositivo: function () {
        try {
            this.resetarOpcoesCaixote()
            if (this.pontuacao == 1) {
                somPontuado.components.sound.playSound()
                pontuacao++
            } else if (this.pontuacao == -1) {
                somWrong.components.sound.playSound()
            } else {
                // showLog("Errou")
            }
        } catch (error) {
            sendLog(`index.js - goal-object - verificarCaixotePositivo - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    resetarOpcoesCaixote: function () {
        try {
            this.caixaSustentavel.removeEventListener('collisionstarted', this.verificarCaixotePositivo)
            this.caixaNaoSustentavel.removeEventListener('collisionstarted', this.verificarCaixoteNegativo)
            this.reiniciarGoal()
            this.el.emit('liberarmodelo')
        } catch (error) {
            sendLog(`index.js - goal-object - resetarOpcoesCaixote - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
})

AFRAME.registerComponent('pontuacao', {
    init: function () {
        try {
            this.bindMethods()
            this.manipulador = new ManipuladorObjects(this.el)

            const questionSquad = document.getElementById('quadro-de-questionario')
            let temporizador = document.querySelector('#tempo')

            temporizador.addEventListener('tempoesgotado', this.pararContabilizador)
            questionSquad.addEventListener('finishgame', this.contabilizarPlacar)
        } catch (error) {
            sendLog(`index.js - pontuacao - init - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    bindMethods: function () {
        this.contabilizarPlacar = this.contabilizarPlacar.bind(this)
        this.zerarPlacar = this.zerarPlacar.bind(this)
        this.pararContabilizador = this.pararContabilizador.bind(this)
    },
    contabilizarPlacar: function () {
        try {
            sendLog(`O valor pontuado foi: ${pontuacao}`)
            sendScore(pontuacao)
            // somSucess.components.sound.playSound()
            this.zerarPlacar()
            showPontuacaoAtingida()
            this.el.emit('pontuacaoatingida')
        } catch (error) {
            sendLog(`index.js - contabilizarPlacar - pontuacao - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    zerarPlacar: function () {
        pontuacao = 0
    },
    pararContabilizador: function () {
        clearInterval(this.contabilizador)
    }
});

AFRAME.registerComponent('questions', {
    schema: {},
    init: function () {
        this.bindMethods()
    },
    bindMethods: function () {
        this.contabilizarPlacar = this.contabilizarPlacar.bind(this)
        this.zerarPlacar = this.zerarPlacar.bind(this)
        this.pararContabilizador = this.pararContabilizador.bind(this)
    },
});

AFRAME.registerComponent('button-resposta-question', {
    schema: {
        value: { dafault: 'A' },
        positionInit: { dafault: '' },
        positionTarget: { default: '' }
    },
    init: function () {
        try {
            this.el.setAttribute('position', this.data.positionInit)

            const goalLeft = document.getElementById('goal-left')
            const goalRight = document.getElementById('goal-right')
            const placar = document.querySelector('#pontuacao')

            this.bindMethods()
            this.valorButton = this.data.value
            this.el.addEventListener('grab-start', this.hoverStart)
            goalLeft.addEventListener('limitreached', this.limitItensReached)
            goalRight.addEventListener('limitreached', this.limitItensReached)
            placar.addEventListener('pontuacaoatingida', this.colocarPosicaoInicial)
        } catch (error) {
            sendLog(`index.js - button-resposta-question - init - Error: ${JSON.stringify(formatError(error))}`);
        }

    },
    bindMethods: function () {
        this.hoverStart = this.hoverStart.bind(this)
        this.showButtons = this.showButtons.bind(this)
        this.limitItensReached = this.limitItensReached.bind(this)
        this.colocarPosicaoInicial = this.colocarPosicaoInicial.bind(this)
    },
    colocarPosicaoInicial: function () {
        try {
            this.el.setAttribute('position', this.data.positionInit)
        } catch (error) {
            sendLog(`index.js - button-resposta-question - colocarPosicaoInicial - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    hoverStart: function () {
        try {
            const questionInUse = getQuestionValue(QUESTIONARIO.questionInUse)
            if (this.valorButton == questionInUse.value) {
                pontuacao += 3
                somPontuado.components.sound.playSound()
            } else {
                somWrong.components.sound.playSound()
            }
            this.el.removeEventListener('grab-start', this.hoverStart)
            setTimeout(() =>
                this.el.addEventListener('grab-start', this.hoverStart)
                , 1000)
            this.el.emit('respondido')
        } catch (error) {
            sendLog(`index.js - hoverStart (button-resposta-question) - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    sortQuestion: function () {

    },
    limitItensReached: function () {
        try {
            setTimeout(() => {
                this.showButtons()
                // this.sortQuestion()
            }, 2000)
        } catch (error) {
            sendLog(`index.js - limitItensReached - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    showButtons: function () {
        this.el.setAttribute('position', this.data.positionTarget)
    }
});


AFRAME.registerComponent('question-squad', {
    schema: {
        initialPosition: { default: null },
        positionFinal: { default: null }
    },
    init: function () {
        try {
            this.colocarPosicaoInicial()
            this.bindMethods();

            const placar = document.querySelector('#pontuacao')

            // const goalLeft = document.getElementById('goal-left')
            const goalRight = document.getElementById('goal-right')

            const btnA = document.getElementById('button-a')
            const btnB = document.getElementById('button-b')
            const btnC = document.getElementById('button-c')
            const btnD = document.getElementById('button-d')

            btnA.addEventListener('respondido', this.selectQuestion)
            btnB.addEventListener('respondido', this.selectQuestion)
            btnC.addEventListener('respondido', this.selectQuestion)
            btnD.addEventListener('respondido', this.selectQuestion)

            // goalLeft.addEventListener('limitreached', this.limitItensReached)
            placar.addEventListener('pontuacaoatingida', this.colocarPosicaoInicial)
            goalRight.addEventListener('limitreached', this.limitItensReached)
        } catch (error) {
            sendLog(`index.js - question-squad - init - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    bindMethods: function () {
        this.limitItensReached = this.limitItensReached.bind(this)
        this.selectQuestion = this.selectQuestion.bind(this)
        this.addInArray = this.addInArray.bind(this)
        this.colocarPosicaoInicial = this.colocarPosicaoInicial.bind(this)
    },
    colocarPosicaoInicial: function () {
        try {
            if (this.questionManipulada) {
                this.questionManipulada.setPosition(`${this.questionManipulada.getPosition("x")} -10.41621 ${this.questionManipulada.getPosition("z")}`)
            }
            // let questionSquad = new ManipuladorObjects(document.querySelector('#quadro-de-questionario'))
            // questionSquad.setPosition(this.data.initialPosition)
            this.questionsSelect = []
            this.qtdRespondida = 0
            this.perguntaSorteada = null
            this.questionManipulada = null
            this.el.setAttribute("position", this.data.initialPosition)
        } catch (error) {
            sendLog(`index.js - question-squad - colocarPosicaoInicial - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    limitItensReached: function () {
        try {
            this.selectQuestion()
            // setTimeout(() => this.selectQuestion(), 4000)
        } catch (error) {
            sendLog(`index.js - question-squad - limitItensReached - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    selectQuestion: function () {
        try {
            if (this.questionsSelect.length >= 3) {
                this.el.emit('finishgame')
                CONFIG.showQuestions = false
                CONFIG.qtdDeStartPosicaoInicial = 0
            } else {
                if (this.questionManipulada) {
                    this.questionManipulada.setPosition(`${this.questionManipulada.getPosition("x")} -102.456 ${this.questionManipulada.getPosition("z")}`)
                }


                let isInclude = true
                while (isInclude) {
                    this.modeloSorteado = sortearQuestion(this.el)
                    const modelo = this.modeloSorteado
                    this.questionManipulada = new ManipuladorObjects(modelo.sorteado)
                    isInclude = this.questionsSelect.includes(this.questionManipulada.getElementId())
                }
                this.addInArray(this.questionManipulada.getElementId())
                const altura = this.modeloSorteado.altura
                this.questionManipulada.setPosition(`${this.questionManipulada.getPosition("x")} ${altura} ${this.questionManipulada.getPosition("z")}`)
                this.el.setAttribute("position", this.data.positionFinal)
                QUESTIONARIO.questionInUse = this.questionManipulada.getElementId()

            }
        } catch (error) {
            sendLog(`index.js - question-squad - selectQuestion - Error: ${JSON.stringify(formatError(error))}`);
            console.log(error)
        }
    },
    addInArray: function (id) {
        if (this.questionsSelect.length >= 3) {
            this.el.emit('finishgame')
        } else {
            let isInclude = true
            while (!isInclude) {
                isInclude = this.questionsSelect.includes(id)
            }
            this.questionsSelect.push(id)
            console.log(id)
            console.log(this.questionsSelect)
        }
    }

});


// STARTBUTTON.JS


function hideMessages() {
    document.querySelector('#msg-desafio-concluido').setAttribute('visible', 'false')
    document.querySelector('#msg-tempo-esgotado').setAttribute('visible', 'false')
}

// START-BUTTON
AFRAME.registerComponent('start-button', {
    schema: {
    },
    init: function () {
        try {
            this.manipulador = new ManipuladorObjects(this.el)

            this.bindMethods()

            let temporizador = document.querySelector('#tempo')
            let placar = document.querySelector('#pontuacao')

            temporizador.addEventListener('tempoesgotado', this.colocarPosicaoInicial)
            placar.addEventListener('pontuacaoatingida', this.colocarPosicaoInicial)
            this.el.addEventListener('grab-start', this.hoverStart)
            // setTimeout(() => this.hoverStart(), 3000)
        } catch (error) {
            sendLog(`index.js - start-button - init - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    bindMethods: function () {
        this.hoverStart = this.hoverStart.bind(this)
        this.colocarPosicaoInicial = this.colocarPosicaoInicial.bind(this)
    },
    hoverStart: function () {
        this.el.removeEventListener('grab-start', this.hoverStart)
        try {
            let manipuladorButtonModel = new ManipuladorObjects(document.querySelector('#button-start'))
            manipuladorButtonModel.setPosition('0 -10 0')
            this.manipulador.setPosition('0 -10 0')

            setTimeout(() => this.el.addEventListener('grab-start', this.hoverStart), 2000)
            hideMessages()
            this.el.emit('startgame')
        } catch (error) {
            sendLog(`index.js - start-button - hoverStart - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    colocarPosicaoInicial: function () {
        let manipuladorButtonModel = new ManipuladorObjects(document.querySelector('#button-start'))
        setTimeout(() => {
            manipuladorButtonModel.setPosition('-0.003 0.7 -0.49497')
            this.manipulador.setPosition('0 0.831 -0.46235')
        }, 3000)
    }
});

// TEMPORIZADOR




const somTempoRestante = document.querySelector('#tempo-restante-sound')
const somNotificacao = document.querySelector('#notification-sound')

const msgTempoEsgotado = document.querySelector('#msg-tempo-esgotado')

function showTempoEsgotado() {
    msgTempoEsgotado.setAttribute('visible', 'true')
    setTimeout(() => msgTempoEsgotado.setAttribute('visible', 'false'), 5000)
}


function escreverTempo(text) {
    const minutosFormatados = minutos.toString().padStart(2, '0');
    const segundosFormatados = segundos.toString().padStart(2, '0');


    const tempoFormatado = `${minutosFormatados}:${segundosFormatados}`;
    if (minutos == 0 && segundos <= 2) {
        somTempoRestante.components.sound.playSound()
    }
    document.querySelector('#tempo').setAttribute('text', {
        value: tempoFormatado,
        color: (minutos == 0 && segundos <= 30) ? 'red' : 'black'
    });
}

let minutoOriginal = 0
let segundoOriginal = 30
let minutos = minutoOriginal;
let segundos = segundoOriginal;

AFRAME.registerComponent('temporizador', {
    schema: {
    },
    init: function () {
        try {
            const { hasTime } = CONFIG_TEMPORIZADOR
            if (!hasTime) {
                this.el.setAttribute('visible', false);
                document.getElementById('fundo-branco2').setAttribute('visible', false)
            } else {
                this.bindMethods()
                this.manipulador = new ManipuladorObjects(this.el)

                let buttonStart = document.querySelector('#button-start-contato')
                let placar = document.querySelector('#pontuacao')

                buttonStart.addEventListener('startgame', this.iniciarTemporizador)
                placar.addEventListener('pontuacaoatingida', this.pararTempo)
            }

        } catch (error) {
            sendLog(`index.js - temporizador - init - Error: ${JSON.stringify(formatError(error))}`);
        }
    },
    bindMethods: function () {
        this.iniciarTemporizador = this.iniciarTemporizador.bind(this)
        this.avisarTempoEsgotado = this.avisarTempoEsgotado.bind(this)
        this.pararTempo = this.pararTempo.bind(this)
    },
    iniciarTemporizador: function () {
        this.zerarTempo()
        const self = this
        this.temporizador = setInterval(function () {
            segundos--;

            if (segundos < 0) {
                segundos = 59;
                minutos--;
            }

            if (minutos == 0 && segundos <= 0) {
                clearInterval(self.temporizador);
                somNotificacao.components.sound.playSound()
                escreverTempo(0, 0);
                self.avisarTempoEsgotado()
                self.el.emit('tempoesgotado')
                return;
            }

            escreverTempo(minutos, segundos);
        }, 1000);
    },
    pararTempo: function () {
        clearInterval(this.temporizador)
    },
    avisarTempoEsgotado: function () {
        showTempoEsgotado()
    },
    zerarTempo: function () {
        minutos = minutoOriginal;
        segundos = segundoOriginal;
    }

});

// SYSTEM:


AFRAME.registerComponent('collision-system', {
    schema: {
        area: { default: '' },
    },
    tick: function () {
        if (this.data.area == '') return
        var areaTridimensional = document.querySelector(`${this.data.area}`);

        if (!areaTridimensional) return
        var objetoPosicao = this.el.object3D.position.clone(); // Posição do objeto
        var areaTridimensionalPosicao = areaTridimensional.object3D.position.clone(); // Posição da área tridimensional
        var areaTridimensionalEscala = areaTridimensional.getAttribute('scale').clone(); // Escala da área tridimensional

        if (
            objetoPosicao.x >= areaTridimensionalPosicao.x - areaTridimensionalEscala.x / 2 &&
            objetoPosicao.x <= areaTridimensionalPosicao.x + areaTridimensionalEscala.x / 2 &&
            objetoPosicao.y >= areaTridimensionalPosicao.y - areaTridimensionalEscala.y / 2 &&
            objetoPosicao.y <= areaTridimensionalPosicao.y + areaTridimensionalEscala.y / 2 &&
            objetoPosicao.z >= areaTridimensionalPosicao.z - areaTridimensionalEscala.z / 2 &&
            objetoPosicao.z <= areaTridimensionalPosicao.z + areaTridimensionalEscala.z / 2
        ) {
            this.el.emit('collisionstarted'); // emite o inicio da colisão
        } else {
            // this.el.emit('isnotcolision');
            this.el.emit('collisionended'); // emite o fim da colisão
        }

    }
});


