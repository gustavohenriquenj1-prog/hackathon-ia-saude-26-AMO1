/* ==========================================================================
   MedFlow — Fluxo do paciente
   Máquina de estados das telas + motor de conversa com a IA.
   Regra de ouro: a IA nunca diagnostica e nunca inventa informação.
   Quando não tem certeza, encaminha para a equipe.
   ========================================================================== */

(() => {
  "use strict";

  /* --- Rótulos em português (padrão do dashboard da equipe) --------------- */
  const PT = {
    motivo: {
      consulta: "Consulta",
      exame: "Exame",
      agendamento: "Agendamento",
      convenio: "Convênio",
      documentos: "Documentos",
      outro: "Outro"
    },
    plan: {
      "plano-x": "Plano X",
      "plano-vida": "Plano Vida",
      particular: "Particular (sem convênio)",
      outro: "Outro convênio",
      "nao-sei": "Não sei informar"
    },
    doc: {
      "chat.d_opt_pedido": "Pedido médico",
      "chat.d_opt_foto": "Documento com foto",
      "chat.d_opt_cartao": "Cartão do convênio",
      "chat.d_opt_outro": "Outro"
    },
    svc: {
      consulta: "Consulta",
      exame: "Exame",
      retorno: "Retorno"
    },
    period: { manha: "manhã", tarde: "tarde" }
  };

  const doc = (key) => ({ key, pt: PT.doc[key] || key });

  /* --- Estado ------------------------------------------------------------- */
  const state = {
    screen: "home",
    form: { nome: "", cpf: "", nascimento: "", telefone: "", convenio: "" },
    motivo: null,
    docs: [],
    procedimento: null,     // texto livre do exame/procedimento
    servico: null,          // consulta | exame | retorno (agendamento)
    periodo: null,          // manha | tarde
    prepKey: null,
    chat: { history: [], node: null, awaiting: null, motivoAtStart: null, closed: false },
    escalation: null,       // { titleKey, reasonPt, reasonKey, reasonParams, eta }
    eta: null,
    recordId: null
  };

  const STEPS = {
    home: 0,
    identificacao: 1,
    motivo: 2,
    chat: 3,
    encaminhamento: 3,
    resumo: 4,
    sucesso: 4
  };

  const START_NODE = {
    consulta: "q_tem_data",
    exame: "e_tem_pedido",
    agendamento: "a_servico",
    convenio: "c_conv",
    documentos: "d_qual",
    outro: "o_descreva"
  };

  /* --- Helpers ------------------------------------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const norm = (s) =>
    String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

  const reduceMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function firstName(full) {
    return String(full || "").trim().split(/\s+/)[0] || "";
  }

  function convenioParts() {
    const id = state.form.convenio;
    if (!id) return { id: "", label: "", pt: "" };
    if (id === "particular") return { id, label: t("plan.particular"), pt: PT.plan.particular };
    if (id === "outro") return { id, label: t("plan.outro"), pt: PT.plan.outro };
    if (id === "nao-sei") return { id, label: t("plan.nao_sei"), pt: PT.plan.nao_sei };
    const label = id === "plano-vida" ? "Plano Vida" : "Plano X";
    return { id, label, pt: label };
  }

  /** Nome usado na tabela de cobertura cadastrada. */
  function coverageName() {
    const c = convenioParts();
    if (c.id === "particular") return "Particular";
    if (c.id === "plano-x" || c.id === "plano-vida") return c.pt;
    if (c.id === "outro" || c.id === "nao-sei") return null;
    return c.pt || null;
  }

  /* --- Navegação de telas -------------------------------------------------- */
  function goTo(screen) {
    if (state.screen === screen) return;
    const prev = $("#screen-" + state.screen);
    const next = $("#screen-" + screen);
    if (!next) return;

    if (prev) prev.hidden = true;
    next.hidden = false;
    next.classList.remove("is-entering");
    void next.offsetWidth; // reinicia a animação
    next.classList.add("is-entering");

    state.screen = screen;

    // Cada tela se redesenha ao entrar: nada de valores defasados.
    if (screen === "resumo") renderSummary();
    else if (screen === "encaminhamento") renderEscalation();
    else if (screen === "sucesso") renderSuccess();

    renderProgress();
    I18n.apply(next);
    Icons.hydrate(next);
    window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });

    const heading = next.querySelector("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function renderProgress() {
    const wrap = $("#progress-wrap");
    const step = STEPS[state.screen];
    if (!step) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;

    const done = state.screen === "sucesso";
    $("#progress-count").textContent = done
      ? t("progress.done")
      : t("progress.count", { current: step, total: 4 });
    $("#progress-name").textContent = t("progress.step" + step);

    const bar = $("#progress-bar");
    bar.setAttribute("aria-valuenow", String(step));
    bar.setAttribute("aria-valuetext", $("#progress-count").textContent);

    $$(".progress-steps__seg", bar).forEach((seg, i) => {
      const n = i + 1;
      seg.classList.toggle("is-done", done || n < step);
      seg.classList.toggle("is-current", !done && n === step);
    });
  }

  /* --- Toast --------------------------------------------------------------- */
  function toast({ title, text, tone = "info" }) {
    const region = $("#toast-region");
    const el = document.createElement("div");
    el.className = "toast toast--" + tone;
    const icon = tone === "success" ? "check-circle" : tone === "error" ? "alert" : "info";
    el.innerHTML =
      '<span data-icon="' + icon + '" data-size="18"></span>' +
      '<span><span class="toast__title"></span>' +
      (text ? '<span class="toast__text"></span>' : "") +
      "</span>";
    $(".toast__title", el).textContent = title;
    if (text) $(".toast__text", el).textContent = text;
    region.appendChild(el);
    Icons.hydrate(el);
    setTimeout(() => el.remove(), 5200);
  }

  /* --- Idioma -------------------------------------------------------------- */
  function setupLang() {
    const btn = $("#lang-btn");
    const menu = $("#lang-menu");

    const close = () => {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      if (open) menu.querySelector('[aria-selected="true"]')?.focus();
    });

    document.addEventListener("click", (e) => {
      if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) {
        close();
        btn.focus();
      }
    });

    menu.addEventListener("click", (e) => {
      const li = e.target.closest("[data-lang]");
      if (li) selectLang(li.dataset.lang);
    });

    menu.addEventListener("keydown", (e) => {
      const li = e.target.closest("[data-lang]");
      if (!li) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectLang(li.dataset.lang);
      }
    });

    function selectLang(lang) {
      if (!I18n.setLang(lang)) return;
      close();
      applyLanguage();
      toast({ title: t("lang.changed", { lang: t("lang." + lang.split("-")[0]) }), tone: "success" });
      btn.focus();
    }
  }

  function applyLanguage() {
    I18n.apply();
    Icons.hydrate();
    $("#lang-code").textContent = I18n.getCode();
    $$("#lang-menu [data-lang]").forEach((li) => {
      li.setAttribute("aria-selected", String(li.dataset.lang === I18n.getLang()));
    });
    renderSelect();
    renderProgress();
    if (state.motivo) $("#chat-motivo").textContent = t("reason." + state.motivo);
    renderChat();
    if (state.screen === "encaminhamento") renderEscalation();
    if (state.screen === "resumo") renderSummary();
    if (state.screen === "sucesso") renderSuccess();
  }

  /* --- Modal de ajuda ------------------------------------------------------- */
  function setupHelp() {
    const modal = $("#help-modal");
    let lastFocus = null;

    const open = () => {
      lastFocus = document.activeElement;
      modal.hidden = false;
      $(".modal__panel button", modal).focus();
    };
    const close = () => {
      modal.hidden = true;
      if (lastFocus) lastFocus.focus();
    };

    $$("[data-open-help]").forEach((b) => b.addEventListener("click", open));
    $$("[data-close-help]", modal).forEach((b) => b.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) close();
    });

    $("#help-call").addEventListener("click", () => {
      close();
      toast({ title: t("help.sent_title"), text: t("help.sent_text"), tone: "success" });
    });

    $("#help-phone").addEventListener("click", () => {
      close();
      toast({ title: t("help.opt2"), text: t("help.calling", { phone: "(11) 3333-1000" }), tone: "info" });
    });

    $("#help-privacy").addEventListener("click", () => {
      close();
      toast({ title: t("help.privacy_title"), text: t("help.privacy_text"), tone: "info" });
    });
  }

  /* --- Máscaras e validação -------------------------------------------------- */
  function maskCPF(v) {
    return v
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }

  function maskPhone(v) {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 10) {
      return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  }

  function setError(inputId, errKey) {
    const input = $("#" + inputId);
    const field = input.closest(".field");
    const box = $("#err-" + input.id.replace("f-", ""));
    input.setAttribute("aria-invalid", "true");
    field.classList.add("field--error");
    if (box) {
      box.hidden = false;
      $("[data-err-text]", box).textContent = t(errKey);
    }
  }

  function clearError(inputId) {
    const input = $("#" + inputId);
    if (!input) return;
    const field = input.closest(".field");
    const box = $("#err-" + input.id.replace("f-", ""));
    input.removeAttribute("aria-invalid");
    if (field) field.classList.remove("field--error");
    if (box) box.hidden = true;
  }

  function validateForm() {
    let ok = true;
    let firstBad = null;

    const nome = $("#f-nome").value.trim();
    if (!nome) { setError("f-nome", "err.required"); ok = false; firstBad = firstBad || "f-nome"; }
    else if (nome.split(/\s+/).length < 2 || nome.length < 3) {
      setError("f-nome", "err.name"); ok = false; firstBad = firstBad || "f-nome";
    } else clearError("f-nome");

    const cpf = $("#f-cpf").value.replace(/\D/g, "");
    if (!cpf) { setError("f-cpf", "err.required"); ok = false; firstBad = firstBad || "f-cpf"; }
    else if (cpf.length !== 11) { setError("f-cpf", "err.cpf"); ok = false; firstBad = firstBad || "f-cpf"; }
    else clearError("f-cpf");

    const nasc = $("#f-nascimento").value;
    if (!nasc) { setError("f-nascimento", "err.required"); ok = false; firstBad = firstBad || "f-nascimento"; }
    else if (new Date(nasc) >= new Date()) {
      setError("f-nascimento", "err.birth_future"); ok = false; firstBad = firstBad || "f-nascimento";
    } else clearError("f-nascimento");

    const tel = $("#f-telefone").value.replace(/\D/g, "");
    if (!tel) { setError("f-telefone", "err.required"); ok = false; firstBad = firstBad || "f-telefone"; }
    else if (tel.length < 10) { setError("f-telefone", "err.phone"); ok = false; firstBad = firstBad || "f-telefone"; }
    else clearError("f-telefone");

    const conv = $("#f-convenio").value;
    if (!conv) { setError("f-convenio", "err.plan"); ok = false; firstBad = firstBad || "f-convenio"; }
    else clearError("f-convenio");

    if (!ok && firstBad) $("#" + firstBad).focus();
    return ok;
  }

  function readForm() {
    state.form = {
      nome: $("#f-nome").value.trim(),
      cpf: $("#f-cpf").value.trim(),
      nascimento: $("#f-nascimento").value,
      telefone: $("#f-telefone").value.trim(),
      convenio: $("#f-convenio").value
    };
  }

  function setupForm() {
    const form = $("#form-identificacao");

    $("#f-cpf").addEventListener("input", (e) => {
      e.target.value = maskCPF(e.target.value);
      if (e.target.getAttribute("aria-invalid")) clearError("f-cpf");
    });

    $("#f-telefone").addEventListener("input", (e) => {
      e.target.value = maskPhone(e.target.value);
      if (e.target.getAttribute("aria-invalid")) clearError("f-telefone");
    });

    ["f-nome", "f-nascimento"].forEach((id) => {
      $("#" + id).addEventListener("input", () => {
        if ($("#" + id).getAttribute("aria-invalid")) clearError(id);
      });
    });

    $("#f-convenio").addEventListener("change", (e) => {
      e.target.classList.toggle("has-value", Boolean(e.target.value));
      if (e.target.getAttribute("aria-invalid")) clearError("f-convenio");
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      readForm();
      goTo("motivo");
    });
  }

  function renderSelect() {
    const sel = $("#f-convenio");
    const current = sel.value;
    sel.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = t("id.plan_ph");
    sel.appendChild(first);

    Store.CONVENIOS.forEach((c) => {
      const o = document.createElement("option");
      o.value = c.id;
      if (c.id === "particular") o.textContent = t("plan.particular");
      else if (c.id === "outro") o.textContent = t("plan.outro");
      else if (c.id === "nao-sei") o.textContent = t("plan.nao_sei");
      else o.textContent = c.label;
      sel.appendChild(o);
    });

    // Mantém a escolha do paciente ao trocar de idioma
    sel.value = current;
    sel.classList.toggle("has-value", Boolean(sel.value));
  }

  /* --- Escolha do motivo ------------------------------------------------------ */
  function setupReasons() {
    const grid = $("#reason-grid");
    const cont = $("#btn-reason-continue");

    grid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-reason]");
      if (!card) return;
      $$(".reason-card", grid).forEach((c) => c.setAttribute("aria-pressed", "false"));
      card.setAttribute("aria-pressed", "true");
      state.motivo = card.dataset.reason;
      cont.disabled = false;
    });

    cont.addEventListener("click", () => {
      if (!state.motivo) return;
      if (state.chat.motivoAtStart !== state.motivo) startChat();
      else renderChat();
      goTo("chat");
    });
  }

  /* ==========================================================================
     Motor de conversa
     ========================================================================== */

  function defaultDocs(motivo) {
    switch (motivo) {
      case "consulta": return [doc("chat.d_opt_foto"), doc("chat.d_opt_cartao")];
      case "exame": return [doc("chat.d_opt_foto"), doc("chat.d_opt_cartao")];
      case "agendamento": return [doc("chat.d_opt_foto")];
      case "convenio": return [doc("chat.d_opt_cartao"), doc("chat.d_opt_foto")];
      default: return [];
    }
  }

  function addDoc(key) {
    if (!state.docs.some((d) => d.key === key)) state.docs.push(doc(key));
  }

  function startChat() {
    state.chat = {
      history: [],
      node: null,
      awaiting: null,
      motivoAtStart: state.motivo,
      closed: false
    };
    state.docs = defaultDocs(state.motivo);
    state.procedimento = null;
    state.servico = null;
    state.periodo = null;
    state.prepKey = null;
    // Motivo novo = conversa nova: o encaminhamento anterior não deve
    // aparecer nem sequestrar o botão de falar com um humano.
    state.escalation = null;
    state.eta = null;

    $("#chat-motivo").textContent = t("reason." + state.motivo);
    pushAI({ key: "chat.greet", params: { nome: firstName(state.form.nome) } });
    // Sem convênio cadastrado, a IA pula direto para o procedimento:
    // cobertura desconhecida é assunto da equipe, nunca chute.
    const start = state.motivo === "convenio" && !coverageName()
      ? "c_proc"
      : START_NODE[state.motivo];
    askNode(start);
  }

  function pushAI(entry) {
    state.chat.history.push(Object.assign({ role: "ai" }, entry));
  }

  function pushUser(entry) {
    state.chat.history.push(Object.assign({ role: "user" }, entry));
  }

  /** Escreve a "digitação" e depois entrega a mensagem + ações da IA. */
  function askNode(nodeId) {
    const node = NODES[nodeId];
    if (!node) return;
    state.chat.node = nodeId;
    state.chat.awaiting = "typing";
    renderChat();

    const delay = reduceMotion() ? 120 : 620 + Math.random() * 380;
    setTimeout(() => {
      const ai = typeof node.ai === "function" ? node.ai() : { key: node.ai };
      pushAI(ai);
      renderChat();

      if (node.escalate) {
        state.chat.awaiting = "escalating";
        renderChat();
        setTimeout(() => triggerEscalation(node.escalate), reduceMotion() ? 150 : 900);
        return;
      }
      if (node.text) {
        state.chat.awaiting = "text";
        renderChat();
        $("#chat-text").focus();
        return;
      }
      if (node.options) {
        state.chat.awaiting = "options";
        renderChat();
        return;
      }
      finishChat();
    }, delay);
  }

  function chooseOption(to, labelEntry) {
    pushUser(labelEntry);
    disableReplies();
    advance(to);
  }

  function advance(to) {
    if (to === "DONE") { finishChat(); return; }
    if (to && to.escalate) {
      state.chat.awaiting = "escalating";
      // A IA explica o porquê do encaminhamento antes de sair do chat.
      if (to.escalate.ai) pushAI({ key: to.escalate.ai });
      renderChat();
      setTimeout(() => triggerEscalation(to.escalate), reduceMotion() ? 200 : 1400);
      return;
    }
    askNode(to);
  }

  function finishChat() {
    state.chat.closed = true;
    state.chat.awaiting = "done";
    pushAI({ key: "chat.closing" });
    renderChat();
  }

  function disableReplies() {
    $$("#chat-log .quick-reply").forEach((b) => { b.disabled = true; });
    state.chat.awaiting = "typing";
  }

  /* --- Definição dos nós ------------------------------------------------------ */
  const NODES = {
    /* Consulta */
    q_tem_data: {
      ai: "chat.q_tem_data",
      options: [
        { label: "common.yes", to: "q_sim" },
        { label: "common.no", to: "q_nao" }
      ]
    },
    q_sim: {
      ai: "chat.q_sim",
      options: [
        { label: "chat.opt_docs", to: "q_docs" },
        { label: "chat.opt_done", to: "DONE" }
      ]
    },
    q_nao: {
      ai: "chat.q_nao",
      options: [
        { label: "chat.opt_manha", to: "q_pref_manha" },
        { label: "chat.opt_tarde", to: "q_pref_tarde" }
      ]
    },
    q_pref_manha: { ai: () => ({ key: "chat.q_pref", params: { periodo: t("chat.period_manha") } }),
      options: [{ label: "chat.opt_docs", to: "q_docs" }, { label: "chat.opt_done", to: "DONE" }] },
    q_pref_tarde: { ai: () => ({ key: "chat.q_pref", params: { periodo: t("chat.period_tarde") } }),
      options: [{ label: "chat.opt_docs", to: "q_docs" }, { label: "chat.opt_done", to: "DONE" }] },
    q_docs: {
      ai: () => {
        addDoc("chat.d_opt_foto");
        addDoc("chat.d_opt_cartao");
        return { key: "chat.q_docs" };
      },
      options: [{ label: "chat.opt_done", to: "DONE" }]
    },

    /* Exame */
    e_tem_pedido: {
      ai: "chat.e_tem_pedido",
      options: [
        {
          label: "common.yes",
          to: { then: () => { addDoc("chat.d_opt_pedido"); } , node: "e_qual" }
        },
        {
          label: "common.no",
          to: { escalate: {
            titleKey: "esc.default_title",
            reasonKey: "esc.r_sem_pedido",
            reasonPt: "Exame sem pedido médico",
            eta: 10,
            ai: "chat.e_sem_pedido"
          } }
        }
      ]
    },
    e_qual: {
      ai: "chat.qual_exame",
      text: { ph: "chat.exame_ph" },
      textTo(value) {
        const n = norm(value);
        let prepKey = null;
        if (/(sangue|hemograma|glicemia|colesterol|triglicer|urina|blood|hemogram)/.test(n)) prepKey = "chat.prep.sangue";
        else if (/(ressonan|mri|resonanc)/.test(n)) prepKey = "chat.prep.ressonancia";
        else if (/(raio|x-?ray|radiograf|torax)/.test(n)) prepKey = "chat.prep.imagem";
        else if (/(ultrassom|ultrasound|ecografia|\beco\b)/.test(n)) prepKey = "chat.prep.ultrassom";
        else if (/(endoscop|gastroscop)/.test(n)) prepKey = "chat.prep.endoscopia";

        state.procedimento = value.trim();
        addDoc("chat.d_opt_pedido");

        if (!prepKey) {
          return { escalate: {
            titleKey: "esc.default_title",
            reasonKey: "esc.r_prep",
            reasonParams: { exame: value.trim() },
            reasonPt: "Preparo para " + value.trim(),
            eta: null
          } };
        }
        state.prepKey = prepKey;
        return "e_prep";
      }
    },
    e_prep: {
      ai: () => ({
        key: "chat.e_prep",
        params: { exame: state.procedimento, prep: t(state.prepKey) },
        extraKey: "chat.e_prep_docs"
      }),
      options: [{ label: "chat.opt_done", to: "DONE" }]
    },

    /* Agendamento */
    a_servico: {
      ai: "chat.a_servico",
      options: [
        { label: "chat.svc_consulta", to: "a_quando", svc: "consulta" },
        { label: "chat.svc_exame", to: "a_quando", svc: "exame" },
        { label: "chat.svc_retorno", to: "a_quando", svc: "retorno" }
      ]
    },
    a_quando: {
      ai: "chat.q_nao",
      options: [
        { label: "chat.opt_manha", to: "a_ok", period: "manha" },
        { label: "chat.opt_tarde", to: "a_ok", period: "tarde" }
      ]
    },
    a_ok: {
      ai: () => ({
        key: "chat.a_ok",
        params: {
          servico: t("chat.svc_" + (state.servico || "consulta")),
          periodo: t("chat.period_" + (state.periodo || "manha"))
        }
      }),
      options: [{ label: "chat.opt_done", to: "DONE" }]
    },

    /* Convênio */
    c_conv: {
      ai: () => ({ key: "chat.c_conv", params: { conv: convenioParts().label } }),
      options: [
        { label: "common.yes", to: "c_proc" },
        { label: "common.no", to: "c_trocar" }
      ]
    },
    c_trocar: {
      ai: "chat.c_trocar",
      text: { ph: "chat.convenio_ph" },
      textTo(value) {
        // Convênio escrito pelo paciente: sem cadastro, cobertura exige a equipe.
        state.form.convenio = "";
        state.convTyped = value.trim();
        return "c_proc_typed";
      }
    },
    c_proc_typed: {
      ai: "chat.c_proc",
      text: { ph: "chat.proc_ph" },
      textTo(value) {
        state.procedimento = value.trim();
        return { escalate: {
          titleKey: "esc.default_title",
          reasonKey: "esc.r_cobertura",
          reasonPt: "Dúvida sobre cobertura",
          eta: null
        } };
      }
    },
    c_proc: {
      ai: "chat.c_proc",
      text: { ph: "chat.proc_ph" },
      textTo(value) {
        state.procedimento = value.trim();
        const conv = coverageName();
        const cov = conv ? Store.COVERAGE[conv] : null;
        const n = norm(value);
        const covered = cov && cov.some((c) => n.includes(c) || c.includes(n));

        if (!covered) {
          return { escalate: {
            titleKey: "esc.default_title",
            reasonKey: "esc.r_cobertura",
            reasonPt: "Dúvida sobre cobertura",
            eta: null
          } };
        }
        addDoc("chat.d_opt_pedido");
        return "c_cobertura";
      }
    },
    c_cobertura: {
      ai: () => ({
        key: "chat.c_cobertura",
        params: { proc: state.procedimento, conv: coverageName() || convenioParts().label }
      }),
      options: [{ label: "chat.opt_done", to: "DONE" }]
    },

    /* Documentos */
    d_qual: {
      ai: "chat.d_qual",
      options: [
        { label: "chat.d_opt_pedido", to: "d_pedido" },
        { label: "chat.d_opt_foto", to: "d_foto" },
        { label: "chat.d_opt_cartao", to: "d_cartao" },
        { label: "chat.d_opt_outro", to: "d_outro" }
      ]
    },
    d_pedido: {
      ai: () => { state.docs = [doc("chat.d_opt_pedido"), doc("chat.d_opt_foto")]; return { key: "chat.d_pedido" }; },
      options: [{ label: "chat.opt_done", to: "DONE" }]
    },
    d_foto: {
      ai: () => { state.docs = [doc("chat.d_opt_foto")]; return { key: "chat.d_foto" }; },
      options: [{ label: "chat.opt_done", to: "DONE" }]
    },
    d_cartao: {
      ai: () => { state.docs = [doc("chat.d_opt_cartao"), doc("chat.d_opt_foto")]; return { key: "chat.d_cartao" }; },
      options: [{ label: "chat.opt_done", to: "DONE" }]
    },
    d_outro: {
      ai: "chat.d_outro",
      text: { ph: "chat.placeholder" },
      textTo(value) {
        state.docs = [doc("chat.d_opt_foto")];
        return { escalate: {
          titleKey: "esc.default_title",
          reasonKey: "esc.r_doc",
          reasonParams: { texto: value.trim() },
          reasonPt: "Documento: " + value.trim(),
          eta: null
        } };
      }
    },

    /* Outro */
    o_descreva: {
      ai: "chat.o_descreva",
      text: { ph: "chat.outro_ph" },
      textTo(value) {
        const txt = value.trim();
        state.procedimento = txt;
        return { escalate: {
          titleKey: "esc.default_title",
          reasonKey: null,
          reasonPt: txt.length > 70 ? txt.slice(0, 67) + "…" : txt,
          eta: null
        } };
      }
    }
  };

  /* Suporte a "então vá para..." usado na escolha do pedido médico */
  const _askNode = askNode;
  function askNodeWrapped(nodeId) { _askNode(nodeId); }

  function advanceWithThen(to) {
    if (to && to.then && to.node) {
      to.then();
      askNodeWrapped(to.node);
      return;
    }
    advance(to);
  }

  /* --- Renderização do chat ---------------------------------------------------- */
  function renderChat() {
    const log = $("#chat-log");
    const form = $("#chat-form");
    if (!log) return;

    log.innerHTML = "";

    state.chat.history.forEach((m, idx) => {
      const last = idx === state.chat.history.length - 1;

      if (m.role === "ai") {
        const row = document.createElement("div");
        row.className = "msg msg--ai";
        row.innerHTML =
          '<span class="avatar avatar--ai msg__avatar" data-icon="sparkles" data-size="18" aria-hidden="true"></span>' +
          '<div class="msg__body"><div class="bubble bubble--ai"></div></div>';
        const bubble = $(".bubble", row);
        let text = t(m.key, m.params);
        if (m.extraKey) text += "\n\n" + t(m.extraKey);
        bubble.textContent = text;
        log.appendChild(row);
        Icons.hydrate(row);

        if (last && state.chat.awaiting === "options") renderOptions();
        if (last && state.chat.awaiting === "text") renderInputHint();
      } else if (m.role === "user") {
        const row = document.createElement("div");
        row.className = "msg msg--user";
        row.innerHTML = '<div class="msg__body"><div class="bubble bubble--user"></div></div>';
        $(".bubble", row).textContent = m.key ? t(m.key, m.params) : m.text;
        log.appendChild(row);
      }
    });

    if (state.chat.awaiting === "typing") {
      const row = document.createElement("div");
      row.className = "msg msg--ai";
      row.innerHTML =
        '<span class="avatar avatar--ai msg__avatar" data-icon="sparkles" data-size="18" aria-hidden="true"></span>' +
        '<div class="msg__body"><div class="bubble bubble--ai typing" aria-label="' +
        t("chat.typing") + '"><span></span><span></span><span></span></div></div>';
      log.appendChild(row);
      Icons.hydrate(row);
    }

    // Aviso de encaminhamento quando o paciente volta para o chat
    if (state.escalation && state.screen === "chat") {
      const sys = document.createElement("div");
      sys.className = "sys-msg";
      sys.innerHTML = '<span data-icon="user-check" data-size="18"></span><span></span>';
      $("span:last-child", sys).textContent = t("esc.body");
      log.appendChild(sys);
      Icons.hydrate(sys);
    }

    if (state.chat.awaiting === "done" || state.chat.awaiting === "closed") {
      renderClosingActions();
    }

    const node = NODES[state.chat.node];
    form.hidden = !(state.chat.awaiting === "text" && node && node.text);
    log.scrollTop = log.scrollHeight;
  }

  function renderOptions() {
    const node = NODES[state.chat.node];
    if (!node || !node.options) return;
    const wrap = document.createElement("div");
    wrap.className = "quick-replies";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", t("chat.title"));

    node.options.forEach((opt) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "quick-reply";
      b.textContent = t(opt.label);
      b.addEventListener("click", () => {
        if (opt.svc) state.servico = opt.svc;
        if (opt.period) state.periodo = opt.period;
        pushUser({ key: opt.label });
        disableReplies();
        advanceWithThen(opt.to);
      });
      wrap.appendChild(b);
    });

    $("#chat-log").appendChild(wrap);
  }

  function renderInputHint() {
    const node = NODES[state.chat.node];
    if (!node || !node.text) return;
    const hint = document.createElement("p");
    hint.className = "chat-hint";
    hint.innerHTML = '<span data-icon="info" data-size="16"></span><span></span>';
    $("span:last-child", hint).textContent = t("chat.hint");
    $("#chat-log").appendChild(hint);
    Icons.hydrate(hint);
  }

  function renderClosingActions() {
    const wrap = document.createElement("div");
    wrap.className = "quick-replies";

    const b = document.createElement("button");
    b.type = "button";
    b.className = "quick-reply quick-reply--primary";
    b.textContent = t("chat.review");
    b.addEventListener("click", () => goTo("resumo"));
    wrap.appendChild(b);

    $("#chat-log").appendChild(wrap);
  }

  function setupChat() {
    $("#chat-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#chat-text");
      const value = input.value.trim();
      if (!value) return;
      const node = NODES[state.chat.node];
      if (!node || !node.text) return;

      pushUser({ text: value });
      input.value = "";
      state.chat.awaiting = "typing";
      renderChat();

      const to = node.textTo(value);
      setTimeout(() => advance(to), reduceMotion() ? 80 : 320);
    });

    $("#btn-human").addEventListener("click", () => {
      if (state.escalation) { goTo("encaminhamento"); return; }
      pushUser({ key: "chat.human" });
      state.chat.awaiting = "closed";
      renderChat();
      setTimeout(() => triggerEscalation({
        titleKey: "esc.human_title",
        reasonKey: "esc.r_humano",
        reasonPt: "Pedido de atendimento humano",
        eta: 15
      }), reduceMotion() ? 150 : 700);
    });
  }

  /* --- Encaminhamento ---------------------------------------------------------- */
  function buildResumoIa() {
    const first = firstName(state.form.nome);
    const parts = [];
    parts.push(
      "Paciente " + first + " — motivo: " +
      (state.escalation ? state.escalation.reasonPt : PT.motivo[state.motivo] || "—") + "."
    );
    if (state.escalation) {
      parts.push(
        "A IA não conseguiu confirmar a informação e encaminhou o atendimento para a equipe."
      );
    } else {
      parts.push("A IA respondeu as dúvidas e organizou o atendimento, sem pendências.");
    }
    if (state.procedimento) parts.push("Procedimento informado: " + state.procedimento + ".");
    if (state.docs.length) parts.push("Documentos orientados: " + state.docs.map((d) => d.pt).join(", ") + ".");
    else parts.push("Documentos: a equipe informará.");
    return parts.join(" ");
  }

  function buildConversa() {
    return state.chat.history.map((m) => ({
      role: m.role === "ai" ? "ai" : "user",
      text: m.key ? t(m.key, m.params) : m.text
    }));
  }

  /** Cria ou atualiza o registro sem apagar o que a recepção já fez. */
  function saveRecord() {
    if (!state.recordId) {
      const rec = Store.add(buildRecord());
      state.recordId = rec.id;
      return;
    }
    const patch = buildRecord();
    const existing = Store.get(state.recordId);
    if (existing) {
      // Status, resolução e destino pertencem à equipe: confirmar a
      // informação no app não pode devolver o caso para a fila.
      patch.status = existing.status;
      patch.resolvidoPor = existing.resolvidoPor;
      patch.destino = existing.destino;
    }
    Store.update(state.recordId, patch);
  }

  function triggerEscalation(cfg) {
    state.chat.awaiting = "closed";
    state.eta = typeof cfg.eta === "number" ? cfg.eta : null;
    state.escalation = {
      titleKey: cfg.titleKey || "esc.default_title",
      reasonKey: cfg.reasonKey,
      reasonParams: cfg.reasonParams || {},
      reasonPt: cfg.reasonPt,
      eta: state.eta
    };

    // O número do atendimento nasce aqui: o paciente nunca fica sem número.
    saveRecord();

    renderEscalation();
    goTo("encaminhamento");
  }

  function renderEscalation() {
    if (!state.escalation) return;
    const esc = state.escalation;
    $("#esc-title").textContent = t(esc.titleKey);
    $("#esc-number").textContent = state.recordId || "—";
    $("#esc-motivo").textContent = esc.reasonKey
      ? t(esc.reasonKey, esc.reasonParams)
      : esc.reasonPt;

    const row = $("#esc-eta-row");
    if (typeof esc.eta === "number") {
      row.hidden = false;
      $("#esc-eta").textContent = t("esc.eta_value", { minutes: esc.eta });
    } else {
      row.hidden = true;
    }
  }

  /* --- Resumo ------------------------------------------------------------------- */
  function motivoDisplay() {
    if (state.motivo === "outro" && state.procedimento) return state.procedimento;
    return t("reason." + state.motivo);
  }

  function renderSummary() {
    $("#sum-nome").textContent = state.form.nome || "—";
    $("#sum-motivo").textContent = motivoDisplay();
    $("#sum-convenio").textContent = state.convTyped || convenioParts().label || "—";
    $("#sum-docs").textContent = state.docs.length
      ? state.docs.map((d) => t(d.key)).join(" + ")
      : t("sum.docs_none");
  }

  function birthToBR(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return d && m && y ? `${d}/${m}/${y}` : iso;
  }

  function buildRecord() {
    const motivoPt = state.escalation
      ? state.escalation.reasonPt
      : state.motivo === "outro" && state.procedimento
        ? String(state.procedimento).slice(0, 70)
        : PT.motivo[state.motivo] || "—";

    let procedimento = state.procedimento || "";
    if (state.motivo === "agendamento" && state.servico) {
      procedimento = PT.svc[state.servico];
    }
    if (state.motivo === "documentos" && state.docs.length === 1) {
      procedimento = state.docs[0].pt;
    }
    if (state.motivo === "consulta") procedimento = "Consulta";

    return {
      nome: state.form.nome,
      cpf: state.form.cpf,
      nascimento: birthToBR(state.form.nascimento),
      telefone: state.form.telefone,
      convenio: state.convTyped || convenioParts().pt || "Não informado",
      categoria: state.motivo || "outro",
      motivo: motivoPt,
      procedimento: procedimento || "Não informado",
      documentos: state.docs.map((d) => d.pt),
      status: Store.STATUS.AGUARDANDO,
      resolvidoPor: null,
      eta: state.eta,
      destino: null,
      origem: "ia",
      resumo: buildResumoIa(),
      conversa: buildConversa()
    };
  }

  function renderSuccess() {
    $("#ok-number").textContent = state.recordId || "—";
    $("#ok-body").textContent = t("ok.body", { nome: firstName(state.form.nome) });
    const row = $("#ok-eta-row");
    if (typeof state.eta === "number") {
      row.hidden = false;
      $("#ok-eta").textContent = t("esc.eta_value", { minutes: state.eta });
    } else {
      row.hidden = true;
    }
  }

  /* --- Confirmação e reinício ------------------------------------------------------ */
  function confirmSummary() {
    saveRecord();
    renderSuccess();
    goTo("sucesso");
    toast({ title: t("ok.confirmed"), text: t("esc.number") + ": " + state.recordId, tone: "success" });
  }

  function restart() {
    state.form = { nome: "", cpf: "", nascimento: "", telefone: "", convenio: "" };
    state.motivo = null;
    state.docs = [];
    state.procedimento = null;
    state.servico = null;
    state.periodo = null;
    state.escalation = null;
    state.eta = null;
    state.recordId = null;
    state.convTyped = null;
    state.chat = { history: [], node: null, awaiting: null, motivoAtStart: null, closed: false };

    $("#form-identificacao").reset();
    ["f-nome", "f-cpf", "f-nascimento", "f-telefone", "f-convenio"].forEach(clearError);
    $$(".reason-card").forEach((c) => c.setAttribute("aria-pressed", "false"));
    $("#btn-reason-continue").disabled = true;
    $("#chat-log").innerHTML = "";
    $("#chat-text").value = "";
    $("#chat-form").hidden = true;
    renderSelect();
    goTo("home");
  }

  /* --- Botões globais --------------------------------------------------------------- */
  function setupNav() {
    $("#btn-start").addEventListener("click", () => goTo("identificacao"));
    $("#btn-confirm").addEventListener("click", confirmSummary);
    $("#btn-restart").addEventListener("click", restart);

    $$("[data-goto]").forEach((btn) => {
      btn.addEventListener("click", () => goTo(btn.dataset.goto));
    });

    $$(".kv__edit[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.edit;
        if (target === "chat") {
          renderChat();
          goTo("chat");
        } else {
          goTo(target);
        }
      });
    });
  }

  /* --- Boot -------------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    I18n.apply();
    Icons.hydrate();
    document.documentElement.lang = I18n.getLang();
    $("#lang-code").textContent = I18n.getCode();

    renderSelect();
    renderProgress();
    setupLang();
    setupHelp();
    setupForm();
    setupReasons();
    setupChat();
    setupNav();
  });
})();
