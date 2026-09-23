/* ==========================================================================
   MedFlow — Dashboard da equipe
   Indicadores, lista de atendimentos e painel de dados coletados pela IA.
   ========================================================================== */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const CATEGORIA_PT = {
    consulta: "Consulta",
    exame: "Exame",
    agendamento: "Agendamento",
    convenio: "Convênio",
    documentos: "Documentos",
    outro: "Outro"
  };

  const FILTER_LABEL = {
    todos: "Todos",
    aguardando: "Aguardando atendimento",
    em_andamento: "Em atendimento",
    resolvido: "Resolvido",
    acao_necessaria: "Ação necessária"
  };

  const state = {
    filter: "todos",
    query: "",
    selectedId: null,
    forwardSector: null,
    lastFocus: null,
    knownIds: new Set()
  };

  /* --- Toast ---------------------------------------------------------------- */
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

  /* --- Dados ----------------------------------------------------------------- */
  function badgeHTML(status) {
    const meta = Store.statusMeta(status);
    return (
      '<span class="badge badge--' + meta.tone + '">' +
      '<span data-icon="' + meta.icon + '" data-size="14"></span>' +
      meta.label +
      "</span>"
    );
  }

  function filtered() {
    const q = state.query.trim().toLowerCase();
    return Store.all().filter((r) => {
      const byStatus = state.filter === "todos" || r.status === state.filter;
      if (!byStatus) return false;
      if (!q) return true;
      return [r.nome, r.motivo, r.id, r.convenio, r.procedimento]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }

  /* --- Indicadores ------------------------------------------------------------ */
  function renderKpis() {
    const c = Store.counts();
    $("#kpi-total").textContent = String(c.total);
    $("#kpi-waiting").textContent = String(c.aguardando);
    $("#kpi-ai").textContent = String(c.resolvidosIA);
    $("#nav-count").textContent = String(c.total);

    const waitingMeta = $("#kpi-waiting-meta");
    if (c.aguardando === 0) waitingMeta.textContent = "fila vazia — tudo em dia";
    else if (c.aguardando === 1) waitingMeta.textContent = "1 pessoa aguardando na recepção";
    else waitingMeta.textContent = c.aguardando + " pessoas aguardando na recepção";

    $$("[data-count]").forEach((el) => {
      const key = el.dataset.count;
      const n = key === "todos" ? c.total : Store.all().filter((r) => r.status === key).length;
      el.textContent = String(n);
    });
  }

  /* --- Lista ------------------------------------------------------------------- */
  function renderTable() {
    const body = $("#patients-body");
    const rows = filtered();
    body.innerHTML = "";

    $("#empty-state").hidden = rows.length > 0;
    $("#patients-table").hidden = rows.length === 0;

    rows.forEach((r) => {
      const meta = Store.statusMeta(r.status);
      const cat = CATEGORIA_PT[r.categoria] || "";
      const tr = document.createElement("tr");
      tr.tabIndex = 0;
      tr.dataset.id = r.id;
      if (r.id === state.selectedId) tr.classList.add("is-selected");
      tr.setAttribute(
        "aria-label",
        r.nome + " — " + r.motivo + " — " + r.convenio + " — " + meta.label + " — " + r.horario
      );

      tr.innerHTML =
        '<td data-label="Paciente">' +
          '<button type="button" class="row-name">' +
            "<span></span>" +
            '<span class="row-sub"></span>' +
          "</button>" +
        "</td>" +
        '<td data-label="Motivo"><span class="cell-motivo"><strong></strong><span></span></span></td>' +
        '<td data-label="Convênio"></td>' +
        '<td data-label="Status">' + badgeHTML(r.status) + "</td>" +
        '<td data-label="Horário" class="time-cell"></td>';

      $(".row-name span:first-child", tr).textContent = r.nome;
      $(".row-name .row-sub", tr).textContent = r.id;
      $(".cell-motivo strong", tr).textContent = r.motivo;
      $(".cell-motivo span", tr).textContent = cat && cat !== r.motivo ? cat : "Atendimento via IA";
      tr.children[2].textContent = r.convenio;
      tr.children[4].textContent = r.horario;

      body.appendChild(tr);
    });

    Icons.hydrate(body);
  }

  /* --- Painel de detalhe ---------------------------------------------------------- */
  function kvRow(label, value) {
    const wrap = document.createElement("div");
    wrap.className = "kv__row";

    const dt = document.createElement("dt");
    dt.className = "kv__label";
    dt.textContent = label;

    const dd = document.createElement("dd");
    dd.className = "kv__value";
    dd.textContent = value;

    wrap.appendChild(dt);
    wrap.appendChild(dd);
    return wrap;
  }

  function openDrawer(id) {
    const r = Store.get(id);
    if (!r) return;
    state.selectedId = id;
    state.lastFocus = document.activeElement;

    const meta = Store.statusMeta(r.status);

    $("#drawer-id").textContent = "Atendimento " + r.id + " · " + r.horario;
    $("#drawer-badge").innerHTML = badgeHTML(r.status);
    $("#drawer-name").textContent = r.nome;
    $("#drawer-sub").textContent =
      (CATEGORIA_PT[r.categoria] || "Atendimento") + " · " + r.convenio +
      (r.destino ? " · Encaminhado para " + r.destino : "");

    /* Dados coletados */
    const kv = $("#drawer-kv");
    kv.innerHTML = "";
    kv.appendChild(kvRow("Paciente", r.nome));
    kv.appendChild(kvRow("CPF", r.cpf || "Não informado"));
    kv.appendChild(kvRow("Data de nascimento", r.nascimento || "Não informado"));
    kv.appendChild(kvRow("Telefone", r.telefone || "Não informado"));
    kv.appendChild(kvRow("Convênio", r.convenio));
    kv.appendChild(kvRow("Motivo", r.motivo));
    kv.appendChild(kvRow("Procedimento", r.procedimento || "Não informado"));

    /* Documentos */
    const docs = $("#drawer-docs");
    docs.innerHTML = "";
    if (r.documentos && r.documentos.length) {
      r.documentos.forEach((d) => {
        const li = document.createElement("li");
        li.innerHTML = '<span data-icon="check-circle" data-size="16"></span><span></span>';
        $("span:last-child", li).textContent = d;
        docs.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.className = "is-empty";
      li.innerHTML = '<span data-icon="info" data-size="16"></span><span></span>';
      $("span:last-child", li).textContent = "Nenhum documento coletado até aqui.";
      docs.appendChild(li);
    }

    /* Resumo gerado pela IA */
    $("#drawer-resumo").textContent = r.resumo || "Sem resumo disponível.";

    /* Conversa completa */
    const transcript = $("#drawer-transcript");
    const msgs = $("#drawer-messages");
    const section = transcript.closest("section");
    msgs.innerHTML = "";

    if (r.conversa && r.conversa.length) {
      section.hidden = false;
      r.conversa.forEach((m) => {
        const line = document.createElement("div");
        line.className = "transcript__line";
        const who = m.role === "ai" ? "IA" : "Paciente";
        line.innerHTML =
          '<span class="transcript__who transcript__who--' + (m.role === "ai" ? "ai" : "user") +
          '"></span><span class="transcript__text"></span>';
        $(".transcript__who", line).textContent = m.role === "ai" ? "IA" : "EU";
        $(".transcript__who", line).setAttribute("title", who);
        $(".transcript__text", line).textContent = m.text;
        msgs.appendChild(line);
      });
      transcript.open = false;
    } else {
      section.hidden = true;
    }

    /* Tempo estimado (só quando existe informação) */
    const etaBox = $("#drawer-eta");
    const etaParts = [];
    if (typeof r.eta === "number") {
      etaParts.push("Tempo estimado de espera: " + r.eta + " minutos, com base na fila atual.");
    }
    if (r.destino) etaParts.push("Encaminhado para " + r.destino + ".");
    if (etaParts.length) {
      etaBox.hidden = false;
      $("#drawer-eta-text").textContent = etaParts.join(" ");
    } else {
      etaBox.hidden = true;
    }

    /* Ações */
    const resolved = r.status === Store.STATUS.RESOLVIDO;
    $("#drawer-actions").hidden = resolved;
    const doneEl = $("#drawer-done");
    doneEl.hidden = !resolved;
    if (resolved) {
      doneEl.innerHTML =
        '<span data-icon="check-circle" data-size="16"></span><span></span>';
      $("span:last-child", doneEl).textContent = r.resolvidoPor === "ia"
        ? "Resolvido pela IA. Não há ações pendentes."
        : "Finalizado pela recepção. Não há ações pendentes.";
    }

    $("#drawer").hidden = false;
    $("#drawer-backdrop").hidden = false;
    Icons.hydrate($("#drawer"));
    renderTable();
    $("#drawer-name").focus({ preventScroll: true });
  }

  function closeDrawer() {
    $("#drawer").hidden = true;
    $("#drawer-backdrop").hidden = true;
    const id = state.selectedId;
    state.selectedId = null;
    renderTable();
    const row = id ? $('tr[data-id="' + id + '"]') : null;
    if (row) row.focus();
    else if (state.lastFocus) state.lastFocus.focus();
  }

  /* --- Ações do atendimento -------------------------------------------------------- */
  function updateSelected(patch, toastCfg) {
    if (!state.selectedId) return;
    Store.update(state.selectedId, patch);
    renderKpis();
    renderTable();
    openDrawer(state.selectedId);
    if (toastCfg) toast(toastCfg);
  }

  function setupActions() {
    $("#btn-assume").addEventListener("click", () => {
      updateSelected(
        { status: Store.STATUS.EM_ANDAMENTO, resolvidoPor: null, destino: "Recepção — Camila Rocha" },
        { title: "Atendimento assumido", text: "Você é responsável por este caso agora.", tone: "success" }
      );
    });

    const modal = $("#forward-modal");
    const openForward = () => {
      state.forwardSector = null;
      $$("#forward-options .option").forEach((o) => {
        o.classList.remove("is-selected");
        o.setAttribute("aria-checked", "false");
      });
      $("#btn-forward-confirm").disabled = true;
      modal.hidden = false;
      $("#forward-options .option").focus();
    };
    const closeForward = () => { modal.hidden = true; $("#btn-forward").focus(); };

    $("#btn-forward").addEventListener("click", openForward);
    $$("[data-close-forward]").forEach((b) => b.addEventListener("click", closeForward));

    $("#forward-options").addEventListener("click", (e) => {
      const opt = e.target.closest("[data-sector]");
      if (!opt) return;
      $$("#forward-options .option").forEach((o) => {
        o.classList.remove("is-selected");
        o.setAttribute("aria-checked", "false");
      });
      opt.classList.add("is-selected");
      opt.setAttribute("aria-checked", "true");
      state.forwardSector = opt.dataset.sector;
      $("#btn-forward-confirm").disabled = false;
    });

    $("#btn-forward-confirm").addEventListener("click", () => {
      if (!state.forwardSector) return;
      modal.hidden = true;
      updateSelected(
        { status: Store.STATUS.EM_ANDAMENTO, destino: state.forwardSector },
        { title: "Encaminhado para " + state.forwardSector, text: "O paciente mantém o mesmo número de atendimento.", tone: "success" }
      );
      $("#btn-forward").focus();
    });

    $("#btn-finish").addEventListener("click", () => {
      updateSelected(
        { status: Store.STATUS.RESOLVIDO, resolvidoPor: "recepcao" },
        { title: "Atendimento finalizado", text: "O caso saiu da fila da recepção.", tone: "success" }
      );
    });
  }

  /* --- Filtros e navegação ---------------------------------------------------------- */
  function setupFilters() {
    $("#status-chips").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-filter]");
      if (!chip) return;
      state.filter = chip.dataset.filter;
      $$("#status-chips .chip").forEach((c) => {
        const active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-pressed", String(active));
      });
      renderTable();
    });

    $("#search-input").addEventListener("input", (e) => {
      state.query = e.target.value;
      renderTable();
    });

    $("#btn-clear-filters").addEventListener("click", () => {
      state.filter = "todos";
      state.query = "";
      $("#search-input").value = "";
      $$("#status-chips .chip").forEach((c) => {
        const active = c.dataset.filter === "todos";
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-pressed", String(active));
      });
      renderTable();
      $("#search-input").focus();
    });

    $("#btn-refresh").addEventListener("click", () => {
      renderKpis();
      renderTable();
      toast({ title: "Lista atualizada", text: "Dados sincronizados com os atendimentos.", tone: "success" });
    });
  }

  function setupNav() {
    $$(".nav-item").forEach((item) => {
      item.addEventListener("click", () => {
        const target = item.dataset.nav;
        if (target === "soon") {
          toast({ title: "Em breve", text: "Esta seção faz parte da próxima etapa do protótipo.", tone: "info" });
          return;
        }
        $$(".nav-item").forEach((n) => {
          n.classList.remove("is-active");
          n.removeAttribute("aria-current");
        });
        item.classList.add("is-active");
        item.setAttribute("aria-current", "page");

        if (target === "top") window.scrollTo({ top: 0, behavior: "smooth" });
        else $("#secao-lista").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function setupTable() {
    const body = $("#patients-body");

    body.addEventListener("click", (e) => {
      const tr = e.target.closest("tr[data-id]");
      if (tr) openDrawer(tr.dataset.id);
    });

    body.addEventListener("keydown", (e) => {
      const tr = e.target.closest("tr[data-id]");
      if (!tr) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDrawer(tr.dataset.id);
      }
    });

    $("#drawer-close").addEventListener("click", closeDrawer);
    $("#drawer-backdrop").addEventListener("click", closeDrawer);

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!$("#forward-modal").hidden) {
        $("#forward-modal").hidden = true;
        $("#btn-forward").focus();
      } else if (!$("#drawer").hidden) {
        closeDrawer();
      }
    });
  }

  function renderDate() {
    const d = new Date();
    const label = d.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    $("#today-label").textContent = label.charAt(0).toUpperCase() + label.slice(1);
  }

  /* --- Boot -------------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    Icons.hydrate();
    renderDate();
    renderKpis();
    renderTable();
    setupFilters();
    setupNav();
    setupTable();
    setupActions();

    // Novo atendimento vindo da aba do paciente
    Store.all().forEach((r) => state.knownIds.add(r.id));
    Store.onChange(() => {
      const fresh = Store.all().filter((r) => !state.knownIds.has(r.id));
      fresh.forEach((r) => state.knownIds.add(r.id));
      renderKpis();
      renderTable();
      if (fresh.length) {
        toast({
          title: "Novo atendimento recebido",
          text: fresh[0].nome + " · " + fresh[0].motivo,
          tone: "info"
        });
      }
    });
  });
})();
