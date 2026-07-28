(function(){
  const controls=document.getElementById("cv-controls");
  const resume=document.getElementById("cv-resume");
  const top=resume?resume.querySelector(".cv-top"):null;
  if(!controls||!resume||!top)return;

  const placeholder=document.createComment("cv-controls-desktop-position");
  controls.parentNode.insertBefore(placeholder,controls);

  function syncControlsPosition(){
    const mobile=window.matchMedia("(max-width:700px)").matches;

    if(mobile){
      if(controls.parentNode!==top)top.insertBefore(controls,top.firstChild);
    }else{
      if(placeholder.parentNode&&controls.parentNode!==placeholder.parentNode){
        placeholder.parentNode.insertBefore(controls,placeholder.nextSibling);
      }
    }
  }

  syncControlsPosition();

  const media=window.matchMedia("(max-width:700px)");
  if(media.addEventListener)media.addEventListener("change",syncControlsPosition);
  else if(media.addListener)media.addListener(syncControlsPosition);

  window.addEventListener("resize",syncControlsPosition);
})();
