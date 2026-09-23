/* ==========================================================================
   MedFlow — Ícones (SVG inline, estilo stroke 24px)
   Uso: <span data-icon="check" data-size="20"></span>
        ou Icons.get('check', 20)
   ========================================================================== */

const Icons = (() => {
  const paths = {
    /* Navegação / ações */
    "arrow-right": '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    "arrow-left": '<path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/>',
    "arrow-up-right": '<path d="M7 17L17 7"/><path d="M8 7h9v9"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
    close: '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>',
    send: '<path d="M21 3L10.5 13.5"/><path d="M21 3l-6.8 18-3.7-7.5L3 9.8 21 3z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16.8 16.8"/>',
    "chevron-down": '<path d="M6 9l6 6 6-6"/>',
    "chevron-right": '<path d="M9 6l6 6-6 6"/>',
    "corner-up-right": '<path d="M5 19V9.5A4.5 4.5 0 0 1 9.5 5H19"/><path d="M15 1l4 4-4 4"/>',
    "log-out": '<path d="M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10"/><path d="M15.5 8l4 4-4 4"/><path d="M19.5 12H9"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-.7 4.5"/><path d="M20 4.5V11h-6.5"/>',

    /* Comunicação / pessoas */
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.2-3.4 4-5.5 7.5-5.5s6.3 2.1 7.5 5.5"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c1-3 3.4-5 6.5-5s5.5 2 6.5 5"/><path d="M16 5.5a3.5 3.5 0 0 1 0 6.6"/><path d="M18 15.4c2 .8 3.3 2.5 3.9 4.6"/>',
    "user-check": '<circle cx="10" cy="8" r="4"/><path d="M3.5 20.5c1.1-3.3 3.6-5.5 6.5-5.5 1 0 1.9.2 2.7.7"/><path d="M15.5 18l2 2 4-4.5"/>',
    phone: '<path d="M6.5 3.5h3.2l1.6 4-2 1.4a11.5 11.5 0 0 0 5.3 5.3l1.4-2 4 1.6v3.2a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/>',
    bell: '<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6z"/><path d="M10.5 19.5a2 2 0 0 0 3 0"/>',
    "message-circle": '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.6-.8L3 20.5l1.5-4.6A8.4 8.4 0 0 1 12 3.5a8.4 8.4 0 0 1 9 8z"/>',

    /* Hospital / atendimento */
    hospital: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M12 7.5v5"/><path d="M9.5 10h5"/><path d="M8.5 21v-3.5h7V21"/>',
    "heart-pulse": '<path d="M12 20.3S3.5 15.4 3.5 9.7A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 8.5 3.1c0 5.7-8.5 10.6-8.5 10.6z"/><path d="M4.8 12h3.4l1.4-2.2 1.9 4 1.4-2.6h3.6"/>',
    stethoscope: '<path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M4.5 3h3"/><path d="M12.5 3h3"/><path d="M10 12v3a5 5 0 0 0 10 0v-1.6"/><circle cx="20" cy="11" r="2"/>',
    flask: '<path d="M9.5 3h5"/><path d="M10.5 3v6L5.4 18.6A2 2 0 0 0 7.1 21.5h9.8a2 2 0 0 0 1.7-2.9L13.5 9V3"/><path d="M8 15h8"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M3.5 10h17"/>',
    "credit-card": '<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19"/><path d="M6 14.5h3"/>',
    file: '<path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8L14 3.5z"/><path d="M13.8 3.6V8H18.5"/><path d="M9 13h6"/><path d="M9 16.5h4"/>',
    "clipboard-list": '<rect x="8.5" y="2.5" width="7" height="4" rx="1.2"/><path d="M15.5 4.5H17A2 2 0 0 1 19 6.5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h1.5"/><path d="M8.5 11h7"/><path d="M8.5 15h7"/><path d="M8.5 18.5h4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>',
    pin: '<path d="M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    shield: '<path d="M12 3l7 2.8v5.7c0 4.4-2.9 7.6-7 9.5-4.1-1.9-7-5.1-7-9.5V5.8L12 3z"/><path d="M9 12l2 2 4-4"/>',
    "file-check": '<path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8L14 3.5z"/><path d="M13.8 3.6V8H18.5"/><path d="M8.8 14.5l1.8 1.8 3.6-3.8"/>',
    "id-card": '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5 16.2c.7-1.5 2-2.4 3.5-2.4s2.8.9 3.5 2.4"/><path d="M14.5 10h4"/><path d="M14.5 13.5h4"/>',

    /* Interface */
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.6 12h16.8"/><path d="M12 3.5c2.3 2.4 3.5 5.4 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.4-3.5-8.5S9.7 5.9 12 3.5z"/>',
    help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.6a2.4 2.4 0 1 1 3.2 2.3c-.7.3-1.1 1-1.1 1.8v.3"/><circle cx="11.9" cy="17" r="0.6" fill="currentColor" stroke="none"/>',
    alert: '<path d="M12 4.5L2.8 20h18.4L12 4.5z"/><path d="M12 10.5v4"/><circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r="0.6" fill="currentColor" stroke="none"/>',
    sparkles: '<path d="M11 4.5l1.5 4 4 1.5-4 1.5L11 15.5 9.5 11.5l-4-1.5 4-1.5L11 4.5z"/><path d="M17.5 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z"/>',
    bot: '<rect x="4.5" y="8" width="15" height="11" rx="3"/><path d="M12 4.5V8"/><circle cx="12" cy="4" r="1.3"/><path d="M9 12.5h.01"/><path d="M15 12.5h.01"/><path d="M9.5 16h5"/>',
    list: '<path d="M4 6.5h16"/><path d="M4 12h16"/><path d="M4 17.5h10"/>',
    "layout-dashboard": '<rect x="3.5" y="3.5" width="7" height="8" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.5"/><rect x="13.5" y="11" width="7" height="9.5" rx="1.5"/><rect x="3.5" y="14.5" width="7" height="6" rx="1.5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 14.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    "external-link": '<path d="M13.5 4.5H19.5V10.5"/><path d="M19.5 4.5L11 13"/><path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10"/>',
    inbox: '<path d="M3.5 13.5h4l1.5 2.5h6l1.5-2.5h4"/><path d="M5.6 5.2l-2.1 8.3V18a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-4.5l-2.1-8.3A2 2 0 0 0 16.6 4H7.4a2 2 0 0 0-1.8 1.2z"/>',
    history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1"/><path d="M3.5 4.5V10H9"/><path d="M12 7.5V12l3.2 1.9"/>',
    lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2.5"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>',
    camera: '<path d="M4 8.5h2.6l1.4-2.2h8l1.4 2.2H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5z"/><circle cx="12" cy="13.5" r="3.2"/>',
    building: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M9 7.5h2"/><path d="M13 7.5h2"/><path d="M9 11.5h2"/><path d="M13 11.5h2"/><path d="M10.5 20.5v-4h3v4"/>'
  };

  function get(name, size = 24, extraClass = "") {
    const body = paths[name] || paths.info;
    const s = size;
    return (
      '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s +
      '" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"' +
      (extraClass ? ' class="' + extraClass + '"' : "") + ">" + body + "</svg>"
    );
  }

  /** Substitui todos os [data-icon] de um elemento raiz. */
  function hydrate(root = document) {
    root.querySelectorAll("[data-icon]").forEach((el) => {
      if (el.dataset.iconDone === "1") return;
      const size = Number(el.dataset.size || 24);
      el.innerHTML = get(el.dataset.icon, size);
      el.dataset.iconDone = "1";
    });
  }

  function has(name) { return Boolean(paths[name]); }

  return { get, hydrate, has };
})();

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => Icons.hydrate());
}
