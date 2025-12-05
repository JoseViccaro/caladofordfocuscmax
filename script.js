document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('progressBar');
    const btnReset = document.getElementById('btnReset');
    const btnCheckAll = document.getElementById('btnCheckAll');
    const btnUncheckAll = document.getElementById('btnUncheckAll');

    // Theme Toggle Elements
    const themeToggle = document.getElementById('themeToggle');
    const iconSun = document.getElementById('iconSun');
    const iconMoon = document.getElementById('iconMoon');
    const body = document.body;

    // --- Theme Logic ---
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            enableLightMode();
        }
    }

    function enableLightMode() {
        body.classList.add('light-mode');
        iconMoon.style.display = 'none';
        iconSun.style.display = 'block';
        localStorage.setItem('theme', 'light');
    }

    function enableDarkMode() {
        body.classList.remove('light-mode');
        iconMoon.style.display = 'block';
        iconSun.style.display = 'none';
        localStorage.setItem('theme', 'dark');
    }

    function toggleTheme() {
        if (body.classList.contains('light-mode')) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    }

    themeToggle.addEventListener('click', toggleTheme);


    // --- Checklist Logic ---

    // Load state from localStorage
    function loadState() {
        const savedState = JSON.parse(localStorage.getItem('timingChecklistState')) || {};
        checkboxes.forEach((cb, index) => {
            if (savedState[index]) {
                cb.checked = true;
            }
        });
        updateProgress();
        updateSections();
    }

    // Save state to localStorage
    function saveState() {
        const state = {};
        checkboxes.forEach((cb, index) => {
            state[index] = cb.checked;
        });
        localStorage.setItem('timingChecklistState', JSON.stringify(state));
        updateProgress();
        updateSections();
    }

    // Update progress bar
    function updateProgress() {
        const total = checkboxes.length;
        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
        const percentage = (checked / total) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    // Update Section Visual Feedback
    function updateSections() {
        const detailsList = document.querySelectorAll('details');
        detailsList.forEach(details => {
            // Find all checkboxes inside this details element
            const sectionCheckboxes = details.querySelectorAll('input[type="checkbox"]');
            if (sectionCheckboxes.length > 0) {
                const allChecked = Array.from(sectionCheckboxes).every(cb => cb.checked);
                if (allChecked) {
                    details.classList.add('section-completed');
                } else {
                    details.classList.remove('section-completed');
                }
            }
        });
    }

    // Event Listeners
    checkboxes.forEach(cb => {
        cb.addEventListener('change', saveState);
    });

    btnReset.addEventListener('click', () => {
        if (confirm('¿Reiniciar todo el checklist?')) {
            checkboxes.forEach(cb => cb.checked = false);
            saveState();
        }
    });

    btnCheckAll.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = true);
        saveState();
    });

    btnUncheckAll.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = false);
        saveState();
    });

    // Initial Load
    loadState();
    loadTheme();

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('SW registrado con éxito:', registration.scope);
                })
                .catch(err => {
                    console.log('Fallo al registrar SW:', err);
                });
        });
    }
});
