const isEditing = () => {
    const el = document.activeElement;
    return el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.isContentEditable);
};

const isShifted = () => {
    const vv = window.visualViewport;
    return window.scrollX !== 0 || window.scrollY !== 0
        || document.documentElement.scrollTop !== 0
        || document.body.scrollTop !== 0
        || (vv && (Math.round(vv.offsetTop) !== 0 || Math.round(vv.pageTop) !== 0));
};

const reset = () => {
    if (isEditing() || !isShifted()) return;
    window.scrollTo(0, 1);
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
};

const later = () => {
    setTimeout(reset, 150);
    setTimeout(reset, 600);
};

document.addEventListener('focusout', later);
document.addEventListener('touchend', later, { passive: true });
window.addEventListener('scroll', later, { passive: true });
window.visualViewport?.addEventListener('resize', later);
window.visualViewport?.addEventListener('scroll', later);
