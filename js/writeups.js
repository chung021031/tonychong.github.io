/* =========================================================
   writeups.js — filter, search, and count logic
   ========================================================= */

// ── Count live (non-placeholder) writeup cards ──────────
function refreshCount() {
    const cards = document.querySelectorAll('.wu-card-link:not(.wu-example)');
    const el = document.getElementById('wuTotal');
    if (el) el.textContent = cards.length;

    const empty = document.getElementById('emptyState');
    if (empty) empty.style.display = cards.length === 0 ? 'block' : 'none';
}

// ── Filter buttons ──────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
    });
});

// ── Search input ────────────────────────────────────────
const searchInput = document.getElementById('wuSearch');
searchInput?.addEventListener('input', applyFilters);

// ── Apply filters + search together ─────────────────────
function applyFilters() {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const term = searchInput?.value.trim().toLowerCase() || '';
    const cards = document.querySelectorAll('.wu-card-link:not(.wu-example)');
    let visible = 0;

    cards.forEach(card => {
        const tags = (card.dataset.tags || '').toLowerCase();
        const title = (card.dataset.title || '').toLowerCase();
        const excerpt = card.querySelector('.wc-excerpt')?.textContent.toLowerCase() || '';

        const matchFilter = activeFilter === 'all' || tags.includes(activeFilter);
        const matchSearch = !term || title.includes(term) || excerpt.includes(term) || tags.includes(term);

        const show = matchFilter && matchSearch;
        card.style.display = show ? 'flex' : 'none';
        if (show) visible++;
    });

    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = (visible === 0 && term) ? 'block' : 'none';
}

// ── Init ────────────────────────────────────────────────
refreshCount();
