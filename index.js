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

const dbg = document.createElement('div');
dbg.style.cssText = 'position:fixed;top:40%;left:40%;z-index:99999;background:rgba(0,0,0,.8);color:#0f0;font:12px monospace;padding:6px;pointer-events:none;white-space:pre';
document.body.appendChild(dbg);
setInterval(() => {
    const vv = window.visualViewport;
    dbg.textContent = `v2
scrollY ${window.scrollY}
html ${document.documentElement.scrollTop}
body ${document.body.scrollTop}
vvTop ${vv?.offsetTop}
vvPageTop ${vv?.pageTop}
vvH ${vv?.height}
innerH ${innerHeight}
sheld ${document.getElementById('sheld')?.scrollTop}`;
}, 300);

