// Shared HTML-escaping helpers, usable both in the browser (as globals
// `escapeHtml` / `safeUrl`) and under Node's test runner (via module.exports).
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.escapeHtml = api.escapeHtml;
    window.safeUrl = api.safeUrl;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  // Escape text before inserting it into innerHTML to prevent XSS.
  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Return a URL only if it uses a safe scheme, otherwise an empty string.
  function safeUrl(value) {
    if (!value) return '';
    const trimmed = String(value).trim();
    if (/^https?:\/\//i.test(trimmed) || /^\//.test(trimmed)) {
      return trimmed;
    }
    return '';
  }

  return { escapeHtml, safeUrl };
});
