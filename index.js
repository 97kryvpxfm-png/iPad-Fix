const isEditing = () => {
    const el = document.activeElement;
    return el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.isContentEditable);
};

const reset = () => {
    if (isEditing()) return;
    if (window.scrollX !== 0 || window.scrollY !== 0) window.scrollTo(0, 0);
    if (document.documentElement.scrollTop) document.documentElement.scrollTop = 0;
    if (document.body.scrollTop) document.body.scrollTop = 0;
};

const later = () => setTimeout(reset, 150);

document.addEventListener('focusout', later);
window.addEventListener('scroll', later, { passive: true });
window.visualViewport?.addEventListener('resize', later);
