(function () {
  const body = document.body;
  const modal = document.getElementById("cv-case-modal");
  const mount = document.getElementById("cv-case-modal-mount");
  const title = document.getElementById("cv-case-modal-title");

  const demoMap = {
    calc: {
      url: "./calculator/",
      titleKey: "modalCalcTitle",
      fallback: "Калькулятор фулфилмента"
    },
    quiz: {
      url: "./quiz/",
      titleKey: "modalQuizTitle",
      fallback: "Детский квиз"
    }
  };

  function getModalTitle(config) {
    const root = document.getElementById("cv-resume");
    const lang = root && root.dataset.language
      ? root.dataset.language
      : "ru";

    const dict = window.cvDictionary;

    if (
      dict &&
      dict[lang] &&
      dict[lang][config.titleKey]
    ) {
      return dict[lang][config.titleKey];
    }

    return config.fallback;
  }

  function openDemo(name) {
    const config = demoMap[name];

    if (!config || !modal || !mount) return;

    const iframe = document.createElement("iframe");

    iframe.src = config.url;
    iframe.title = config.fallback;
    iframe.loading = "eager";
    iframe.setAttribute("allow", "clipboard-write");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");

    iframe.style.width = "100%";
    iframe.style.height = "min(82vh, 920px)";
    iframe.style.display = "block";
    iframe.style.border = "0";
    iframe.style.background = "#ffffff";
    iframe.style.borderRadius = "16px";

    mount.innerHTML = "";
    mount.appendChild(iframe);

    if (title) {
      title.textContent = getModalTitle(config);
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("cv-lock");
  }

  function closeDemo() {
    if (!modal || !mount) return;

    mount.innerHTML = "";
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("cv-lock");
  }

  document.addEventListener("click", function (event) {
    const trigger = event.target.closest("[data-demo]");

    if (trigger) {
      event.preventDefault();
      openDemo(trigger.getAttribute("data-demo"));
      return;
    }

    if (event.target.closest("[data-cv-close]")) {
      event.preventDefault();
      closeDemo();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      modal &&
      modal.classList.contains("is-open")
    ) {
      closeDemo();
    }
  });


window.addEventListener("message", function(event){
  if(event.data==="close-demo"){
    closeDemo();
  }
});

})();
