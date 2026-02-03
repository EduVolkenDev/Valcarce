// /assets/bot_engine.js
(() => {
  "use strict";

  /* =========================================================
     0) Normalização / Canonização
     ========================================================= */
  function normalizeText(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/m²/g, "m2")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // sinônimos globais (NÃO por tópico)
  const CANON = [
    [/\b(preco|preço|valor|custo|custa|mensalidade|faixa|quanto)\b/g, "valor"],
    [/\b(locacao|locação|alugar|aluguel|locar)\b/g, "aluguel"],
    [/\b(condominio|condomínio)\b/g, "condominio"],
    [/\b(estacao|estação|metro|metrô)\b/g, "metro"],
    [/\b(varanda)\b/g, "sacada"],
    [/\b(agendar|agenda|visitar|tour|marcar)\b/g, "visita"],
    [/\b(whats|wpp|zap|whatsapp)\b/g, "whatsapp"],
  ];

  const STOPWORDS = new Set(
    [
      "o",
      "a",
      "os",
      "as",
      "um",
      "uma",
      "uns",
      "umas",
      "de",
      "da",
      "do",
      "das",
      "dos",
      "em",
      "no",
      "na",
      "nos",
      "nas",
      "pra",
      "para",
      "por",
      "com",
      "sem",
      "e",
      "ou",
      "que",
      "qual",
      "quais",
      "como",
      "quanto",
      "onde",
      "tem",
      "tenho",
      "temos",
      "seria",
      "pode",
      "podem",
      "eu",
      "me",
      "te",
      "se",
      "isso",
      "essa",
      "esse",
      "ai",
      "aí",
      "vc",
      "vcs",
      "voce",
      "vocês",
      "porfavor",
      "pf",
      "pls",
    ].map(normalizeText),
  );

  function canonize(s) {
    let t = normalizeText(s);
    for (const [re, rep] of CANON) t = t.replace(re, rep);
    return t.replace(/\s+/g, " ").trim();
  }

  function tokens(s) {
    const t = canonize(s);
    if (!t) return [];
    return t.split(" ").filter((w) => w && !STOPWORDS.has(w));
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function containsWord(textCanon, wordCanon) {
    const re = new RegExp(`\\b${escapeRegExp(wordCanon)}\\b`, "i");
    return re.test(textCanon);
  }

  function phraseTokenHit(textTokens, phrase) {
    const pToks = tokens(phrase);
    if (!pToks.length) return false;
    const bag = new Set(textTokens);
    return pToks.every((t) => bag.has(t));
  }

  /* =========================================================
     1) Fuzzy leve (typos)
     ========================================================= */
  function levenshtein(a, b) {
    if (a === b) return 0;
    const al = a.length,
      bl = b.length;
    if (!al) return bl;
    if (!bl) return al;

    const dp = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));
    for (let i = 0; i <= al; i++) dp[i][0] = i;
    for (let j = 0; j <= bl; j++) dp[0][j] = j;

    for (let i = 1; i <= al; i++) {
      for (let j = 1; j <= bl; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost,
        );
      }
    }
    return dp[al][bl];
  }

  function approxWordMatch(wordCanon, bag) {
    if (bag.has(wordCanon)) return { hit: true, fuzzy: false };

    const maxDist = wordCanon.length >= 8 ? 2 : 1;
    for (const w of bag) {
      if (Math.abs(w.length - wordCanon.length) > 2) continue;
      const d = levenshtein(wordCanon, w);
      if (d <= maxDist) return { hit: true, fuzzy: true };
    }
    return { hit: false, fuzzy: false };
  }

  /* =========================================================
     2) Slots “universais” (ENUMS) — uma vez só, resolve geral
     ========================================================= */
  const SLOT_ENUMS = {
    perfil: {
      CLT: ["clt", "carteira assinada", "registrado"],
      Autônomo: [
        "autonomo",
        "autônomo",
        "freela",
        "freelancer",
        "por conta",
        "mei",
      ],
      Estudante: ["estudante", "faculdade", "universidade", "aluno"],
      PJ: ["pj", "empresa", "pessoa juridica", "pessoa jurídica", "cnpj"],
    },

    sacada_pref: {
      com: ["com sacada", "com varanda", "quero sacada", "sacada sim", "com"],
      sem: [
        "sem sacada",
        "sem varanda",
        "nao quero sacada",
        "não quero sacada",
        "sem",
      ],
    },

    turno: {
      manhã: ["manha", "manhã", "cedo"],
      tarde: ["tarde"],
      noite: ["noite"],
    },

    dia_pref: {
      hoje: ["hoje"],
      "fim de semana": ["fim de semana", "sabado", "sábado", "domingo"],
    },

    laundry_action: {
      lavar: ["lavar"],
      secar: ["secar"],
      ambos: ["ambos", "os dois", "as duas", "ambas"],
    },
  };

  // Aliases: aceita nomes diferentes no KB sem quebrar
  const SLOT_ALIASES = {
    balcony_pref: "sacada_pref",
    sacada_pref: "sacada_pref",
  };

  function enumMatch(slotName, raw) {
    const slot = SLOT_ENUMS[slotName];
    if (!slot) return null;

    const t = canonize(raw);
    const ttoks = tokens(raw);
    const bag = new Set(ttoks);

    for (const [value, syns] of Object.entries(slot)) {
      for (const s of syns) {
        const sc = canonize(s);
        if (!sc) continue;
        if (sc.includes(" ")) {
          if (t.includes(sc) || phraseTokenHit(ttoks, sc)) return value;
        } else {
          // palavra (com fuzzy)
          const hit = containsWord(t, sc) || approxWordMatch(sc, bag).hit;
          if (hit) return value;
        }
      }
    }
    return null;
  }

  function detectSlots(raw) {
    const out = {};

    // tenta preencher todos os enums
    for (const slotName of Object.keys(SLOT_ENUMS)) {
      const v = enumMatch(slotName, raw);
      if (v != null) out[slotName] = v;
    }

    // aliases (sacada_pref <-> balcony_pref)
    if (out.sacada_pref) out.balcony_pref = out.sacada_pref;

    return out;
  }

  function isWeakAnswer(raw) {
    const t = canonize(raw);
    if (!t) return true;
    return [
      "ok",
      "sim",
      "nao",
      "não",
      "talvez",
      "sei la",
      "sei lá",
      "hm",
      "hmm",
      "blz",
      "beleza",
    ].includes(t);
  }

  // slots que aceitam texto livre (ex.: destino)
  const FREE_TEXT_SLOTS = new Set(["destino"]);

  function captureFreeTextSlot(slotName, raw, state) {
    if (!FREE_TEXT_SLOTS.has(slotName)) return false;
    const v = String(raw || "").trim();
    if (!v || v.length < 2) return false;
    if (v.length > 80) return false;
    if (isWeakAnswer(v)) return false;
    state.slots[slotName] = v;
    return true;
  }

  function chipsForSlot(slotName) {
    const base = slotName in SLOT_ALIASES ? SLOT_ALIASES[slotName] : slotName;
    if (base === "perfil") return ["CLT", "Autônomo", "Estudante", "PJ"];
    if (base === "sacada_pref") return ["Com sacada", "Sem sacada"];
    if (base === "turno") return ["Manhã", "Tarde", "Noite"];
    if (base === "dia_pref") return ["Hoje", "Fim de semana"];
    if (base === "laundry_action") return ["Lavar", "Secar", "Ambos"];
    return null;
  }

  function premiumRephrase(slotQuestion, chips) {
    return {
      text:
        "Hmm, acho que não entendi sua resposta. " +
        "Responda em 2–3 palavras ou clique em um chip abaixo que eu te direciono certinho.",
      cta: null,
      chips: chips && chips.length ? chips.slice(0, 8) : null,
    };
  }

  /* =========================================================
     3) Scoring de intents (genérico)
     ========================================================= */
  function scoreIntent(raw, intent) {
    const t = canonize(raw);
    const tToks = tokens(raw);
    const bag = new Set(tToks);

    let score = 0;

    // keywords
    for (const [kwRaw, wRaw] of Object.entries(intent.keywords || {})) {
      const w = Number(wRaw) || 0;
      const kw = canonize(kwRaw);
      if (!kw) continue;

      if (kw.includes(" ")) {
        if (t.includes(kw) || phraseTokenHit(tToks, kw)) score += w;
      } else {
        const m = approxWordMatch(kw, bag);
        if (m.hit) score += m.fuzzy ? Math.max(1, Math.round(w * 0.7)) : w;
      }
    }

    // training_phrases
    for (const p of intent.training_phrases || []) {
      const pp = canonize(p);
      if (!pp) continue;
      if (t.includes(pp)) score += 10;
      else if (phraseTokenHit(tToks, pp)) score += 6;
    }

    return score;
  }

  function isFollowUpish(raw) {
    const t = canonize(raw);
    // follow-up universal (não por tópico)
    return /(inclui|incluir|detalh|lista|pacote|completo|essencial|minimo|minimo|o que|quais|qual|e no meu caso|como funciona|mais sobre|explica)/i.test(
      t,
    );
  }

  /* =========================================================
     4) Estado + Reply
     ========================================================= */
  const BOT_STATE = {
    slots: {},
    lastIntentId: null,
    awaitingSlot: null,
    whatsappAsks: 0,
  };

  function buildAnswer(intent, kb, meta) {
    const ctx = {
      slots: BOT_STATE.slots,
      config: kb.config,
      meta: meta || null,
    };
    const text =
      typeof intent.answer === "function"
        ? intent.answer(ctx)
        : String(intent.answer || "");

    // chips: do intent, ou do slot que estava sendo pedido, ou fallback
    const chips = intent.chips || null;

    return { text, cta: intent.cta || null, chips };
  }

  function softClarify(best, second, kb) {
    const a = best?.id ? best.id.replaceAll("_", " ") : "isso";
    const b = second?.id ? second.id.replaceAll("_", " ") : null;

    const chips = Array.from(
      new Set([
        ...(best?.chips || []),
        ...(second?.chips || []),
        ...(kb.fallback?.chips || []),
      ]),
    ).slice(0, 8);

    return {
      text: b
        ? `Só pra eu te responder sem erro: você quer falar mais de **${a}** ou **${b}**?`
        : `Só pra eu te responder sem erro: qual tema é prioridade agora?`,
      cta: null,
      chips: chips.length ? chips : null,
    };
  }

  function applyWhatsappPolicy(kb, raw) {
    const t = canonize(raw);
    if (!t.includes("whatsapp")) return null;

    BOT_STATE.whatsappAsks += 1;

    // regra: só libera se insistiu 3+ vezes
    if (BOT_STATE.whatsappAsks < 4) {
      const email = kb?.config?.email;
      const formUrl = kb?.config?.formUrl;
      return {
        text:
          "Pra manter o atendimento organizado, eu sigo pelo **formulário** e **e-mail**. " +
          (formUrl ? `Formulário: ${formUrl}\n` : "") +
          (email ? `E-mail: ${email}` : "") +
          "\n\nSe você realmente precisar WhatsApp, insiste mais um pouco que eu libero.",
        cta: null,
        chips: ["Abrir formulário", "Enviar e-mail"],
      };
    }

    // se passou do limite, libera (mas isso só acontece se insistiu)
    const wpp = kb?.config?.whatsapp;
    return {
      text: wpp
        ? `Ok. Como você insistiu, aqui vai o WhatsApp: ${wpp}`
        : "Ok. WhatsApp disponível sob solicitação (número não configurado).",
      cta: null,
      chips: null,
    };
  }

  function reply(userText) {
    const kb = window.VOLYNX_BOT;
    if (!kb || !Array.isArray(kb.intents)) {
      return {
        text: "Configuração do bot não carregou. Confira se /assets/bot_kb.js está antes do /assets/bot_engine.js no HTML.",
        cta: null,
        chips: null,
      };
    }

    const raw = String(userText || "").trim();
    const t = canonize(raw);

    if (!t) {
      return {
        text: kb.fallback?.answer || "Me diga sua dúvida em 1 frase.",
        cta: kb.fallback?.cta || null,
        chips: kb.fallback?.chips || null,
      };
    }

    // policy whatsapp (camada acima de tudo)
    const policy = applyWhatsappPolicy(kb, raw);
    if (policy) return policy;

    // slots
    const detected = detectSlots(raw);
    const beforeSlots = { ...BOT_STATE.slots };
    BOT_STATE.slots = { ...BOT_STATE.slots, ...detected };

    const slotDelta = Object.keys(BOT_STATE.slots).filter(
      (k) => beforeSlots[k] !== BOT_STATE.slots[k],
    );

    // 1) Se está esperando um slot: primeiro tenta ENUM (digitado), depois free-text
    if (BOT_STATE.awaitingSlot) {
      const awaiting =
        SLOT_ALIASES[BOT_STATE.awaitingSlot] || BOT_STATE.awaitingSlot;

      // se detectSlots já preencheu o slot, sucesso imediato (isso resolve o “CLT digitado”)
      if (BOT_STATE.slots[awaiting] != null) {
        const prev = kb.intents.find((i) => i.id === BOT_STATE.lastIntentId);
        BOT_STATE.awaitingSlot = null;
        if (prev) return buildAnswer(prev, kb, { followup: true, raw });
        return {
          text: "Perfeito. E agora, qual tema você quer ver?",
          cta: null,
          chips: kb.fallback?.chips || null,
        };
      }

      // tentar enum match direto (caso não tenha sido detectado por frase)
      const em = enumMatch(awaiting, raw);
      if (em != null) {
        BOT_STATE.slots[awaiting] = em;
        if (awaiting === "sacada_pref") BOT_STATE.slots.balcony_pref = em;

        const prev = kb.intents.find((i) => i.id === BOT_STATE.lastIntentId);
        BOT_STATE.awaitingSlot = null;
        if (prev) return buildAnswer(prev, kb, { followup: true, raw });
      }

      // tentar free text (se slot permitir)
      const filled = captureFreeTextSlot(awaiting, raw, BOT_STATE);
      if (filled) {
        const prev = kb.intents.find((i) => i.id === BOT_STATE.lastIntentId);
        BOT_STATE.awaitingSlot = null;
        if (prev) return buildAnswer(prev, kb, { followup: true, raw });
      }

      // não preencheu: rephrase premium + chips do slot (não fallback)
      const prev = kb.intents.find((i) => i.id === BOT_STATE.lastIntentId);
      const slotQ =
        prev?.slot_questions?.[BOT_STATE.awaitingSlot] ||
        "Só preciso de um detalhe rápido:";
      const chips =
        prev?.chips || chipsForSlot(awaiting) || kb.fallback?.chips || null;
      return premiumRephrase(slotQ, chips);
    }

    // 2) Rank intents (top2)
    let best = null,
      second = null;
    let bestScore = -1,
      secondScore = -1;

    for (const it of kb.intents) {
      const s = scoreIntent(raw, it);
      if (s > bestScore) {
        second = best;
        secondScore = bestScore;
        best = it;
        bestScore = s;
      } else if (s > secondScore) {
        second = it;
        secondScore = s;
      }
    }

    const soft = t.length <= 6 ? 2 : 4;
    const hard = t.length <= 6 ? 3 : 6;

    // 3) Se não bate intent novo, MAS é follow-up/slotDelta: responde no CONTEXTO do último intent
    if ((!best || bestScore < soft) && BOT_STATE.lastIntentId) {
      const prev = kb.intents.find((i) => i.id === BOT_STATE.lastIntentId);

      // se o usuário só respondeu algo que virou slot, não cai em fallback
      if (slotDelta.length || isFollowUpish(raw)) {
        if (prev) return buildAnswer(prev, kb, { followup: true, raw });
      }
    }

    // 4) fallback normal (sem contexto)
    if (!best || bestScore < soft) {
      return {
        text: kb.fallback?.answer || "Me diga sua dúvida em 1 frase.",
        cta: kb.fallback?.cta || null,
        chips: kb.fallback?.chips || null,
      };
    }

    // 5) ambiguidade: clarifica, não arrisca
    const ambiguous =
      second && bestScore < hard && bestScore - secondScore <= 2;
    if (ambiguous) return softClarify(best, second, kb);

    // 6) slots requeridos (compat com alias)
    const req = (best.required_slots || []).map((s) => SLOT_ALIASES[s] || s);
    const missing = req.filter((s) => BOT_STATE.slots[s] == null);

    if (missing.length) {
      const slot = missing[0];

      // guarda qual slot original o KB pediu (pra usar slot_questions corretamente)
      const originalSlotName =
        (best.required_slots || []).find(
          (x) => (SLOT_ALIASES[x] || x) === slot,
        ) || slot;

      BOT_STATE.lastIntentId = best.id;
      BOT_STATE.awaitingSlot = originalSlotName;

      const q =
        best.slot_questions?.[originalSlotName] ||
        "Só preciso de um detalhe rápido:";
      const chips =
        best.chips || chipsForSlot(slot) || kb.fallback?.chips || null;

      return { text: q, cta: null, chips };
    }

    // 7) responde
    BOT_STATE.lastIntentId = best.id;
    BOT_STATE.awaitingSlot = null;
    return buildAnswer(best, kb, { raw });
  }

  window.VolynxBotReply = reply;

  // debug opcional
  window.VolynxBotDebug = {
    state: BOT_STATE,
    canonize,
    tokens,
    detectSlots,
    scoreIntent,
  };
})();
