/**
 * Service de notifications toast basé sur la librairie Sonner.
 *
 * Fournit une interface simplifiée pour afficher des notifications
 * de succès, d'erreur, d'information et d'avertissement.
 *
 * @module services/toast
 */

import { toast } from 'sonner';

export const notify = {
  success: (msg) => toast.success(msg),
  error:   (msg) => toast.error(msg),
  info:    (msg) => toast.info(msg),
  warning: (msg) => toast.warning(msg),
};