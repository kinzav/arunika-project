
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('accessibilityToggle');
    const panel = document.getElementById('accessibilityPanel');
    const reset = document.getElementById('accessibilityReset');

    if (!toggle || !panel || !reset) return;

    const options = {
        grayscale: document.getElementById('toggleGrayscale'),
        contrast: document.getElementById('toggleContrast'),
        invert: document.getElementById('toggleInvert')
    };

    const classes = {
        grayscale: 'a11y-grayscale',
        contrast: 'a11y-high-contrast',
        invert: 'a11y-invert'
    };

    const html = document.documentElement;

    function updateButton(button, active) {
        button.setAttribute('aria-pressed', String(active));

        const status = button.querySelector('.accessibility-status');
        if (status) {
            status.textContent = active ? 'AKTIF' : 'MATI';
        }
    }

    function setFeature(feature, enabled) {
        // Hanya satu filter warna aktif pada satu waktu
        Object.keys(classes).forEach(function (key) {
            html.classList.remove(classes[key]);
            updateButton(options[key], false);
        });

        if (enabled) {
            html.classList.add(classes[feature]);
            updateButton(options[feature], true);
        }
    }

    // Buka/tutup menu
    toggle.addEventListener('click', function () {
        const isOpen = panel.classList.toggle('is-open');

        toggle.setAttribute('aria-expanded', String(isOpen));
        panel.setAttribute('aria-hidden', String(!isOpen));
    });

    // Klik di luar menu untuk menutup
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.accessibility-widget')) {
            panel.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
        }
    });

    // Aktifkan/nonaktifkan setiap fitur
    Object.keys(options).forEach(function (feature) {
        const button = options[feature];

        if (!button) return;

        button.addEventListener('click', function () {
            const isActive =
                button.getAttribute('aria-pressed') === 'true';

            setFeature(feature, !isActive);
        });
    });

    // Reset tampilan
    reset.addEventListener('click', function () {
        Object.keys(classes).forEach(function (feature) {
            html.classList.remove(classes[feature]);
            updateButton(options[feature], false);
        });
    });

    // Tutup menu dengan Escape
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            panel.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
            toggle.focus();
        }
    });
});
