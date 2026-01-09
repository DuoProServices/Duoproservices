/**
 * ADMIN CONFIGURATION
 * 
 * Para adicionar um novo administrador:
 * 1. Adicione o email na lista ADMIN_EMAILS abaixo
 * 2. Salve o arquivo
 * 3. O usuário com esse email terá acesso ao painel admin
 * 
 * IMPORTANTE: Use emails em MINÚSCULAS
 */

export const ADMIN_EMAILS = [
  'veprass@gmail.com',
  'germana.canada@gmail.com',
  'duoproservices.info@gmail.com',
];

/**
 * Verifica se um email é de administrador
 */
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}