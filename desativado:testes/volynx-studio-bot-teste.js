document.addEventListener("DOMContentLoaded", () => {
  (() => {
    "use strict";

    // ---------- Config ----------
    const userCfg = window.VOLYNX_BOT_CONFIG || {};
    const kbCfg = window.VOLYNX_BOT?.config || {};

    const botName = userCfg.botName || "Sandra";
    const botRole = userCfg.botRole || "Bot da imobiliária";
    const launcherHint = userCfg.launcherHint || "Pergunte aqui";
    const neighborhood = userCfg.neighborhood || "Freguesia do Ó";

    const formUrl =
      kbCfg.formUrl ||
      userCfg.formUrl ||
      userCfg?.contact?.formUrl ||
      "https://caner.aggilizador.com.br/";

    const email =
      kbCfg.email ||
      userCfg.email ||
      userCfg?.contact?.email ||
      "contato@valcarce.com.br";

    const whatsapp =
      kbCfg.whatsapp ||
      userCfg.whatsapp ||
      userCfg?.contact?.whatsapp ||
      "+55 11 99460-3024";

    // ---------- CSS completo ----------
    const css = `
        .vx-bot-launcher{
          position: fixed !important;
          right: 14px;
          bottom: calc(env(safe-area-inset-bottom, 0px) + 14px);
          z-index: 99999 !important;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }
        .vx-bot-fab{
          border: 3px outset rgb(0, 0, 0);
          cursor: pointer;
          border-radius: 30px;
          padding: 22px 24px;
          display: flex;
          gap: 10px;
          align-items: center;
          box-shadow: 0 15px 10px rgba(0,0,0,0.4);
          background: linear-gradient(50deg, rgba(99, 234, 95, 0.91), rgba(150, 9, 214, 0.82), rgba(12, 229, 76, 0.84));
          color: #fff;
          max-width: min(340px, calc(100vw - 28px));
        }
        .vx-bot-avatar{
          width:48px; height:48px; border-radius:999px;
          display:grid; place-items:center;
          border:3px inset rgba(255,255,255,0.38);
          background:rgba(0,0,0,.14);
          flex:0 0 auto;
        }
        .vx-bot-avatar.small{ width:90px; height:90px; }
        .vx-bot-labels{ display:flex; flex-direction:column; align-items:flex-start; min-width:0; }
        .vx-bot-name{ font-weight:800; font-size:13px; line-height:1.05; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:240px; }
        .vx-bot-hint{ font-size:12px; opacity:.85; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:240px; }
        
        .vx-bot-panel{
          position: fixed !important;
          right:14px;
          bottom: calc(14px + env(safe-area-inset-bottom, 0px) + 60px);
          width:min(420px, calc(100vw - 28px));
          max-height:min(70vh, 620px);
          background:#0b0f19;
          border:1px solid rgba(255,255,255,.10);
          border-radius:18px;
          box-shadow:0 24px 70px rgba(0,0,0,.55);
          overflow:hidden;
          display:none;
        }
        .vx-bot-panel.open{ display:flex; flex-direction:column; }
        
        @media (max-width: 768px){
          .vx-bot-launcher{
            bottom: calc(env(safe-area-inset-bottom, 0px) + 14px);
            right: 14px;
          }
          .vx-bot-panel{
            width: calc(100vw - 20px);
            right: 10px;
            bottom: calc(14px + env(safe-area-inset-bottom, 0px) + 60px);
            max-height: 75vh;
          }
        }
        @media (min-width: 900px){
          .vx-bot-launcher{ right:18px; bottom:18px; }
          .vx-bot-avatar{ width:90px; height:90px; }
          .vx-bot-panel{ max-height:min(72vh, 680px); }
        }
        
        .vx-bot-launcher, .vx-bot-panel{
          isolation: isolate;
          pointer-events: auto;
        }
        
        /* Painel header, corpo, mensagens, botões, chips, inputs */
        .vx-bot-header{ padding:12px 14px; border-bottom:1px solid rgba(255,255,255,.10); display:flex; gap:10px; align-items:center; }
        .vx-bot-title{ color:#fff; font-weight:700; font-size:13px; line-height:1.2; }
        .vx-bot-sub{ color:rgba(255,255,255,.70); font-size:12px; line-height:1.2; }
        .vx-bot-meta{ display:flex; gap:8px; margin-left:auto; }
        .vx-mini{ border:0; background:transparent; color:rgba(255,255,255,.7); cursor:pointer; font-size:12px; }
        .vx-bot-actions{ padding:10px 14px; display:flex; gap:8px; flex-wrap:wrap; border-bottom:1px solid rgba(255,255,255,.10); }
        .vx-action{ border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.06); color:#fff; border-radius:999px; padding:8px 10px; font-size:12px; cursor:pointer; }
        .vx-bot-body{ padding:12px; overflow:auto; display:flex; flex-direction:column; gap:10px; }
        .vx-msg{ max-width:85%; padding:10px 12px; border-radius:14px; font-size:13px; line-height:1.35; white-space:pre-wrap; }
        .vx-msg.bot{ background:rgba(255,255,255,.06); color:#fff; border:1px solid rgba(255,255,255,.08); }
        .vx-msg.user{ margin-left:auto; background:#fff; color:#0b0f19; }
        .vx-chips{ display:flex; flex-wrap:wrap; gap:8px; margin-top:2px; }
        .vx-chip{ border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.06); color:#fff; border-radius:999px; padding:8px 10px; font-size:12px; cursor:pointer; }
        .vx-cta{ margin-top:6px; color:rgba(255,255,255,.85); font-size:12px; }
        .vx-bot-input{ border-top:1px solid rgba(255,255,255,.10); padding:10px; display:flex; gap:8px; background:#0b0f19; }
        .vx-bot-field{ flex:1; border-radius:12px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.06); color:#fff; padding:10px 10px; font-size:13px; outline:none; }
        .vx-bot-send{ border:0; border-radius:12px; padding:10px 12px; background:#fff; color:#0b0f19; cursor:pointer; font-weight:700; }
        `;

    const root = document.createElement("div");
    root.className = "vx-bot-launcher";
    root.innerHTML = `
            <style>${css}</style>
        
            <button class="vx-bot-fab" type="button" aria-expanded="false" aria-label="${escapeHtml(botName)}">
              <div class="vx-bot-avatar" aria-hidden="true"></div>
              <div class="vx-bot-labels">
                <div class="vx-bot-name">${escapeHtml(botName)}</div>
                <div class="vx-bot-hint">${escapeHtml(launcherHint)}</div>
              </div>
            </button>
        
            <div class="vx-bot-panel" role="dialog" aria-label="Chat da ${escapeHtml(botName)}">
              <div class="vx-bot-header">
                <div class="vx-bot-avatar small" aria-hidden="true"></div>
                <div>
                  <div class="vx-bot-title">${escapeHtml(botName)} • ${escapeHtml(botRole)}</div>
                  <div class="vx-bot-sub">Respostas rápidas • ${escapeHtml(neighborhood)}</div>
                </div>
                <div class="vx-bot-meta">
                  <button class="vx-mini vx-reset" type="button">Limpar</button>
                  <button class="vx-mini vx-close" type="button">Fechar</button>
                </div>
              </div>
        
              <div class="vx-bot-actions">
                <button class="vx-action vx-open-form" type="button">Abrir formulário</button>
                <button class="vx-action vx-email" type="button">Enviar e-mail</button>
              </div>
        
              <div class="vx-bot-body"></div>
        
              <div class="vx-bot-input">
                <input class="vx-bot-field" placeholder="Ex.: áreas comuns, valores, vaga, metragem..." autocomplete="off" />
                <button class="vx-bot-send" type="button">Enviar</button>
              </div>
            </div>
          `;
    document.body.appendChild(root);

    // ---------- Selectors ----------
    const btn = root.querySelector(".vx-bot-fab");
    const panel = root.querySelector(".vx-bot-panel");
    const body = root.querySelector(".vx-bot-body");
    const field = root.querySelector(".vx-bot-field");
    const send = root.querySelector(".vx-bot-send");
    const close = root.querySelector(".vx-close");
    const reset = root.querySelector(".vx-reset");
    const openForm = root.querySelector(".vx-open-form");
    const emailBtn = root.querySelector(".vx-email");

    if (
      !btn ||
      !panel ||
      !body ||
      !field ||
      !send ||
      !close ||
      !reset ||
      !openForm ||
      !emailBtn
    ) {
      console.error("Sandra bot: selector faltando");
      return;
    }

    // ---------- Ajuste do painel para seguir o launcher ----------
    function adjustPanelPosition() {
      const launcherRect = btn.getBoundingClientRect();
      const bottomSpace = window.innerHeight - launcherRect.bottom;
      panel.style.bottom = `${bottomSpace + launcherRect.height}px`;
    }
    btn.addEventListener("click", () => setTimeout(adjustPanelPosition, 10));
    window.addEventListener("resize", adjustPanelPosition);
    window.addEventListener("scroll", adjustPanelPosition);
    adjustPanelPosition();

    // ---------- Funções do bot ----------
    const defaultChips = [
      "Valores",
      "Visita",
      "Vaga",
      "Sacada",
      "Documentos",
      "Áreas comuns",
    ];
    let whatsappAsks = 0;
    const WHATS_RE =
      /\b(whats|whatsapp|wpp|zap|zapp|telefone|celular|contato por whats)\b/i;

    function botSay(text, chips, cta) {
      const wrap = document.createElement("div");
      wrap.className = "vx-msg bot";
      wrap.textContent = text ?? "";
      body.appendChild(wrap);

      if (cta) {
        const c = document.createElement("div");
        c.className = "vx-cta";
        c.textContent = cta;
        body.appendChild(c);
      }

      const list = (chips && chips.length ? chips : defaultChips).slice(0, 8);
      const chipsEl = document.createElement("div");
      chipsEl.className = "vx-chips";
      for (const label of list) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "vx-chip";
        b.textContent = label;
        b.addEventListener("click", () => userSend(label));
        chipsEl.appendChild(b);
      }
      body.appendChild(chipsEl);
      body.scrollTop = body.scrollHeight;
    }

    function userSay(text) {
      const wrap = document.createElement("div");
      wrap.className = "vx-msg user";
      wrap.textContent = text ?? "";
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    }

    function userSend(forcedText) {
      const msg = (forcedText ?? field.value ?? "").trim();
      if (!msg) return;
      userSay(msg);
      field.value = "";
      const m = msg.toLowerCase();

      if (m === "abrir formulário" || m === "abrir formulario") {
        window.open(formUrl, "_blank", "noopener,noreferrer");
        botSay(
          `Perfeito. Abri o formulário: ${formUrl}\n\nQuando você terminar, me diga aqui “concluí” que eu te oriento no próximo passo.`,
          ["Concluí", "Documentos", "Visita", "Valores"],
        );
        return;
      }
      if (
        m === "enviar e-mail" ||
        m === "enviar email" ||
        m === "email" ||
        m === "e-mail"
      ) {
        const subject = encodeURIComponent(
          "Interesse — Studios na Freguesia do Ó",
        );
        const bodyTxt = encodeURIComponent(
          "Olá! Tenho interesse em um studio.\n\nMeu perfil: (CLT/autônomo/estudante/PJ)\nPreferência: (com sacada/sem sacada)\nMelhor dia/turno para visita:\n\nObrigado!",
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${bodyTxt}`;
        botSay(
          `Beleza — o contato oficial é por e-mail: ${email}.\n\nSe quiser, eu também te guio no formulário.`,
          ["Abrir formulário", "Documentos", "Visita", "Valores"],
        );
        return;
      }

      if (WHATS_RE.test(msg)) {
        whatsappAsks++;
        if (whatsappAsks < 3) {
          botSay(
            "Para manter o atendimento organizado, a prioridade é **preencher o formulário da seguradora** + confirmação por **e-mail**. Vou tentar resolver por aqui primeiro 🙂",
            ["Abrir formulário", "Enviar e-mail", "Documentos", "Visita"],
          );
          return;
        }
        botSay(
          `Ok. Como você insistiu, segue o WhatsApp: ${whatsapp}.\n(Use apenas se não conseguir concluir por formulário/e-mail.)`,
          ["Abrir formulário", "Enviar e-mail"],
          `Formulário: ${formUrl}`,
        );
        return;
      }

      if (typeof window.VolynxBotReply !== "function") {
        botSay(
          "O motor do bot não carregou. Verifique se os scripts estão nessa ordem no HTML:\n1) /assets/bot_kb.js\n2) /assets/bot_engine.js\n3) /assets/volynx-studio-bot.js",
          ["Abrir formulário", "Enviar e-mail"],
        );
        return;
      }

      const out = window.VolynxBotReply(msg);
      botSay(
        out?.text || "Ok — me diga sua dúvida em 1 frase.",
        out?.chips || defaultChips,
        out?.cta || null,
      );
    }

    function toggle(open) {
      const isOpen = open ?? !panel.classList.contains("open");
      panel.classList.toggle("open", isOpen);
      btn.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        if (!body.dataset.booted) {
          body.dataset.booted = "1";
          botSay(
            `Oi! Eu sou a Sandra e estou aqui pra te ajudar! Posso te reponder sobre: áreas comuns, valores, vaga, metragem, documentos e visita.`,
            defaultChips,
            `Objetivo: preencher o formulário corretamente. Link: ${formUrl}`,
          );
        }
        setTimeout(() => field.focus(), 0);
      }
    }

    // ---------- Actions ----------
    btn.addEventListener("click", () => toggle());
    close.addEventListener("click", () => toggle(false));
    send.addEventListener("click", () => userSend());
    field.addEventListener("keydown", (e) => {
      if (e.key === "Enter") userSend();
    });
    reset.addEventListener("click", () => {
      try {
        window.VolynxBotReset?.();
      } catch (_) {}
      body.innerHTML = "";
      delete body.dataset.booted;
      whatsappAsks = 0;
      botSay(
        "Reiniciado. Quer falar de valores, metragem, sacada, vaga, áreas comuns, documentos ou visita?",
        defaultChips,
        `Formulário: ${formUrl}`,
      );
    });
    openForm.addEventListener("click", () => {
      window.open(formUrl, "_blank", "noopener,noreferrer");
    });
    emailBtn.addEventListener("click", () => {
      const subject = encodeURIComponent(
        "Interesse em studio — Freguesia do Ó",
      );
      const bodyTxt = encodeURIComponent(
        "Olá! Tenho interesse em um studio.\n\nPreferência: (com sacada / sem sacada)\nData aproximada de mudança:\nPerfil (CLT/autônomo/estudante/PJ):\n\nObrigado!",
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${bodyTxt}`;
    });

    function escapeHtml(s) {
      return String(s || "").replace(
        /[&<>"']/g,
        (m) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
          })[m],
      );
    }
  })();
});
