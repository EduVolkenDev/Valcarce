// /assets/bot_kb.js
// Banco de conhecimento otimizado para os Studios H Valcarce
(function () {
  "use strict";

  // Configuracoes do projeto
  var DEFAULTS = {
    projectName: "Studios H Valcarce",
    location: "Freguesia do Ó - São Paulo",
    studioSizes: {
      comSacada: "32m2",
      semSacada: "28m2",
    },
    prices: {
      comSacada: "a partir de R$ 2.100/mes",
      semSacada: "a partir de R$ 1.900/mes",
    },
    metro: {
      station: "Freguesia do Ó",
      line: "Linha 1 - Azul",
      highlight: "em frente ao metro",
    },
    parking: {
      enabled: true,
      price: "R$ 300/mes",
      limit: 40,
      note: "vagas limitadas",
    },
    commonAreas: [
      "Academia completa",
      "Lavanderia OMO",
      "Coworking",
      "Sala de jogos",
      "Lounge",
      "Mini mercado",
      "Bicicletario",
    ],
    visits: {
      types: ["Presencial", "Virtual"],
      how: "via formulario",
    },
    contract: {
      minTerm: "12 meses",
      readjust: "IGP-M + variacao",
      deposit: "1 mes de aluguel",
    },
    email: "contato@valcarce.com.br",
    formUrl: "https://caner.aggilizador.com.br/rent",
  };

  var USER = window.VOLYNX_BOT_CONFIG || {};

  // Mesclar configuracoes
  var CFG = {
    projectName: USER.projectName || DEFAULTS.projectName,
    location: USER.location || DEFAULTS.location,
    studioSizes: {
      comSacada:
        (USER.studioSizes && USER.studioSizes.comSacada) ||
        DEFAULTS.studioSizes.comSacada,
      semSacada:
        (USER.studioSizes && USER.studioSizes.semSacada) ||
        DEFAULTS.studioSizes.semSacada,
    },
    prices: {
      comSacada:
        (USER.prices && USER.prices.comSacada) || DEFAULTS.prices.comSacada,
      semSacada:
        (USER.prices && USER.prices.semSacada) || DEFAULTS.prices.semSacada,
    },
    metro: {
      station: (USER.metro && USER.metro.station) || DEFAULTS.metro.station,
      line: (USER.metro && USER.metro.line) || DEFAULTS.metro.line,
      highlight:
        (USER.metro && USER.metro.highlight) || DEFAULTS.metro.highlight,
    },
    parking: {
      enabled:
        USER.parking && USER.parking.enabled !== undefined
          ? USER.parking.enabled
          : DEFAULTS.parking.enabled,
      price: (USER.parking && USER.parking.price) || DEFAULTS.parking.price,
      limit: (USER.parking && USER.parking.limit) || DEFAULTS.parking.limit,
      note: (USER.parking && USER.parking.note) || DEFAULTS.parking.note,
    },
    commonAreas: USER.commonAreas || DEFAULTS.commonAreas,
    visits: {
      types: (USER.visits && USER.visits.types) || DEFAULTS.visits.types,
      how: (USER.visits && USER.visits.how) || DEFAULTS.visits.how,
    },
    contract: {
      minTerm:
        (USER.contract && USER.contract.minTerm) || DEFAULTS.contract.minTerm,
      readjust:
        (USER.contract && USER.contract.readjust) || DEFAULTS.contract.readjust,
      deposit:
        (USER.contract && USER.contract.deposit) || DEFAULTS.contract.deposit,
    },
    email: USER.email || (USER.contact && USER.contact.email) || DEFAULTS.email,
    formUrl:
      USER.formUrl ||
      (USER.contact && USER.contact.formUrl) ||
      DEFAULTS.formUrl,
  };

  var CHIPS_HOME = [
    "Preencher Formulario",
    "Valores",
    "Metragem",
    "Sacada",
    "Vaga",
    "Areas Comuns",
    "Documentos",
    "Visita",
  ];

  var CHIPS_SACADA = [
    "32m2 Com Sacada",
    "28m2 Sem Sacada",
    "Valores",
    "Visita",
  ];

  var CHIPS_VISITA = [
    "Hoje",
    "Amanha",
    "Fim de semana",
    "Manha",
    "Tarde",
    "Noite",
  ];

  var CHIPS_DOCS = ["CLT", "Autonomo", "Estudante", "PJ"];

  var CHIPS_AREAS = [
    "Academia",
    "Lavanderia",
    "Coworking",
    "Sala de Jogos",
    "Mini Mercado",
  ];

  window.VOLYNX_BOT = {
    config: CFG,
    intents: [
      {
        id: "boas_vindas",
        keywords: {
          oi: 10,
          ola: 10,
          "bom dia": 8,
          "boa tarde": 8,
          "boa noite": 8,
          hey: 8,
          hello: 8,
        },
        training_phrases: ["oi", "ola", "bom dia", "boa tarde", "boa noite"],
        answer: function () {
          return "Ola! Sou a Sandra do Studios H Valcarce na Freguesia do O! Posso te ajudar com: Valores, Metragem, Sacada, Areas Comuns, Documentacao ou Agendar visita. Quer saber mais sobre qual tema?";
        },
        chips: CHIPS_HOME,
      },
      {
        id: "valores",
        keywords: {
          valor: 10,
          valores: 10,
          preco: 10,
          aluguel: 10,
          quanto: 8,
          custa: 8,
          "valor do aluguel": 12,
          "quanto custa": 12,
        },
        training_phrases: [
          "qual o valor",
          "quanto custa",
          "quanto e o aluguel",
          "valores",
        ],
        answer: function () {
          return (
            "VALORES DOS STUDIOS:\n\n- 32m2 com Sacada: " +
            CFG.prices.comSacada +
            "\n- 28m2 sem Sacada: " +
            CFG.prices.semSacada +
            "\n\nO valor inclui: agua quente, gas encanado, internet e limpeza das areas comuns. Obs: valores sujeitos a variacao conforme disponibilidade."
          );
        },
        chips: CHIPS_SACADA,
      },
      {
        id: "metragem",
        keywords: {
          metro: 10,
          metragem: 12,
          metros: 10,
          tamanho: 10,
          "quantos metros": 12,
          m2: 8,
          "metros quadrados": 12,
          "28m": 14,
          "32m": 14,
          "28 m": 14,
          "32 m": 14,
        },
        training_phrases: [
          "quantos metros",
          "qual a metragem",
          "tamanho do studio",
          "28m",
          "32m",
        ],
        answer: function () {
          return "TAMANHO DOS STUDIOS:\n\n32m2 COM SACADA:\n- Espaco extra para rack, mesa e sacada\n- Ideal para home office\n- Mais ventilacao e luz natural\n\n28m2 SEM SACADA:\n- Studio compacto e funcional\n- Layout otimizado para economia\n- Perfeito para rotina corrida\n\nOs dois tem: Kitchenette completa, banheiro privativo e piso frio.";
        },
        chips: CHIPS_SACADA,
      },
      {
        id: "sacada_com",
        keywords: {
          "com sacada": 15,
          sacada: 10,
          varanda: 8,
          "32m": 12,
          "studio com sacada": 15,
          "quero sacada": 12,
        },
        training_phrases: ["com sacada", "sacada", "32m", "studio com sacada"],
        answer: function () {
          return (
            "STUDIO 32m2 COM SACADA:\n\n- " +
            CFG.studioSizes.comSacada +
            " + sacada privativa\n- Preco: " +
            CFG.prices.comSacada +
            "\n- Perfeito para quem trabalha em home office\n- Mais ventilacao e luz natural\n- Espaco extra para plantas ou cafe\n\nA sacada e um diferencial enorme para o dia a dia! Quer agendar uma visita?"
          );
        },
        chips: [
          "Agendar Visita",
          "Documentos",
          "Valores",
          "Preencher Formulario",
        ],
      },
      {
        id: "sacada_sem",
        keywords: {
          "sem sacada": 15,
          "sem varanda": 12,
          "28m": 14,
          "studio sem sacada": 15,
          "quero sem sacada": 12,
        },
        training_phrases: ["sem sacada", "28m", "studio sem sacada"],
        answer: function () {
          return (
            "STUDIO 28m2 SEM SACADA:\n\n- " +
            CFG.studioSizes.semSacada +
            " - compacto e funcional\n- Preco: " +
            CFG.prices.semSacada +
            "\n- Layout otimizado para maxima economia\n- Perfeito para quem fica pouco em casa\n- Ideal para quem busca praticidade e preco acessivel!"
          );
        },
        chips: [
          "Agendar Visita",
          "Documentos",
          "Valores",
          "Preencher Formulario",
        ],
      },
      {
        id: "areas_comuns",
        keywords: {
          "areas comuns": 12,
          "area comum": 10,
          estrutura: 8,
          lazer: 8,
          "o que tem": 10,
        },
        training_phrases: ["quais areas comuns", "o que tem", "areas comuns"],
        answer: function () {
          return (
            "AREAS COMUNS DO STUDIO:\n\n" +
            CFG.commonAreas.join(", ") +
            "\n\nTodas as areas sao completas e planejadas para o seu conforto! Quer saber mais detalhes de alguma area especifica?"
          );
        },
        chips: CHIPS_AREAS.concat(["Valores", "Preencher Formulario"]),
      },
      {
        id: "academia",
        keywords: {
          academia: 14,
          treinar: 8,
          treino: 8,
          gym: 6,
          musculacao: 10,
        },
        training_phrases: ["tem academia", "academia", "posso treinar"],
        answer: function () {
          return "ACADEMIA COMPLETA:\n\n- Equipamentos modernos\n- Ar-condicionado\n- Horario estendido\n- Sem custo adicional (ja incluido!)\n\nVoce pode treinar a qualquer momento sem pagar academia externa. Quer saber das outras areas?";
        },
        chips: ["Lavanderia", "Coworking", "Sala de Jogos", "Areas Comuns"],
      },
      {
        id: "lavanderia",
        keywords: {
          lavanderia: 14,
          lavar: 8,
          maquina: 8,
          omo: 8,
        },
        training_phrases: ["tem lavanderia", "lavanderia", "omo"],
        answer: function () {
          return "LAVANDERIA OMO:\n\n- Maquinas de lavar e secar\n- Pagamento por uso (app)\n- Sem precisar sair do predio\n- Pratico e moderno\n\nVoce so paga pelo que usar sem mensalidade fixa!";
        },
        chips: ["Academia", "Coworking", "Sala de Jogos", "Areas Comuns"],
      },
      {
        id: "coworking",
        keywords: {
          coworking: 14,
          trabalho: 8,
          "home office": 10,
          trabalhar: 8,
        },
        training_phrases: ["tem coworking", "coworking", "posso trabalhar"],
        answer: function () {
          return "COWORKING:\n\n- Espaco dedicado ao trabalho\n- Mesas individuais\n- Wi-Fi de alta velocidade\n- Tomadas e iluminacao adequada\n- Sem custo adicional\n\nPerfeito para quem trabalha em home office!";
        },
        chips: ["Academia", "Lavanderia", "Sala de Jogos", "Areas Comuns"],
      },
      {
        id: "localizacao",
        keywords: {
          localizacao: 12,
          onde: 8,
          fica: 8,
          endereco: 10,
          metro: 10,
          transporte: 8,
          freguesia: 8,
          perto: 6,
        },
        training_phrases: [
          "onde fica",
          "localizacao",
          "metro",
          "perto do metro",
        ],
        answer: function () {
          return (
            "LOCALIZACAO PRIVILEGIADA:\n\nEndereco: Freguesia do O, Sao Paulo\n\nMETRO NA PORTA!\nEstacao: " +
            CFG.metro.station +
            "\nLinha: " +
            CFG.metro.line +
            "\n\n- Acesso facil as universidades\n- Proximo a comercios e servicos\n- Otima estrutura de transporte\n\nA localizacao e um dos maiores diferenciais! Quer agendar uma visita?"
          );
        },
        chips: ["Agendar Visita", "Valores", "Sacada", "Preencher Formulario"],
      },
      {
        id: "vaga",
        keywords: {
          vaga: 10,
          estacionamento: 14,
          garagem: 10,
          carro: 8,
        },
        training_phrases: [
          "tem vaga",
          "estacionamento",
          "garagem",
          "vaga de carro",
        ],
        answer: function () {
          if (!CFG.parking.enabled) {
            return "ESTACIONAMENTO:\n\nNeste momento nao temos vagas de estacionamento disponiveis para locacao. Mas o bairro tem opcoes de estacionamento nas proximidades.";
          }
          return (
            "VAGA DE ESTACIONAMENTO:\n\n- Preco: " +
            CFG.parking.price +
            "\n- Vagas: " +
            CFG.parking.limit +
            " (" +
            CFG.parking.note +
            ")\n\nVaga e opcional e sujeita a disponibilidade. Quer incluir na reserva?"
          );
        },
        chips: ["Com Vaga", "Sem Vaga", "Valores", "Preencher Formulario"],
      },
      {
        id: "visita",
        keywords: {
          visita: 14,
          visitar: 12,
          agendar: 10,
          conhecer: 10,
          tour: 8,
          virtual: 8,
          horario: 8,
        },
        training_phrases: [
          "quero agendar visita",
          "agendar visita",
          "posso visitar",
          "tour",
        ],
        answer: function () {
          return "AGENDAR VISITA:\n\n- Visitas Presenciais\n- Tour Virtual (se preferir)\n\nCOMO AGENDAR:\n1. Preencha o formulario\n2. Nossa equipe entra em contato\n3. Escolha o melhor dia e horario\n\nAgende com antecedencia para garantir o melhor horario! Qual turno funciona melhor?";
        },
        chips: CHIPS_VISITA.concat(["Preencher Formulario", "Documentos"]),
      },
      {
        id: "documentos",
        keywords: {
          documento: 14,
          documentos: 12,
          papeis: 10,
          comprovante: 8,
          renda: 8,
          clt: 8,
          autonomo: 8,
          estudante: 8,
          pj: 8,
        },
        training_phrases: [
          "quais documentos",
          "documentos",
          "o que preciso",
          "sou clt",
        ],
        answer: function () {
          return "DOCUMENTACAO NECESSARIA:\n\nPARA CLT:\n- RG e CPF\n- Comprovante de renda (3 meses)\n- Declaracao de IR\n\nPARA AUTONOMO:\n- RG e CPF\n- Declaracao de IR\n- Extrato bancario\n\nPARA ESTUDANTE:\n- RG e CPF\n- Comprovante de matricula\n\nPARA PJ:\n- Contrato social\n- Balanco patrimonial\n\nDica: Preencha o formulario que te passamos o checklist completo!";
        },
        chips: CHIPS_DOCS.concat([
          "Preencher Formulario",
          "Garantia",
          "Valores",
        ]),
      },
      {
        id: "garantia",
        keywords: {
          garantia: 12,
          seguro: 10,
          fianca: 12,
          caucao: 10,
          fiador: 10,
        },
        training_phrases: ["garantia", "seguro fianca", "fiador", "caucao"],
        answer: function () {
          return "GARANTIAS ACEITAS:\n\nSEGURO FIANCA (mais comum):\n- Pratico e sem fiador\n- Parcelamento disponivel\n\nCAUCAO:\n- Deposito de 1 a 3 meses\n\nFIADOR:\n- Imovel em Sao Paulo\n\nA seguradora analisa cada caso individualmente. O formulario ja comeca esse processo!";
        },
        chips: ["Seguro Fianca", "Caucao", "Fiador", "Preencher Formulario"],
      },
      {
        id: "formulario",
        keywords: {
          formulario: 12,
          preencher: 8,
          cadastro: 8,
          inscricao: 8,
        },
        training_phrases: ["formulario", "como preencher", "onde cadastro"],
        answer: function () {
          return "COMO SE CANDIDATAR:\n\n1. Clique em Preencher Formulario\n2. Preencha com seus dados\n3. Envie a documentacao\n4. Aguarde a analise (rapida!)\n5. Aprovado? Agende sua visita!\n\nO formulario e o primeiro passo para garantir seu studio!";
        },
        chips: [
          "Preencher Formulario",
          "Documentos",
          "Valores",
          "Agendar Visita",
        ],
      },
      {
        id: "contato",
        keywords: {
          contato: 10,
          email: 8,
          telefone: 8,
          ligar: 6,
        },
        training_phrases: ["qual email", "telefone", "contato"],
        answer: function () {
          return (
            "NOSSOS CONTATOS:\n\nE-mail: " +
            CFG.email +
            "\nWhatsApp: (disponivel via formulario)\n\nRecomendamos usar o formulario para resposta mais rapida! Posso ajudar com mais alguma coisa?"
          );
        },
        chips: ["Preencher Formulario", "Documentos", "Valores"],
      },
      {
        id: "contrato",
        keywords: {
          contrato: 12,
          prazo: 10,
          minimo: 10,
          tempo: 8,
          meses: 8,
          reajuste: 10,
          multa: 8,
          rescisao: 10,
        },
        training_phrases: [
          "qual o prazo",
          "contrato",
          "quanto tempo",
          "reajuste",
        ],
        answer: function () {
          return (
            "SOBRE O CONTRATO:\n\n- Prazo minimo: " +
            CFG.contract.minTerm +
            "\n- Reajuste: " +
            CFG.contract.readjust +
            "\n- Entrada: " +
            CFG.contract.deposit +
            "\n- Sair antes: segue as clausulas do contrato\n\nTodas as condicoes estao descritas com clareza!"
          );
        },
        chips: [
          "Preencher Formulario",
          "Documentos",
          "Valores",
          "Agendar Visita",
        ],
      },
      {
        id: "duvida_geral",
        keywords: {
          duvida: 8,
          pergunta: 6,
          "outra coisa": 6,
          mais: 4,
        },
        training_phrases: [
          "tenho uma duvida",
          "outra pergunta",
          "mais alguma coisa",
        ],
        answer: function () {
          return "POSSO TE AJUDAR COM:\n\nVALORES:\n32m2 com sacada: a partir de R$ 2.100\n28m2 sem sacada: a partir de R$ 1.900\n\nTAMANHOS:\n32m2 (com sacada) ou 28m2 (sem sacada)\n\nLOCALIZACAO:\nFreguesia do O - Metro na porta!\n\nAREAS COMUNS:\nAcademia, Lavanderia, Coworking e mais!\n\nO que mais te interessa?";
        },
        chips: CHIPS_HOME,
      },
    ],
    fallback: {
      answer:
        "Nao entendi direito... Mas posso te ajudar com: Valores, Metragem, Sacada, Areas Comuns, Documentacao ou Agendar visita. E so clicar em uma opcao acima!",
      chips: CHIPS_HOME,
    },
  };
})();
