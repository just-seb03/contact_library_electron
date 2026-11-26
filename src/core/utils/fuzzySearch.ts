/**
 * Utilidad de búsqueda difusa (fuzzy) tolerante a:
 * - Omisión de tildes y mayúsculas ("jose" -> "José")
 * - Falta o exceso de espacios y símbolos ("984123390" -> "+56 9 8412 3390", "camilasoto" -> "Camila Soto")
 * - Errores de tipeo, letras cambiadas o transpuestas ("Valenzulea", "984213390")
 * - Coincidencias parciales en orden ("cml vln")
 */

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function stripSeparators(value: string): string {
  return normalizeText(value).replace(/[\s+\-()._]/g, '');
}

/**
 * Distancia Damerau-Levenshtein (considera inserción, borrado, sustitución y transposición adyacente).
 */
function damerauLevenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let val = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        val = Math.min(val, dp[i - 2][j - 2] + cost);
      }
      dp[i][j] = val;
    }
  }
  return dp[m][n];
}

function subsequenceScore(query: string, target: string): number {
  if (!query || !target || query.length > target.length) return 0;
  let qi = 0;
  let consecutive = 0;
  let score = 0;

  for (let ti = 0; ti < target.length && qi < query.length; ti++) {
    if (target[ti] === query[qi]) {
      consecutive++;
      const isWordStart = ti === 0 || target[ti - 1] === ' ';
      score += 1 + (isWordStart ? 3 : 0) + consecutive;
      qi++;
    } else {
      consecutive = 0;
    }
  }

  return qi === query.length ? score : 0;
}

function maxAllowedEdits(length: number): number {
  if (length <= 2) return 0;
  if (length <= 5) return 1;
  return 2;
}

function bestWindowEditScore(token: string, target: string): number {
  const maxEdits = maxAllowedEdits(token.length);
  if (maxEdits === 0 || target.length < 2) return 0;

  // Para cadenas cortas o similares al largo del token, comparar directo
  if (Math.abs(target.length - token.length) <= maxEdits) {
    const dist = damerauLevenshtein(token, target);
    if (dist <= maxEdits) return 45 - dist * 15;
  }

  // Ventana deslizante para detectar errores dentro de números o palabras largas
  const minWin = Math.max(2, token.length - maxEdits);
  const maxWin = Math.min(target.length, token.length + maxEdits);
  let best = 0;

  for (let winLen = minWin; winLen <= maxWin; winLen++) {
    for (let start = 0; start <= target.length - winLen; start++) {
      const slice = target.slice(start, start + winLen);
      const dist = damerauLevenshtein(token, slice);
      if (dist <= maxEdits) {
        const candidateScore = 40 - dist * 14 + (start === 0 ? 5 : 0);
        if (candidateScore > best) best = candidateScore;
      }
    }
  }

  return best;
}

/**
 * Calcula la relevancia difusa de una consulta contra múltiples campos de un elemento.
 * Devuelve 0 si no hay coincidencia, o un puntaje positivo mayor cuanto mejor coincida.
 */
export function fuzzyScore(query: string, fields: (string | undefined)[]): number {
  const normQuery = normalizeText(query);
  if (!normQuery) return 1;

  const compactQuery = stripSeparators(query);
  const tokens = normQuery.split(/\s+/).filter(Boolean);

  let bestFieldScore = 0;

  for (const rawField of fields) {
    if (!rawField) continue;
    const normField = normalizeText(rawField);
    const compactField = stripSeparators(rawField);
    if (!normField) continue;

    // 1. Coincidencia exacta o de subcadena directa (con o sin espacios/símbolos)
    if (normField === normQuery || (compactQuery && compactField === compactQuery)) {
      bestFieldScore = Math.max(bestFieldScore, 200);
      continue;
    }
    if (normField.startsWith(normQuery) || (compactQuery && compactField.startsWith(compactQuery))) {
      bestFieldScore = Math.max(bestFieldScore, 150);
      continue;
    }
    if (normField.includes(normQuery) || (compactQuery && compactField.includes(compactQuery))) {
      bestFieldScore = Math.max(bestFieldScore, 120);
      continue;
    }

    // 2. Coincidencia por tokens (permite omitir espacios o tener errores por palabra/número)
    const words = normField.split(/[\s+\-()._/@]+/).filter(Boolean);
    let tokenTotal = 0;
    let allTokensMatched = true;

    for (const token of tokens) {
      const compactToken = stripSeparators(token);
      let tokenBest = 0;

      if (normField.includes(token) || (compactToken && compactField.includes(compactToken))) {
        tokenBest = 80;
      } else {
        for (const word of words) {
          const editScore = bestWindowEditScore(compactToken || token, word);
          if (editScore > tokenBest) tokenBest = editScore;
        }
        if (tokenBest === 0 && compactToken.length >= 3) {
          tokenBest = bestWindowEditScore(compactToken, compactField);
        }
        if (tokenBest === 0) {
          const subScore = subsequenceScore(compactToken || token, compactField);
          if (subScore > 0) tokenBest = Math.min(35, subScore);
        }
      }

      if (tokenBest === 0) {
        allTokensMatched = false;
        break;
      }
      tokenTotal += tokenBest;
    }

    if (allTokensMatched && tokenTotal > 0) {
      bestFieldScore = Math.max(bestFieldScore, tokenTotal);
      continue;
    }

    // 3. Fallback global sin espacios (por ejemplo consulta sin espacios con 1-2 errores de tipeo)
    if (compactQuery.length >= 3) {
      const compactEdit = bestWindowEditScore(compactQuery, compactField);
      if (compactEdit > 0) {
        bestFieldScore = Math.max(bestFieldScore, compactEdit);
      } else {
        const subScore = subsequenceScore(compactQuery, normField);
        if (subScore >= compactQuery.length * 2) {
          bestFieldScore = Math.max(bestFieldScore, Math.min(32, subScore));
        }
      }
    }
  }

  return bestFieldScore;
}
