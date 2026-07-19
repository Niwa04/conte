const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const demoContent = {
  read: ['assets/images/app-screen-2.jpg', 'Aperçu de la lecture illustrée', 'Tournez les pages et laissez les illustrations raconter leur propre histoire.'],
  listen: ['assets/images/app-screen-3.jpg', 'Aperçu de la narration audio', 'Laissez-vous guider par une voix chaleureuse et une ambiance musicale apaisante.'],
  explore: ['assets/images/app-screen-1.jpg', 'Aperçu du décor interactif', 'Observez les décors prendre vie et découvrez les détails cachés dans chaque scène.']
};
const demoScreen = document.querySelector('.demo-screen');
const demoImage = document.querySelector('#demo-image');
const demoCaption = document.querySelector('#demo-caption');
document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-demo]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
  });
  const content = demoContent[button.dataset.demo];
  demoScreen.classList.add('changing');
  setTimeout(() => {
    demoImage.src = content[0];
    demoImage.alt = content[1];
    demoCaption.textContent = content[2];
    demoScreen.classList.remove('changing');
  }, 220);
}));

const unityDemo = document.querySelector('.unity-demo');
const unityDemoFrame = unityDemo?.querySelector('.unity-demo-iframe');
const unityDemoViewport = unityDemo?.querySelector('.unity-demo-frame');
unityDemo?.querySelector('.unity-demo-launch')?.addEventListener('click', () => {
  if (!unityDemoFrame.src) unityDemoFrame.src = 'game.html?embed=1';
  unityDemo.classList.add('is-running');
  unityDemoFrame.focus();
});

const setUnityDemoFullscreen = enabled => {
  unityDemo?.classList.toggle('is-fullscreen', enabled);
  document.body.classList.toggle('demo-fullscreen-open', enabled);
};

unityDemo?.querySelector('.unity-demo-expand')?.addEventListener('click', async () => {
  if (!unityDemoFrame.src) unityDemoFrame.src = 'game.html?embed=1';
  unityDemo.classList.add('is-running');
  try {
    if (unityDemoViewport.requestFullscreen) await unityDemoViewport.requestFullscreen();
    else setUnityDemoFullscreen(true);
  } catch {
    setUnityDemoFullscreen(true);
  }
});

unityDemo?.querySelector('.unity-demo-close')?.addEventListener('click', async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  setUnityDemoFullscreen(false);
});

document.addEventListener('fullscreenchange', () => {
  setUnityDemoFullscreen(document.fullscreenElement === unityDemoViewport);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && unityDemo?.classList.contains('is-fullscreen') && !document.fullscreenElement) {
    setUnityDemoFullscreen(false);
  }
});

const dialog = document.querySelector('#lightbox');
const dialogImage = dialog?.querySelector('img');
document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
  dialogImage.src = button.dataset.lightbox;
  dialog.showModal();
}));
dialog?.querySelector('.lightbox-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

let deferredPrompt;
const toast = document.querySelector('#toast');
const showToast = message => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5200);
};

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;
  document.querySelectorAll('.install-button').forEach(button => button.classList.add('install-ready'));
});

document.querySelectorAll('.install-button').forEach(button => button.addEventListener('click', async event => {
  // Le lien du menu conserve une ancre de secours si JavaScript est désactivé,
  // mais lance directement l'installation lorsque la PWA est disponible.
  event.preventDefault();

  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) {
    showToast('L’application est déjà installée. Lancement du jeu…');
    setTimeout(() => { location.href = 'game.html?launch=installed'; }, 600);
    return;
  }

  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (choice.outcome === 'accepted') showToast('Installation acceptée. Préparation de l’application…');
    return;
  }

  const apple = /iphone|ipad|ipod/i.test(navigator.userAgent);
  showToast(apple
    ? 'Sur iPhone ou iPad : touchez Partager, puis « Ajouter à l’écran d’accueil ».'
    : 'L’installation sera proposée dès que le téléchargement hors ligne sera prêt. Vous pouvez aussi utiliser le menu Installer du navigateur.');
}));

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  showToast('Application installée ! Lancement du jeu…');
  setTimeout(() => { location.href = 'game.html?launch=installed'; }, 900);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));
}
