// =====================================================================
// storageService.js — Upload de arquivos (Firebase Storage).
// Aceita qualquer tipo de arquivo. Retorna a URL de download para
// gravar no conteúdo da trilha. Em MODO DEMO usa URL temporária local.
// =====================================================================
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../firebase.js';

// Liga/desliga o botão de upload de arquivos no painel Admin.
// Deixe FALSE enquanto o Firebase Storage não estiver ativo (exige Blaze).
// Troque para TRUE quando ativar o Storage — o upload volta a aparecer.
export const UPLOAD_HABILITADO = false;

let _seq = 0;

/** Detecta uma categoria amigável a partir do MIME do arquivo. */
export function categoriaDoArquivo(mime = '') {
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('image/')) return 'imagem';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime === 'application/pdf') return 'pdf';
  return 'arquivo';
}

/**
 * Envia um arquivo e retorna { url, nome, tipo, tamanho, caminho }.
 * @param {File} file
 * @param {string} pasta caminho lógico dentro do bucket (ex.: 'trilhas/flutterflow')
 */
export async function uploadArquivo(file, pasta = 'conteudos') {
  const nome = file.name;
  const tipo = file.type || 'application/octet-stream';

  if (!isFirebaseConfigured) {
    // Demo: URL temporária (não persiste após recarregar). Só para testes.
    return { url: URL.createObjectURL(file), nome, tipo, tamanho: file.size, caminho: null, demo: true };
  }

  const seguro = nome.replace(/[^\w.\-]+/g, '_');
  const caminho = `${pasta}/${Date.now()}_${_seq++}_${seguro}`;
  const r = ref(storage, caminho);
  await uploadBytes(r, file, { contentType: tipo });
  const url = await getDownloadURL(r);
  return { url, nome, tipo, tamanho: file.size, caminho };
}

/** Remove um arquivo do Storage pelo caminho (opcional). */
export async function removerArquivo(caminho) {
  if (!isFirebaseConfigured || !caminho) return;
  try {
    await deleteObject(ref(storage, caminho));
  } catch {
    /* já removido / inexistente */
  }
}

/** Formata bytes para exibição. */
export function formatarTamanho(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
