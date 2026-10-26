import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/+esm";

let SUPABASE_URL = "";
let SUPABASE_PUBLISHABLE_KEY = "";
let READER_CATALOG_URL = "";
let READER_CONTENT_CATALOG_URL = "";
let supabase = null;
let authSubscription = null;
let activeSupabaseEnvironment = "";
let RUNTIME_CATALOG_CACHE_KEY = "maison-des-contes-runtime-catalog-v3";

function configureSupabaseEnvironment(environmentId, url, publishableKey) {
  const normalizedEnvironmentId = String(environmentId || "").trim().toLowerCase();
  const normalizedUrl = String(url || "").trim().replace(/\/+$/, "");
  const normalizedKey = String(publishableKey || "").trim();
  if (!["dev", "prod"].includes(normalizedEnvironmentId)
    || !/^https?:\/\//i.test(normalizedUrl)
    || !normalizedKey) {
    console.error("Maison des Contes : environnement Supabase invalide.");
    return false;
  }

  if (activeSupabaseEnvironment === normalizedEnvironmentId
    && SUPABASE_URL === normalizedUrl
    && SUPABASE_PUBLISHABLE_KEY === normalizedKey) {
    return true;
  }

  authSubscription?.unsubscribe();
  authStateRequestSequence += 1;
  SUPABASE_URL = normalizedUrl;
  SUPABASE_PUBLISHABLE_KEY = normalizedKey;
  READER_CATALOG_URL = SUPABASE_URL + "/functions/v1/reader-catalog";
  READER_CONTENT_CATALOG_URL = SUPABASE_URL + "/functions/v1/reader-content-catalog";
  RUNTIME_CATALOG_CACHE_KEY = "maison-des-contes-runtime-catalog-v3-" + normalizedEnvironmentId;
  activeSupabaseEnvironment = normalizedEnvironmentId;

  supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "maison-des-contes-parent-auth-" + normalizedEnvironmentId
    }
  });

  cachedAccessState = null;
  cachedAccessStateUserId = "";
  cachedAccessStateAt = 0;
  accessStatePromise = null;
  accessStatePromiseUserId = "";
  publicCatalogCache = null;
  publicCatalogCacheAt = 0;
  publicCatalogPromise = null;
  latestState = { state: "loading" };
  authSubscription = supabase.auth.onAuthStateChange(handleSupabaseAuthStateChange).data.subscription;
  return true;
}

let receiverName = window.MaisonDesContesPendingReceiver || "";
let latestState = { state: "signed_out" };
let checkoutRetryScheduled = false;
let authStateRequestSequence = 0;
const ACCESS_STATE_CACHE_TTL_MS = 10000;
let cachedAccessState = null;
let cachedAccessStateUserId = "";
let cachedAccessStateAt = 0;
let accessStatePromise = null;
let accessStatePromiseUserId = "";
let publicCatalogCache = null;
let publicCatalogCacheAt = 0;
let publicCatalogPromise = null;
// Le catalogue reste local entre les relances. Une vérification distante
// explicite peut toujours être demandée par Unity pour récupérer les mises à jour.
const RUNTIME_CATALOG_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
let catalogFilter = "all";
let catalogNotice = "";
let authMode = "sign_in";
let authReturnFocus = null;
let authBusy = false;
let authUi = null;
// Tant que Stripe n'est pas configuré, le serveur local peut simuler un accès.
// Cette simulation est volontairement limitée à localhost/127.0.0.1 et ne
// touche jamais Supabase. Elle disparaît automatiquement sur un domaine réel.
const DEMO_PAYMENTS_ENABLED = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const DEMO_ACCESS_STORAGE_KEY = "maison-des-contes-demo-access-v1";
const DEMO_PAID_STORY_FIXTURE_ENABLED = DEMO_PAYMENTS_ENABLED &&
  new URLSearchParams(window.location.search).get("demo_paid_story") === "1";

function emptyDemoAccess() {
  return { ownedStoryIds: [], hasSubscription: false };
}

function readDemoAccess(userId) {
  if (!DEMO_PAYMENTS_ENABLED || !userId) return emptyDemoAccess();
  try {
    const allAccess = JSON.parse(window.localStorage.getItem(DEMO_ACCESS_STORAGE_KEY) || "{}");
    const access = allAccess?.[userId];
    return {
      ownedStoryIds: Array.isArray(access?.ownedStoryIds) ? access.ownedStoryIds.filter(Boolean) : [],
      hasSubscription: access?.hasSubscription === true
    };
  } catch (_error) {
    return emptyDemoAccess();
  }
}

function writeDemoAccess(userId, access) {
  if (!DEMO_PAYMENTS_ENABLED || !userId) return;
  try {
    const allAccess = JSON.parse(window.localStorage.getItem(DEMO_ACCESS_STORAGE_KEY) || "{}");
    allAccess[userId] = {
      ownedStoryIds: Array.from(new Set(access.ownedStoryIds || [])),
      hasSubscription: access.hasSubscription === true,
      updatedAt: new Date().toISOString()
    };
    window.localStorage.setItem(DEMO_ACCESS_STORAGE_KEY, JSON.stringify(allAccess));
  } catch (_error) {
    // Le paiement réel n'est jamais remplacé par un stockage local défaillant.
  }
}

function resetDemoAccess(userId) {
  if (!DEMO_PAYMENTS_ENABLED || !userId) return;
  try {
    const allAccess = JSON.parse(window.localStorage.getItem(DEMO_ACCESS_STORAGE_KEY) || "{}");
    delete allAccess[userId];
    window.localStorage.setItem(DEMO_ACCESS_STORAGE_KEY, JSON.stringify(allAccess));
  } catch (_error) {
    // Le stockage local reste facultatif pour le mode de démonstration.
  }
}

function applyDemoStoryFixture(catalog) {
  if (!DEMO_PAID_STORY_FIXTURE_ENABLED || !catalog) return catalog;
  const stories = Array.isArray(catalog.stories) ? catalog.stories : [];
  if (!stories.length || stories.some((story) => story?.access_model && story.access_model !== "free")) {
    return catalog;
  }

  // Le scénario utilise un conte existant afin que le bouton puisse aussi
  // ouvrir le BookSO correspondant dans Unity, sans créer de fausse donnée.
  const fixtureIndex = 0;
  return {
    ...catalog,
    stories: stories.map((story, index) => index === fixtureIndex
      ? {
        ...story,
        access_model: "subscription_or_purchase",
        has_full_access: false,
        owned: false,
        purchase_available: true,
        subscription_available: true
      }
      : story)
  };
}

function applyDemoAccess(catalog, userId) {
  if (!DEMO_PAYMENTS_ENABLED || !catalog || !userId) return catalog;
  const access = readDemoAccess(userId);
  const ownedStoryIds = new Set(access.ownedStoryIds);
  return {
    ...catalog,
    has_subscription: catalog.has_subscription === true || access.hasSubscription,
    stories: (Array.isArray(catalog.stories) ? catalog.stories : []).map((story) => {
      const demoOwned = Boolean(story?.id && ownedStoryIds.has(story.id));
      const model = story?.access_model;
      // Un abonnement actif débloque tous les contes payants, y compris
      // ceux dont le modèle commercial est one_time_purchase.
      const demoSubscription = access.hasSubscription && model !== "free";
      return {
        ...story,
        owned: story?.owned === true || demoOwned,
        has_full_access: story?.has_full_access === true || demoOwned || demoSubscription
      };
    })
  };
}

function displayName(user) {
  return user?.user_metadata?.full_name || user?.user_metadata?.name || "";
}

function sendToUnity(state) {
  latestState = state;
  renderReaderCatalog(state);
  const unity = window.unityInstance;
  if (!receiverName || !unity || typeof unity.SendMessage !== "function") return;
  unity.SendMessage(receiverName, "OnParentAuthState", JSON.stringify(state));
}

async function requestPublicWebpAsPng(requestId, imageUrl) {
  const sendResult = (result) => {
    const unity = window.unityInstance;
    if (receiverName && unity && typeof unity.SendMessage === "function") {
      unity.SendMessage(receiverName, "OnParentPublicImage", JSON.stringify({ requestId, ...result }));
    }
  };
  try {
    const image = new URL(imageUrl);
    if (image.origin !== new URL(SUPABASE_URL).origin
      || !image.pathname.startsWith("/storage/v1/object/public/story-images/")
      || !image.pathname.toLowerCase().endsWith(".webp")) {
      throw new Error("URL d’image publique invalide.");
    }
    const response = await fetch(image.href, { cache: "force-cache" });
    if (!response.ok) throw new Error("Image originale indisponible.");
    const bitmap = await createImageBitmap(await response.blob());
    try {
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Décodage de l’image indisponible.");
      context.drawImage(bitmap, 0, 0);
      sendResult({ pngBase64: canvas.toDataURL("image/png").split(",")[1] });
      canvas.width = canvas.height = 0;
    } finally {
      bitmap.close();
    }
  } catch (error) {
    sendResult({ error: error instanceof Error ? error.message : "Image illisible." });
  }
}

function getGameRedirectUrl() {
  return new URL("game.html", window.location.href).href;
}

function setAuthStatus(message = "", kind = "") {
  if (!authUi?.status) return;
  authUi.status.textContent = message;
  authUi.status.classList.toggle("is-error", kind === "error");
  authUi.status.classList.toggle("is-success", kind === "success");
}

function setAuthBusy(busy) {
  authBusy = Boolean(busy);
  if (!authUi) return;
  [
    authUi.googleButton,
    authUi.submitButton,
    authUi.closeButton,
    authUi.forgotButton,
    authUi.modeButton
  ].forEach((control) => {
    if (control) control.disabled = authBusy;
  });
  [authUi.email, authUi.password, authUi.confirmPassword].forEach((control) => {
    if (control) control.disabled = authBusy;
  });
  if (authUi.submitButton && !authBusy) {
    authUi.submitButton.textContent = authUi.submitLabel;
  }
}

function setAuthMode(mode, statusMessage = "", statusKind = "") {
  if (!authUi) return;
  authMode = mode;
  const signInMode = mode === "sign_in";
  const signUpMode = mode === "sign_up";
  const resetRequestMode = mode === "reset_request";
  const recoveryMode = mode === "reset_password";
  const needsPassword = signInMode || signUpMode || recoveryMode;
  const needsConfirmation = signUpMode || recoveryMode;

  authUi.title.textContent = signInMode
    ? "Connexion client"
    : signUpMode
      ? "Créer un compte"
      : resetRequestMode
        ? "Mot de passe oublié"
        : "Nouveau mot de passe";
  authUi.description.textContent = signInMode
    ? "Retrouvez vos contes et vos accès sur tous vos appareils."
    : signUpMode
      ? "Créez votre compte client pour retrouver vos contes et vos accès."
      : resetRequestMode
        ? "Nous vous enverrons un lien pour choisir un nouveau mot de passe."
        : "Choisissez un nouveau mot de passe pour votre compte client.";

  authUi.googleButton.hidden = !signInMode && !signUpMode;
  authUi.divider.hidden = !signInMode && !signUpMode;
  authUi.emailField.hidden = recoveryMode;
  authUi.email.required = !recoveryMode;
  authUi.passwordField.hidden = !needsPassword;
  authUi.password.required = needsPassword;
  authUi.password.autocomplete = signInMode ? "current-password" : "new-password";
  authUi.confirmPasswordField.hidden = !needsConfirmation;
  authUi.confirmPassword.required = needsConfirmation;
  authUi.forgotButton.hidden = !signInMode;
  authUi.modeButton.hidden = recoveryMode;
  authUi.modeButton.textContent = signInMode || signUpMode
    ? signInMode ? "Créer un compte" : "J’ai déjà un compte"
    : "Retour à la connexion";
  authUi.privacy.hidden = !signUpMode;
  authUi.submitLabel = signInMode
    ? "Se connecter"
    : signUpMode
      ? "Créer mon compte"
      : resetRequestMode
        ? "Envoyer le lien"
        : "Enregistrer le nouveau mot de passe";
  if (!authBusy) authUi.submitButton.textContent = authUi.submitLabel;
  authUi.modal.classList.toggle("is-recovery", recoveryMode);
  setAuthStatus(statusMessage, statusKind);
}

function focusAuthField() {
  if (!authUi) return;
  const target = authMode === "reset_password"
    ? authUi.password
    : authUi.email;
  if (target && !target.disabled) target.focus();
}

function openAuthModal(mode = "sign_in", statusMessage = "", statusKind = "") {
  if (!authUi) return;
  if (!authUi.modal.open) {
    authReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (typeof authUi.modal.showModal === "function") authUi.modal.showModal();
    else authUi.modal.setAttribute("open", "");
  }
  setAuthMode(mode, statusMessage, statusKind);
  window.setTimeout(focusAuthField, 0);
}

function closeAuthModal() {
  if (!authUi) return;
  if (authUi.modal.open && typeof authUi.modal.close === "function") authUi.modal.close();
  else authUi.modal.removeAttribute("open");
  setAuthBusy(false);
  const focusTarget = authReturnFocus;
  authReturnFocus = null;
  if (focusTarget && typeof focusTarget.focus === "function") {
    window.setTimeout(() => focusTarget.focus(), 0);
  }
}

function validateAuthForm() {
  if (!authUi) return "Le formulaire de connexion est indisponible.";
  if (authMode !== "reset_password") {
    authUi.email.value = authUi.email.value.trim().toLowerCase();
    if (!authUi.email.value || !authUi.email.validity.valid) {
      return "Saisissez une adresse e-mail valide.";
    }
  }
  if (authMode === "reset_request") return "";
  if (!authUi.password.value || authUi.password.value.length < 6) {
    return "Votre mot de passe doit contenir au moins 6 caractères.";
  }
  if ((authMode === "sign_up" || authMode === "reset_password") && authUi.password.value !== authUi.confirmPassword.value) {
    return "Les deux mots de passe ne correspondent pas.";
  }
  return "";
}

async function ensureReaderClient() {
  const { error } = await supabase.functions.invoke("ensure-reader-client", { body: {} });
  if (error) throw new Error("Profil client indisponible.");
}

async function signInWithGoogle() {
  const previousState = latestState;
  setAuthBusy(true);
  sendToUnity({ state: "loading" });
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: getGameRedirectUrl() }
  });
  if (error) {
    setAuthBusy(false);
    sendToUnity({ ...previousState, state: "error", error: error.message, visibleCollectionItemIds: [] });
    setAuthStatus(authErrorMessage(error.message), "error");
    setCatalogNotice(authErrorMessage(error.message));
  }
}

async function signInWithEmail() {
  const validationError = validateAuthForm();
  if (validationError) {
    setAuthStatus(validationError, "error");
    return;
  }
  const previousState = latestState;
  setAuthBusy(true);
  sendToUnity({ state: "loading" });
  const { error } = await supabase.auth.signInWithPassword({
    email: authUi.email.value,
    password: authUi.password.value
  });
  if (error) {
    setAuthBusy(false);
    sendToUnity({ ...previousState, state: "error", error: error.message, visibleCollectionItemIds: [] });
    setAuthStatus(authErrorMessage(error.message), "error");
    return;
  }
  closeAuthModal();
  await refresh(true);
}

async function signUpWithEmail() {
  const validationError = validateAuthForm();
  if (validationError) {
    setAuthStatus(validationError, "error");
    return;
  }
  setAuthBusy(true);
  const { data, error } = await supabase.auth.signUp({
    email: authUi.email.value,
    password: authUi.password.value,
    options: { emailRedirectTo: getGameRedirectUrl() }
  });
  if (error) {
    setAuthBusy(false);
    setAuthStatus(authErrorMessage(error.message), "error");
    return;
  }
  authUi.password.value = "";
  authUi.confirmPassword.value = "";
  if (data?.session) {
    closeAuthModal();
    await refresh(true);
    return;
  }
  setAuthBusy(false);
  setAuthMode("sign_in", "Compte créé. Vérifiez votre boîte e-mail pour confirmer votre adresse, puis connectez-vous.", "success");
}

async function requestPasswordReset() {
  const validationError = validateAuthForm();
  if (validationError) {
    setAuthStatus(validationError, "error");
    return;
  }
  setAuthBusy(true);
  const { error } = await supabase.auth.resetPasswordForEmail(authUi.email.value, {
    redirectTo: getGameRedirectUrl()
  });
  setAuthBusy(false);
  if (error) {
    setAuthStatus(authErrorMessage(error.message), "error");
    return;
  }
  setAuthStatus("Si un compte correspond à cette adresse, un lien de réinitialisation vient d’être envoyé.", "success");
}

async function updatePassword() {
  const validationError = validateAuthForm();
  if (validationError) {
    setAuthStatus(validationError, "error");
    return;
  }
  setAuthBusy(true);
  const { error } = await supabase.auth.updateUser({ password: authUi.password.value });
  if (error) {
    setAuthBusy(false);
    setAuthStatus(authErrorMessage(error.message), "error");
    return;
  }
  setCatalogNotice("Mot de passe mis à jour. Bienvenue dans votre espace client.");
  closeAuthModal();
  await refresh(true);
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  if (authBusy) return;
  if (authMode === "sign_in") return signInWithEmail();
  if (authMode === "sign_up") return signUpWithEmail();
  if (authMode === "reset_request") return requestPasswordReset();
  return updatePassword();
}

function initializeReaderAuthUi() {
  const modal = document.getElementById("readerAuthModal");
  const form = document.getElementById("readerAuthForm");
  const emailField = document.getElementById("readerAuthEmailField");
  const passwordField = document.getElementById("readerAuthPasswordField");
  const confirmPasswordField = document.getElementById("readerAuthConfirmPasswordField");
  const email = document.getElementById("readerAuthEmail");
  const password = document.getElementById("readerAuthPassword");
  const confirmPassword = document.getElementById("readerAuthConfirmPassword");
  const title = document.getElementById("readerAuthTitle");
  const description = document.getElementById("readerAuthDescription");
  const googleButton = document.getElementById("readerAuthGoogleButton");
  const divider = document.getElementById("readerAuthDivider");
  const submitButton = document.getElementById("readerAuthSubmitButton");
  const status = document.getElementById("readerAuthStatus");
  const closeButton = document.getElementById("readerAuthCloseButton");
  const forgotButton = document.getElementById("readerAuthForgotButton");
  const modeButton = document.getElementById("readerAuthModeButton");
  const privacy = document.getElementById("readerAuthPrivacy");
  if (!modal || !form || !email || !password || !confirmPassword || !title || !description || !googleButton || !divider || !submitButton || !status || !closeButton || !forgotButton || !modeButton || !privacy) return;

  authUi = {
    modal, form, emailField, passwordField, confirmPasswordField, email, password, confirmPassword,
    title, description, googleButton, divider, submitButton, status, closeButton, forgotButton,
    modeButton, privacy, submitLabel: "Se connecter"
  };
  setAuthMode("sign_in");
  form.addEventListener("submit", handleAuthSubmit);
  googleButton.addEventListener("click", signInWithGoogle);
  closeButton.addEventListener("click", closeAuthModal);
  forgotButton.addEventListener("click", () => {
    setAuthMode("reset_request");
    window.setTimeout(focusAuthField, 0);
  });
  modeButton.addEventListener("click", () => {
    setAuthMode(authMode === "sign_up" ? "sign_in" : authMode === "sign_in" ? "sign_up" : "sign_in");
    window.setTimeout(focusAuthField, 0);
  });
  modal.addEventListener("cancel", (event) => {
    if (authBusy) event.preventDefault();
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal && !authBusy) closeAuthModal();
  });
}

function initializeReaderCatalogUi() {
  const openButton = document.getElementById("catalogOpenButton");
  const panel = document.getElementById("readerCatalogPanel");
  const refreshButton = document.getElementById("catalogRefreshButton");
  const closeButton = document.getElementById("catalogCloseButton");
  const accountLabel = document.getElementById("readerAccountLabel");
  const accountButton = document.getElementById("readerAccountButton");
  const paymentMode = document.getElementById("readerPaymentMode");
  const paymentModeText = document.getElementById("readerPaymentModeText");
  const demoResetButton = document.getElementById("readerDemoResetButton");
  if (!openButton || !panel || !refreshButton || !closeButton || !accountLabel || !accountButton) return;

  if (paymentMode) paymentMode.hidden = !DEMO_PAYMENTS_ENABLED;
  if (paymentModeText && DEMO_PAID_STORY_FIXTURE_ENABLED) {
    paymentModeText.textContent = "Mode test local : le premier conte est temporairement payant. Aucun paiement réel ne sera effectué.";
  }
  if (demoResetButton) {
    demoResetButton.addEventListener("click", () => {
      resetDemoAccess(latestState?.userId);
      invalidateAccessStateCache();
      setCatalogNotice("Les accès test ont été réinitialisés dans ce navigateur.");
      refresh(true);
    });
  }

  openButton.hidden = !window.unityInstance;
  window.addEventListener("MaisonDesContesUnityReady", () => {
    openButton.hidden = false;
  }, { once: true });
  openButton.addEventListener("click", () => {
    panel.hidden = false;
    closeButton.focus();
  });
  refreshButton.addEventListener("click", () => refresh(true));
  accountButton.addEventListener("click", () => {
    if (latestState?.state === "signed_in") signOut();
    else if (latestState?.state === "error") refresh(true);
    else signIn();
  });
  document.querySelectorAll("[data-catalog-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      catalogFilter = button.dataset.catalogFilter || "all";
      renderReaderCatalog(latestState);
    });
  });
  closeButton.addEventListener("click", () => {
    panel.hidden = true;
    openButton.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      panel.hidden = true;
      openButton.focus();
    }
  });
  panel.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || panel.hidden) return;
    const focusable = Array.from(panel.querySelectorAll(
      "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )).filter((element) => element instanceof HTMLElement && element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  panel.addEventListener("click", (event) => {
    if (event.target === panel) {
      panel.hidden = true;
      openButton.focus();
    }
  });
  renderReaderCatalog(latestState);
}

function catalogAccessLabel(story, state) {
  if (story.owned) return "Conte acheté";
  if (story.has_full_access && state?.hasSubscription) return "Inclus dans l'abonnement";
  if (story.access_model === "free") return "Lecture libre";
  return state?.state === "signed_in" ? "Aperçu · 2 pages" : "Connexion · 2 pages";
}

function isAccessibleStory(story) {
  return story?.has_full_access === true;
}

function renderReaderCatalog(state) {
  const grid = document.getElementById("readerCatalogGrid");
  const summary = document.getElementById("readerCatalogSummary");
  const status = document.getElementById("readerCatalogStatus");
  const refreshButton = document.getElementById("catalogRefreshButton");
  const accountLabel = document.getElementById("readerAccountLabel");
  const accountButton = document.getElementById("readerAccountButton");
  const paymentMode = document.getElementById("readerPaymentMode");
  const paymentModeText = document.getElementById("readerPaymentModeText");
  const demoResetButton = document.getElementById("readerDemoResetButton");
  if (!grid || !summary || !status) return;

  if (paymentMode) paymentMode.hidden = !DEMO_PAYMENTS_ENABLED;
  if (paymentModeText && DEMO_PAID_STORY_FIXTURE_ENABLED) {
    paymentModeText.textContent = "Mode test local : le premier conte est temporairement payant. Aucun paiement réel ne sera effectué.";
  }

  const panel = document.getElementById("readerCatalogPanel");
  if (panel) panel.setAttribute("aria-busy", String(state?.state === "loading"));

  const allStories = Array.isArray(state?.catalogStories) ? state.catalogStories : [];
  const stories = catalogFilter === "owned"
    ? allStories.filter(isAccessibleStory)
    : catalogFilter === "available"
      ? allStories.filter((story) => !isAccessibleStory(story))
      : allStories;
  const authenticated = state?.state === "signed_in";
  if (demoResetButton) {
    demoResetButton.hidden = !DEMO_PAYMENTS_ENABLED || !authenticated;
    demoResetButton.disabled = state?.state === "loading";
  }
  if (refreshButton) refreshButton.disabled = state?.state === "loading";
  if (accountLabel) {
    if (authenticated) {
      const identity = state.displayName || state.email || "Parent";
      accountLabel.textContent = `Bonjour ${identity}`;
    } else if (state?.state === "loading") {
      accountLabel.textContent = "Vérification…";
    } else {
      accountLabel.textContent = "Visiteur";
    }
  }
  if (accountButton) {
    accountButton.disabled = state?.state === "loading";
    accountButton.textContent = state?.state === "loading"
      ? "Chargement…"
      : authenticated
        ? "Se déconnecter"
        : state?.state === "error" ? "Réessayer" : "Se connecter";
  }
  document.querySelectorAll("[data-catalog-filter]").forEach((button) => {
    const active = (button.dataset.catalogFilter || "all") === catalogFilter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const accessibleCount = allStories.filter(isAccessibleStory).length;
  const purchasedCount = allStories.filter((story) => story?.owned).length;
  const previewCount = allStories.filter((story) => story?.access_model !== "free" && !story?.has_full_access).length;
  summary.textContent = authenticated
    ? `${allStories.length} conte${allStories.length > 1 ? "s" : ""} publié${allStories.length > 1 ? "s" : ""} · ${accessibleCount} accessible${accessibleCount > 1 ? "s" : ""} · ${purchasedCount} acheté${purchasedCount > 1 ? "s" : ""} · ${previewCount} en aperçu`
    : "Découvrez les contes publiés ; connectez-vous pour retrouver vos accès.";
  const catalogError = state?.catalogError || state?.accessError;
  status.classList.toggle("is-error", Boolean(catalogError));
  status.textContent = catalogError
    ? "Le catalogue est momentanément indisponible."
    : catalogNotice
      ? catalogNotice
    : stories.length
      ? catalogFilter === "all"
        ? `${stories.length} conte${stories.length > 1 ? "s" : ""} publié${stories.length > 1 ? "s" : ""}`
        : `${stories.length} conte${stories.length > 1 ? "s" : ""} affiché${stories.length > 1 ? "s" : ""} sur ${allStories.length}`
      : "Aucun conte publié pour le moment.";

  grid.replaceChildren();
  if (!stories.length && catalogFilter !== "all" && !catalogError) {
    const empty = document.createElement("p");
    empty.className = "reader-catalog-empty";
    empty.textContent = catalogFilter === "owned"
      ? (authenticated ? "Aucun conte accessible pour le moment." : "Aucun conte gratuit accessible pour le moment.")
      : (authenticated
        ? "Tous les contes publiés sont déjà dans vos contes."
        : "Connectez-vous pour voir les contes réservés à votre compte.");
    grid.appendChild(empty);
    return;
  }
  for (const story of stories) {
    const item = document.createElement("article");
    item.className = "reader-catalog-item";

    const cover = document.createElement("img");
    cover.className = "reader-catalog-cover";
    cover.alt = `Couverture de ${story.title || "ce conte"}`;
    const placeholderCover = "assets/images/hero-book.png";
    if (story.cover_url) {
      cover.src = story.cover_url;
      cover.addEventListener("error", () => {
        if (cover.dataset.fallbackApplied) return;
        cover.dataset.fallbackApplied = "true";
        cover.src = placeholderCover;
      }, { once: true });
    } else {
      cover.src = placeholderCover;
    }
    item.appendChild(cover);

    const body = document.createElement("div");
    body.className = "reader-catalog-item-body";
    const title = document.createElement("h2");
    title.textContent = story.title || "Conte sans titre";
    body.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "reader-catalog-meta";
    const details = [story.age_range, story.reading_minutes ? `${story.reading_minutes} min` : ""]
      .filter(Boolean);
    if (story.collection_count) details.push(`${story.collection_count} objet${story.collection_count > 1 ? "s" : ""}`);
    meta.textContent = details.join(" · ");
    body.appendChild(meta);

    const badge = document.createElement("span");
    badge.className = "reader-catalog-badge";
    badge.textContent = catalogAccessLabel(story, state);
    body.appendChild(badge);

    if (story.id) {
      const openAction = document.createElement("button");
      openAction.type = "button";
      openAction.className = "reader-catalog-action reader-catalog-open-action";
      openAction.textContent = story.access_model !== "free" && !story.has_full_access
        ? "Voir l’aperçu"
        : "Lire le conte";
      openAction.addEventListener("click", () => openCatalogStory(story.id));
      body.appendChild(openAction);
    }

    if (story.access_model !== "free" && !story.has_full_access) {
      if (!authenticated) {
        const action = document.createElement("button");
        action.type = "button";
        action.className = "reader-catalog-action";
        action.textContent = "Se connecter";
        action.addEventListener("click", signIn);
        body.appendChild(action);
      } else {
        const supportsSubscription = ["subscription", "subscription_or_purchase"].includes(story.access_model);
        const supportsPurchase = ["one_time_purchase", "subscription_or_purchase"].includes(story.access_model);
        const subscriptionAvailable = story.subscription_available === true ||
          (DEMO_PAYMENTS_ENABLED && supportsSubscription);
        const purchaseAvailable = story.purchase_available === true ||
          (DEMO_PAYMENTS_ENABLED && supportsPurchase);

        if (supportsSubscription && subscriptionAvailable) {
          const action = document.createElement("button");
          action.type = "button";
          action.className = "reader-catalog-action";
          action.textContent = DEMO_PAYMENTS_ENABLED ? "Simuler l’abonnement" : "S'abonner";
          action.addEventListener("click", startSubscription);
          body.appendChild(action);
        }

        if (supportsPurchase && purchaseAvailable) {
          const action = document.createElement("button");
          action.type = "button";
          action.className = "reader-catalog-action";
          action.textContent = DEMO_PAYMENTS_ENABLED ? "Simuler l’achat" : "Acheter ce conte";
          action.addEventListener("click", () => startPurchase(story.id));
          body.appendChild(action);
        }

        const missingPurchase = supportsPurchase && !purchaseAvailable;
        const missingSubscription = supportsSubscription && !subscriptionAvailable;
        if (missingPurchase && !subscriptionAvailable) {
          const unavailable = document.createElement("span");
          unavailable.className = "reader-catalog-unavailable";
          unavailable.textContent = supportsSubscription ? "Offres bientôt disponibles" : "Achat bientôt disponible";
          body.appendChild(unavailable);
        } else if (missingPurchase && !supportsSubscription) {
          const unavailable = document.createElement("span");
          unavailable.className = "reader-catalog-unavailable";
          unavailable.textContent = "Achat bientôt disponible";
          body.appendChild(unavailable);
        } else if (missingSubscription && !purchaseAvailable) {
          const unavailable = document.createElement("span");
          unavailable.className = "reader-catalog-unavailable";
          unavailable.textContent = "Abonnement bientôt disponible";
          body.appendChild(unavailable);
        }
      }
    }

    item.appendChild(body);
    grid.appendChild(item);
  }
}

function sendCheckoutToUnity(state) {
  if (state?.state === "loading") setCatalogNotice("Ouverture du paiement…");
  if (state?.state === "success") setCatalogNotice("Paiement confirmé. Vérification de vos droits…");
  if (state?.state === "cancelled") setCatalogNotice("Paiement annulé. Aucun débit n’a été effectué.");
  if (state?.state === "error") setCatalogNotice(checkoutErrorMessage(state.error));
  const unity = window.unityInstance;
  if (!receiverName || !unity || typeof unity.SendMessage !== "function") return;
  unity.SendMessage(receiverName, "OnParentCheckoutState", JSON.stringify(state));
}

function setCatalogNotice(message) {
  catalogNotice = message || "";
  renderReaderCatalog(latestState);
  if (!catalogNotice) return;
  const notice = catalogNotice;
  window.setTimeout(() => {
    if (catalogNotice !== notice) return;
    catalogNotice = "";
    renderReaderCatalog(latestState);
  }, 8000);
}

function showCatalogMessage(message) {
  setCatalogNotice(message);
}

function openCatalogStory(storyId) {
  const unity = window.unityInstance;
  const panel = document.getElementById("readerCatalogPanel");
  const openButton = document.getElementById("catalogOpenButton");
  const status = document.getElementById("readerCatalogStatus");
  if (!storyId || !receiverName || !unity || typeof unity.SendMessage !== "function") {
    if (status) {
      status.classList.add("is-error");
      status.textContent = "Le lecteur n’est pas encore prêt. Réessayez dans un instant.";
    }
    return;
  }

  try {
    unity.SendMessage(receiverName, "OpenCatalogStory", storyId);
    if (panel) panel.hidden = true;
    if (openButton) openButton.focus();
  } catch (_error) {
    if (status) {
      status.classList.add("is-error");
      status.textContent = "Ce conte ne peut pas encore être ouvert dans cette version.";
    }
  }
}

function removeQueryParameters(parameters) {
  try {
    const cleanUrl = new URL(window.location.href);
    parameters.forEach((parameter) => cleanUrl.searchParams.delete(parameter));
    window.history.replaceState({}, document.title, cleanUrl.href);
  } catch (_error) {
    // Le nettoyage est facultatif ; l'état d'authentification reste prioritaire.
  }
}

function checkoutErrorMessage(error) {
  const messages = {
    not_configured: "Le paiement n'est pas encore configuré. Réessayez plus tard.",
    invalid_json: "La demande de paiement est invalide. Réessayez.",
    story_id_required: "Ce conte ne peut pas être acheté pour le moment.",
    return_url_required: "Le retour vers l'application est manquant.",
    return_url_invalid: "Le retour vers l'application est invalide.",
    payments_not_configured: "Le paiement n'est pas encore configuré. Réessayez plus tard.",
    product_not_available: "Ce conte ou cet abonnement n'est pas encore disponible.",
    story_is_free: "Ce conte est déjà accessible gratuitement.",
    story_not_found: "Ce conte n'est plus disponible.",
    checkout_creation_failed: "Le paiement n'a pas pu être ouvert. Réessayez dans un instant.",
    reader_profile_unavailable: "Votre compte parent est momentanément indisponible.",
    unauthorized: "Votre session a expiré. Reconnectez-vous.",
    return_url_not_allowed: "Le retour vers l'application n'est pas autorisé.",
  };
  return messages[error] || error || "Le paiement est momentanément indisponible.";
}

function authErrorMessage(error) {
  const normalized = String(error || "").toLowerCase();
  if (normalized.includes("access_denied") || normalized.includes("cancel")) {
    return "Connexion annulée. Vous pouvez réessayer avec Google ou votre adresse e-mail.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Cette adresse e-mail n’est pas encore confirmée. Consultez votre boîte de réception.";
  }
  if (normalized.includes("invalid login credentials") || normalized.includes("invalid credentials") || normalized.includes("user not found")) {
    return "Adresse e-mail ou mot de passe incorrect.";
  }
  if (normalized.includes("already registered") || normalized.includes("user already registered")) {
    return "Un compte existe déjà avec cette adresse. Connectez-vous ou demandez un nouveau mot de passe.";
  }
  if (normalized.includes("password should be at least") || normalized.includes("password must be at least")) {
    return "Le mot de passe choisi est trop court.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many requests")) {
    return "Trop de tentatives. Attendez quelques instants avant de réessayer.";
  }
  if (normalized.includes("expired") || normalized.includes("invalid token") || normalized.includes("otp_expired")) {
    return "Ce lien n’est plus valide. Demandez un nouveau lien de réinitialisation.";
  }
  if (normalized.includes("profil client")) {
    return "Votre compte client est momentanément indisponible. Réessayez plus tard.";
  }
  return "Connexion impossible pour le moment. Réessayez dans un instant.";
}

function scheduleCheckoutAccessRefresh() {
  const checkout = new URLSearchParams(window.location.search).get("checkout");
  if (!["success", "cancelled"].includes(checkout) || checkoutRetryScheduled) return;

  checkoutRetryScheduled = true;
  if (checkout === "success") {
    sendCheckoutToUnity({
      state: "success",
      message: "Paiement confirmé. Nous vérifions vos accès…"
    });
    [1000, 3000, 6000].forEach((delay) => {
      window.setTimeout(() => {
        refresh(true);
      }, delay);
    });
  } else {
    sendCheckoutToUnity({
      state: "cancelled",
      message: "Paiement annulé. Aucun débit n’a été effectué."
    });
  }

  // Le message ne doit pas réapparaître après un simple rechargement de la page.
  try {
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("checkout");
    window.history.replaceState({}, document.title, cleanUrl.href);
  } catch (_error) {
    // L'actualisation des droits reste prioritaire si l'historique est indisponible.
  }
}

async function fetchReaderCatalog(accessToken = "") {
  const requestHeaders = { apikey: SUPABASE_PUBLISHABLE_KEY };
  if (accessToken) requestHeaders.Authorization = `Bearer ${accessToken}`;
  const response = await fetch(READER_CATALOG_URL, {
    headers: requestHeaders,
    cache: "no-store"
  });
  const catalog = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(catalog.error || "Droits de lecture indisponibles.");
  return catalog;
}

function parseRuntimeCatalogPayload(value) {
  try {
    const payload = typeof value === "string" ? JSON.parse(value) : value;
    if (!payload || payload.catalog_loaded !== true || !Array.isArray(payload.stories)) return null;
    return payload;
  } catch (_error) {
    return null;
  }
}

function runtimeCatalogCacheKey(session = null) {
  return String(
    session?.user?.id
      || window.MaisonDesContesRuntimeCatalogUserId
      || latestState?.userId
      || "anonymous"
  );
}

function readRuntimeCatalogCacheStore() {
  try {
    const store = JSON.parse(window.localStorage.getItem(RUNTIME_CATALOG_CACHE_KEY) || "{}");
    if (!store || store.version !== 2 || !store.entries || typeof store.entries !== "object") {
      return { version: 2, entries: {} };
    }
    return store;
  } catch (_error) {
    return { version: 2, entries: {} };
  }
}

function getRuntimeCatalogCacheEntry(cacheKey) {
  if (!cacheKey) return null;
  const store = readRuntimeCatalogCacheStore();
  const entry = store.entries?.[cacheKey];
  const payload = parseRuntimeCatalogPayload(entry?.payload);
  if (!payload) return null;
  return {
    savedAt: Number(entry.savedAt) || 0,
    payload
  };
}

function sendRuntimeCatalogToUnity(methodName, payload) {
  const unity = window.unityInstance;
  if (!receiverName || !unity || typeof unity.SendMessage !== "function") return false;
  try {
    unity.SendMessage(receiverName, methodName, JSON.stringify(payload));
    return true;
  } catch (_error) {
    // Unity peut être en train de fermer le lecteur.
    return false;
  }
}

async function loadRuntimeCatalogCache() {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data?.session || null;
  } catch (_error) {
    // Le cache anonyme reste disponible même si Supabase est momentanément hors ligne.
  }

  const cacheKey = runtimeCatalogCacheKey(session);
  if (session?.user?.id) window.MaisonDesContesRuntimeCatalogUserId = cacheKey;
  const entry = getRuntimeCatalogCacheEntry(cacheKey);
  if (!entry) return;

  if (!sendRuntimeCatalogToUnity("OnCachedRuntimeCatalogJson", entry.payload)) {
    window.MaisonDesContesPendingRuntimeCatalogCacheLoad = true;
  }
}

function saveRuntimeCatalogCache(value) {
  const payload = parseRuntimeCatalogPayload(value);
  if (!payload) return;

  try {
    const store = readRuntimeCatalogCacheStore();
    const cacheKey = runtimeCatalogCacheKey();
    store.entries[cacheKey] = {
      savedAt: Date.now(),
      payload
    };
    window.localStorage.setItem(RUNTIME_CATALOG_CACHE_KEY, JSON.stringify(store));
  } catch (_error) {
    // Le jeu reste utilisable en ligne si le stockage local est indisponible.
  }
}

// Le jeu WebGL demande le catalogue ou un conte par le bridge JavaScript afin de
// garder le jeton Supabase dans le navigateur. Le C# ne reçoit que la réponse
// JSON calculée par l'Edge Function, jamais les secrets ni le jeton.
async function requestRuntimeCatalog(minimumStatus = "draft", force = false, includePages = false, storyId = "") {
  const unity = window.unityInstance;
  const status = String(minimumStatus || "draft");
  const requestedStoryId = String(storyId || "").trim();
  const isLightCatalog = !includePages && !requestedStoryId;
  if (!receiverName || !unity || typeof unity.SendMessage !== "function") {
    window.MaisonDesContesPendingRuntimeCatalog = status;
    window.MaisonDesContesPendingRuntimeCatalogForce = force === true;
    window.MaisonDesContesPendingRuntimeCatalogIncludePages = includePages === true;
    window.MaisonDesContesPendingRuntimeCatalogStoryId = requestedStoryId;
    return;
  }

  let cachedEntry = null;
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const session = sessionData?.session || null;
    window.MaisonDesContesRuntimeCatalogUserId = runtimeCatalogCacheKey(session);
    if (isLightCatalog) cachedEntry = getRuntimeCatalogCacheEntry(window.MaisonDesContesRuntimeCatalogUserId);

    if (!force && cachedEntry && cachedEntry.savedAt > 0
      && Date.now() - cachedEntry.savedAt <= RUNTIME_CATALOG_CACHE_TTL_MS) {
      sendRuntimeCatalogToUnity("OnRuntimeCatalogJson", cachedEntry.payload);
      return;
    }

    const requestHeaders = {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: "application/json"
    };
    if (sessionData?.session?.access_token) {
      requestHeaders.Authorization = `Bearer ${sessionData.session.access_token}`;
    }

    const response = await fetch(
      `${READER_CONTENT_CATALOG_URL}?minimum_status=${encodeURIComponent(status)}&include_pages=${includePages ? "true" : "false"}${requestedStoryId ? `&story_id=${encodeURIComponent(requestedStoryId)}` : ""}`,
      { headers: requestHeaders, cache: "no-store" }
    );
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Catalogue de contenu indisponible.");
    if (isLightCatalog) saveRuntimeCatalogCache(payload);
    sendRuntimeCatalogToUnity("OnRuntimeCatalogJson", payload);
  } catch (error) {
    // En cas de coupure, conserver le dernier catalogue utilisable hors ligne.
    if (cachedEntry?.payload && sendRuntimeCatalogToUnity("OnRuntimeCatalogJson", cachedEntry.payload)) {
      return;
    }
    try {
      unity.SendMessage(receiverName, "OnRuntimeCatalogJson", JSON.stringify({
        version: 1,
        authenticated: false,
        catalog_loaded: false,
        access_error: error?.message || "Catalogue de contenu indisponible.",
        stories: []
      }));
    } catch (_sendError) {
      // Unity peut être en train de fermer le lecteur.
    }
  }
}

async function fetchPublicCatalog(force = false) {
  const now = Date.now();
  if (!force && publicCatalogCache && now - publicCatalogCacheAt < ACCESS_STATE_CACHE_TTL_MS)
    return publicCatalogCache;
  if (publicCatalogPromise) return publicCatalogPromise;

  publicCatalogPromise = fetchReaderCatalog()
    .then((catalog) => {
      publicCatalogCache = catalog;
      publicCatalogCacheAt = Date.now();
      return catalog;
    })
    .finally(() => {
      publicCatalogPromise = null;
    });
  return publicCatalogPromise;
}

async function loadStateFromUser(user, accessToken) {
  try {
    await ensureReaderClient();
    const catalog = applyDemoAccess(applyDemoStoryFixture(await fetchReaderCatalog(accessToken)), user.id);
    const stories = Array.isArray(catalog.stories) ? catalog.stories : [];
    const profile = catalog.profile || null;

    return {
      state: "signed_in",
      displayName: displayName(user),
      email: user.email || "",
      userId: user.id,
      hasSubscription: Boolean(catalog.has_subscription),
      subscriptionStatus: catalog.subscription_status || "",
      currentPeriodEnd: catalog.current_period_end || "",
      accessType: profile?.access_type || "free",
      ownedStoryIds: Array.isArray(catalog.owned_story_ids)
        ? catalog.owned_story_ids.filter(Boolean)
        : stories.filter((story) => story?.owned && story.id).map((story) => story.id),
      visibleCollectionItemIds: Array.isArray(catalog.visible_collection_item_ids)
        ? catalog.visible_collection_item_ids.filter(Boolean)
        : [],
      catalogStories: stories,
      catalogLoaded: catalog.catalog_loaded === true,
      accessError: catalog.access_error || "",
      profile
    };
  } catch (error) {
    // L'authentification reste valide, mais l'application doit refuser l'accès
    // complet tant que les droits n'ont pas pu être vérifiés.
    return {
      state: "signed_in",
      displayName: displayName(user),
      email: user.email || "",
      userId: user.id,
      hasSubscription: false,
      ownedStoryIds: [],
      visibleCollectionItemIds: [],
      catalogStories: [],
      catalogLoaded: false,
      catalogError: error?.message || "Catalogue indisponible.",
      accessError: error?.message || "Droits de lecture indisponibles.",
      profile: null
    };
  }
}

function invalidateAccessStateCache() {
  cachedAccessState = null;
  cachedAccessStateUserId = "";
  cachedAccessStateAt = 0;
}

async function stateFromUser(user, accessToken = "", force = false) {
  if (!user) {
    invalidateAccessStateCache();
    return { state: "signed_out", visibleCollectionItemIds: [] };
  }

  const now = Date.now();
  if (
    !force &&
    cachedAccessState &&
    cachedAccessStateUserId === user.id &&
    now - cachedAccessStateAt < ACCESS_STATE_CACHE_TTL_MS
  ) {
    return cachedAccessState;
  }

  if (accessStatePromise && accessStatePromiseUserId === user.id) {
    return accessStatePromise;
  }

  accessStatePromiseUserId = user.id;
  accessStatePromise = loadStateFromUser(user, accessToken)
    .then((state) => {
      cachedAccessState = state;
      cachedAccessStateUserId = user.id;
      cachedAccessStateAt = Date.now();
      return state;
    })
    .finally(() => {
      accessStatePromise = null;
      accessStatePromiseUserId = "";
    });

  return accessStatePromise;
}

async function refresh(force = false) {
  if (!supabase) return;
  const requestSequence = ++authStateRequestSequence;
  const previousState = latestState;
  sendToUnity({ state: "loading" });

  const oauthError = new URLSearchParams(window.location.search).get("error_description");
  if (oauthError) {
    if (requestSequence !== authStateRequestSequence) return;
    const message = authErrorMessage(oauthError);
    try {
      const catalog = await fetchPublicCatalog(true);
      if (requestSequence !== authStateRequestSequence) return;
      const catalogForDisplay = applyDemoStoryFixture(catalog);
      sendToUnity({
        state: "error",
        error: oauthError,
        catalogStories: catalogForDisplay.stories || [],
        visibleCollectionItemIds: [],
        catalogLoaded: true
      });
      openAuthModal("sign_in", message, "error");
      setCatalogNotice(message);
    } catch (_error) {
      if (requestSequence !== authStateRequestSequence) return;
      sendToUnity({ state: "error", error: oauthError, catalogStories: [], visibleCollectionItemIds: [], catalogLoaded: false, catalogError: "Catalogue indisponible." });
    }
    removeQueryParameters(["error", "error_code", "error_description", "error_reason"]);
    return;
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (requestSequence !== authStateRequestSequence) return;
  if (sessionError) {
    sendToUnity({ ...previousState, state: "error", error: sessionError.message, visibleCollectionItemIds: [] });
    return;
  }

  if (!sessionData.session) {
    if (requestSequence !== authStateRequestSequence) return;
    try {
      const catalog = await fetchPublicCatalog(force);
      if (requestSequence !== authStateRequestSequence) return;
      const catalogForDisplay = applyDemoStoryFixture(catalog);
      sendToUnity({
        state: "signed_out",
        catalogStories: catalogForDisplay.stories || [],
        ownedStoryIds: [],
        visibleCollectionItemIds: Array.isArray(catalog.visible_collection_item_ids)
          ? catalog.visible_collection_item_ids.filter(Boolean)
          : [],
        catalogLoaded: catalog.catalog_loaded === true,
        accessError: catalog.access_error || "",
        profile: null
      });
    } catch (error) {
      if (requestSequence !== authStateRequestSequence) return;
      sendToUnity({ state: "signed_out", catalogStories: [], visibleCollectionItemIds: [], catalogLoaded: false, catalogError: error?.message || "Catalogue indisponible." });
    }
    return;
  }

  const { data, error } = await supabase.auth.getUser();
  if (requestSequence !== authStateRequestSequence) return;
  if (error) {
    sendToUnity({ ...previousState, state: "error", error: error.message, visibleCollectionItemIds: [] });
    return;
  }
  const state = await stateFromUser(data.user, sessionData.session.access_token, force);
  if (requestSequence !== authStateRequestSequence) return;
  sendToUnity(state);
  scheduleCheckoutAccessRefresh();
}

function signIn() {
  openAuthModal("sign_in");
}

async function signOut() {
  sendToUnity({ state: "loading" });
  const { error } = await supabase.auth.signOut();
  if (error) {
    sendToUnity({ state: "error", error: error.message });
    return;
  }
  invalidateAccessStateCache();
  await refresh(true);
}

async function reportStoryProgress(storyId, lastPageNumber, completed = false) {
  if (!storyId) return;
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) return;

  const { error } = await supabase.functions.invoke("reader-progress", {
    body: {
      story_id: String(storyId),
      last_page_number: Math.max(0, Number(lastPageNumber) || 0),
      completed: completed === true
    }
  });
  if (error) {
    console.warn("Progression du conte non enregistrée.", error);
    return;
  }
  await refresh(true);
}

function sendPageViewResult(requestId, success) {
  const unity = window.unityInstance;
  if (!requestId || !receiverName || !unity || typeof unity.SendMessage !== "function") return;
  try {
    unity.SendMessage(receiverName, "OnParentPageViewResult", JSON.stringify({
      requestId,
      success: success === true
    }));
  } catch (_error) {
    // Unity peut etre en train de fermer le lecteur ; la file locale gerera le prochain essai.
  }
}

async function reportPageView(storyId, pageNumber, durationSeconds, viewedAt, requestId) {
  if (!storyId || !requestId) {
    sendPageViewResult(requestId, false);
    return;
  }

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      sendPageViewResult(requestId, false);
      return;
    }

    const { error } = await supabase.functions.invoke("record-reader-activity", {
      body: {
        story_id: String(storyId),
        action: "page_view",
        page_number: Math.max(1, Number(pageNumber) || 1),
        duration_seconds: Math.max(1, Number(durationSeconds) || 1),
        viewed_at: viewedAt || new Date().toISOString()
      }
    });
    if (error) console.warn("Vue de page non enregistrée.", error);
    sendPageViewResult(requestId, !error);
  } catch (error) {
    console.warn("Synchronisation de la vue de page impossible.", error);
    sendPageViewResult(requestId, false);
  }
}

async function startCheckout(kind, storyId = null) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session) {
    sendCheckoutToUnity({ state: "error", error: "Connectez-vous avant de continuer." });
    return;
  }

  sendCheckoutToUnity({ state: "loading" });

  if (DEMO_PAYMENTS_ENABLED) {
    try {
      const access = readDemoAccess(sessionData.session.user.id);
      if (kind === "story_purchase") {
        const catalog = applyDemoStoryFixture(await fetchReaderCatalog(sessionData.session.access_token));
        const story = (catalog.stories || []).find((candidate) => candidate?.id === storyId);
        if (!story) {
          sendCheckoutToUnity({ state: "error", error: "story_not_found" });
          return;
        }
        if (story.access_model === "free") {
          sendCheckoutToUnity({ state: "error", error: "story_is_free" });
          return;
        }
        access.ownedStoryIds.push(story.id);
        writeDemoAccess(sessionData.session.user.id, access);
      } else {
        access.hasSubscription = true;
        writeDemoAccess(sessionData.session.user.id, access);
      }

      const refreshedState = await stateFromUser(
        sessionData.session.user,
        sessionData.session.access_token,
        true
      );
      sendToUnity(refreshedState);
      sendCheckoutToUnity({
        state: "success",
        message: kind === "subscription"
          ? "Abonnement simulé. Accès complet activé dans ce navigateur."
          : "Achat simulé. Accès complet activé dans ce navigateur."
      });
    } catch (error) {
      sendCheckoutToUnity({ state: "error", error: error?.message || "Simulation du paiement impossible." });
    }
    return;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/reader-checkout`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${sessionData.session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind,
        story_id: storyId,
        return_url: new URL("game.html", window.location.href).href
      })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.url) {
      sendCheckoutToUnity({ state: "error", error: checkoutErrorMessage(body.error) });
      return;
    }
    window.location.assign(body.url);
  } catch (error) {
    sendCheckoutToUnity({ state: "error", error: error?.message || "Impossible de contacter le service de paiement." });
  }
}

function startPurchase(storyId) {
  return startCheckout("story_purchase", storyId);
}

function startSubscription() {
  return startCheckout("subscription");
}

function handleSupabaseAuthStateChange(event, session) {
  if (event === "PASSWORD_RECOVERY") {
    openAuthModal("reset_password", "Choisissez votre nouveau mot de passe.");
  } else if (event === "SIGNED_IN" && authMode !== "reset_password") {
    closeAuthModal();
  }
  const requestSequence = ++authStateRequestSequence;
  invalidateAccessStateCache();
  sendToUnity({ state: session?.user ? "loading" : "signed_out" });

  // Supabase exécute ce callback sous son verrou interne d'authentification.
  // Décaler les requêtes de droits évite de réentrer dans supabase-js depuis
  // le callback et garantit que la déconnexion invalide bien les réponses lentes.
  window.setTimeout(async () => {
    if (requestSequence !== authStateRequestSequence) return;
    if (!session?.user) {
      try {
        const catalog = await fetchPublicCatalog();
        if (requestSequence !== authStateRequestSequence) return;
        const catalogForDisplay = applyDemoStoryFixture(catalog);
        sendToUnity({
          state: "signed_out",
          catalogStories: catalogForDisplay.stories || [],
          visibleCollectionItemIds: Array.isArray(catalog.visible_collection_item_ids)
            ? catalog.visible_collection_item_ids.filter(Boolean)
            : [],
          catalogLoaded: true
        });
      } catch (error) {
        if (requestSequence !== authStateRequestSequence) return;
        sendToUnity({ state: "signed_out", catalogStories: [], visibleCollectionItemIds: [], catalogLoaded: false, catalogError: error?.message || "Catalogue indisponible." });
      }
      return;
    }
    const state = await stateFromUser(session?.user, session?.access_token || "");
    if (requestSequence !== authStateRequestSequence) return;
    sendToUnity(state);
  }, 0);
}
window.MaisonDesContesAuth = {
  setSupabaseEnvironment(environmentId, url, publishableKey) {
    return configureSupabaseEnvironment(environmentId, url, publishableKey);
  },
  setReceiver(name) {
    receiverName = name;
    window.MaisonDesContesPendingReceiver = name;
    sendToUnity(latestState);
    if (window.MaisonDesContesPendingRuntimeCatalog) {
      const pendingStatus = window.MaisonDesContesPendingRuntimeCatalog;
      const pendingForce = window.MaisonDesContesPendingRuntimeCatalogForce === true;
      const pendingIncludePages = window.MaisonDesContesPendingRuntimeCatalogIncludePages === true;
      const pendingStoryId = window.MaisonDesContesPendingRuntimeCatalogStoryId || "";
      delete window.MaisonDesContesPendingRuntimeCatalog;
      delete window.MaisonDesContesPendingRuntimeCatalogForce;
      delete window.MaisonDesContesPendingRuntimeCatalogIncludePages;
      delete window.MaisonDesContesPendingRuntimeCatalogStoryId;
      requestRuntimeCatalog(pendingStatus, pendingForce, pendingIncludePages, pendingStoryId);
    }
    if (window.MaisonDesContesPendingRuntimeCatalogCacheLoad) {
      delete window.MaisonDesContesPendingRuntimeCatalogCacheLoad;
      loadRuntimeCatalogCache();
    }
  },
  refresh,
  signIn,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  requestPasswordReset,
  updatePassword,
  signOut,
  startPurchase,
  startSubscription,
  reportStoryProgress,
  requestPublicWebpAsPng,
  reportPageView,
  showCatalogMessage,
  requestRuntimeCatalog,
  loadRuntimeCatalogCache,
  saveRuntimeCatalogCache
};

if (window.MaisonDesContesPendingSupabaseEnvironment) {
  const pendingEnvironment = window.MaisonDesContesPendingSupabaseEnvironment;
  delete window.MaisonDesContesPendingSupabaseEnvironment;
  window.MaisonDesContesAuth.setSupabaseEnvironment(
    pendingEnvironment.environmentId,
    pendingEnvironment.url,
    pendingEnvironment.publishableKey
  );
}

// Le C# peut appeler le bridge dès le démarrage du player, avant que le module
// d'authentification n'ait fini son initialisation.
if (window.MaisonDesContesPendingRuntimeCatalog) {
  const pendingStatus = window.MaisonDesContesPendingRuntimeCatalog;
  const pendingForce = window.MaisonDesContesPendingRuntimeCatalogForce === true;
  const pendingIncludePages = window.MaisonDesContesPendingRuntimeCatalogIncludePages === true;
  const pendingStoryId = window.MaisonDesContesPendingRuntimeCatalogStoryId || "";
  delete window.MaisonDesContesPendingRuntimeCatalog;
  delete window.MaisonDesContesPendingRuntimeCatalogForce;
  delete window.MaisonDesContesPendingRuntimeCatalogIncludePages;
  delete window.MaisonDesContesPendingRuntimeCatalogStoryId;
  requestRuntimeCatalog(pendingStatus, pendingForce, pendingIncludePages, pendingStoryId);
}

if (window.MaisonDesContesPendingRuntimeCatalogCache) {
  const pendingCatalog = window.MaisonDesContesPendingRuntimeCatalogCache;
  delete window.MaisonDesContesPendingRuntimeCatalogCache;
  saveRuntimeCatalogCache(pendingCatalog);
}

if (window.MaisonDesContesPendingRuntimeCatalogCacheLoad) {
  delete window.MaisonDesContesPendingRuntimeCatalogCacheLoad;
  loadRuntimeCatalogCache();
}

// Unity peut initialiser le bridge avant la fin du chargement de ce module.
// Rejouer le rattachement évite de perdre les états d'authentification dans ce cas.
if (window.MaisonDesContesPendingReceiver) {
  window.MaisonDesContesAuth.setReceiver(window.MaisonDesContesPendingReceiver);
}

initializeReaderAuthUi();
initializeReaderCatalogUi();
refresh();
