export const translations = {
  pt: {
    nav: {
      home: 'Início',
      fundamentals: 'Fundamentos',
      variables: 'Variáveis',
      functions: 'Funções',
      lab: 'Laboratório',
      progress: 'Progresso',
      login: 'Entrar',
      logout: 'Sair'
    },
    hero: {
      title_pre: 'Domine Python com',
      title_high: 'Inteligência Artificial',
      subtitle: 'Uma jornada interativa do zero ao profissional. Aprenda lógica, automação e ciência de dados com Fole, seu mentor IA pessoal.',
      btn_start: 'Começar Agora',
      btn_student: 'Área do Aluno'
    },
    fundamentos: {
      title: 'Fundamentos da Lógica',
      desc: 'Antes de escrever código, você precisa aprender a pensar como um computador. Domine algoritmos e fluxogramas.',
      card1_title: 'Sequência',
      card1_desc: 'A ordem importa. Aprenda como instruções passo a passo formam a base de qualquer programa.',
      card2_title: 'Fluxogramas',
      card2_desc: 'Visualize decisões. Se (if) estiver chovendo, leve guarda-chuva. Senão (else), vá de óculos.',
      card3_title: 'Repetição',
      card3_desc: 'Automação é poder. Execute tarefas milhares de vezes sem cansar usando Loops.'
    },
    variaveis: {
      title: 'Sistema de Variáveis',
      desc: 'Variáveis são caixas onde guardamos informações. Em Python, elas são dinâmicas e poderosas.',
      ex_title: 'Exemplo Prático',
      types: {
        int: { desc: 'Números inteiros para contagens e matemática discreta.' },
        str: { desc: 'Textos (Strings) para mensagens e processamento de dados.' },
        float: { desc: 'Números decimais para precisão e cálculos científicos.' },
        bool: { desc: 'Lógica booleana para controle de fluxo e decisões.' }
      }
    },
    funcoes: {
      tag: "DRY: Don't Repeat Yourself",
      title: 'Arquitetura de Funções',
      desc: 'Funções são mini-programas dentro do seu código. Elas recebem dados, processam e retornam um resultado. Modularize seu pensamento.',
      list: ['Reutilização de código', 'Organização e legibilidade', 'Testabilidade isolada']
    },
    lab: {
      exercises: 'Lista de Exercícios',
      debugger_title: 'Fole Debugger',
      debugger_sub: 'Detecção automática de erros',
      analyzing: 'Analisando seu código...',
      clear_analysis: 'Limpar análise',
      empty_state: 'Execute seu código. Se houver erros, eu aparecerei aqui para ajudar!',
      run: 'Executar',
      clear_console: 'Limpar',
      ready: 'Pronto para execução...',
      success_msg: '✨ SUCESSO! Exercício Concluído! ✨'
    },
    chat: {
      welcome: (name: string) => `Olá${name ? ' **' + name + '**' : ''}! 👋 Sou o Fole, seu assistente inteligente. \n\nEstou pronto para ajudar com Python, revisar código ou responder qualquer dúvida que você tiver sobre o universo! 🌌`,
      placeholder: 'Digite sua pergunta...',
      thinking: 'Pensando'
    }
  },
  en: {
    nav: {
      home: 'Home',
      fundamentals: 'Fundamentals',
      variables: 'Variables',
      functions: 'Functions',
      lab: 'Laboratory',
      progress: 'Progress',
      login: 'Login',
      logout: 'Logout'
    },
    hero: {
      title_pre: 'Master Python with',
      title_high: 'Artificial Intelligence',
      subtitle: 'An interactive journey from zero to professional. Learn logic, automation and data science with Fole, your personal AI mentor.',
      btn_start: 'Start Now',
      btn_student: 'Student Area'
    },
    fundamentos: {
      title: 'Logic Fundamentals',
      desc: 'Before writing code, you need to learn to think like a computer. Master algorithms and flowcharts.',
      card1_title: 'Sequence',
      card1_desc: 'Order matters. Learn how step-by-step instructions form the basis of any program.',
      card2_title: 'Flowcharts',
      card2_desc: 'Visualize decisions. If (if) it is raining, take an umbrella. Else (else), wear sunglasses.',
      card3_title: 'Repetition',
      card3_desc: 'Automation is power. Execute tasks thousands of times without tiring using Loops.'
    },
    variaveis: {
      title: 'Variable System',
      desc: 'Variables are boxes where we store information. In Python, they are dynamic and powerful.',
      ex_title: 'Practical Example',
      types: {
        int: { desc: 'Integer numbers for counting and discrete mathematics.' },
        str: { desc: 'Texts (Strings) for messages and data processing.' },
        float: { desc: 'Decimal numbers for precision and scientific calculations.' },
        bool: { desc: 'Boolean logic for flow control and decisions.' }
      }
    },
    funcoes: {
      tag: "DRY: Don't Repeat Yourself",
      title: 'Function Architecture',
      desc: 'Functions are mini-programs inside your code. They receive data, process it, and return a result. Modularize your thinking.',
      list: ['Code reuse', 'Organization and readability', 'Isolated testability']
    },
    lab: {
      exercises: 'Exercise List',
      debugger_title: 'Fole Debugger',
      debugger_sub: 'Automatic error detection',
      analyzing: 'Analyzing your code...',
      clear_analysis: 'Clear analysis',
      empty_state: 'Run your code. If there are errors, I will appear here to help!',
      run: 'Run',
      clear_console: 'Clear',
      ready: 'Ready for execution...',
      success_msg: '✨ SUCCESS! Exercise Completed! ✨'
    },
    chat: {
      welcome: (name: string) => `Hello${name ? ' **' + name + '**' : ''}! 👋 I am Fole, your intelligent assistant. \n\nI am ready to help with Python, code review or answer any questions you have about the universe! 🌌`,
      placeholder: 'Type your question...',
      thinking: 'Thinking'
    }
  }
};
