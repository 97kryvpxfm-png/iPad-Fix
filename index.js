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

// Safari иногда рисует страницу сдвинутой, хотя сам считает, что сдвига нет.
// Небольшой «толчок» заставляет его перерисовать всё на месте.
const nudge = () => {
    if (keyboardOpen()) return;
    window.scrollTo(0, 1);
    requestAnimationFrame(toTop);
};

const nudgeLater = () => {
    setTimeout(nudge, 100);
    setTimeout(nudge, 400);
    setTimeout(nudge, 900);
};

// Не даём странице сдвигаться, пока нет экранной клавиатуры
window.addEventListener('scroll', () => {
    if ((window.scrollX !== 0 || window.scrollY !== 0) && !keyboardOpen()) toTop();
}, { passive: true });

// Толкаем после начала и конца редактирования
document.addEventListener('click', (e) => {
    if (e.target.closest('.mes_edit, .mes_edit_done, .mes_edit_cancel, .mes_edit_delete')) nudgeLater();
}, true);
document.addEventListener('focusout', nudgeLater);
window.visualViewport?.addEventListener('resize', nudgeLater);
