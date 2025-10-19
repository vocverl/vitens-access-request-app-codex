const accessCatalogue = [
    {
        id: 'visio-pro',
        name: 'Microsoft Visio Professional',
        description: 'Uitgebreide diagrammen, BPMN en technische modellen maken.',
        category: 'Microsoft Visio',
        type: 'Licentie'
    },
    {
        id: 'visio-standard',
        name: 'Microsoft Visio Standard',
        description: 'Basisdiagrammen en eenvoudige flows visualiseren.',
        category: 'Microsoft Visio',
        type: 'Licentie'
    },
    {
        id: 'p2p-requester',
        name: 'SAP_P2P_REQUESTER',
        description: 'Aanmaken van inkoopaanvragen binnen het Purchase-to-Pay proces.',
        category: 'SAP P2P',
        type: 'SAP Rol'
    },
    {
        id: 'p2p-buyer',
        name: 'SAP_P2P_BUYER',
        description: 'Beheren en versturen van inkooporders.',
        category: 'SAP P2P',
        type: 'SAP Rol'
    },
    {
        id: 'p2p-approver',
        name: 'SAP_P2P_APPROVER',
        description: 'Goedkeuren van inkooporders en facturen.',
        category: 'SAP P2P',
        type: 'SAP Rol'
    },
    {
        id: 'p2p-receiver',
        name: 'SAP_P2P_RECEIVER',
        description: 'Registreren van goederenontvangst en packing slips.',
        category: 'SAP P2P',
        type: 'SAP Rol'
    }
];

const state = {
    mode: 'demo',
    cart: [],
    requester: {
        requesterName: '',
        requesterEmail: '',
        requesterId: '',
        requesterManager: '',
        requestJustification: ''
    }
};

const STORAGE_KEY = 'codex-vitens-access-request';

const dom = {
    year: document.getElementById('year'),
    modeBadge: document.getElementById('modeBadge'),
    modeToggle: document.getElementById('modeToggle'),
    searchInput: document.getElementById('searchInput'),
    searchButton: document.getElementById('searchButton'),
    resultsContainer: document.getElementById('resultsContainer'),
    resultTemplate: document.getElementById('resultTemplate'),
    cartContainer: document.getElementById('cartContainer'),
    cartItemTemplate: document.getElementById('cartItemTemplate'),
    submitButton: document.getElementById('submitButton'),
    requestForm: document.getElementById('requestForm')
};

dom.year.textContent = new Date().getFullYear();

function loadStoredState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed.requester) {
            state.requester = { ...state.requester, ...parsed.requester };
            populateFormValues();
        }
    } catch (error) {
        console.warn('Kon opgeslagen gegevens niet laden:', error);
    }
}

function persistState() {
    try {
        const payload = {
            requester: { ...state.requester }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
        console.warn('Kon gegevens niet opslaan:', error);
    }
}

function populateFormValues() {
    Object.entries(state.requester).forEach(([name, value]) => {
        const field = dom.requestForm.elements[name];
        if (field) {
            field.value = value;
        }
    });
}

function setMode(mode) {
    state.mode = mode;
    if (mode === 'demo') {
        dom.modeBadge.textContent = 'Demo modus';
        dom.modeBadge.classList.remove('badge--online');
        dom.modeBadge.classList.add('badge--demo');
        dom.modeToggle.textContent = 'Switch naar Online';
    } else {
        dom.modeBadge.textContent = 'Online modus';
        dom.modeBadge.classList.remove('badge--demo');
        dom.modeBadge.classList.add('badge--online');
        dom.modeToggle.textContent = 'Terug naar Demo';
    }
}

function toggleMode() {
    const nextMode = state.mode === 'demo' ? 'online' : 'demo';
    setMode(nextMode);
    const infoMessage = nextMode === 'demo'
        ? 'Je zit in demo modus. Aanvragen worden lokaal bevestigd.'
        : 'Online modus geactiveerd. Koppel deze omgeving aan SAP GRC voor live aanvragen.';
    notify(infoMessage);
}

function notify(message, variant = 'info') {
    // Eenvoudige non-blocking notificatie
    const banner = document.createElement('div');
    banner.className = `notification notification--${variant}`;
    banner.textContent = message;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add('is-visible'));
    setTimeout(() => {
        banner.classList.remove('is-visible');
        setTimeout(() => banner.remove(), 300);
    }, 3200);
}

function clearResults() {
    dom.resultsContainer.innerHTML = '';
}

function renderEmptyState(message = 'Geen resultaten gevonden. Pas je zoekterm aan.') {
    const empty = document.createElement('div');
    empty.className = 'results__empty';
    empty.textContent = message;
    dom.resultsContainer.appendChild(empty);
}

function renderResults(items) {
    clearResults();
    if (!items.length) {
        renderEmptyState();
        return;
    }

    items.forEach(item => {
        const node = dom.resultTemplate.content.cloneNode(true);
        const title = node.querySelector('.result__title');
        const description = node.querySelector('.result__description');
        const badge = node.querySelector('.result__badge');
        const button = node.querySelector('.result__button');

        title.textContent = item.name;
        description.textContent = item.description;
        badge.textContent = item.category;
        button.addEventListener('click', () => addToCart(item.id));

        dom.resultsContainer.appendChild(node);
    });
}

function performSearch() {
    const term = dom.searchInput.value.trim().toLowerCase();
    if (!term) {
        renderEmptyState('Typ een zoekterm zoals "Visio" of "P2P".');
        return;
    }

    const matches = accessCatalogue.filter(item => {
        return [item.name, item.description, item.category, item.type]
            .some(field => field.toLowerCase().includes(term));
    });

    renderResults(matches);
}

function addToCart(itemId) {
    if (state.cart.some(item => item.id === itemId)) {
        notify('Dit item staat al in de winkelwagen.', 'warning');
        return;
    }

    const match = accessCatalogue.find(item => item.id === itemId);
    if (!match) return;

    state.cart.push(match);
    updateCartUI();
    dom.submitButton.disabled = state.cart.length === 0;
    notify(`${match.name} is toegevoegd aan de aanvraag.`);
}

function removeFromCart(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
    updateCartUI();
    dom.submitButton.disabled = state.cart.length === 0;
}

function updateCartUI() {
    dom.cartContainer.innerHTML = '';
    if (!state.cart.length) {
        const message = document.createElement('p');
        message.className = 'cart__empty';
        message.textContent = 'Nog geen items geselecteerd.';
        dom.cartContainer.appendChild(message);
        return;
    }

    state.cart.forEach(item => {
        const node = dom.cartItemTemplate.content.cloneNode(true);
        const title = node.querySelector('.cart-item__title');
        const subtitle = node.querySelector('.cart-item__subtitle');
        const removeButton = node.querySelector('.cart-item__remove');

        title.textContent = item.name;
        subtitle.textContent = `${item.category} • ${item.type}`;
        removeButton.addEventListener('click', () => removeFromCart(item.id));

        dom.cartContainer.appendChild(node);
    });
}

function handleFormChange(event) {
    const { name, value } = event.target;
    if (!Object.prototype.hasOwnProperty.call(state.requester, name)) {
        return;
    }
    state.requester[name] = value;
    persistState();
}

function validateForm() {
    return dom.requestForm.reportValidity();
}

function buildSummary() {
    const { requesterName, requesterEmail, requesterId, requesterManager, requestJustification } = state.requester;
    return [
        `Aanvrager: ${requesterName} (${requesterEmail})`,
        `Personeelsnummer: ${requesterId}`,
        requesterManager ? `Manager: ${requesterManager}` : null,
        `Motivatie: ${requestJustification}`,
        `Items: ${state.cart.map(item => item.name).join(', ')}`,
        `Modus: ${state.mode === 'demo' ? 'Demo (lokaal)' : 'Online (koppeling vereist)'}`
    ].filter(Boolean).join('\n');
}

function submitRequest() {
    if (!state.cart.length) {
        notify('Voeg minimaal één item toe aan de aanvraag.', 'warning');
        return;
    }

    if (!validateForm()) {
        notify('Controleer de verplichte velden in het formulier.', 'danger');
        return;
    }

    if (state.mode === 'demo') {
        notify('Aanvraag opgeslagen in demo modus. Zie console voor details.');
        console.log('Demo aanvraag samenvatting:\n', buildSummary());
    } else {
        notify('Online modus: koppel SOAP/API voordat je live kunt versturen.', 'info');
        console.info('Online aanvraag payload (mock):\n', {
            requester: { ...state.requester },
            cart: state.cart,
            submittedAt: new Date().toISOString()
        });
    }

    state.cart = [];
    updateCartUI();
    dom.submitButton.disabled = true;
}

function wireEvents() {
    dom.searchButton.addEventListener('click', performSearch);
    dom.searchInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            performSearch();
        }
    });

    dom.modeToggle.addEventListener('click', toggleMode);
    dom.submitButton.addEventListener('click', submitRequest);

    Array.from(dom.requestForm.elements).forEach(element => {
        element.addEventListener('input', handleFormChange);
        element.addEventListener('blur', handleFormChange);
    });
}

function createNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            left: 50%;
            top: 24px;
            transform: translate(-50%, -20px);
            padding: 12px 18px;
            border-radius: 999px;
            background: rgba(44, 60, 138, 0.95);
            color: #fff;
            font-weight: 600;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 1000;
        }
        .notification--warning {
            background: rgba(214, 69, 65, 0.9);
        }
        .notification--danger {
            background: rgba(214, 69, 65, 0.95);
        }
        .notification--info {
            background: rgba(74, 174, 223, 0.9);
        }
        .notification.is-visible {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    `;
    document.head.appendChild(style);
}

function init() {
    createNotificationStyles();
    loadStoredState();
    updateCartUI();
    setMode('demo');
    wireEvents();
}

init();
