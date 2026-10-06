(()=>{
  const KEY='invoiceguard_theme';
  const labels={
    en:{system:'Theme: System. Switch to dark',dark:'Theme: Dark. Switch to light',light:'Theme: Light. Switch to system'},
    ru:{system:'Тема: системная. Переключить на тёмную',dark:'Тема: тёмная. Переключить на светлую',light:'Тема: светлая. Переключить на системную'},
    uz:{system:"Mavzu: tizim. Qorong‘i mavzuga o‘tish",dark:"Mavzu: qorong‘i. Yorug‘ mavzuga o‘tish",light:"Mavzu: yorug‘. Tizim mavzusiga o‘tish"},
    es:{system:'Tema: sistema. Cambiar a oscuro',dark:'Tema: oscuro. Cambiar a claro',light:'Tema: claro. Cambiar a sistema'},
    de:{system:'Design: System. Zu Dunkel wechseln',dark:'Design: Dunkel. Zu Hell wechseln',light:'Design: Hell. Zu System wechseln'},
    fr:{system:'Thème : système. Passer au sombre',dark:'Thème : sombre. Passer au clair',light:'Thème : clair. Passer au système'},
    pt:{system:'Tema: sistema. Mudar para escuro',dark:'Tema: escuro. Mudar para claro',light:'Tema: claro. Mudar para sistema'}
  };
  const root=document.documentElement;
  const systemTheme=()=>matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  const saved=()=>{try{const v=localStorage.getItem(KEY);return ['system','light','dark'].includes(v)?v:'system'}catch{return 'system'}};
  const apply=(preference=saved(),persist=false)=>{
    const pref=['system','light','dark'].includes(preference)?preference:'system';
    const resolved=pref==='system'?systemTheme():pref;
    root.dataset.theme=resolved;
    root.dataset.themePreference=pref;
    root.style.colorScheme=resolved;
    if(persist){try{localStorage.setItem(KEY,pref)}catch{}}
    const button=document.getElementById('themeToggle');
    if(button){
      button.dataset.preference=pref;
      button.textContent=pref==='system'?'◐':resolved==='dark'?'☀':'☾';
      const lang=(document.documentElement.lang||'en').slice(0,2);
      button.setAttribute('aria-label',(labels[lang]||labels.en)[pref]);
      button.setAttribute('title',(labels[lang]||labels.en)[pref]);
    }
  };
  apply();
  document.addEventListener('DOMContentLoaded',()=>{
    apply();
    document.getElementById('themeToggle')?.addEventListener('click',()=>{
      const current=saved();
      apply(current==='system'?'dark':current==='dark'?'light':'system',true);
    });
    document.getElementById('language')?.addEventListener('change',()=>setTimeout(()=>apply(),0));
  });
  try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(saved()==='system')apply('system')})}catch{}
})();
