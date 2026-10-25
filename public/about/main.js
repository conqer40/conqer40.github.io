(() => {
  // Safety net: if the intro animation never finishes, remove the black loader so the page and cursor work.
  setTimeout(() => document.querySelector('.loader')?.remove(), 5000);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- sound: tiny synthesized UI sounds (no audio files) ---------- */
  const Snd = (() => {
    let ctx, master, on = !reduce;
    try { if (localStorage.getItem('snd') === '0') on = false; } catch (e) {}
    const AC = window.AudioContext || window.webkitAudioContext;
    const unlock = () => {
      if (!AC) return;
      if (!ctx) { ctx = new AC(); master = ctx.createGain(); master.gain.value = .85; master.connect(ctx.destination); }
      if (ctx.state === 'suspended') ctx.resume();
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(e => addEventListener(e, unlock, { passive: true }));
    const ok = () => on && ctx && ctx.state === 'running';
    const env = (g, t, a, d, peak) => { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); };
    const tone = (f0, f1, dur, peak, type = 'sine', delay = 0) => {
      if (!ok()) return;
      const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      env(g, t, .005, dur, peak); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
    };
    const noise = (dur, f0, f1, peak, q = 1.2) => {
      if (!ok()) return;
      const t = ctx.currentTime, len = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = buf; bp.type = 'bandpass'; bp.Q.value = q;
      bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
      env(g, t, dur * .35, dur * .65, peak); src.connect(bp); bp.connect(g); g.connect(master); src.start(t); src.stop(t + dur + .05);
    };
    let lastTick = 0;
    return {
      unlock,
      get on() { return on; },
      set(v) { on = v; try { localStorage.setItem('snd', v ? '1' : '0'); } catch (e) {} },
      tick() { const n = performance.now(); if (n - lastTick < 70) return; lastTick = n; tone(2100, 1500, .05, .035, 'sine'); },
      click() { tone(760, 480, .09, .07, 'triangle'); },
      pop() { tone(520, 980, .13, .07, 'sine'); },
      whoosh() { noise(.7, 280, 3000, .17); },
      key(space) { if (space) { tone(120, 70, .06, .05, 'square'); noise(.04, 1800, 900, .05, 1.5); } else { noise(.035, 3600, 1900, .07, 2.6); tone(150 + Math.random() * 60, 80, .045, .035, 'square'); } },
      land(v = 1) { tone(190, 70, .24, .26 * v, 'sine'); tone(1400, 900, .07, .05 * v, 'sine', .02); },
      open() { noise(.28, 900, 3200, .05); tone(420, 640, .12, .04, 'sine', .04); },
      toggle(v) { tone(v ? 660 : 520, v ? 990 : 330, .12, .07, 'triangle'); },
      intro() { noise(1.3, 120, 1800, .09, .8); tone(70, 140, 1.2, .08, 'sawtooth'); }
    };
  })();
  /* run fn each time scroll progress crosses a mark (up or down) */
  const crossAt = (marks, fn) => { let lp = 0; return self => { const p = self.progress; marks.forEach((m, i) => { if ((lp < m.at) !== (p < m.at)) fn(m.k, p > lp); }); lp = p; }; };

  /* smooth scroll */
  let lenis;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.055, smoothWheel: true, wheelMultiplier: 0.9, syncTouch: true, touchMultiplier: 1.4 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { offset: 0, duration: 1.4 }) : t.scrollIntoView({ behavior: 'smooth' });
  }));

  /* split text into chars */
  const split = el => {
    const txt = el.textContent;
    el.setAttribute('aria-label', txt);
    el.textContent = '';
    [...txt].forEach(c => {
      const s = document.createElement('span');
      s.className = 'ch'; s.textContent = c === ' ' ? ' ' : c; s.setAttribute('aria-hidden', 'true');
      el.appendChild(s);
    });
    return el.querySelectorAll('.ch');
  };

  /* ---------- Selected work: data from the project briefs, cards, case-study sheet ---------- */
  const CASES = [
    {
      name: 'JARVIS', logos: ['claude.svg', 'obsidian.svg', 'openai.svg'],
      cat: ['AI Agents / Automation', 'وكلاء ذكاء اصطناعي / أتمتة'], tone: 'st-exp',
      status: ['Experimental · Working prototype', 'تجريبي · نموذج أولي يعمل'],
      sub: ['A context-aware desktop AI assistant designed to connect language models with practical computer workflows.', 'مساعد ذكاء اصطناعي مكتبي يفهم السياق، صُمم ليربط النماذج اللغوية بسير عمل الكمبيوتر العملي.'],
      overview: ['JARVIS is my exploration of a personal AI workspace that brings together computer interaction, knowledge management, memory and multi-model assistance. Rather than functioning only as a chat interface, the concept focuses on turning instructions into structured actions across desktop tools.', 'JARVIS هو استكشافي لمساحة عمل شخصية بالذكاء الاصطناعي تجمع التفاعل مع الكمبيوتر وإدارة المعرفة والذاكرة والمساعدة بنماذج متعددة. بدل أن يكون مجرد واجهة محادثة، يركّز المفهوم على تحويل التعليمات إلى إجراءات منظمة عبر أدوات سطح المكتب.'],
      problem: ['The challenge is fragmentation: knowledge, desktop apps, email and AI models often live in separate workflows. JARVIS explores a more unified, contextual way to work.', 'التحدي هو التشتت: المعرفة وتطبيقات سطح المكتب والبريد ونماذج الذكاء الاصطناعي تعيش غالباً في مسارات عمل منفصلة. يستكشف JARVIS طريقة أكثر توحيداً وسياقاً للعمل.'],
      feats: [['Windows desktop application control and task execution experiments', 'تجارب في التحكم بتطبيقات ويندوز وتنفيذ المهام'], ['Obsidian knowledge vault integration for a structured second brain', 'تكامل مع قاعدة معرفة Obsidian كعقل ثانٍ منظم'], ['Long-term memory and contextual knowledge retrieval concepts', 'مفاهيم الذاكرة طويلة المدى واسترجاع المعرفة حسب السياق'], ['Email workflow assistance and internal browser interactions', 'مساعدة في سير عمل البريد والتفاعل مع المتصفح الداخلي'], ['Multi-model architecture experiments with OpenAI, Anthropic and DeepSeek', 'تجارب بنية متعددة النماذج مع OpenAI وAnthropic وDeepSeek']],
      tools: [['AI agents', 'claude.svg'], ['Desktop automation'], ['Obsidian', 'obsidian.svg'], ['Workflow orchestration'], ['LLM integration', 'openai.svg']],
      flow: [['Receive the request', 'Text, voice, image, camera, file, phone, glasses or WhatsApp.', 'استقبال الطلب', 'نص أو صوت أو صورة أو كاميرا أو ملف أو هاتف أو نظارة أو واتساب.'], ['Understand and plan', 'Analyzes the goal, splits it into steps and picks the right model and tool.', 'الفهم والتخطيط', 'يحلل الهدف ويقسّمه إلى خطوات ويختار النموذج والأداة المناسبة.'], ['Safe approval', 'Asks permission before files, PowerShell, control, sending and printing.', 'الموافقة الآمنة', 'يطلب الإذن قبل الملفات وPowerShell والتحكم والإرسال والطباعة.'], ['Execute and report', 'A reply, file, image, 3D model, project, notification or real control.', 'التنفيذ والنتيجة', 'رد أو ملف أو صورة أو نموذج ثلاثي الأبعاد أو مشروع أو إشعار أو تحكم فعلي.']],
      areas: [['Conversation and vision', 'المحادثة والرؤية'], ['Computer and web', 'الكمبيوتر والويب'], ['Coding and making', 'البرمجة والتصنيع'], ['Devices and smart life', 'الأجهزة والحياة الذكية'], ['Automation and integrations', 'الأتمتة والتكاملات'], ['Security and self-evolution', 'الأمن والتطور الذاتي']],
      note: ['A working system under continuous development and testing. Some integrations depend on the device, network and service keys. Sensitive operations are never executed silently: permissions are set separately for files, PowerShell, computer control, web, email and printing.', 'نظام فعلي قيد التطوير والاختبار المستمر. بعض التكاملات تعتمد على الجهاز والشبكة ومفاتيح الخدمات. العمليات الحساسة لا تُنفّذ خلسة: صلاحيات مستقلة للملفات وPowerShell والتحكم بالكمبيوتر والويب والبريد والطباعة.']
    },
    {
      name: 'F.R.I.D.A.Y AI', logos: ['openai.svg', 'claude.svg'],
      cat: ['AI Agents / Sovereign AI OS', 'وكلاء ذكاء اصطناعي / نظام تشغيل سيادي'], tone: 'st-con',
      status: ['Project concept · Pitch deck', 'فكرة مشروع · عرض تقديمي'],
      sub: ['A sovereign AI operating system concept for business management, live phone calls, research and daily task automation, with local privacy and cloud power.', 'تصور نظام تشغيل ذكاء اصطناعي سيادي لإدارة الأعمال والمكالمات الحية والأبحاث وأتمتة المهام اليومية، بخصوصية محلية وقوة سحابية.'],
      overview: ['Not just a chatbot: a hybrid architecture that runs open-source models locally on the GPU to keep business data private, and connects to leading cloud models only when heavy analysis is needed.', 'ليس مجرد شات بوت: معمارية هجينة تشغّل نماذج مفتوحة المصدر محلياً على كارت الشاشة لحماية بيانات العمل، وتتصل بأقوى النماذج السحابية فقط عند الحاجة لتحليل ضخم.'],
      problem: ['AI assistants usually live in the cloud and stay at the chat level. The idea is a private executive partner that can act: call, research, remember and manage operations.', 'مساعدات الذكاء الاصطناعي تعيش غالباً في السحابة وتبقى في مستوى الدردشة. الفكرة شريك تنفيذي خاص يستطيع التصرف: الاتصال والبحث والتذكر وإدارة العمليات.'],
      feats: [['Telephony gateway: live inbound and outbound calls with instant barge-in', 'بوابة اتصالات: مكالمات حية واردة وصادرة مع مقاطعة فورية'], ['Neural voice engine in Egyptian Arabic, Modern Standard Arabic and English', 'محرك صوتي عصبي بالعامية المصرية والفصحى والإنجليزية'], ['Second Brain: persistent vector memory (ChromaDB + SQLite) with a visual idea map', 'العقل الثاني: ذاكرة متجهة دائمة مع خريطة أفكار بصرية'], ['Feed and commodities sales CRM linked to customs and ports workflows', 'إدارة مبيعات الأعلاف والخامات مرتبطة بسير عمل الجمارك والموانئ'], ['Autonomous browser agent for research and data extraction', 'متصفح ذاتي للبحث واستخراج البيانات'], ['Computer vision and hand-gesture control of Windows', 'رؤية حاسوبية وتحكم بويندوز عبر إيماءات اليد']],
      tools: [['Local LLMs (Ollama)'], ['Gemini'], ['Claude', 'claude.svg'], ['GPT-4o', 'openai.svg'], ['Vector memory'], ['3D WebGL HUD']],
      note: ['Presented as a project concept with a pitch deck. Capabilities are described as designed, not as a released product.', 'مقدَّم كفكرة مشروع مع عرض تقديمي. الإمكانيات موصوفة كتصميم وليست كمنتج منشور.']
    },
    {
      name: 'ELHAWY AI', logos: ['wordpress.svg', 'figma.svg'],
      cat: ['Brand / Web / Education', 'علامة / ويب / تعليم'], tone: 'st-live',
      status: ['Live brand · Ongoing', 'علامة منشورة · مستمرة'],
      sub: ['A personal digital brand focused on making AI, web design and practical technology easier to understand and use.', 'علامة رقمية شخصية هدفها تبسيط الذكاء الاصطناعي وتصميم المواقع والتقنية العملية ليسهل فهمها واستخدامها.'],
      overview: ['ELHAWY AI is the home for my technology-focused content, creative experiments and digital work. It connects practical tutorials, AI-assisted workflows, design and useful tools for Arabic-speaking audiences and businesses.', 'ELHAWY AI هو بيت المحتوى التقني والتجارب الإبداعية وأعمالي الرقمية. يربط الشروحات العملية وسير العمل بمساعدة الذكاء الاصطناعي والتصميم والأدوات المفيدة للجمهور الناطق بالعربية والشركات.'],
      problem: ['The goal is to translate fast-moving technology into clear, practical examples that help people and organizations do real work.', 'الهدف هو ترجمة التقنية السريعة التغيّر إلى أمثلة واضحة وعملية تساعد الأفراد والمؤسسات على إنجاز عمل حقيقي.'],
      feats: [['AI tutorials and explainers for a broad Arabic-speaking audience', 'شروحات ودروس للذكاء الاصطناعي لجمهور عربي واسع'], ['Website design, visual identity and digital content creation', 'تصميم المواقع والهوية البصرية وصناعة المحتوى الرقمي'], ['Experiments in productivity automation and AI workflows', 'تجارب في أتمتة الإنتاجية وسير العمل بالذكاء الاصطناعي'], ['Technology updates and accessible educational posts', 'مستجدات تقنية ومنشورات تعليمية مبسطة'], ['A growing portfolio of digital products and prototypes', 'معرض متنامٍ من المنتجات الرقمية والنماذج الأولية']],
      tools: [['WordPress', 'wordpress.svg'], ['Web design', 'figma.svg'], ['AI tools', 'claude.svg'], ['Content strategy'], ['Visual design']],
      cta: ['https://www.elhawyai.com', 'Visit elhawyai.com', 'زيارة elhawyai.com']
    },
    {
      name: 'Logistics Process Documentation', nameAr: 'توثيق عمليات اللوجستيات', logos: ['excel.svg', 'word.svg'],
      cat: ['Operations / Process', 'عمليات / إجراءات'], tone: 'st-prof',
      status: ['Professional experience · Sanitized case study', 'خبرة مهنية · دراسة حالة منقّحة'],
      sub: ['Mapping import shipment lifecycles, documentation checkpoints and product registration workflows into repeatable operational guides.', 'رسم دورات حياة شحنات الاستيراد ونقاط المستندات وسير عمل تسجيل المنتجات في أدلة تشغيل قابلة للتكرار.'],
      overview: ['Drawing on my experience in logistics and international trade, I structure complex import operations into understandable stages, checklists and documents. The work covers coordination between suppliers, shipping lines, customs, internal teams and regulatory requirements.', 'بالاستناد إلى خبرتي في اللوجستيات والتجارة الدولية، أحوّل عمليات الاستيراد المعقدة إلى مراحل وقوائم تحقق ومستندات مفهومة. يشمل العمل التنسيق بين الموردين وخطوط الشحن والجمارك والفرق الداخلية والمتطلبات التنظيمية.'],
      problem: ['International shipments depend on accuracy across multiple parties and documents. Missing or inconsistent details can cause delays, rework and compliance problems.', 'تعتمد الشحنات الدولية على الدقة بين أطراف ومستندات متعددة. النقص أو التضارب في التفاصيل قد يسبب تأخيراً وإعادة عمل ومشكلات امتثال.'],
      feats: [['End-to-end import shipment lifecycle mapping and status tracking', 'رسم دورة حياة شحنة الاستيراد بالكامل ومتابعة حالتها'], ['Shipping documentation: commercial invoice, packing list, bill of lading, certificate of origin and other applicable certificates', 'مستندات الشحن: الفاتورة التجارية وقائمة التعبئة وبوليصة الشحن وشهادة المنشأ وغيرها من الشهادات'], ['Egyptian ACI / Nafeza / CargoX workflow coordination', 'تنسيق سير العمل على منظومات ACI ونافذة وCargoX'], ['Feed and additive registration documentation, label checks and supplier follow-up', 'مستندات تسجيل الأعلاف والإضافات ومراجعة الملصقات ومتابعة الموردين'], ['Process checklists, Excel trackers and standard operating procedure documentation', 'قوائم تحقق وجداول متابعة بإكسل وتوثيق إجراءات التشغيل القياسية']],
      tools: [['Import logistics'], ['International shipping'], ['Nafeza / ACI', 'nafeza.png'], ['CargoX', 'cargox.png'], ['Excel', 'excel.svg'], ['SOPs']],
      note: ['Only generic, anonymized examples are shown. No supplier contracts, shipment numbers, customer records or internal documents are published.', 'تُعرض أمثلة عامة ومجهولة فقط. لا تُنشر عقود موردين أو أرقام شحنات أو سجلات عملاء أو مستندات داخلية.']
    },
    {
      name: 'TikTok Live Interactive Game', nameAr: 'لعبة تفاعلية على تيك توك لايف', logos: ['javascript.svg', 'n8n.svg'],
      cat: ['Interactive / Game', 'تفاعلي / ألعاب'], tone: 'st-con',
      status: ['Concept · Design stage', 'فكرة · مرحلة التصميم'],
      sub: ['An automated livestream game concept where viewer gifts trigger units and influence a continuously running zombie-survival battle.', 'فكرة لعبة بث مباشر آلية، هدايا المشاهدين فيها تُنزل وحدات وتؤثر في معركة بقاء ضد الزومبي تعمل باستمرار.'],
      overview: ['This concept turns a TikTok LIVE broadcast into a dynamic, spectator-driven survival game. Combat runs automatically while audience gifts affect the battlefield, allowing the streamer to focus on the show rather than manually controlling every action.', 'تحوّل هذه الفكرة بثّ تيك توك لايف إلى لعبة بقاء ديناميكية يقودها المشاهدون. يجري القتال تلقائياً بينما تؤثر هدايا الجمهور في ساحة المعركة، فيتفرغ صاحب البث للعرض بدل التحكم اليدوي في كل حركة.'],
      problem: ['Most livestream games rely heavily on host interaction. This design explores an automated visual experience where participation is immediately visible to viewers.', 'معظم ألعاب البث تعتمد كثيراً على تفاعل المضيف. يستكشف هذا التصميم تجربة بصرية آلية تظهر فيها مشاركة المشاهد فوراً.'],
      feats: [['Automatic combat and zombie-wave progression', 'قتال تلقائي وتصاعد موجات الزومبي'], ['Gift-triggered unit spawning and power-ups', 'ظهور الوحدات والتعزيزات عند وصول الهدايا'], ['On-screen player names above units created by viewers', 'أسماء المشاهدين فوق الوحدات التي أنشأوها'], ['Smart camera framing focused on major battles and special attacks', 'كاميرا ذكية تركّز على المعارك الكبرى والهجمات الخاصة'], ['Modular concept for live-event integration, scoring and visual effects', 'فكرة معيارية لربط الأحداث المباشرة والنقاط والمؤثرات البصرية']],
      tools: [['JavaScript', 'javascript.svg'], ['Game systems'], ['Event-driven logic'], ['Live interaction'], ['Motion graphics']],
      note: ['Concept only. No public release or working TikTok integration is claimed.', 'فكرة فقط. لا يُدّعى وجود إصدار منشور أو ربط فعلي مع تيك توك.']
    },
    {
      name: 'Solo Learn', nameAr: 'Solo Learn · علّم نفسك', logos: ['javascript.svg', 'claude.svg'],
      cat: ['EdTech / Web & Mobile', 'تعليم / ويب وموبايل'], tone: 'st-live',
      status: ['Live · Ongoing development', 'منشور · تطوير مستمر'],
      sub: ['A free, Arabic-first platform for learning English on your own: listen, type letter by letter, and see the meaning instantly.', 'منصة مجانية وعربية أولاً لتعلم الإنجليزية بنفسك: اسمع، واكتب حرفاً بحرف، وشوف المعنى فوراً.'],
      problem: ['Most learners memorize words but struggle to spell and use them. Passive apps do not force real practice.', 'معظم المتعلمين يحفظون الكلمات لكنهم يتعثرون في كتابتها واستخدامها. التطبيقات السلبية لا تجبرك على التدريب الفعلي.'],
      overview: ['Solo Learn turns every sentence into a typing exercise: you hear it, type it letter by letter, and get instant feedback. Lessons are organised by level (A1, A2, B1) and include short stories you type sentence by sentence. The core experience is free, with optional accounts that sync progress across devices.', 'Solo Learn يحوّل كل جملة إلى تمرين كتابة: تسمعها، وتكتبها حرفاً بحرف، وتاخد تصحيحاً فورياً. الدروس مرتبة حسب المستوى (A1 وA2 وB1) وفيها قصص قصيرة تكتبها جملة بجملة. التجربة الأساسية مجانية، والحساب الاختياري بيحفظ تقدمك على كل أجهزتك.'],
      feats: [
        ['Letter-by-letter typing with instant feedback', 'كتابة حرف بحرف مع تصحيح فوري'],
        ['Dictation mode: listen first, then write without seeing the text', 'وضع الإملاء: اسمع الأول، واكتب من غير ما تشوف النص'],
        ['115+ lessons and stories across three levels', 'أكتر من 115 درس وقصة على ثلاث مستويات'],
        ['Accounts with progress synced across devices', 'حسابات مع مزامنة التقدم على كل الأجهزة'],
        ['Android app in development with daily reminders', 'تطبيق أندرويد قيد التطوير مع تذكير يومي']
      ],
      tools: [['Next.js'], ['Supabase'], ['Vercel'], ['React Native'], ['AI-assisted content']],
      note: ['Lesson content is written with AI assistance and is being reviewed by hand.', 'محتوى الدروس مكتوب بمساعدة الذكاء الاصطناعي، والمراجعة البشرية مستمرة.'],
      cta: ['https://www.elhawyai.com/sololearn/', 'Visit Solo Learn', 'زيارة Solo Learn']
    }
  ];
  const SLUGS = ['jarvis', 'friday', 'elhawy-ai', 'logistics', 'tiktok', 'sololearn'];
  CASES.forEach((c, i) => { c.slug = SLUGS[i]; c.img = 'assets/work/' + SLUGS[i] + '.webp'; });
  const works = document.getElementById('works');
  works.innerHTML = CASES.map((c, i) => '<button type="button" class="card folder pf" data-case="' + i + '" aria-label="' + c.name + '">'
    + '<div class="folder-tab"></div>'
    + '<div class="folder-paper"><div class="fp-head"><span data-ar="' + c.cat[1] + '">' + c.cat[0] + '</span><em class="st ' + c.tone + '" data-ar="' + c.status[1].split(' · ')[0] + '">' + c.status[0].split(' · ')[0] + '</em></div><div class="fp-body"><img src="' + c.img + '" alt="" loading="lazy" onload="this.parentNode.classList.add(\'has\')" onerror="this.remove()"></div></div>'
    + '<div class="folder-front"><h3' + (c.nameAr ? ' data-ar="' + c.nameAr + '"' : '') + '>' + c.name + '</h3><p data-ar="' + c.sub[1] + '">' + c.sub[0] + '</p>'
    + '<div class="pl">' + c.logos.map(l => '<img src="assets/logos/' + l + '" alt="">').join('') + '</div></div></button>').join('');

  const sheet = document.createElement('div');
  sheet.className = 'case'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.hidden = true;
  sheet.innerHTML = '<div class="case-bg"></div><div class="case-panel" data-lenis-prevent><button type="button" class="case-x" aria-label="Close">&times;</button><div class="case-body"></div></div>';
  document.body.appendChild(sheet);
  const caseBody = sheet.querySelector('.case-body'), casePanel = sheet.querySelector('.case-panel'), caseBg = sheet.querySelector('.case-bg');
  let caseOpen = false;
  const L = i => (ar ? 1 : 0);
  const openCase = i => {
    const c = CASES[i], k = ar ? 1 : 0, T = ar ? ['السياق', 'نظرة عامة', 'أبرز الإمكانيات', 'الأدوات والمهارات', 'كيف يعمل', 'محاور القدرات'] : ['Context', 'Overview', 'Highlights', 'Tools & skills', 'How it works', 'Capability areas'];
    sheet.dir = ar ? 'rtl' : 'ltr';
    caseBody.innerHTML = '<header class="case-hero"><img class="case-cover" src="' + c.img + '" alt="" onerror="this.remove()"><span class="case-cat">' + c.cat[k] + '</span><h2>' + (k && c.nameAr ? c.nameAr : c.name) + '</h2>'
      + '<span class="case-status st ' + c.tone + '">' + c.status[k] + '</span><p>' + c.sub[k] + '</p></header>'
      + '<div class="case-cols"><section><small>' + T[0] + '</small><p>' + c.problem[k] + '</p></section><section><small>' + T[1] + '</small><p>' + c.overview[k] + '</p></section></div>'
      + '<section class="case-feats"><small>' + T[2] + '</small><div class="feat-grid">' + c.feats.map((f, n) => '<div class="feat"><b>0' + (n + 1) + '</b><p>' + f[k] + '</p></div>').join('') + '</div></section>'
      + (c.flow ? '<section class="case-flow"><small>' + T[4] + '</small><ol>' + c.flow.map((f, n) => '<li><b>0' + (n + 1) + '</b><h4>' + f[k ? 2 : 0] + '</h4><p>' + f[k ? 3 : 1] + '</p></li>').join('') + '</ol>' + (c.areas ? '<small class="areas-l">' + T[5] + '</small><div class="tool-chips">' + c.areas.map(a => '<span>' + a[k] + '</span>').join('') + '</div>' : '') + '</section>' : '')
      + '<section class="case-tools"><small>' + T[3] + '</small><div class="tool-chips">' + c.tools.map(t => '<span>' + (t[1] ? '<img src="assets/logos/' + t[1] + '" alt="">' : '') + t[0] + '</span>').join('') + '</div></section>'
      + (c.note ? '<p class="case-note">' + c.note[k] + '</p>' : '')
      + (c.cta ? '<a class="pill light-pill case-cta" href="' + c.cta[0] + '" target="_blank" rel="noopener"><span>' + c.cta[k + 1] + '</span><i>↗</i></a>' : '');
    sheet.hidden = false; caseOpen = true;
    document.documentElement.classList.add('case-open');
    if (lenis) lenis.stop();
    casePanel.scrollTop = 0;
    gsap.fromTo(caseBg, { opacity: 0 }, { opacity: 1, duration: .5, ease: 'power2.out' });
    gsap.fromTo(casePanel, { yPercent: 100 }, { yPercent: 0, duration: .9, ease: 'expo.out' });
    gsap.from(caseBody.children, { y: 40, opacity: 0, duration: .9, stagger: .09, delay: .25, ease: 'expo.out' });
    gsap.from('.feat', { y: 30, opacity: 0, scale: .96, stagger: .07, duration: .8, delay: .5, ease: 'back.out(1.6)' });
    Snd.whoosh();
  };
  const closeCase = () => {
    if (!caseOpen) return; caseOpen = false;
    gsap.to(casePanel, { yPercent: 100, duration: .6, ease: 'expo.in' });
    gsap.to(caseBg, { opacity: 0, duration: .5, delay: .15, onComplete: () => { sheet.hidden = true; document.documentElement.classList.remove('case-open'); if (lenis) lenis.start(); } });
    Snd.click();
  };
  works.addEventListener('click', e => { const b = e.target.closest('.pf'); if (b) openCase(+b.dataset.case); });
  sheet.querySelector('.case-x').addEventListener('click', closeCase);
  caseBg.addEventListener('click', closeCase);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeCase(); });

  /* i18n */
  let ar = false;
  const i18n = [...document.querySelectorAll('[data-ar]')].filter(e => !e.classList.contains('hn'));
  i18n.forEach(e => { e._span = e.classList.contains('pill') ? e.querySelector('span') : null; e._en = (e._span || e).innerHTML; });
  const hn = [document.getElementById('hnL'), document.getElementById('hnR')];
  hn.forEach(e => e._en = e.textContent);

  /* sentences with inline logo chips that fly down into the next section */
  const chipSrc = { wp: 'wordpress.svg', claude: 'claude.svg', figma: 'figma.svg', xl: 'excel.svg', obs: 'obsidian.svg', elsalhy: 'elsalhy.png', horizon: 'horizon.png', nafeza: 'nafeza.png', cargox: 'cargox.png' };
  const TXT = {
    statement: {
      en: 'I turn complex workflows into websites @wp and AI tools @claude that feel right, with a designer’s eye @figma, backed by real logistics experience @xl and organized knowledge @obs.',
      ar: 'بحوّل العمليات المعقدة لمواقع @wp وأدوات ذكاء اصطناعي @claude سهلة وواضحة، بعين مصمم @figma، وبخبرة لوجستية حقيقية @xl ومعرفة منظمة @obs.'
    },
    bridge: {
      en: 'Years of moving cargo with Elsalhy Group @elsalhy, now coordinating marketing and logistics at Horizon @horizon, with hands-on Nafeza @nafeza and CargoX @cargox workflows, and building AI products as ELHAWY AI @claude.',
      ar: 'سنين في تحريك الشحنات مع مجموعة الصالحي @elsalhy، ودلوقتي بنسّق التسويق واللوجستيات في هورايزون @horizon، بخبرة فعلية في نافذة @nafeza وCargoX @cargox، وببني منتجات ذكاء اصطناعي باسم ELHAWY AI @claude.'
    }
  };
  const flyStore = {};
  const buildFly = (key, el, targets, trig, typed) => {
    (flyStore[key] || []).forEach(t => { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); });
    flyStore[key] = [];
    el.innerHTML = TXT[key][ar ? 'ar' : 'en'].split(' ').map(w => {
      const chars = t => [...t].map(c => '<span class="c">' + c + '</span>').join('');
      if (w[0] !== '@') return typed ? '<span class="tw">' + chars(w) + '</span>' : '<span class="w">' + w + '</span>';
      const src = 'assets/logos/' + chipSrc[w.match(/^@([a-z0-9]+)/)[1]];
      return '<span class="logo-chip"><img class="ghost" src="' + src + '" alt=""><span class="fly"><img src="' + src + '" alt=""></span></span>' + (typed ? '<span class="tw">' + chars(w.replace(/^@[a-z0-9]+/, '')) + '</span>' : w.replace(/^@[a-z0-9]+/, ''));
    }).join(' ');
    el.classList.toggle('typed', !!typed);
    if (!typed) flyStore[key].push(gsap.to(el.querySelectorAll('.w'), { opacity: 1, stagger: .15, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true } }));
    if (reduce) { document.documentElement.classList.remove('fly-on'); return; }
    document.documentElement.classList.add('fly-on');
    if (typed) {
      const items = [...el.querySelectorAll('.c, .logo-chip')], times = []; let t = 0, prevWord = null, cur = null, started = false, stop = () => {};
      items.forEach(x => {
        const word = x.parentElement;
        if (x.classList.contains('logo-chip')) t += 320;
        else { if (word !== prevWord) t += 70; t += 24 + Math.random() * 26; if (/[,.;،]/.test(x.textContent)) t += 130; }
        prevWord = x.classList.contains('logo-chip') ? null : word;
        times.push(t);
      });
      const show = (x, quiet) => {
        if (x.classList.contains('logo-chip')) { x.classList.add('on'); if (!quiet) Snd.pop(); return; }
        if (cur) cur.classList.remove('cur');
        x.classList.add('on', 'cur'); cur = x;
        if (!quiet) Snd.key(false);
      };
      if (reduce) items.forEach(x => show(x, true));
      else {
        const run = () => {
          if (started) return; started = true;
          const t0 = performance.now(); let idx = 0;
          const tick = () => { const now = performance.now() - t0; while (idx < items.length && times[idx] <= now) show(items[idx++]); if (idx >= items.length) { gsap.ticker.remove(tick); if (cur) setTimeout(() => cur && cur.classList.remove('cur'), 1800); } };
          stop = () => gsap.ticker.remove(tick);
          gsap.ticker.add(tick);
        };
        const st0 = ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: run });
        if (st0.progress > 0) run();
        flyStore[key].push({ kill: () => { stop(); st0.kill(); } });
      }
    }
    const center = r => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    [...el.querySelectorAll('.logo-chip')].forEach((chip, i) => {
      const fly = chip.querySelector('.fly'), tgt = targets()[i];
      if (!tgt) return;
      tgt.classList.add('tgt');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: trig.start || 'top 72%', endTrigger: trig.endTrigger, end: trig.end, scrub: 1.1, invalidateOnRefresh: true } });
      tl.fromTo(fly, typed ? { scale: 1, rotation: 0 } : { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: .14, ease: 'back.out(2.2)' }, i * .035)
        .to(chip, { '--ph': 1, duration: .08 }, (trig.hold || .36) - .06)
        .to(fly, {
          x: () => center(tgt.getBoundingClientRect()).x - center(chip.getBoundingClientRect()).x,
          y: () => center(tgt.getBoundingClientRect()).y - center(chip.getBoundingClientRect()).y,
          rotation: 0,
          scale: () => tgt.getBoundingClientRect().width / (chip.offsetWidth * .68),
          backgroundColor: 'rgba(255,255,255,0)', boxShadow: '0 0 0 rgba(0,0,0,0)',
          duration: .5, ease: 'power3.inOut'
        }, (trig.hold || .36) + i * .05)
        .to({}, { duration: .06 });
      flyStore[key].push(tl);
      const D = tl.duration(), H = trig.hold || .36;
      flyStore[key].push(ScrollTrigger.create({
        trigger: el, start: trig.start || 'top 72%', endTrigger: trig.endTrigger, end: trig.end,
        onUpdate: crossAt([{ k: 'pop', at: (i * .035 + .07) / D }, { k: 'go', at: (H + i * .05) / D }, { k: 'land', at: (H + i * .05 + .5) / D }], (k, fwd) => { if (k === 'pop') { if (!typed) Snd.pop(); } else if (k === 'go') Snd.whoosh(); else Snd.land(); })
      }));
      const row = tgt.closest('.svc, .exp-card');
      if (row) {
        row.addEventListener('mouseenter', () => gsap.to(fly.firstChild, { rotation: 12, scale: 1.12, duration: .5, ease: 'back.out(2)' }));
        row.addEventListener('mouseleave', () => gsap.to(fly.firstChild, { rotation: 0, scale: 1, duration: .5, ease: 'expo.out' }));
      }
    });
  };
  const buildStatement = () => {
    buildFly('statement', document.getElementById('statement'), () => [...document.querySelectorAll('.svc img')], { endTrigger: '.svc-list', end: 'top 38%' }, true);
    buildFly('bridge', document.getElementById('bridgeText'), () => [
      document.querySelector('.exp:nth-of-type(1) .exp-logo img'),
      document.querySelector('.exp:nth-of-type(2) .exp-logo img'),
      document.querySelector('.exp:nth-of-type(1) .exp-sys img[alt="Nafeza"]'),
      document.querySelector('.exp:nth-of-type(1) .exp-sys img[alt="CargoX"]'),
      document.querySelector('.exp:nth-of-type(3) .exp-sys img[alt="Claude"]')
    ], { start: 'top 85%', endTrigger: '#expWrap', end: 'top 45%', hold: .55 });
  };
  buildStatement();

  const setHero = () => hn.forEach(e => {
    e.textContent = ar ? e.dataset.ar : e._en;
    if (!ar) split(e); // Arabic letters must stay joined: never split into characters
  });
  const setLang = on => {
    ar = on;
    document.documentElement.lang = ar ? 'ar' : 'en';
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
    document.body.classList.toggle('ar', ar);
    i18n.forEach(e => { (e._span || e).innerHTML = ar ? e.dataset.ar : e._en; });
    setHero();
    buildStatement();
    gsap.fromTo(ar ? '.hn' : '.hn .ch', { yPercent: 110 }, { yPercent: 0, duration: .9, stagger: ar ? .1 : .04, ease: 'expo.out', overwrite: true });
    document.querySelector('#lang span').textContent = ar ? 'EN' : 'ع';
    ScrollTrigger.refresh();
  };
  document.getElementById('lang').addEventListener('click', () => { Snd.click(); setLang(!ar); });
  document.querySelectorAll('.dock-item, .pill, .svc, .ct, .vtile, .vfeat, .toolt, .skill, .cv-banner, .back-pill, .ftile').forEach(el => el.addEventListener('mouseenter', () => Snd.tick()));
  document.querySelectorAll('a, button').forEach(el => el.addEventListener('click', () => { if (el.id !== 'lang' && el.id !== 'snd') Snd.click(); }));
  const sndBtn = document.getElementById('snd');
  const paintSnd = () => sndBtn.classList.toggle('off', !Snd.on);
  paintSnd();
  sndBtn.addEventListener('click', () => { Snd.unlock(); Snd.set(!Snd.on); paintSnd(); Snd.toggle(Snd.on); });
  const hint = document.getElementById('loaderHint');
  addEventListener('pointerdown', function once() { if (hint && hint.isConnected) { Snd.intro(); } removeEventListener('pointerdown', once); }, { once: true });

  /* split titles */
  document.querySelectorAll('.sec-title').forEach(t => { if (!t.dataset.ar) split(t); });
  hn.forEach(e => split(e));

  /* preloader */
  const countEl = document.getElementById('count');
  const loaderTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  gsap.set('.hero-name .ch', { yPercent: 120 });
  gsap.set('.portrait', { yPercent: 30, opacity: 0 });
  gsap.set('.hero-sub,.hero .pill', { opacity: 0, y: 30 });
  gsap.set('.dock', { yPercent: -150 });
  const cnt = { v: 0 };
  loaderTl
    .to('.loader-word span', { y: 0, yPercent: 0, opacity: 1, stagger: .07, duration: 1 }, 0)
    .to(cnt, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => countEl.textContent = Math.round(cnt.v) }, 0)
    .to('.loader-word span', { yPercent: -110, stagger: .04, duration: .7, ease: 'expo.in' }, 2)
    .add(() => Snd.whoosh(), 2.35)
    .to('.loader', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 2.35)
    .to('.dock', { yPercent: 0, duration: 1.1, ease: 'back.out(1.6)' }, 2.9)
    .to('.hero-name .ch', { yPercent: 0, stagger: .045, duration: 1.2 }, 2.7)
    .to('.portrait', { yPercent: 0, opacity: 1, duration: 1.4 }, 2.8)
    .to('.hero-sub,.hero .pill', { opacity: 1, y: 0, stagger: .12, duration: 1 }, 3.2)
    .set('.loader', { display: 'none' });
  if (reduce) loaderTl.progress(1);

  /* hero mouse tracking + scroll parallax */
  const card = document.getElementById('heroCard');
  const portrait = document.getElementById('portrait');
  const glow = document.getElementById('heroGlow');
  const hnL = document.getElementById('hnL'), hnR = document.getElementById('hnR');
    const gx = gsap.quickTo(glow, 'left', { duration: 1, ease: 'power3' });
  const gy = gsap.quickTo(glow, 'top', { duration: 1, ease: 'power3' });
  card.addEventListener('mousemove', e => { const r = card.getBoundingClientRect(); gx(e.clientX - r.left); gy(e.clientY - r.top); });
  gsap.to(card, { borderRadius: 60, scale: .96, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });


  /* logo tiles: float in hero (mouse reactive), then fall into the next slide on scroll */
  const stage = document.getElementById('stage');
  const tiles = [...document.querySelectorAll('.dtile')];
  const starts = innerWidth <= 640 ? [[.08,.46,-8],[.92,.44,8],[.08,.58,6],[.92,.57,-6],[.08,.7,-6],[.92,.7,6],[.08,.82,8],[.92,.83,-8]] : [[.07,.17,-8],[.19,.1,6],[.81,.1,-6],[.93,.17,8],[.06,.8,6],[.18,.88,-8],[.82,.88,8],[.94,.8,-6]];
  const ts = () => innerWidth <= 640 ? 64 : 104;

  const fanEl = document.getElementById('fan');
  const toolsEl = document.querySelector('.tools');
  const ftiles = tiles.map((t, i) => { const f = document.createElement('div'); f.className = 'ftile'; f.innerHTML = t.querySelector('.di').outerHTML; fanEl.appendChild(f); f.style.zIndex = i + 1; f.style.setProperty('--k', i); return f; });
  const layoutFan = () => {
    const W = toolsEl.offsetWidth || 420, sz = Math.min(W * .235, 118), spread = W * .52;
    ftiles.forEach((f, i) => {
      const u = i / (ftiles.length - 1);
      f._rot = -24 + u * 40;
      f.style.width = f.style.height = sz + 'px';
      f.style.left = (W / 2 - sz / 2 + (u - .5) * spread) + 'px';
      f.style.top = (30 + (1 - u) * sz * .34) + 'px';
      f.style.transform = 'rotate(' + f._rot + 'deg)';
    });
  };
  layoutFan();
  ScrollTrigger.addEventListener('refreshInit', layoutFan);
  const endTs = () => (ftiles[0] && ftiles[0].offsetWidth) || 80;
  const toolsEnd = () => Math.max(420, lay(toolsEl).y - innerHeight * .5);
  const rel = (el) => { const a = el.getBoundingClientRect(), b = stage.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height }; };
  const lay = el => { let x = 0, y = 0, n = el; while (n && n !== stage) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; }; // ignores transforms of animating cards
  tiles.forEach((t, i) => {
    const di = t.querySelector('.di');
    const heroDist = () => rel(document.getElementById('hero')).h * 1.1 + 200;
    gsap.fromTo(t, {
      x: () => { const h = rel(card); return h.x + starts[i][0] * h.w - ts() / 2; },
      y: () => { const h = rel(card); return h.y + starts[i][1] * h.h - ts() / 2; },
      rotation: starts[i][2]
    }, {
      x: () => lay(ftiles[i]).x,
      y: () => lay(ftiles[i]).y,
      rotation: () => ftiles[i]._rot,
      width: () => endTs(), height: () => endTs(),
      ease: 'back.out(1.25)',
      scrollTrigger: { trigger: stage, start: 'top top', end: () => '+=' + (toolsEnd() + i * 26), scrub: 1, invalidateOnRefresh: true, onUpdate: self => { const done = self.progress > .985; if (done !== t._done) { t._done = done; t.style.visibility = done ? 'hidden' : 'visible'; ftiles[i].classList.toggle('on', done); } } }
    });
    if (!reduce) {
      gsap.to(di, { scale: 1 + gsap.utils.random(.03, .08), rotation: gsap.utils.random(-5, 5), duration: gsap.utils.random(2, 3.5), repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    ScrollTrigger.create({ trigger: stage, start: 'top top', end: () => '+=' + (toolsEnd() + i * 26), onUpdate: crossAt([{ k: 'l', at: .97 }], () => Snd.land(.5)) });
    if (i % 3 === 0) ScrollTrigger.create({ trigger: stage, start: () => 'top top-=' + (i * 14), end: () => '+=60', onUpdate: crossAt([{ k: 'g', at: .5 }], () => Snd.whoosh()) });
    t._qx = gsap.quickTo(di, 'x', { duration: .9, ease: 'power3' });
    t._qy = gsap.quickTo(di, 'y', { duration: .9, ease: 'power3' });
    t._d = gsap.utils.random(.5, 1.6) * (i % 2 ? -1 : 1);
  });
  const TOOLS = [
    { n: 'Claude', en: ['AI assistant and coding partner', 'Prototyping agents, writing code and structuring content.'], ar: ['مساعد ذكاء اصطناعي وشريك برمجة', 'بناء نماذج الوكلاء وكتابة الأكواد وهيكلة المحتوى.'] },
    { n: 'n8n', en: ['Workflow automation', 'Connecting apps and building automation proofs of concept.'], ar: ['أتمتة سير العمل', 'ربط التطبيقات وبناء نماذج أولية للأتمتة.'] },
    { n: 'OpenAI', en: ['Language models', 'Prompt engineering, research and conversational AI experiments.'], ar: ['نماذج لغوية', 'هندسة الأوامر والبحث وتجارب الذكاء الاصطناعي التفاعلي.'] },
    { n: 'WordPress', en: ['Website builder', 'Designing and launching business and personal websites.'], ar: ['منصة بناء المواقع', 'تصميم وإطلاق مواقع الشركات والمواقع الشخصية.'] },
    { n: 'Figma', en: ['Interface design', 'Wireframes, screens, social and branding creatives.'], ar: ['تصميم الواجهات', 'مخططات وشاشات وتصاميم سوشيال وهوية.'] },
    { n: 'Obsidian', en: ['Knowledge vault', 'My second brain for notes and project memory.'], ar: ['قاعدة المعرفة', 'عقلي الثاني للملاحظات وذاكرة المشاريع.'] },
    { n: 'Excel / VBA', en: ['Spreadsheets and macros', 'Shipment tracking, reports and small automations.'], ar: ['جداول وماكرو', 'متابعة الشحنات والتقارير وأتمتة صغيرة.'] },
    { n: 'GitHub', en: ['Code hosting', 'Version control and sharing for my prototypes.'], ar: ['استضافة الأكواد', 'إدارة الإصدارات ومشاركة النماذج الأولية.'] }
  ];
  const tip = document.createElement('div');
  tip.className = 'tip'; tip.setAttribute('role', 'dialog');
  stage.appendChild(tip);
  let tipFor = -1;
  const closeTip = () => { if (tipFor < 0) return; tipFor = -1; gsap.to(tip, { opacity: 0, y: 8, scale: .96, duration: .25, ease: 'power2.in', onComplete: () => { tip.style.visibility = 'hidden'; } }); };
  const openTip = i => {
    const t = tiles[i], d = TOOLS[i], tx = d[ar ? 'ar' : 'en'];
    tipFor = i;
    tip.dir = ar ? 'rtl' : 'ltr';
    tip.innerHTML = '<div class="tip-h"><img src="' + t.querySelector('img').src + '" alt=""><b>' + d.n + '</b></div><strong>' + tx[0] + '</strong><p>' + tx[1] + '</p>';
    tip.style.visibility = 'visible';
    const sr = stage.getBoundingClientRect(), tr = t.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = tr.left + tr.width / 2 - sr.left - tw / 2; x = Math.max(8, Math.min(x, sr.width - tw - 8));
    let y = tr.top - sr.top - th - 14, below = false;
    if (tr.top - th - 14 < 70) { y = tr.bottom - sr.top + 14; below = true; }
    tip.classList.toggle('below', below);
    tip.style.setProperty('--ax', (tr.left + tr.width / 2 - sr.left - x) + 'px');
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    gsap.fromTo(tip, { opacity: 0, y: below ? -8 : 8, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: 'back.out(1.8)' });
    Snd.click();
  };
  tiles.forEach((t, i) => {
    t.setAttribute('tabindex', '0'); t.setAttribute('role', 'button'); t.setAttribute('aria-label', TOOLS[i].n);
    t.addEventListener('click', e => { e.stopPropagation(); tipFor === i ? closeTip() : openTip(i); });
    t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tipFor === i ? closeTip() : openTip(i); } });
  });
  ftiles.forEach((f, i) => { f.setAttribute('tabindex', '0'); f.setAttribute('role', 'button'); f.setAttribute('aria-label', TOOLS[i].n); f.addEventListener('click', e => { e.stopPropagation(); tipFor === i ? closeTip() : openTip(i); }); f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tipFor === i ? closeTip() : openTip(i); } }); });
  document.addEventListener('click', e => { if (tipFor >= 0 && !tip.contains(e.target)) closeTip(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeTip(); });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: () => { if (tipFor >= 0) closeTip(); } });
  ScrollTrigger.create({ trigger: stage, start: 'top top', end: () => '+=' + (document.getElementById('hero').offsetHeight * 1.1 + 200),
    onUpdate: crossAt([{ k: 'go', at: .04 }], () => Snd.whoosh()) });
  addEventListener('mousemove', e => {
    const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
    tiles.forEach(t => { t._qx(nx * 70 * t._d); t._qy(ny * 70 * t._d); });
  });
  gsap.set(tiles, { opacity: 0, scale: 0 });
  loaderTl.to(tiles, { opacity: 1, scale: 1, stagger: .08, duration: 1, ease: 'back.out(2)' }, 3.3);
  if (reduce) gsap.set(tiles, { opacity: 1, scale: 1 });

  addEventListener('load', () => ScrollTrigger.refresh());
  if (window.ResizeObserver) new ResizeObserver(() => ScrollTrigger.refresh()).observe(document.querySelector('.bento'));

  /* bento reveal */
  gsap.from('.bento .card', { y: 120, opacity: 0, rotate: 2, duration: 1.2, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.bento', start: 'top 80%' } });

  /* folders: paper slides up on scroll; opens on hover (cover tilts, paper rises) */
  document.querySelectorAll('.folder').forEach(f => {
    const paper = f.querySelector('.folder-paper'), front = f.querySelector('.folder-front');
    if (f.classList.contains('pf')) {
      gsap.from(f, { y: 70, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 90%' } });
      if (!touch) f.addEventListener('mouseenter', () => Snd.open());
      return;
    }
    if (f.closest('.screens')) {
      gsap.from(paper, { y: 46, opacity: 0, scale: .94, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 88%' } });
      if (!touch) { f.addEventListener('mouseenter', () => { Snd.open(); gsap.to(paper, { y: -8, scale: 1.025, duration: .6, ease: 'expo.out' }); }); f.addEventListener('mouseleave', () => gsap.to(paper, { y: 0, scale: 1, duration: .7, ease: 'expo.out' })); }
      return;
    }
    gsap.set(front, { transformOrigin: '50% 100%', transformPerspective: 900 });
    gsap.fromTo(paper, { y: 110 }, { y: 0, ease: 'none', scrollTrigger: { trigger: f, start: 'top 92%', end: 'top 45%', scrub: true } });
    if (touch) return;
    f.addEventListener('mouseenter', () => { Snd.open(); gsap.to(paper, { y: -52, duration: .7, ease: 'expo.out', overwrite: 'auto' }); gsap.to(front, { rotationX: -9, y: 10, duration: .7, ease: 'expo.out' }); });
    f.addEventListener('mouseleave', () => { gsap.to(paper, { y: 0, duration: .8, ease: 'expo.out', overwrite: 'auto' }); gsap.to(front, { rotationX: 0, y: 0, duration: .8, ease: 'expo.out' }); });
  });
  const toolsCard = document.querySelector('.tools');
  toolsCard.addEventListener('mouseenter', () => Snd.tick());
  toolsCard.addEventListener('mouseenter', () => gsap.to('.dtile .di', { yPercent: -14, stagger: { each: .04, from: 'center' }, duration: .6, ease: 'back.out(2)', overwrite: 'auto' }));
  toolsCard.addEventListener('mouseleave', () => gsap.to('.dtile .di', { yPercent: 0, stagger: .03, duration: .7, ease: 'expo.out', overwrite: 'auto' }));

  /* 3D tilt on cards */
  if (!touch && !reduce) document.querySelectorAll('.tilt:not(.folder)').forEach(c => {
    const rx = gsap.quickTo(c, 'rotationX', { duration: .6, ease: 'power3' });
    const ry = gsap.quickTo(c, 'rotationY', { duration: .6, ease: 'power3' });
    gsap.set(c, { transformPerspective: 900 });
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - .5) * 8);
      rx(((e.clientY - r.top) / r.height - .5) * -8);
    });
    c.addEventListener('mouseleave', () => { rx(0); ry(0); });
  });

  /* statement: words scrub + logo chips pop */
  gsap.from('.about-photo', { clipPath: 'inset(100% 0 0 0 round 36px)', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.about-card', start: 'top 80%' } });
  gsap.from('.about-photo img', { scale: 1.25, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.about-card', start: 'top 80%' } });
  gsap.from('.about-copy > *', { y: 36, opacity: 0, stagger: .12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.about-card', start: 'top 75%' } });
  gsap.from('.about-facts > div', { opacity: 0, scale: .9, stagger: .12, duration: .9, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.about-facts', start: 'top 90%' } });

  /* titles */
  document.querySelectorAll('.sec-title').forEach(t => {
    const c = t.querySelectorAll('.ch');
    if (c.length) gsap.from(c, { yPercent: 110, stagger: .035, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 85%' } });
  });
  gsap.from('.svc', { opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.svc-list', start: 'top 80%' } });
  /* experience: progress line draws, cards rise, dots pop, spotlight follows cursor */
  gsap.fromTo('#expFill', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#expWrap', start: 'top 65%', end: 'bottom 75%', scrub: 1.1 } });
  document.querySelectorAll('.exp').forEach(x => {
    const st = { trigger: x, start: 'top 82%' };
    gsap.from(x.querySelector('.exp-card'), { opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'expo.out', scrollTrigger: st });
    gsap.from(x.querySelector('.exp-when'), { x: -30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: st });
    gsap.from(x.querySelectorAll('.exp-body li, .exp-sys .sys'), { opacity: 0, stagger: .08, duration: .8, delay: .25, ease: 'expo.out', scrollTrigger: st });
    gsap.from(x.querySelector('.exp-dot'), { scale: 0, duration: .7, ease: 'back.out(3)', scrollTrigger: st });
    const c = x.querySelector('.exp-card');
    c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });

  /* education, skills, academy: staggered reveals */
  const rev = (sel, trig, o = {}) => { const els = document.querySelectorAll(sel); if (els.length) gsap.from(els, Object.assign({ y: 40, opacity: 0, duration: 1, stagger: .09, ease: 'expo.out', scrollTrigger: { trigger: trig, start: 'top 82%' } }, o)); };
  rev('.cred li', '.cred', { x: -24, y: 0 });
  rev('.skill', '.skillgrid', { scale: .9, y: 20, ease: 'back.out(1.6)' });
  rev('.cv-banner', '.cv-banner');
  rev('.acad-photo', '.acad-top', { y: 60 });
  rev('.vfeat', '.acad-top', { y: 60, delay: .15 });
  rev('.acad-stats > div', '.acad-stats', { scale: .92 });
  rev('.vtile', '.vgrid');
  rev('.toolt', '.toolgrid', { y: 30 });
  gsap.to('.vplay', { scale: 1.12, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  /* contact: floating icons drift + react to mouse */
  const icons = [...document.querySelectorAll('#floatIcons img')];
  const pos = [[8, 16, -12], [82, 12, 14], [14, 70, 10], [78, 68, -10], [46, 8, 6], [90, 40, -6], [4, 42, 8]];
  icons.forEach((im, i) => {
    gsap.set(im, { left: pos[i][0] + '%', top: pos[i][1] + '%', rotate: pos[i][2] });
    gsap.from(im, { scale: 0, opacity: 0, duration: 1, delay: i * .08, ease: 'back.out(2)', scrollTrigger: { trigger: '#contact', start: 'top 60%' } });
    gsap.to(im, { y: gsap.utils.random(-26, 26), x: gsap.utils.random(-14, 14), rotate: '+=' + gsap.utils.random(-12, 12), duration: gsap.utils.random(2.5, 4.5), repeat: -1, yoyo: true, ease: 'sine.inOut' });
    im._d = gsap.utils.random(.4, 1.6);
  });
  const contact = document.getElementById('contact');
  contact.addEventListener('mousemove', e => {
    const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
    icons.forEach(im => gsap.to(im, { '--mx': 0, translateX: nx * 60 * im._d, translateY: ny * 60 * im._d, duration: 1, overwrite: 'auto' }));
  });
  gsap.from('.cta-big', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '#contact', start: 'top 55%' } });

  /* magnetic buttons (native mouse cursor is used) */
  if (!touch) {
    document.querySelectorAll('.magnetic').forEach(m => {
      const mx = gsap.quickTo(m, 'x', { duration: .5, ease: 'power3' }), my = gsap.quickTo(m, 'y', { duration: .5, ease: 'power3' });
      m.addEventListener('mousemove', e => { const r = m.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .35); my((e.clientY - r.top - r.height / 2) * .5); });
      m.addEventListener('mouseleave', () => { mx(0); my(0); });
    });
  }

  /* dock hides on scroll down, returns on up */
  let last = 0;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
    const y = s.scroll();
    if (y > 300) gsap.to('.dock', { yPercent: s.direction === 1 ? -0 : 0, duration: .3 });
    last = y;
  } });
})();
