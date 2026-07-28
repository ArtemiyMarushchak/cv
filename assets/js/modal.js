(function(){
  const body=document.body;
  const modal=document.getElementById("cv-case-modal");
  const mount=document.getElementById("cv-case-modal-mount");
  const title=document.getElementById("cv-case-modal-title");
  const cards=document.querySelectorAll("[data-demo]");
  let activeSource=null;
  let activePlaceholder=null;

  const sourceMap={
    calc:{selector:".cv-demo-source--calc",titleKey:"modalCalcTitle",fallback:"Калькулятор фулфилмента"},
    quiz:{selector:".cv-demo-source--quiz",titleKey:"modalQuizTitle",fallback:"Детский квиз"}
  };

  function getModalTitle(config){
    const root=document.getElementById("cv-resume");
    const lang=root&&root.dataset.language?root.dataset.language:"ru";
    const dict=window.cvDictionary;
    return dict&&dict[lang]&&dict[lang][config.titleKey]?dict[lang][config.titleKey]:config.fallback;
  }

  function openDemo(name){
    const config=sourceMap[name];
    if(!config)return;
    const source=document.querySelector(config.selector);
    if(!source){alert("На странице не найден отдельный T123-блок: "+config.selector);return}

    activePlaceholder=document.createComment("cv-demo-placeholder");
    source.parentNode.insertBefore(activePlaceholder,source);
    activeSource=source;
    source.hidden=false;
    source.removeAttribute("aria-hidden");
    mount.appendChild(source);
    title.textContent=getModalTitle(config);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");
    body.classList.add("cv-lock");
  }

  function closeDemo(){
    if(activeSource&&activePlaceholder&&activePlaceholder.parentNode){
      activePlaceholder.parentNode.insertBefore(activeSource,activePlaceholder);
      activePlaceholder.remove();
      activeSource.hidden=true;
      activeSource.setAttribute("aria-hidden","true");
    }

    activeSource=null;
    activePlaceholder=null;
    mount.innerHTML="";
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden","true");
    body.classList.remove("cv-lock");
  }

  cards.forEach(function(card){card.addEventListener("click",function(event){if(event.target.closest("a"))return;openDemo(card.getAttribute("data-demo"))})});
  document.addEventListener("click",function(event){if(event.target.closest("[data-cv-close]"))closeDemo()});
  document.addEventListener("keydown",function(event){if(event.key==="Escape"&&modal.classList.contains("is-open"))closeDemo()});
})();
