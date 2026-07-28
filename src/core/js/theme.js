(function(){
  const STORAGE_KEY="cv-theme";
  const root=document.documentElement;
  const button=document.querySelector("#cv-theme .cv-theme__button");

  function getSystemTheme(){
    return window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
  }

  function applyTheme(theme,save){
    const safe=theme==="dark"?"dark":"light";
    root.setAttribute("data-cv-theme",safe);
    if(button){
      const dark=safe==="dark";
      button.setAttribute("aria-label",dark?"Включить светлую тему":"Включить тёмную тему");
      button.setAttribute("title",dark?"Включить светлую тему":"Включить тёмную тему");
      button.setAttribute("aria-pressed",dark?"true":"false");
    }
    if(save){
      try{localStorage.setItem(STORAGE_KEY,safe)}catch(error){}
    }
  }

  let initial;
  try{initial=localStorage.getItem(STORAGE_KEY)}catch(error){}
  if(initial!=="dark"&&initial!=="light")initial=getSystemTheme();
  applyTheme(initial,false);

  if(button){
    button.addEventListener("click",function(){
      applyTheme(root.getAttribute("data-cv-theme")==="dark"?"light":"dark",true);
    });
  }

  if(window.matchMedia){
    const media=window.matchMedia("(prefers-color-scheme: dark)");
    const sync=function(event){
      let saved=null;
      try{saved=localStorage.getItem(STORAGE_KEY)}catch(error){}
      if(saved!=="dark"&&saved!=="light")applyTheme(event.matches?"dark":"light",false);
    };
    if(media.addEventListener)media.addEventListener("change",sync);
    else if(media.addListener)media.addListener(sync);
  }
})();
