/* ==========================================================================
   MedFlow — Internacionalização (experiência do paciente)
   Idiomas: Português (BR) · English · Español
   Fallback: idioma atual -> pt-BR -> chave
   ========================================================================== */

const I18N = {
  "pt-BR": {
    /* Comum */
    "common.skip": "Pular para o conteúdo",
    "common.help": "Preciso de ajuda",
    "common.continue": "Continuar",
    "common.back": "Voltar",
    "common.close": "Fechar",
    "common.yes": "Sim",
    "common.no": "Não",

    /* Idioma */
    "lang.aria": "Alterar idioma",
    "lang.menu": "Idiomas",
    "lang.changed": "Idioma alterado para {lang}.",
    "lang.pt": "Português",
    "lang.en": "English",
    "lang.es": "Español",

    /* Progresso */
    "progress.aria": "Progresso do atendimento",
    "progress.count": "Etapa {current} de {total}",
    "progress.step1": "Identificação",
    "progress.step2": "Motivo",
    "progress.step3": "Atendimento com IA",
    "progress.step4": "Revisão",
    "progress.done": "Concluído",

    /* 1. Tela inicial */
    "home.badge": "Recepção digital com IA",
    "home.title": "Olá! Vamos agilizar seu atendimento.",
    "home.subtitle": "Informe seus dados e o motivo da visita. Nossa IA organiza as informações em poucos minutos — e você fala com uma pessoa sempre que precisar.",
    "home.h1t": "Leva cerca de 2 minutos",
    "home.h1s": "Quatro etapas rápidas, uma por vez",
    "home.h2t": "Seus dados ficam seguros",
    "home.h2s": "Usados somente neste atendimento",
    "home.h3t": "Sempre há uma pessoa por perto",
    "home.h3s": "Encaminhamos para a equipe quando necessário",
    "home.cta": "Começar atendimento",
    "home.disclaimer": "A MedFlow não faz diagnósticos. A IA apenas coleta informações e orienta — a decisão é sempre de um profissional de saúde.",

    /* 2. Identificação */
    "id.title": "Vamos nos conhecer",
    "id.subtitle": "Só o essencial para localizar seu cadastro. Nada além disso.",
    "id.name": "Nome completo",
    "id.name_ph": "Ex.: João da Silva",
    "id.cpf": "CPF",
    "id.cpf_ph": "000.000.000-00",
    "id.cpf_help": "Digite apenas números.",
    "id.birth": "Data de nascimento",
    "id.birth_help": "Formato dia, mês e ano.",
    "id.phone": "Telefone",
    "id.phone_ph": "(11) 90000-0000",
    "id.phone_help": "Com DDD. Usado apenas para confirmar seu atendimento.",
    "id.plan": "Convênio",
    "id.plan_ph": "Selecione seu convênio",
    "id.plan_help": "Se não souber, escolha “Não sei informar”.",
    "id.privacy": "Seus dados são usados somente para este atendimento.",

    /* Convênios */
    "plan.particular": "Particular (sem convênio)",
    "plan.outro": "Outro convênio",
    "plan.nao_sei": "Não sei informar",

    /* Erros de validação */
    "err.required": "Este campo é obrigatório.",
    "err.name": "Digite seu nome e sobrenome.",
    "err.cpf": "Digite um CPF válido (11 números).",
    "err.birth": "Informe uma data de nascimento válida.",
    "err.birth_future": "A data não pode estar no futuro.",
    "err.phone": "Digite um telefone com DDD (11 dígitos).",
    "err.plan": "Selecione uma opção.",

    /* 3. Motivo */
    "reason.title": "O que você precisa hoje?",
    "reason.subtitle": "Escolha uma opção. Você poderá detalhar na próxima etapa.",
    "reason.consulta": "Consulta",
    "reason.consulta_hint": "Primeira vez ou retorno",
    "reason.exame": "Exame",
    "reason.exame_hint": "Sangue, imagem ou outro",
    "reason.agendamento": "Agendamento",
    "reason.agendamento_hint": "Marcar data e horário",
    "reason.convenio": "Convênio",
    "reason.convenio_hint": "Cobertura e carteirinha",
    "reason.documentos": "Documentos",
    "reason.documentos_hint": "Pedido, RG, cartão",
    "reason.outro": "Outro",
    "reason.outro_hint": "Conte para a gente",

    /* 4. Chat */
    "chat.title": "Atendimento com a IA",
    "chat.motivo_label": "Motivo",
    "chat.change": "Alterar",
    "chat.disclaimer": "A IA coleta informações e orienta. Ela não faz diagnóstico nem substitui um profissional.",
    "chat.placeholder": "Escreva sua resposta",
    "chat.send": "Enviar",
    "chat.human": "Prefere falar com uma pessoa? Peça atendimento humano",
    "chat.typing": "A IA está escrevendo…",
    "chat.hint": "Use os botões acima para responder.",
    "chat.greet": "Olá {nome}! Vou fazer algumas perguntas rápidas para organizar seu atendimento.",
    "chat.closing": "Obrigado! Seu atendimento está organizado. Revise as informações para concluir.",
    "chat.review": "Revisar e confirmar atendimento",

    /* Consulta */
    "chat.q_tem_data": "Você já tem data e horário marcados para sua consulta?",
    "chat.q_sim": "Ótimo! Chegue 15 minutos antes e leve documento com foto e cartão do convênio.",
    "chat.q_nao": "Prefere período da manhã ou à tarde?",
    "chat.q_pref": "Certo! Registramos o período da {periodo}. A equipe confirma o horário pelo telefone.",
    "chat.opt_manha": "Manhã",
    "chat.opt_tarde": "Tarde",
    "chat.period_manha": "manhã",
    "chat.period_tarde": "tarde",
    "chat.opt_docs": "Ver documentos necessários",
    "chat.opt_done": "Concluir",
    "chat.q_docs": "Para a consulta, leve: documento com foto, cartão do convênio e pedido médico (se houver).",

    /* Exame */
    "chat.e_tem_pedido": "Você possui um pedido médico?",
    "chat.e_sem_pedido": "Sem problema. Alguns exames precisam de pedido e não conseguimos confirmar isso por aqui. Vou encaminhar seu atendimento para a equipe orientar você.",
    "chat.qual_exame": "Qual exame você irá realizar?",
    "chat.exame_ph": "Ex.: hemograma, ressonância…",
    "chat.e_prep": "Para {exame}: {prep}",
    "chat.e_prep_docs": "Também leve o pedido médico, documento com foto e cartão do convênio.",
    "chat.prep.sangue": "jejum de 8 horas. Você pode beber água.",
    "chat.prep.ressonancia": "nada de objetos metálicos. Chegue 20 minutos antes.",
    "chat.prep.imagem": "não precisa de preparo.",
    "chat.prep.ultrassom": "jejum de 6 horas.",
    "chat.prep.endoscopia": "jejum de 8 horas e sem fumar.",

    /* Agendamento */
    "chat.a_servico": "Qual serviço você quer agendar?",
    "chat.svc_consulta": "consulta",
    "chat.svc_exame": "exame",
    "chat.svc_retorno": "retorno",
    "chat.a_ok": "Certo! Registramos sua solicitação de {servico} no período da {periodo}. A equipe confirma o horário pelo telefone.",

    /* Convênio */
    "chat.c_conv": "Você informou {conv} como seu convênio. Está correto?",
    "chat.c_trocar": "Qual é o seu convênio?",
    "chat.convenio_ph": "Ex.: Plano X",
    "chat.c_proc": "Qual procedimento você precisa?",
    "chat.proc_ph": "Ex.: consulta, exame, ultrassom…",
    "chat.c_cobertura": "Pelo cadastro, {proc} está previsto no {conv}. Leve o cartão do convênio, documento com foto e o pedido médico.",

    /* Documentos */
    "chat.d_qual": "Qual documento você precisa apresentar?",
    "chat.d_opt_pedido": "Pedido médico",
    "chat.d_opt_foto": "Documento com foto",
    "chat.d_opt_cartao": "Cartão do convênio",
    "chat.d_opt_outro": "Outro",
    "chat.d_pedido": "O pedido médico precisa trazer seu nome, o procedimento e a assinatura do médico. Se ainda não tem, nossa equipe orienta você.",
    "chat.d_foto": "Leve um documento oficial com foto: RG, CNH ou passaporte.",
    "chat.d_cartao": "Leve o cartão do convênio junto com um documento com foto.",
    "chat.d_outro": "Conte qual documento você precisa.",

    /* Outro */
    "chat.o_descreva": "Conte, em poucas palavras, o que você precisa.",
    "chat.outro_ph": "Ex.: preciso de ajuda com…",

    /* 5. Encaminhamento */
    "esc.default_title": "Não conseguimos confirmar essa informação.",
    "esc.human_title": "Vamos deixar isso com a nossa equipe.",
    "esc.body": "Vamos encaminhar seu atendimento para nossa equipe. Você não precisa repetir nada: já levamos seus dados e a conversa.",
    "esc.number": "Número do atendimento",
    "esc.motivo": "Motivo",
    "esc.status": "Status",
    "esc.status_value": "Aguardando atendimento",
    "esc.eta": "Tempo estimado",
    "esc.eta_value": "{minutes} minutos",
    "esc.now_title": "O que acontece agora",
    "esc.now_1": "Enviamos seus dados e a conversa para a recepção.",
    "esc.now_2": "Um funcionário assume seu atendimento.",
    "esc.now_3": "Você será chamado — não precisa ficar em fila.",
    "esc.continue": "Revisar e confirmar",
    "esc.r_sem_pedido": "Exame sem pedido médico",
    "esc.r_cobertura": "Dúvida sobre cobertura",
    "esc.r_prep": "Preparo para {exame}",
    "esc.r_doc": "Documento: {texto}",
    "esc.r_humano": "Pedido de atendimento humano",

    /* 6. Resumo */
    "sum.title": "Revise as informações",
    "sum.subtitle": "Confira se está tudo certo. Você pode corrigir qualquer dado antes de enviar.",
    "sum.patient": "Paciente",
    "sum.motivo": "Motivo",
    "sum.convenio": "Convênio",
    "sum.docs": "Documentos",
    "sum.status": "Status",
    "sum.status_value": "Aguardando recepção",
    "sum.edit": "Editar",
    "sum.confirm": "Confirmar informações",
    "sum.back_chat": "Voltar à conversa",
    "sum.docs_none": "A equipe informará os documentos necessários.",

    /* 7. Sucesso */
    "ok.title": "Atendimento confirmado!",
    "ok.body": "Pronto, {nome}. Seu atendimento já está com a nossa equipe.",
    "ok.next_title": "O que acontece agora",
    "ok.next_1": "Fique perto da recepção — você será chamado pelo nome.",
    "ok.next_2": "Guarde o número do atendimento para acompanhar.",
    "ok.next_3": "Dúvidas? Toque em “Preciso de ajuda”.",
    "ok.restart": "Voltar ao início",
    "ok.confirmed": "Atendimento confirmado",

    /* Ajuda */
    "help.title": "Como podemos ajudar?",
    "help.desc": "Se estiver com dificuldades, escolha uma opção:",
    "help.opt1": "Chamar um funcionário",
    "help.opt1_hint": "Avisamos a recepção para vir até você",
    "help.opt2": "Ligar para a recepção",
    "help.opt3": "O que acontece com meus dados?",
    "help.opt3_hint": "Entenda em uma frase",
    "help.privacy_title": "Seus dados",
    "help.privacy_text": "Usamos seus dados apenas para este atendimento, conforme a LGPD.",
    "help.sent_title": "Aviso enviado",
    "help.sent_text": "A recepção foi informada. Alguém vai até você em instantes.",
    "help.calling": "Ligação para {phone}."
  },

  "en-US": {
    "common.skip": "Skip to content",
    "common.help": "I need help",
    "common.continue": "Continue",
    "common.back": "Back",
    "common.close": "Close",
    "common.yes": "Yes",
    "common.no": "No",

    "lang.aria": "Change language",
    "lang.menu": "Languages",
    "lang.changed": "Language changed to {lang}.",
    "lang.pt": "Português",
    "lang.en": "English",
    "lang.es": "Español",

    "progress.aria": "Visit progress",
    "progress.count": "Step {current} of {total}",
    "progress.step1": "Your details",
    "progress.step2": "Reason",
    "progress.step3": "AI assistant",
    "progress.step4": "Review",
    "progress.done": "Done",

    "home.badge": "Digital reception with AI",
    "home.title": "Hello! Let's speed up your visit.",
    "home.subtitle": "Share your details and the reason for your visit. Our AI organizes everything in a few minutes — and you can talk to a person whenever you need.",
    "home.h1t": "Takes about 2 minutes",
    "home.h1s": "Four quick steps, one at a time",
    "home.h2t": "Your data stays safe",
    "home.h2s": "Used only for this visit",
    "home.h3t": "A person is always nearby",
    "home.h3s": "We route you to the team when needed",
    "home.cta": "Start check-in",
    "home.disclaimer": "MedFlow does not diagnose. The AI only collects information and guides you — decisions always belong to a health professional.",

    "id.title": "Let's get to know each other",
    "id.subtitle": "Only what we need to find your record. Nothing beyond that.",
    "id.name": "Full name",
    "id.name_ph": "e.g. John Smith",
    "id.cpf": "Tax ID (CPF)",
    "id.cpf_ph": "000.000.000-00",
    "id.cpf_help": "Numbers only.",
    "id.birth": "Date of birth",
    "id.birth_help": "Day, month and year.",
    "id.phone": "Phone",
    "id.phone_ph": "(11) 90000-0000",
    "id.phone_help": "With area code. Used only to confirm your visit.",
    "id.plan": "Insurance",
    "id.plan_ph": "Select your insurance",
    "id.plan_help": "Not sure? Choose “I don't know”.",
    "id.privacy": "Your data is used only for this visit.",

    "plan.particular": "Self-pay (no insurance)",
    "plan.outro": "Another insurance",
    "plan.nao_sei": "I don't know",

    "err.required": "This field is required.",
    "err.name": "Type your first and last name.",
    "err.cpf": "Enter a valid tax ID (11 numbers).",
    "err.birth": "Enter a valid date of birth.",
    "err.birth_future": "The date cannot be in the future.",
    "err.phone": "Enter a phone number with area code (11 digits).",
    "err.plan": "Select an option.",

    "reason.title": "What do you need today?",
    "reason.subtitle": "Pick an option. You can add details in the next step.",
    "reason.consulta": "Appointment",
    "reason.consulta_hint": "First visit or follow-up",
    "reason.exame": "Exam",
    "reason.exame_hint": "Blood, imaging or other",
    "reason.agendamento": "Scheduling",
    "reason.agendamento_hint": "Pick a date and time",
    "reason.convenio": "Insurance",
    "reason.convenio_hint": "Coverage and membership card",
    "reason.documentos": "Documents",
    "reason.documentos_hint": "Referral, ID, card",
    "reason.outro": "Something else",
    "reason.outro_hint": "Tell us about it",

    "chat.title": "AI assistant",
    "chat.motivo_label": "Reason",
    "chat.change": "Change",
    "chat.disclaimer": "The AI collects information and guides you. It does not diagnose or replace a professional.",
    "chat.placeholder": "Type your reply",
    "chat.send": "Send",
    "chat.human": "Prefer a person? Request a human",
    "chat.typing": "The AI is typing…",
    "chat.hint": "Use the buttons above to reply.",
    "chat.greet": "Hi {nome}! I'll ask a few quick questions to organize your visit.",
    "chat.closing": "Thank you! Your visit is organized. Review the details to finish.",
    "chat.review": "Review and confirm",

    "chat.q_tem_data": "Do you already have a date and time for your appointment?",
    "chat.q_sim": "Great! Arrive 15 minutes early and bring a photo ID and your insurance card.",
    "chat.q_nao": "Do you prefer the morning or the afternoon?",
    "chat.q_pref": "Done! We noted the {periodo} period. The team will confirm the time by phone.",
    "chat.opt_manha": "Morning",
    "chat.opt_tarde": "Afternoon",
    "chat.period_manha": "morning",
    "chat.period_tarde": "afternoon",
    "chat.opt_docs": "See required documents",
    "chat.opt_done": "Finish",
    "chat.q_docs": "For your appointment, bring: a photo ID, your insurance card and a medical referral (if you have one).",

    "chat.e_tem_pedido": "Do you have a medical referral?",
    "chat.e_sem_pedido": "No problem. Some exams require a referral and we can't confirm that here. We'll send you to our team for guidance.",
    "chat.qual_exame": "Which exam will you have?",
    "chat.exame_ph": "e.g. blood test, MRI…",
    "chat.e_prep": "For {exame}: {prep}",
    "chat.e_prep_docs": "Also bring the referral, a photo ID and your insurance card.",
    "chat.prep.sangue": "an 8-hour fast. You can drink water.",
    "chat.prep.ressonancia": "no metal objects. Arrive 20 minutes early.",
    "chat.prep.imagem": "no preparation needed.",
    "chat.prep.ultrassom": "a 6-hour fast.",
    "chat.prep.endoscopia": "an 8-hour fast and no smoking.",

    "chat.a_servico": "Which service do you want to schedule?",
    "chat.svc_consulta": "appointment",
    "chat.svc_exame": "exam",
    "chat.svc_retorno": "follow-up",
    "chat.a_ok": "Done! We noted your {servico} request for the {periodo}. The team will confirm the time by phone.",

    "chat.c_conv": "You entered {conv} as your insurance. Is that correct?",
    "chat.c_trocar": "What is your insurance?",
    "chat.convenio_ph": "e.g. Plan X",
    "chat.c_proc": "Which procedure do you need?",
    "chat.proc_ph": "e.g. appointment, exam, ultrasound…",
    "chat.c_cobertura": "According to our records, {proc} is covered by {conv}. Bring your insurance card, a photo ID and the referral.",

    "chat.d_qual": "Which document do you need to present?",
    "chat.d_opt_pedido": "Medical referral",
    "chat.d_opt_foto": "Photo ID",
    "chat.d_opt_cartao": "Insurance card",
    "chat.d_opt_outro": "Something else",
    "chat.d_pedido": "The referral must include your name, the procedure and the doctor's signature. If you don't have it yet, our team will guide you.",
    "chat.d_foto": "Bring an official photo ID: ID card, driver's license or passport.",
    "chat.d_cartao": "Bring your insurance card together with a photo ID.",
    "chat.d_outro": "Tell us which document you need.",

    "chat.o_descreva": "In a few words, tell us what you need.",
    "chat.outro_ph": "e.g. I need help with…",

    "esc.default_title": "We couldn't confirm this information.",
    "esc.human_title": "We'll hand this over to our team.",
    "esc.body": "We're routing your visit to our team. You don't need to repeat anything: we already have your details and this conversation.",
    "esc.number": "Ticket number",
    "esc.motivo": "Reason",
    "esc.status": "Status",
    "esc.status_value": "Waiting for service",
    "esc.eta": "Estimated time",
    "esc.eta_value": "{minutes} minutes",
    "esc.now_title": "What happens next",
    "esc.now_1": "We sent your details and conversation to reception.",
    "esc.now_2": "A staff member takes over your visit.",
    "esc.now_3": "You'll be called — no need to wait in line.",
    "esc.continue": "Review and confirm",
    "esc.r_sem_pedido": "Exam without medical referral",
    "esc.r_cobertura": "Coverage question",
    "esc.r_prep": "Preparation for {exame}",
    "esc.r_doc": "Document: {texto}",
    "esc.r_humano": "Request for human service",

    "sum.title": "Review the information",
    "sum.subtitle": "Check that everything is right. You can fix any detail before sending.",
    "sum.patient": "Patient",
    "sum.motivo": "Reason",
    "sum.convenio": "Insurance",
    "sum.docs": "Documents",
    "sum.status": "Status",
    "sum.status_value": "Waiting at reception",
    "sum.edit": "Edit",
    "sum.confirm": "Confirm information",
    "sum.back_chat": "Back to the conversation",
    "sum.docs_none": "The team will tell you which documents are needed.",

    "ok.title": "Visit confirmed!",
    "ok.body": "All set, {nome}. Your visit is with our team now.",
    "ok.next_title": "What happens next",
    "ok.next_1": "Stay near reception — you'll be called by name.",
    "ok.next_2": "Keep the ticket number to follow up.",
    "ok.next_3": "Questions? Tap “I need help”.",
    "ok.restart": "Back to start",
    "ok.confirmed": "Visit confirmed",

    "help.title": "How can we help?",
    "help.desc": "If you're having trouble, choose an option:",
    "help.opt1": "Call a staff member",
    "help.opt1_hint": "We'll notify reception to come to you",
    "help.opt2": "Call reception",
    "help.opt3": "What happens to my data?",
    "help.opt3_hint": "Understand it in one sentence",
    "help.privacy_title": "Your data",
    "help.privacy_text": "We use your data only for this visit, in line with Brazil's data protection law (LGPD).",
    "help.sent_title": "Notice sent",
    "help.sent_text": "Reception was notified. Someone will come to you shortly.",
    "help.calling": "Calling {phone}."
  },

  "es-ES": {
    "common.skip": "Saltar al contenido",
    "common.help": "Necesito ayuda",
    "common.continue": "Continuar",
    "common.back": "Volver",
    "common.close": "Cerrar",
    "common.yes": "Sí",
    "common.no": "No",

    "lang.aria": "Cambiar idioma",
    "lang.menu": "Idiomas",
    "lang.changed": "Idioma cambiado a {lang}.",
    "lang.pt": "Português",
    "lang.en": "English",
    "lang.es": "Español",

    "progress.aria": "Progreso del trámite",
    "progress.count": "Paso {current} de {total}",
    "progress.step1": "Sus datos",
    "progress.step2": "Motivo",
    "progress.step3": "Atención con IA",
    "progress.step4": "Revisión",
    "progress.done": "Listo",

    "home.badge": "Recepción digital con IA",
    "home.title": "¡Hola! Agilicemos su atención.",
    "home.subtitle": "Indique sus datos y el motivo de la visita. Nuestra IA organiza la información en pocos minutos — y usted habla con una persona cuando lo necesite.",
    "home.h1t": "Tarda unos 2 minutos",
    "home.h1s": "Cuatro pasos rápidos, uno por vez",
    "home.h2t": "Sus datos quedan seguros",
    "home.h2s": "Se usan solo en este trámite",
    "home.h3t": "Siempre hay alguien cerca",
    "home.h3s": "Derivamos al equipo cuando hace falta",
    "home.cta": "Iniciar atención",
    "home.disclaimer": "MedFlow no hace diagnósticos. La IA solo recopila información y orienta — la decisión siempre es de un profesional de salud.",

    "id.title": "Vamos a conocernos",
    "id.subtitle": "Solo lo esencial para encontrar su registro. Nada más.",
    "id.name": "Nombre completo",
    "id.name_ph": "Ej.: Juan Pérez",
    "id.cpf": "CPF",
    "id.cpf_ph": "000.000.000-00",
    "id.cpf_help": "Escriba solo números.",
    "id.birth": "Fecha de nacimiento",
    "id.birth_help": "Formato día, mes y año.",
    "id.phone": "Teléfono",
    "id.phone_ph": "(11) 90000-0000",
    "id.phone_help": "Con código de área. Solo para confirmar su atención.",
    "id.plan": "Seguro",
    "id.plan_ph": "Seleccione su seguro",
    "id.plan_help": "Si no lo sabe, elija “No sé”.",
    "id.privacy": "Sus datos se usan solo en este trámite.",

    "plan.particular": "Particular (sin seguro)",
    "plan.outro": "Otro seguro",
    "plan.nao_sei": "No sé",

    "err.required": "Este campo es obligatorio.",
    "err.name": "Escriba su nombre y apellido.",
    "err.cpf": "Ingrese un CPF válido (11 números).",
    "err.birth": "Ingrese una fecha de nacimiento válida.",
    "err.birth_future": "La fecha no puede estar en el futuro.",
    "err.phone": "Ingrese un teléfono con código de área (11 dígitos).",
    "err.plan": "Seleccione una opción.",

    "reason.title": "¿Qué necesita hoy?",
    "reason.subtitle": "Elija una opción. Podrá detallar en el próximo paso.",
    "reason.consulta": "Consulta",
    "reason.consulta_hint": "Primera vez o control",
    "reason.exame": "Examen",
    "reason.exame_hint": "Sangre, imagen u otro",
    "reason.agendamento": "Agendamiento",
    "reason.agendamento_hint": "Elegir día y hora",
    "reason.convenio": "Seguro",
    "reason.convenio_hint": "Cobertura y carnet",
    "reason.documentos": "Documentos",
    "reason.documentos_hint": "Orden, DNI, carnet",
    "reason.outro": "Otro",
    "reason.outro_hint": "Cuéntenos",

    "chat.title": "Atención con la IA",
    "chat.motivo_label": "Motivo",
    "chat.change": "Cambiar",
    "chat.disclaimer": "La IA recopila información y orienta. No diagnostica ni sustituye a un profesional.",
    "chat.placeholder": "Escriba su respuesta",
    "chat.send": "Enviar",
    "chat.human": "¿Prefiere hablar con una persona? Solicite atención humana",
    "chat.typing": "La IA está escribiendo…",
    "chat.hint": "Use los botones de arriba para responder.",
    "chat.greet": "¡Hola {nome}! Haré unas preguntas rápidas para organizar su atención.",
    "chat.closing": "¡Gracias! Su trámite está organizado. Revise los datos para finalizar.",
    "chat.review": "Revisar y confirmar",

    "chat.q_tem_data": "¿Ya tiene fecha y hora para su consulta?",
    "chat.q_sim": "¡Perfecto! Llegue 15 minutos antes y lleve documento con foto y carnet del seguro.",
    "chat.q_nao": "¿Prefiere el período de la mañana o de la tarde?",
    "chat.q_pref": "¡Listo! Registramos el período de la {periodo}. El equipo confirma el horario por teléfono.",
    "chat.opt_manha": "Mañana",
    "chat.opt_tarde": "Tarde",
    "chat.period_manha": "mañana",
    "chat.period_tarde": "tarde",
    "chat.opt_docs": "Ver documentos necesarios",
    "chat.opt_done": "Finalizar",
    "chat.q_docs": "Para su consulta lleve: documento con foto, carnet del seguro y orden médica (si la tiene).",

    "chat.e_tem_pedido": "¿Tiene orden médica?",
    "chat.e_sem_pedido": "Sin problema. Algunos exámenes requieren orden y no podemos confirmarlo aquí. Lo derivamos con nuestro equipo para que le orienten.",
    "chat.qual_exame": "¿Qué examen se realizará?",
    "chat.exame_ph": "Ej.: hemograma, resonancia…",
    "chat.e_prep": "Para {exame}: {prep}",
    "chat.e_prep_docs": "Lleve también la orden médica, documento con foto y carnet del seguro.",
    "chat.prep.sangue": "ayuno de 8 horas. Puede beber agua.",
    "chat.prep.ressonancia": "sin objetos metálicos. Llegue 20 minutos antes.",
    "chat.prep.imagem": "no requiere preparación.",
    "chat.prep.ultrassom": "ayuno de 6 horas.",
    "chat.prep.endoscopia": "ayuno de 8 horas y sin fumar.",

    "chat.a_servico": "¿Qué servicio desea agendar?",
    "chat.svc_consulta": "consulta",
    "chat.svc_exame": "examen",
    "chat.svc_retorno": "control",
    "chat.a_ok": "¡Listo! Registramos su solicitud de {servico} para la {periodo}. El equipo confirma el horario por teléfono.",

    "chat.c_conv": "Indicó {conv} como su seguro. ¿Es correcto?",
    "chat.c_trocar": "¿Cuál es su seguro?",
    "chat.convenio_ph": "Ej.: Plan X",
    "chat.c_proc": "¿Qué procedimiento necesita?",
    "chat.proc_ph": "Ej.: consulta, examen, ultrasonido…",
    "chat.c_cobertura": "Según nuestro registro, {proc} está previsto en {conv}. Lleve el carnet, documento con foto y la orden médica.",

    "chat.d_qual": "¿Qué documento debe presentar?",
    "chat.d_opt_pedido": "Orden médica",
    "chat.d_opt_foto": "Documento con foto",
    "chat.d_opt_cartao": "Carnet del seguro",
    "chat.d_opt_outro": "Otro",
    "chat.d_pedido": "La orden debe llevar su nombre, el procedimiento y la firma del médico. Si aún no la tiene, nuestro equipo le orienta.",
    "chat.d_foto": "Lleve un documento oficial con foto: DNI, licencia o pasaporte.",
    "chat.d_cartao": "Lleve el carnet del seguro junto con un documento con foto.",
    "chat.d_outro": "Indique qué documento necesita.",

    "chat.o_descreva": "En pocas palabras, díganos qué necesita.",
    "chat.outro_ph": "Ej.: necesito ayuda con…",

    "esc.default_title": "No pudimos confirmar esta información.",
    "esc.human_title": "Dejaremos esto en manos de nuestro equipo.",
    "esc.body": "Vamos a derivar su atención a nuestro equipo. No necesita repetir nada: ya tenemos sus datos y esta conversación.",
    "esc.number": "Número de atención",
    "esc.motivo": "Motivo",
    "esc.status": "Estado",
    "esc.status_value": "Aguardando atendimento",
    "esc.eta": "Tiempo estimado",
    "esc.eta_value": "{minutes} minutos",
    "esc.now_title": "Qué pasa ahora",
    "esc.now_1": "Enviamos sus datos y la conversación a la recepción.",
    "esc.now_2": "Un funcionario se hace cargo de su atención.",
    "esc.now_3": "Será llamado — no necesita hacer fila.",
    "esc.continue": "Revisar y confirmar",
    "esc.r_sem_pedido": "Examen sin orden médica",
    "esc.r_cobertura": "Duda sobre cobertura",
    "esc.r_prep": "Preparación para {exame}",
    "esc.r_doc": "Documento: {texto}",
    "esc.r_humano": "Solicitud de atención humana",

    "sum.title": "Revise los datos",
    "sum.subtitle": "Compruebe que todo esté correcto. Puede corregir cualquier dato antes de enviar.",
    "sum.patient": "Paciente",
    "sum.motivo": "Motivo",
    "sum.convenio": "Seguro",
    "sum.docs": "Documentos",
    "sum.status": "Estado",
    "sum.status_value": "Aguardando recepción",
    "sum.edit": "Editar",
    "sum.confirm": "Confirmar datos",
    "sum.back_chat": "Volver a la conversación",
    "sum.docs_none": "El equipo indicará los documentos necesarios.",

    "ok.title": "¡Atención confirmada!",
    "ok.body": "Listo, {nome}. Su atención ya está con nuestro equipo.",
    "ok.next_title": "Qué pasa ahora",
    "ok.next_1": "Permanezca cerca de la recepción — lo llamarán por su nombre.",
    "ok.next_2": "Guarde el número de atención para dar seguimiento.",
    "ok.next_3": "¿Dudas? Toque “Necesito ayuda”.",
    "ok.restart": "Volver al inicio",
    "ok.confirmed": "Atención confirmada",

    "help.title": "¿Cómo podemos ayudar?",
    "help.desc": "Si tiene dificultades, elija una opción:",
    "help.opt1": "Llamar a un funcionario",
    "help.opt1_hint": "Avisamos a la recepción para que venga hasta usted",
    "help.opt2": "Llamar a la recepción",
    "help.opt3": "¿Qué pasa con mis datos?",
    "help.opt3_hint": "Entiéndalo en una frase",
    "help.privacy_title": "Sus datos",
    "help.privacy_text": "Usamos sus datos solo en este trámite, conforme a la ley de protección de datos.",
    "help.sent_title": "Aviso enviado",
    "help.sent_text": "Se avisó a la recepción. Alguien irá hacia usted en instantes.",
    "help.calling": "Llamando a {phone}."
  }
};

/* ========================================================================== */

const I18n = (() => {
  const LANG_KEY = "medflow.lang";
  const ORDER = ["pt-BR", "en-US", "es-ES"];
  const CODES = { "pt-BR": "PT-BR", "en-US": "EN-US", "es-ES": "ES-ES" };
  const missing = new Set();

  let current = "pt-BR";
  try {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved && I18N[saved]) current = saved;
  } catch (_) { /* segue com pt-BR */ }

  function getLang() { return current; }
  function getCode() { return CODES[current] || "PT-BR"; }

  function setLang(lang) {
    if (!I18N[lang]) return false;
    current = lang;
    try { window.localStorage.setItem(LANG_KEY, lang); } catch (_) { /* noop */ }
    document.documentElement.lang = lang;
    return true;
  }

  /** Traduz uma chave com parâmetros {nome}. */
  function t(key, params) {
    let value = I18N[current] && I18N[current][key];
    if (value === undefined) {
      missing.add(current + "::" + key);
      value = I18N["pt-BR"][key];
    }
    if (value === undefined) {
      // Último recurso: mostra algo legível em vez da chave crua.
      const last = String(key).split(".").pop().replace(/_/g, " ");
      return last.charAt(0).toUpperCase() + last.slice(1);
    }
    if (!params) return value;
    return value.replace(/\{(\w+)\}/g, (m, name) =>
      params[name] !== undefined ? String(params[name]) : m
    );
  }

  /** Aplica data-i18n / data-i18n-placeholder / data-i18n-aria em um escopo. */
  function apply(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
  }

  function missingKeys() { return Array.from(missing); }

  return { t, apply, getLang, setLang, getCode, ORDER, missingKeys };
})();

/* Conveniência global */
function t(key, params) { return I18n.t(key, params); }
