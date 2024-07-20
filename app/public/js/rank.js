const { createApp, ref, onMounted, onBeforeUnmount } = Vue
const { createVuetify } = Vuetify
const BASE_URL = `http://localhost:3000`

axios.defaults.baseURL = 'http://localhost:3000';

const vuetify = createVuetify()

const app = createApp({
    setup() {
        const socket = ref(null)
        const dialog = ref(false)
        const formSaveScore = ref(null)
        const rankItem = ref({})
        const listRank = ref([])
        const loading = ref(false)
        const loadingBtnSave = ref(false)

        const nameRules = [
            v => !!v || 'Campo obrigatório',
        ]
        const headers = [
            { title: 'Classificação', key: 'rank', align: 'center', width: '100px', sortable: false },
            {
                title: 'Apelido',
                align: 'center',
                sortable: false,
                key: 'nickname',
            },
            { title: 'Pontos', key: 'score', align: 'center', sortable: false },
            { title: 'Data', key: 'datatime', align: 'center', sortable: false, width: '180px' },
        ]

        // const sendMessage = () => {
        //     if (socket.value) {
        //         socket.value.emit('message', 'Hello from Vue')
        //     }
        // }

        onMounted(() => {
            socket.value = io(BASE_URL)

            socket.value.on('connect', () => {
                console.log('Conectado ao servidor')
            })

            socket.value.on('finalscore', (data) => {
                console.log('Pontuação vinda do server: ', data)
                dialog.value = true
                rankItem.value.score = data
            })

            socket.value.on('log-oculos', (data) => {
                console.log(data)
            })

            socket.value.on('disconnect', () => {
                console.log('Desconectado do servidor')
            })

            updateRank()
        })

        const formatDate = (date) => {
            const d = new Date(date);

            const day = String(d.getUTCDate()).padStart(2, '0');
            const month = String(d.getUTCMonth() + 1).padStart(2, '0'); // Mês começa do 0
            const year = d.getUTCFullYear();

            const hours = String(d.getUTCHours()).padStart(2, '0');
            const minutes = String(d.getUTCMinutes()).padStart(2, '0');

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }

        const existByNickname = () => {
            return new Promise((resolve) => {
                axios.get(`/api/rank/${rankItem.value.nickname}`)
                    .then((resp) => resolve({ resp: resp.data, exist: true }))
                    .catch((error) => {
                        if (error.response && error.response.status === 404) {
                            resolve({ resp: '', exist: false });
                        } else {
                            reject(error)
                        }
                    });
            });
        }

        const createRankItem = () => {
            axios.post(`/api/rank/`, rankItem.value).then(resp => {
                updateRank()
            })
                .catch((error) => console.error(error))
                .finally(() => {
                    loadingBtnSave.value = false
                    dialog.value = false
                    rankItem.value = {}
                })
        }

        const updateRankItem = (id) => {
            axios.put(`/api/rank/${id}`, rankItem.value).then((resp) => {
                updateRank()
            })
                .catch((error) => console.error(error))
                .finally(() => {
                    loadingBtnSave.value = false
                    dialog.value = false
                    rankItem.value = {}
                })
        }

        const save = async () => {
            loadingBtnSave.value = true
            const { valid } = await formSaveScore.value.validate()
            if (!valid) return
            dialog.value = false

            const { resp, exist } = await existByNickname()
            if (exist) {
                Swal.fire({
                    title: 'Apelido já existente!',
                    text: "Deseja atualizar sua pontuação?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#abc1ff',
                    cancelButtonColor: '#fc5151',
                    confirmButtonText: 'Sim, atualizar',
                    cancelButtonText: 'Não, alterar apelido'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        updateRankItem(resp._id)
                    }
                    if (result.isDismissed) {
                        dialog.value = true
                    }
                })
            } else {
                createRankItem()
            }

        }

        const updateRank = () => {
            loading.value = true
            axios.get(`/api/rank`).then(resp => {
                listRank.value = resp.data
                loading.value = false
            }).catch(error => console.error(error))
        }

        const authorizeStartGame = () => {
            Swal.fire({
                title: 'Confirme',
                text: "Autorizar inicio do jogo?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#abc1ff',
                cancelButtonColor: '#fc5151',
                confirmButtonText: 'Iniciar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    axios.post("/auth-startgame").then((resp) => console.log(resp.data))
                }
            })
        }

        onBeforeUnmount(() => {
            if (socket.value) {
                socket.value.disconnect()
            }
        })

        return {
            updateRank,
            dialog,
            formSaveScore,
            nameRules,
            rankItem,
            save,
            loading,
            headers,
            listRank,
            authorizeStartGame,
            formatDate
        }
    }
})

app.use(vuetify).mount('#app')
