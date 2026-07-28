export const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;
export const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
export const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,50}$/;
export const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
