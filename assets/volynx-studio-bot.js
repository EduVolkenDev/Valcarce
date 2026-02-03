// /assets/volynx-studio-bot.js
// VERSÃO CORRIGIDA - Janela mais larga e menos alta
(function () {
  "use strict";

  var CFG = window.VOLYNX_BOT_CONFIG || {};
  var botName = CFG.botName || "Sandra";
  var launcherHint = CFG.launcherHint || "Tire suas dúvidas";
  var formUrl =
    CFG.formUrl ||
    (CFG.contact && CFG.contact.formUrl) ||
    "https://caner.aggilizador.com.br/rent";
  var email =
    CFG.email ||
    (CFG.contact && CFG.contact.email) ||
    "contato@valcarce.com.br";

  // CSS - Janela mais LARGA e menos ALTA
  var css =
    ".vx-bot-launcher{position:fixed;right:14px;bottom:14px;z-index:99999;font-family:ui-sans-serif,system-ui,sans-serif}.vx-bot-fab{border:2px solid rgba(223,0,255,.55);cursor:pointer;border-radius:999px;padding:14px 18px;display:flex;gap:12px;align-items:center;box-shadow:0 14px 40px rgba(0,0,0,.32);background:linear-gradient(50deg, rgba(100,227,102,.91), rgba(232,30,229,.66));color:#fff;max-width:min(360px,calc(100vw-28px))}.vx-bot-avatar{width:52px;height:52px;border-radius:999px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.14);flex:0 0 auto}.vx-bot-avatar svg{width:28px;height:28px}.vx-bot-labels{display:flex;flex-direction:column;align-items:flex-start;min-width:0}.vx-bot-name{font-weight:800;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px}.vx-bot-hint{font-size:13px;opacity:.85}.vx-bot-panel{position:absolute;right:0;bottom:70px;width:min(480px,calc(100vw-28px));max-height:min(65vh,580px);background:#0b0f19;border:1px solid rgba(255,255,255,.10);border-radius:20px;box-shadow:0 28px 80px rgba(0,0,0,.6);overflow:hidden;display:none}.vx-bot-panel.open{display:flex;flex-direction:column}.vx-bot-header{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.10);display:flex;gap:10px;align-items:center}.vx-bot-title{color:#fff;font-weight:700;font-size:14px}.vx-bot-meta{margin-left:auto}.vx-mini{border:0;background:transparent;color:rgba(255,255,255,.7);cursor:pointer;font-size:12px;padding:4px 8px}.vx-mini:hover{color:#fff}.vx-bot-actions{padding:10px 14px;display:flex;gap:8px;flex-wrap:wrap;border-bottom:1px solid rgba(255,255,255,.10)}.vx-action{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:10px 14px;font-size:13px;cursor:pointer;transition:all .2s}.vx-action:hover{background:rgba(100,227,102,.25);border-color:rgba(100,227,102,.4)}.vx-bot-body{padding:14px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;flex:1}.vx-msg{max-width:100%;padding:10px 12px;border-radius:12px;font-size:13px;line-height:1.5;white-space:pre-wrap}.vx-msg.bot{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.10)}.vx-msg.user{margin-left:auto;background:#fff;color:#0b0f19;border:none;font-weight:500;max-width:85%}.vx-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.vx-chip{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:8px 14px;font-size:12px;cursor:pointer;transition:all .2s}.vx-chip:hover{background:rgba(100,227,102,.25);transform:translateY(-2px);border-color:rgba(100,227,102,.4)}.vx-chip.primary{background:linear-gradient(135deg, rgba(100,227,102,.4), rgba(32,227,178,.35));border-color:rgba(100,227,102,.7);font-weight:600}.vx-chip.primary:hover{background:linear-gradient(135deg, rgba(100,227,102,.5), rgba(32,227,178,.45)}.vx-cta{margin-top:6px;color:rgba(100,227,102,.95);font-size:12px;font-weight:500}";

  // Criar elementos
  var root = document.createElement("div");
  root.className = "vx-bot-launcher";
  root.innerHTML =
    "<style>" +
    css +
    "</style>" +
    '<button class="vx-bot-fab" type="button">' +
    '<div class="vx-bot-avatar"><svg viewBox="0 0 64 64" width="28" height="28" fill="none"><rect x="14" y="18" width="36" height="30" rx="10" stroke="white" opacity=".9"/><circle cx="26" cy="33" r="3" fill="white"/><circle cx="38" cy="33" r="3" fill="white"/><path d="M26 40h12" stroke="white" opacity=".9" stroke-linecap="round"/></svg></div>' +
    '<div class="vx-bot-labels"><div class="vx-bot-name">' +
    botName +
    '</div><div class="vx-bot-hint">' +
    launcherHint +
    "</div></div></button>" +
    '<div class="vx-bot-panel">' +
    '<div class="vx-bot-header"><div class="vx-bot-title">' +
    botName +
    '</div><div class="vx-bot-meta"><button class="vx-mini vx-reset">Limpar</button><button class="vx-mini vx-close">Fechar</button></div></div>' +
    '<div class="vx-bot-actions"><button class="vx-action vx-open-form">Formulario</button><button class="vx-action vx-email">E-mail</button></div>' +
    '<div class="vx-bot-body"></div></div>';

  document.body.appendChild(root);

  var btn = root.querySelector(".vx-bot-fab");
  var panel = root.querySelector(".vx-bot-panel");
  var body = root.querySelector(".vx-bot-body");
  var close = root.querySelector(".vx-close");
  var reset = root.querySelector(".vx-reset");
  var openForm = root.querySelector(".vx-open-form");
  var emailBtn = root.querySelector(".vx-email");

  function showMessage(text, chips) {
    var wrap = document.createElement("div");
    wrap.className = "vx-msg bot";
    wrap.textContent = text;
    body.appendChild(wrap);
    if (chips && chips.length) {
      var chipsEl = document.createElement("div");
      chipsEl.className = "vx-chips";
      for (var i = 0; i < chips.length; i++) {
        var chip = chips[i];
        var b = document.createElement("button");
        b.type = "button";
        b.className = "vx-chip" + (chip.primary ? " primary" : "");
        b.textContent = chip.label;
        b.onclick = chip.action;
        chipsEl.appendChild(b);
      }
      body.appendChild(chipsEl);
    }
    body.scrollTop = body.scrollHeight;
  }

  function userMessage(text) {
    var wrap = document.createElement("div");
    wrap.className = "vx-msg user";
    wrap.textContent = text;
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  // Funções do fluxo
  function showHome() {
    showMessage(
      "Ola! Sou a Sandra dos Studios H Valcarce. Como posso ajudar?",
      [
        { label: "Ver Studios", action: showStudios, primary: true },
        { label: "Valores", action: showValores },
        { label: "Localizacao", action: showLocalizacao },
        { label: "Areas Comuns", action: showAreas },
        { label: "Agendar Visita", action: showVisa },
      ],
    );
  }

  function showStudios() {
    userMessage("Ver Studios");
    showMessage(
      "Nossos estudios:\n\n32m2 COM SACADA:\n- Preco: a partir de R$ 2.100\n- Ideal para home office\n- Sacada privativa\n\n28m2 SEM SACADA:\n- Preco: a partir de R$ 1.900\n- Compacto e funcional\n- Melhor preco\n\nQuer saber mais?",
      [
        { label: "32m2 com Sacada", action: showSacada32 },
        { label: "28m2 sem Sacada", action: showSacada28 },
        { label: "Diferenca", action: showDiferenca },
        { label: "Voltar", action: showHome },
      ],
    );
  }

  function showSacada32() {
    userMessage("32m2 com Sacada");
    showMessage(
      "STUDIO 32m2 COM SACADA:\n\n- 32m2 + sacada privativa\n- Preco: a partir de R$ 2.100/mes\n- Inclui: agua, gas, internet\n\nPerfeito para home office!\n\nO que deseja fazer?",
      [
        { label: "Agendar Visita", action: showVisa },
        { label: "Ver Documentos", action: showDocumentos },
        { label: "Voltar", action: showStudios },
      ],
    );
  }

  function showSacada28() {
    userMessage("28m2 sem Sacada");
    showMessage(
      "STUDIO 28m2 SEM SACADA:\n\n- 28m2 compacto e funcional\n- Preco: a partir de R$ 1.900/mes\n- Inclui: agua, gas, internet\n\nIdeal para praticidade!\n\nO que deseja fazer?",
      [
        { label: "Agendar Visita", action: showVisa },
        { label: "Ver Documentos", action: showDocumentos },
        { label: "Voltar", action: showStudios },
      ],
    );
  }

  function showDiferenca() {
    userMessage("Diferenca");
    showMessage(
      "QUAL ESCOLHER?\n\nCOM SACADA (32m2):\n- Mais espaco\n- Melhor ventilacao\n- Preco: R$ 2.100+\n\nSEM SACADA (28m2):\n- Mais compacto\n- Melhor preco\n- R$ 1.900+",
      [
        { label: "Quero com Sacada", action: showSacada32 },
        { label: "Quero sem Sacada", action: showSacada28 },
        { label: "Voltar", action: showStudios },
      ],
    );
  }

  function showValores() {
    userMessage("Valores");
    showMessage(
      "VALORES:\n\n32m2 com Sacada: R$ 2.100+/mes\n28m2 sem Sacada: R$ 1.900+/mes\n\nINCLUI:\n- Agua, gas, internet\n- Limpeza areas comuns\n\nVAGA: R$ 300/mes (opcional)",
      [
        { label: "Ver Studios", action: showStudios, primary: true },
        { label: "Agendar Visita", action: showVisa },
        { label: "Voltar", action: showHome },
      ],
    );
  }

  function showLocalizacao() {
    userMessage("Localizacao");
    showMessage(
      "LOCALIZACAO:\n\nFreguesia do O, Sao Paulo\nMETRO NA PORTA!\nLinha 1 - Azul\n\nPerto de universidades e commerces.",
      [
        { label: "Agendar Visita", action: showVisa, primary: true },
        { label: "Ver Studios", action: showStudios },
        { label: "Voltar", action: showHome },
      ],
    );
  }

  function showAreas() {
    userMessage("Areas Comuns");
    showMessage(
      "AREAS COMUNS:\n\n- Academia\n- Lavanderia OMO\n- Coworking\n- Sala de jogos\n- Lounge\n- Mini mercado\n- Bicicletario",
      [
        { label: "Academia", action: showAcademia },
        { label: "Lavanderia", action: showLavanderia },
        { label: "Coworking", action: showCoworking },
        { label: "Voltar", action: showHome },
      ],
    );
  }

  function showAcademia() {
    userMessage("Academia");
    showMessage(
      "ACADEMIA:\n\n- Equipamentos modernos\n- Ar-condicionado\n- Sem custo adicional",
      [
        { label: "Outras Areas", action: showAreas },
        { label: "Voltar", action: showHome },
      ],
    );
  }
  function showLavanderia() {
    userMessage("Lavanderia");
    showMessage(
      "LAVANDERIA OMO:\n\n- Maquinas de lavar e secar\n- Pagamento por app\n- Sem mensalidade",
      [
        { label: "Outras Areas", action: showAreas },
        { label: "Voltar", action: showHome },
      ],
    );
  }
  function showCoworking() {
    userMessage("Coworking");
    showMessage(
      "COWORKING:\n\n- Espaco de trabalho\n- Wi-Fi rapido\n- Sem custo adicional",
      [
        { label: "Outras Areas", action: showAreas },
        { label: "Voltar", action: showHome },
      ],
    );
  }

  function showDocumentos() {
    userMessage("Documentos");
    showMessage(
      "DOCUMENTOS:\n\nCLT: RG, CPF, comprovante renda\nAUTONOMO: RG, CPF, IR, extrato\nESTUDANTE: RG, CPF, matricula\nPJ: Contrato social",
      [
        { label: "Preencher Formulario", action: openFormAndSay },
        { label: "Voltar", action: showStudios },
      ],
    );
  }

  function showVisa() {
    userMessage("Agendar Visita");
    showMessage(
      "COMO AGENDAR:\n\n1. Clique em PREENCHER FORMULARIO\n2. Preencha seus dados\n3. Nossa equipe entra em contato",
      [
        {
          label: "Preencher Formulario",
          action: openFormAndSay,
          primary: true,
        },
        { label: "Ver Studios", action: showStudios },
        { label: "Voltar", action: showHome },
      ],
    );
  }

  function openFormAndSay() {
    try {
      window.open(formUrl, "_blank");
    } catch (e) {}
    userMessage("Formulario");
    showMessage(
      "Formulario aberto!\n\nPreencha seus dados e nossa equipe entrara em contato.",
      [
        { label: "Ver Studios", action: showStudios },
        { label: "Valores", action: showValores },
        { label: "Areas Comuns", action: showAreas },
      ],
    );
  }

  // Eventos
  function toggle() {
    var isOpen = !panel.classList.contains("open");
    panel.classList.toggle("open", isOpen);
    if (isOpen && !body.dataset.booted) {
      body.dataset.booted = "1";
      showHome();
    }
  }

  btn.onclick = toggle;
  close.onclick = function () {
    toggle();
  };
  reset.onclick = function () {
    body.innerHTML = "";
    body.dataset.booted = "";
    showHome();
  };
  openForm.onclick = openFormAndSay;
  emailBtn.onclick = function () {
    userMessage("E-mail");
    showMessage("E-mail: " + email, [
      { label: "Preencher Formulario", action: openFormAndSay, primary: true },
      { label: "Voltar", action: showHome },
    ]);
  };
})();
