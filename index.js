// Работает только на iPad (айпад в Safari притворяется маком, поэтому проверяем ещё и сенсорный экран)
const isIPad = /iPad/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if (isIPad) {
    // Экранная клавиатура открыта? (с физической клавиатурой высота почти не меняется)
    const keyboardOpen = () => {
        const vv = window.visualViewport;
        return vv && vv.height < window.innerHeight - 150;
    };

    // Запоминаем, пользуешься ли ты физической клавиатурой
    let hwKeyboard = false;
    try { hwKeyboard = localStorage.getItem('ipadfix_hw') === '1'; } catch {}
    const setHw = (value) => {
        hwKeyboard = value;
        try { localStorage.setItem('ipadfix_hw', value ? '1' : '0'); } catch {}
    };

    const isTextArea = (el) => el instanceof HTMLTextAreaElement;
    const isEditArea = (el) => isTextArea(el) && el.classList.contains('edit_textarea');

    // Печать без экранной клавиатуры = подключена физическая
    document.addEventListener('keydown', (e) => {
        if (isTextArea(e.target) && !keyboardOpen()) setHw(true);
    }, true);

    const toTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };

    // С физической клавиатурой не даём Safari прокручивать страницу при открытии редактирования
    const nativeFocus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (options) {
        if (hwKeyboard && isEditArea(this)) {
            return nativeFocus.call(this, { ...options, preventScroll: true });
        }
        return nativeFocus.call(this, options);
    };

    // Заставляем Safari по-настоящему перерисовать страницу на месте
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

    // С физической клавиатурой вообще не даём странице сдвигаться
    window.addEventListener('scroll', () => {
        if (hwKeyboard && !keyboardOpen() && (window.scrollX !== 0 || window.scrollY !== 0)) toTop();
    }, { passive: true });

    // Появилась экранная клавиатура: значит, физической нет, отдаём управление Safari
    window.visualViewport?.addEventListener('resize', () => {
        if (keyboardOpen()) {
            if (hwKeyboard) {
                setHw(false);
                const el = document.activeElement;
                if (isTextArea(el)) el.scrollIntoView({ block: 'end' });
            }
        } else {
            refreshLater();
        }
    });

    // Начало и конец редактирования
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mes_edit_done, .mes_edit_cancel, .mes_edit_delete')) refreshLater();
        else if (hwKeyboard && e.target.closest('.mes_edit')) refreshLater();
    }, true);
    document.addEventListener('focusout', refreshLater);
}
