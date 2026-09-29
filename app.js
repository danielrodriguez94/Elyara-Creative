(() => {
  const translations = window.ELYARA_TRANSLATIONS || {};
  const config = window.ELYARA_CONFIG || {};
  const fallback = translations.en || {};

  const languageNames = { en: 'English', es: 'Español', pt: 'Português', it: 'Italiano', fr: 'Français', zh: '中文' };
  let currentLang = localStorage.getItem('elyara-language') || 'en';
  if (!translations[currentLang]) currentLang = 'en';

  const t = (key) => translations[currentLang]?.[key] ?? fallback[key] ?? key;

  function applyLanguage(lang) {
    currentLang = translations[lang] ? lang : 'en';
    localStorage.setItem('elyara-language', currentLang);
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = t(key);
    });
    const label = document.getElementById('languageLabel');
    if (label) label.textContent = translations[currentLang]?.language_name || languageNames[currentLang];
  }

  applyLanguage(currentLang);
  document.getElementById('year').textContent = new Date().getFullYear();

  const languageButton = document.getElementById('languageButton');
  const languageMenu = document.getElementById('languageMenu');
  languageButton?.addEventListener('click', () => {
    const open = languageMenu.classList.toggle('is-open');
    languageButton.setAttribute('aria-expanded', String(open));
  });
  languageMenu?.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
    applyLanguage(btn.dataset.lang);
    languageMenu.classList.remove('is-open');
    languageButton.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-wrap')) {
      languageMenu?.classList.remove('is-open');
      languageButton?.setAttribute('aria-expanded', 'false');
    }
  });

  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  menuToggle?.addEventListener('click', () => mobileNav.classList.toggle('is-open'));
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('is-open')));

  const emailNode = document.getElementById('contactEmail');
  const phoneNode = document.getElementById('contactPhone');
  if (config.email && emailNode) emailNode.textContent = config.email;
  if (config.phone && phoneNode) phoneNode.textContent = config.phone;

  let supabaseClient = null;
  if (config.supabaseUrl && config.supabaseAnonKey && window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  document.getElementById('googleLogin')?.addEventListener('click', async () => {
    if (!supabaseClient) {
      alert(t('login_setup'));
      return;
    }
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: config.authRedirectUrl || window.location.href }
    });
    if (error) alert(error.message);
  });

  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    if (!supabaseClient) {
      formStatus.textContent = t('form_setup');
      return;
    }
    formStatus.textContent = '...';
    const { error } = await supabaseClient.from('inquiries').insert([{
      name: values.name,
      email: values.email,
      business: values.business || null,
      service: values.service,
      message: values.message,
      language: currentLang,
      source: 'elyara-website'
    }]);
    if (error) {
      formStatus.textContent = error.message;
      return;
    }
    form.reset();
    formStatus.textContent = t('form_success');
  });

  const overlay = document.getElementById('searchOverlay');
  const siteSearch = document.getElementById('siteSearch');
  const searchResults = document.getElementById('searchResults');
  const searchIndex = [
    ['Websites', '#catalog', 'Custom websites, multilingual sites and platforms'],
    ['Advertising', '#marketing', 'Facebook, Instagram and TikTok advertising'],
    ['Portfolio', '#portfolio', 'Mezcal Chuparrosa, Sandra’s Family Childcare, Cumbre de Identidad'],
    ['Branding', '#catalog', 'Brand identity and business materials'],
    ['Printing', '#catalog', 'Flyers, cards, labels, brochures and signage'],
    ['Contact', '#contact', 'Request a quote or tell us about your project']
  ];
  document.getElementById('searchToggle')?.addEventListener('click', () => {
    overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden','false');
    setTimeout(() => siteSearch.focus(), 50);
  });
  document.getElementById('searchClose')?.addEventListener('click', closeSearch);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
  function closeSearch(){ overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden','true'); }
  siteSearch?.addEventListener('input', () => {
    const q = siteSearch.value.trim().toLowerCase();
    if (!q) { searchResults.innerHTML = ''; return; }
    searchResults.innerHTML = searchIndex.filter(x => x.join(' ').toLowerCase().includes(q)).map(x => `<a class="search-result" href="${x[1]}"><strong>${x[0]}</strong>${x[2]}</a>`).join('') || '<p class="search-result">No results</p>';
    searchResults.querySelectorAll('a').forEach(a => a.addEventListener('click', closeSearch));
  });
})();
