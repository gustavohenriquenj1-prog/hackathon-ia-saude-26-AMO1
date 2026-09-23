/* ==========================================================================
   MedFlow — Store de atendimentos
   Fonte única de dados entre a experiência do paciente e o dashboard.
   Persiste em localStorage (com fallback em memória).
   ========================================================================== */

const Store = (() => {
  const KEY = "medflow.attendances.v1";
  const SEQ_KEY = "medflow.sequence.v1";

  /* --- Catálogoos --------------------------------------------------------- */
  const STATUS = {
    AGUARDANDO: "aguardando",
    EM_ANDAMENTO: "em_andamento",
    RESOLVIDO: "resolvido",
    ACAO_NECESSARIA: "acao_necessaria"
  };

  /** Rótulos e cores sempre vêm acompanhados de texto (nunca só cor). */
  const STATUS_META = {
    aguardando: { label: "Aguardando atendimento", tone: "amber", icon: "clock" },
    em_andamento: { label: "Em atendimento", tone: "blue", icon: "user-check" },
    resolvido: { label: "Resolvido", tone: "green", icon: "check-circle" },
    acao_necessaria: { label: "Ação necessária", tone: "red", icon: "alert" }
  };

  const CONVENIOS = [
    { id: "plano-x", label: "Plano X" },
    { id: "plano-vida", label: "Plano Vida" },
    { id: "particular", label: "Particular (sem convênio)" },
    { id: "outro", label: "Outro convênio" },
    { id: "nao-sei", label: "Não sei informar" }
  ];

  /**
   * Cobertura cadastrada por convênio.
   * A IA só responde sobre cobertura quando existe registro aqui.
   */
  const COVERAGE = {
    "Plano X": ["consulta", "exame y", "ultrassom", "retorno"],
    "Plano Vida": ["consulta", "retorno"],
    "Particular": ["consulta", "retorno"]
  };

  /* --- Dados iniciais (seed) --------------------------------------------- */
  function seed() {
    return [
      {
        id: "MF-1042",
        nome: "João da Silva",
        cpf: "529.982.247-25",
        nascimento: "14/03/1978",
        telefone: "(11) 98765-4321",
        convenio: "Plano X",
        categoria: "convenio",
        motivo: "Dúvida sobre cobertura",
        procedimento: "Exame Y",
        documentos: ["Pedido médico", "Documento com foto", "Cartão do convênio"],
        status: "aguardando",
        resolvidoPor: null,
        horario: "09:12",
        eta: 12,
        destino: null,
        origem: "ia",
        resumo:
          "Paciente deseja saber se o Exame Y é coberto pelo Plano X. " +
          "A IA não encontrou confirmação de cobertura para o procedimento no cadastro, " +
          "por isso o atendimento foi encaminhado para a equipe de convênios. " +
          "Dados de contato e documentos necessários já estão coletados.",
        conversa: [
          { role: "ai", text: "Olá, João! Qual é o motivo do seu atendimento hoje?" },
          { role: "user", text: "Convênio — dúvida sobre cobertura" },
          { role: "ai", text: "Você informou Plano X. Está correto?" },
          { role: "user", text: "Sim" },
          { role: "ai", text: "Qual procedimento você precisa?" },
          { role: "user", text: "Exame Y" },
          { role: "ai", text: "Não conseguimos confirmar essa informação. Vamos encaminhar seu atendimento para nossa equipe." }
        ]
      },
      {
        id: "MF-1041",
        nome: "Maria Oliveira",
        cpf: "348.715.980-11",
        nascimento: "02/09/1985",
        telefone: "(11) 99812-7744",
        convenio: "Particular",
        categoria: "consulta",
        motivo: "Consulta de retorno",
        procedimento: "Consulta",
        documentos: ["Documento com foto"],
        status: "em_andamento",
        resolvidoPor: null,
        horario: "09:05",
        eta: 8,
        destino: "Recepção 2",
        origem: "ia",
        resumo:
          "Paciente aguardando retorno de consulta já realizada no dia 10/09. " +
          "Prefere período da manhã. Cartão do convênio não se aplica (atendimento particular). " +
          "Assumida pela recepcionista Camila Rocha.",
        conversa: [
          { role: "ai", text: "O que você precisa hoje?" },
          { role: "user", text: "Consulta" },
          { role: "ai", text: "Você já tem data e horário marcados?" },
          { role: "user", text: "Não" },
          { role: "ai", text: "Prefere ser chamado de manhã ou à tarde?" },
          { role: "user", text: "Manhã" },
          { role: "ai", text: "Certo! Registramos o período da manhã. A equipe confirma o horário pelo telefone." }
        ]
      },
      {
        id: "MF-1040",
        nome: "Roberto Lima",
        cpf: "190.445.620-08",
        nascimento: "27/11/1969",
        telefone: "(11) 97654-1120",
        convenio: "Plano Vida",
        categoria: "exame",
        motivo: "Exame sem pedido médico",
        procedimento: "Ressonância magnética",
        documentos: ["Documento com foto"],
        status: "acao_necessaria",
        resolvidoPor: null,
        horario: "08:58",
        eta: 10,
        destino: null,
        origem: "ia",
        resumo:
          "Paciente informou que não possui pedido médico para a ressonância magnética. " +
          "Como o pedido é obrigatório para a realização do exame, o atendimento foi sinalizado " +
          "como ação necessária para orientação da equipe técnica.",
        conversa: [
          { role: "ai", text: "Você possui um pedido médico?" },
          { role: "user", text: "Não" },
          { role: "ai", text: "Sem problema. Alguns exames precisam de pedido e não conseguimos confirmar isso por aqui. Vou encaminhar você para a equipe." }
        ]
      },
      {
        id: "MF-1039",
        nome: "Carlos Souza",
        cpf: "610.233.870-45",
        nascimento: "19/06/1992",
        telefone: "(11) 98431-0092",
        convenio: "Plano Vida",
        categoria: "exame",
        motivo: "Exame de sangue",
        procedimento: "Hemograma",
        documentos: ["Pedido médico", "Documento com foto", "Cartão do convênio"],
        status: "resolvido",
        resolvidoPor: "ia",
        horario: "08:47",
        eta: null,
        destino: null,
        origem: "ia",
        resumo:
          "Paciente confirmou posse de pedido médico e realizou o cadastro do exame (hemograma). " +
          "IA informou preparo: jejum de 8 horas, com água liberada, e lista de documentos. " +
          "Nenhuma dúvida restante — atendimento resolvido pela IA.",
        conversa: [
          { role: "ai", text: "Você possui um pedido médico?" },
          { role: "user", text: "Sim" },
          { role: "ai", text: "Qual exame você irá realizar?" },
          { role: "user", text: "Hemograma" },
          { role: "ai", text: "Para o hemograma: jejum de 8 horas. Você pode beber água normalmente. Leve o pedido médico, documento com foto e cartão do convênio." },
          { role: "user", text: "Perfeito, obrigado" }
        ]
      },
      {
        id: "MF-1038",
        nome: "Ana Pereira",
        cpf: "284.509.130-77",
        nascimento: "05/01/1996",
        telefone: "(11) 99120-5566",
        convenio: "Plano X",
        categoria: "agendamento",
        motivo: "Agendamento de ultrassom",
        procedimento: "Ultrassom abdominal",
        documentos: ["Pedido médico", "Documento com foto"],
        status: "resolvido",
        resolvidoPor: "ia",
        horario: "08:31",
        eta: null,
        destino: null,
        origem: "ia",
        resumo:
          "Paciente solicitou agendamento de ultrassom abdominal, período da manhã. " +
          "IA registrou a preferência e orientou sobre preparo (jejum de 6 horas) e documentos. " +
          "A confirmação de horário segue com a equipe de agendamento.",
        conversa: [
          { role: "ai", text: "Qual serviço você quer agendar?" },
          { role: "user", text: "Exame" },
          { role: "ai", text: "Prefere período da manhã ou à tarde?" },
          { role: "user", text: "Manhã" },
          { role: "ai", text: "Registrado! Levante 15 minutos antes. Para o ultrassom abdominal, jejum de 6 horas." }
        ]
      },
      {
        id: "MF-1037",
        nome: "Lúcia Ferreira",
        cpf: "735.620.410-92",
        nascimento: "23/07/1958",
        telefone: "(11) 98877-3412",
        convenio: "Particular",
        categoria: "documentos",
        motivo: "Documentos para internação",
        procedimento: "Internação eletiva",
        documentos: ["Documento com foto", "Pedido médico"],
        status: "aguardando",
        resolvidoPor: null,
        horario: "09:20",
        eta: 15,
        destino: null,
        origem: "ia",
        resumo:
          "Paciente se prepara para internação eletiva e listou os documentos que já possui. " +
          "IA orientou sobre documento com foto e pedido médico. Pendência: validação da equipe " +
          "sobre a autorização da internação.",
        conversa: [
          { role: "ai", text: "Qual documento você precisa apresentar?" },
          { role: "user", text: "Outro" },
          { role: "ai", text: "Não conseguimos confirmar essa informação. Vamos encaminhar seu atendimento para nossa equipe." }
        ]
      },
      {
        id: "MF-1036",
        nome: "Paulo Mendes",
        cpf: "042.118.760-30",
        nascimento: "11/12/1981",
        telefone: "(11) 97001-2288",
        convenio: "Não sei informar",
        categoria: "outro",
        motivo: "Orientação de setor",
        procedimento: "Não informado",
        documentos: [],
        status: "aguardando",
        resolvidoPor: null,
        horario: "09:24",
        eta: null,
        destino: null,
        origem: "ia",
        resumo:
          "Paciente pediu orientação para localizar um setor do hospital e não soube informar o convênio. " +
          "Solicitação fora do escopo seguro da IA — encaminhado para a equipe, sem tempo estimado disponível.",
        conversa: [
          { role: "ai", text: "Conte, em poucas palavras, o que você precisa." },
          { role: "user", text: "Preciso saber onde fica o setor de hemodiálise" },
          { role: "ai", text: "Não conseguimos confirmar essa informação. Vamos encaminhar seu atendimento para nossa equipe." }
        ]
      },
      {
        id: "MF-1035",
        nome: "Juliana Costa",
        cpf: "507.932.640-15",
        nascimento: "30/04/1990",
        telefone: "(11) 99654-8013",
        convenio: "Plano X",
        categoria: "convenio",
        motivo: "Segunda via de cartão",
        procedimento: "Reemissão de carteirinha",
        documentos: ["Documento com foto"],
        status: "resolvido",
        resolvidoPor: "ia",
        horario: "08:22",
        eta: null,
        destino: null,
        origem: "ia",
        resumo:
          "Paciente solicitou segunda via da carteirinha do Plano X. IA informou o local de atendimento " +
          "e a necessidade de documento com foto. Sem pendências — resolvido pela IA.",
        conversa: [
          { role: "ai", text: "Qual documento você precisa apresentar?" },
          { role: "user", text: "Cartão do convênio" },
          { role: "ai", text: "Para o cartão do convênio: leve também um documento com foto. A 2ª via é emitida na recepção." }
        ]
      },
      {
        id: "MF-1034",
        nome: "Antônio Ramos",
        cpf: "871.004.520-66",
        nascimento: "08/08/1949",
        telefone: "(11) 98320-7711",
        convenio: "Plano Vida",
        categoria: "consulta",
        motivo: "Consulta de retorno",
        procedimento: "Consulta",
        documentos: ["Documento com foto", "Cartão do convênio"],
        status: "em_andamento",
        resolvidoPor: null,
        horario: "08:15",
        eta: 5,
        destino: "Recepção 1",
        origem: "recepcao",
        resumo:
          "Paciente foi direcionado pela recepção presencial. Retorno marcado, horário preferido: tarde. " +
          "Documentos conferidos no local.",
        conversa: []
      }
    ];
  }

  /* --- Persistência -------------------------------------------------------- */
  let memory = null;

  function read() {
    if (memory) return memory;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        memory = JSON.parse(raw);
        if (Array.isArray(memory) && memory.length) return memory;
      }
    } catch (_) { /* storage indisponível: usa memória */ }
    memory = seed();
    write(memory, true);
    return memory;
  }

  function write(list, skipEvent) {
    memory = list;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(list));
      window.localStorage.setItem(SEQ_KEY, String(Date.now()));
      if (!skipEvent) {
        // Sinaliza para outras abas que os dados mudaram.
        window.localStorage.setItem("medflow.ping.v1", String(Date.now()));
      }
    } catch (_) { /* segue apenas em memória */ }
  }

  function nextId() {
    let seq = 1043;
    try {
      const raw = window.localStorage.getItem("medflow.idseq.v1");
      if (raw) seq = Number(raw);
    } catch (_) { /* memória */ }
    const id = "MF-" + seq;
    try {
      window.localStorage.setItem("medflow.idseq.v1", String(seq + 1));
    } catch (_) { /* memória */ }
    return id;
  }

  /* --- API ------------------------------------------------------------------ */
  function all() { return read(); }

  function get(id) { return read().find((r) => r.id === id) || null; }

  function add(record) {
    const list = read();
    const enriched = Object.assign(
      { id: nextId(), horario: nowHHMM(), status: STATUS.AGUARDANDO, resolvidoPor: null, destino: null, origem: "ia" },
      record
    );
    list.unshift(enriched);
    write(list);
    return enriched;
  }

  function update(id, patch) {
    const list = read();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    write(list);
    return list[idx];
  }

  function counts() {
    const list = read();
    return {
      total: list.filter((r) => true).length,
      aguardando: list.filter((r) => r.status === STATUS.AGUARDANDO).length,
      emAndamento: list.filter((r) => r.status === STATUS.EM_ANDAMENTO).length,
      resolvidosIA: list.filter((r) => r.status === STATUS.RESOLVIDO && r.resolvidoPor === "ia").length,
      acaoNecessaria: list.filter((r) => r.status === STATUS.ACAO_NECESSARIA).length
    };
  }

  function nowHHMM() {
    const d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }

  function statusMeta(status) {
    return STATUS_META[status] || STATUS_META[STATUS.AGUARDANDO];
  }

  /** Escuta atualizações vindas de outra aba (ex.: paciente terminou o fluxo). */
  function onChange(handler) {
    window.addEventListener("storage", (e) => {
      if (e.key === "medflow.ping.v1" || e.key === KEY) {
        memory = null;
        handler();
      }
    });
  }

  function reset() {
    memory = seed();
    write(memory, true);
  }

  return { all, get, add, update, counts, statusMeta, nowHHMM, onChange, reset,
    STATUS, STATUS_META, CONVENIOS, COVERAGE };
})();
