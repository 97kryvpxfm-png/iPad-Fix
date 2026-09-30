// Работает только на iPad (айпад в Safari притворяется маком, поэтому проверяем ещё и сенсорный экран)
const isIPad = /iPad/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if (isIPad) {
    // Экранная клавиатура открыта? (с физической клавиатурой высота почти не меняется)
    const keyboardOpen = () => {
        const vv = window.visualViewport;
        return vv && vv.height < window.innerHeight - 150;
    };

    const toTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };

    // 1. Не даём Safari прокручивать страницу, когда открывается поле редактирования
    const nativeFocus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (options) {
        if (this instanceof HTMLTextAreaElement && this.classList.contains('edit_textarea')) {
            return nativeFocus.call(this, { ...options, preventScroll: true });
        }
        return nativeFocus.call(this, options);
    };

    // 2. Заставляем Safari по-настоящему перерисовать страницу на месте
    const meta = document.querySelector('meta[name="viewport"]');
    const refresh = () => {
        if (keyboardOpen()) return;
        const html = document.documentElement;
        const original = meta?.getAttribute('content');
        html.style.setProperty('height', 'calc(100% + 2px)', 'important');
        window.scrollTo(0, 2);
        if (meta) meta.setAttribute('content', original + ', maximum-scale=1.0');
        requestAnimationFrame(() => {
            toTop();
            html.style.removeProperty('height');
            if (meta) meta.setAttribute('content', original);
        });
    };

    const refreshLater = () => {
        setTimeout(refresh, 100);
        setTimeout(refresh, 400);
        setTimeout(refresh, 900);
    };

    // Не даём странице сдвигаться, пока нет экранной клавиатуры
    window.addEventListener('scroll', () => {
        if ((window.scrollX !== 0 || window.scrollY !== 0) && !keyboardOpen()) toTop();
    }, { passive: true });

    // После начала и конца редактирования
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mes_edit, .mes_edit_done, .mes_edit_cancel, .mes_edit_delete')) refreshLater();
    }, true);
    document.addEventListener('focusout', refreshLater);
    window.visualViewport?.addEventListener('resize', refreshLater);
}
