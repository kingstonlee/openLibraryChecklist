// Pure pagination helper, usable in the browser (global `paginate`) and under
// Node's test runner (module.exports).
(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  if (typeof window !== 'undefined') {
    window.paginate = api.paginate;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  // Slice `items` into the requested page.
  //   paginate([...], page, pageSize) ->
  //     { items, page, totalPages, total, start, end }
  // `page` is clamped to [1, totalPages]; a non-positive pageSize yields one page.
  function paginate(items, page, pageSize) {
    const list = Array.isArray(items) ? items : [];
    const total = list.length;
    const size = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : total || 1;
    const totalPages = Math.max(1, Math.ceil(total / size));

    let current = Number.parseInt(page, 10);
    if (!Number.isInteger(current) || current < 1) current = 1;
    if (current > totalPages) current = totalPages;

    const start = (current - 1) * size;
    const end = Math.min(start + size, total);

    return {
      items: list.slice(start, end),
      page: current,
      totalPages,
      total,
      start,
      end
    };
  }

  return { paginate };
});
