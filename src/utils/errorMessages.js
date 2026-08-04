const ERROR_PATTERNS = [
  {
    test: /invalid credentials|incorrect username|bad credentials|credenciales inválidas|contraseña incorrecta|usuario o contraseña/i,
    id: "errors.invalidCredentials",
    messages: {
      es: "Credenciales inválidas",
      en: "Invalid credentials",
      fr: "Identifiants invalides",
    },
  },
  {
    test: /network error|failed to fetch|fetch failed|error de red|no se pudo conectar|erreur réseau|connexion impossible/i,
    id: "errors.network",
    messages: {
      es: "No se pudo conectar con el servidor",
      en: "Could not connect to the server",
      fr: "Impossible de se connecter au serveur",
    },
  },
  {
    test: /user not found|usuario no encontrado|utilisateur introuvable|no existe/i,
    id: "errors.userNotFound",
    messages: {
      es: "No se encontró el usuario",
      en: "User not found",
      fr: "Utilisateur introuvable",
    },
  },
  {
    test: /email already exists|correo ya registrado|courriel déjà utilisé|email already used/i,
    id: "errors.emailExists",
    messages: {
      es: "El correo electrónico ya está registrado",
      en: "The email is already registered",
      fr: "L'adresse e-mail est déjà utilisée",
    },
  },
  {
    test: /username already exists|usuario ya existe|nom d'utilisateur déjà utilisé|username already used/i,
    id: "errors.usernameExists",
    messages: {
      es: "El nombre de usuario ya existe",
      en: "The username already exists",
      fr: "Le nom d'utilisateur existe déjà",
    },
  },
  {
    test: /passwords do not match|las contraseñas no coinciden|les mots de passe ne correspondent pas/i,
    id: "errors.passwordsMismatch",
    messages: {
      es: "Las contraseñas no coinciden",
      en: "Passwords do not match",
      fr: "Les mots de passe ne correspondent pas",
    },
  },
  {
    test: /must accept terms|debes aceptar los términos|vous devez accepter les conditions|accept the terms/i,
    id: "errors.termsRequired",
    messages: {
      es: "Debes aceptar los términos",
      en: "You must accept the terms",
      fr: "Vous devez accepter les conditions",
    },
  },
  {
    test: /minimum 8|mín\. 8|mot de passe|password.*requirements|contraseña.*requisitos/i,
    id: "errors.passwordWeak",
    messages: {
      es: "La contraseña no cumple con los requisitos",
      en: "The password does not meet the requirements",
      fr: "Le mot de passe ne respecte pas les exigences",
    },
  },
];

// Distingue el mapa de errores por campo ({"campo":"mensaje"}) que devuelve el backend
// en validaciones 400, de los demás formatos de error (string plano, {message:...}).
export function isFieldErrorMap(data) {
  return (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    typeof data.message !== "string" &&
    typeof data.error !== "string"
  );
}

export function translateErrorMessage(err, fallback, i18n) {
  const raw = err?.message || err?.response?.data?.message || err?.data?.message || "";
  const value = String(raw).trim();

  if (!value) {
    return fallback;
  }

  const locale = i18n?.locale || "es";
  const localeKey = locale.startsWith("en") ? "en" : locale.startsWith("fr") ? "fr" : "es";

  for (const pattern of ERROR_PATTERNS) {
    if (pattern.test.test(value)) {
      return i18n._({ id: pattern.id, message: pattern.messages[localeKey] || pattern.messages.es });
    }
  }

  return fallback;
}
