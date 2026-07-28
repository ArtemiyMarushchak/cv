(function(){
  const STORAGE_KEY="cv-language";
  const supported=["ru","sk","en"];
  const fallback="ru";
  const resume=document.getElementById("cv-resume");
  const language=document.getElementById("cv-language");
  const toggle=language?language.querySelector(".cv-language__toggle"):null;
  const current=language?language.querySelector(".cv-language__current"):null;
  const buttons=document.querySelectorAll("[data-cv-lang]");
  let activeLanguage=fallback;
  let dictionaryApplied=false;
  let attempts=0;

  function dictionary(){
    return window.cvDictionary&&typeof window.cvDictionary==="object"?window.cvDictionary:null;
  }

  function translate(lang){
    const dict=dictionary();
    if(!dict||!dict[lang])return false;

    document.querySelectorAll("#cv-resume [data-i18n],#cv-case-modal [data-i18n]").forEach(function(el){
      const key=el.getAttribute("data-i18n");
      const value=dict[lang][key];
      if(typeof value==="string")el.textContent=value;
    });

    document.querySelectorAll("#cv-resume [data-i18n-alt]").forEach(function(el){
      const key=el.getAttribute("data-i18n-alt");
      const value=dict[lang][key];
      if(typeof value==="string")el.setAttribute("alt",value);
    });

    document.querySelectorAll("#cv-case-modal [data-i18n-aria]").forEach(function(el){
      const key=el.getAttribute("data-i18n-aria");
      const value=dict[lang][key];
      if(typeof value==="string")el.setAttribute("aria-label",value);
    });

    dictionaryApplied=true;
    return true;
  }

  function applyLanguage(lang){
    const safe=supported.includes(lang)?lang:fallback;
    activeLanguage=safe;
    translate(safe);

    if(resume){
      resume.setAttribute("lang",safe);
      resume.dataset.language=safe;
    }
    document.documentElement.setAttribute("lang",safe);

    buttons.forEach(function(button){
      const active=button.getAttribute("data-cv-lang")===safe;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",active?"true":"false");
    });

    if(current)current.textContent=safe.toUpperCase();
    if(language)language.classList.remove("is-open");
    if(toggle)toggle.setAttribute("aria-expanded","false");
    try{localStorage.setItem(STORAGE_KEY,safe)}catch(error){}
  }

  function waitForDictionary(){
    if(translate(activeLanguage))return;
    attempts+=1;
    if(attempts<120)setTimeout(waitForDictionary,100);
  }

  buttons.forEach(function(button){
    button.addEventListener("click",function(){
      applyLanguage(button.getAttribute("data-cv-lang"));
    });
  });

  if(toggle&&language){
    toggle.addEventListener("click",function(event){
      event.stopPropagation();
      const open=language.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded",open?"true":"false");
    });

    document.addEventListener("click",function(event){
      if(!language.contains(event.target)){
        language.classList.remove("is-open");
        toggle.setAttribute("aria-expanded","false");
      }
    });
  }

  try{
    const saved=localStorage.getItem(STORAGE_KEY);
    if(supported.includes(saved))activeLanguage=saved;
  }catch(error){}

  window.cvSetLanguage=applyLanguage;
  window.addEventListener("cv-dictionary-ready",function(){
    attempts=0;
    applyLanguage(activeLanguage);
  });
  document.addEventListener("DOMContentLoaded",function(){
    applyLanguage(activeLanguage);
    waitForDictionary();
  });

  applyLanguage(activeLanguage);
  waitForDictionary();
})();
