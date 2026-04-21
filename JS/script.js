document.addEventListener('DOMContentLoaded', () => {
    const produseDB = [
        { id: 'rtx4060', titlu: 'ASUS Dual GeForce RTX 4060 OC 8GB', pret: '7 600 MDL', img: 'Images/asus.jpg' },
        { id: 'rtx4070', titlu: 'GIGABYTE GeForce RTX 4070 SUPER', pret: '13 500 MDL', img: 'Images/rtx4070.png' },
        { id: 'ryzen7', titlu: 'AMD Ryzen 7 7800X3D', pret: '8 900 MDL', img: 'Images/amdryzen.png' }
    ];

    const searchInput = document.querySelector('.bara-cautare input');
    const searchContainer = document.querySelector('.bara-cautare');

    if (searchInput && searchContainer) {
        let dropdown = document.querySelector('.rezultate-cautare');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'rezultate-cautare';
            searchContainer.appendChild(dropdown);
        }

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            dropdown.innerHTML = '';

            if (query.length > 0) {
                const filtered = produseDB.filter(p => p.titlu.toLowerCase().includes(query));
                if (filtered.length > 0) {
                    dropdown.style.display = 'flex';
                    filtered.forEach(prod => {
                        dropdown.innerHTML += `
                            <a href="produs.html?id=${prod.id}" class="rezultat-item">
                                <img src="${prod.img}" alt="${prod.titlu}" style="width: 40px; height: 40px; object-fit: contain;">
                                <div>
                                    <div style="font-weight: bold; font-size: 14px; color: black;">${prod.titlu}</div>
                                    <div style="color: #9c27b0; font-size: 12px;">${prod.pret}</div>
                                </div>
                            </a>
                        `;
                    });
                } else {
                    dropdown.style.display = 'none';
                }
            } else {
                dropdown.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target) && dropdown) {
                dropdown.style.display = 'none';
            }
        });
    }
});

    // Preluare căutare din URL (dacă venim de pe altă pagină)
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && window.location.pathname.includes('produse.html')) {
        const mainSearchInput = document.querySelector('.bara-cautare input');
        if (mainSearchInput) mainSearchInput.value = searchQuery;
        setTimeout(() => filtrareDupaCautare(searchQuery.toLowerCase()), 100);
    }

    function filtrareDupaCautare(query) {
        const produse = document.querySelectorAll('.card-produs');
        produse.forEach(prod => {
            const titlu = prod.querySelector('.titlu-produs').innerText.toLowerCase();
            const categorie = prod.querySelector('.categorie-text').innerText.toLowerCase();
            if (titlu.includes(query) || categorie.includes(query)) {
                prod.style.display = 'block';
            } else {
                prod.style.display = 'none';
            }
        });
    }

    // --- 2. SLIDER PREȚ ---
    const priceInput = document.querySelector('.grup-filtru input[type="range"]');
    const priceDisplays = document.querySelectorAll('.grup-filtru div span');
    
    if (priceInput && priceDisplays.length > 1) {
        priceInput.addEventListener('input', (e) => {
            priceDisplays[1].innerText = `${e.target.value} MDL`;
        });
    }

    // --- 3. APLICARE FILTRE ---
    const btnFiltre = document.querySelector('.sidebar-filtre .btn-adauga');
    
    if (btnFiltre) {
        btnFiltre.addEventListener('click', (e) => {
            e.preventDefault();
            
            const maxPrice = parseInt(priceInput.value);
            
            // Extragere categorii selectate
            const categoryCheckboxes = document.querySelectorAll('.grup-filtru:nth-of-type(1) input[type="checkbox"]');
            const selectedCategories = Array.from(categoryCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.parentElement.innerText.trim().toLowerCase());

            // Extragere producători selectați
            const manufacturerCheckboxes = document.querySelectorAll('.grup-filtru:nth-of-type(3) input[type="checkbox"]');
            const selectedManufacturers = Array.from(manufacturerCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.parentElement.innerText.trim().toLowerCase());

            const produse = document.querySelectorAll('.card-produs');

            produse.forEach(prod => {
                const pretText = prod.querySelector('.pret').innerText;
                const pretValue = parseInt(pretText.replace(/\s/g, '').replace('MDL', ''));
                
                const categorieText = prod.querySelector('.categorie-text').innerText.toLowerCase();
                const titluText = prod.querySelector('.titlu-produs').innerText.toLowerCase();

                // Verificare preț
                const matchPrice = pretValue <= maxPrice;

                // Verificare categorie
                let matchCategory = selectedCategories.length === 0; // Dacă nimic nu e bifat, arată tot
                selectedCategories.forEach(cat => {
                    if (cat.includes('video') && categorieText.includes('video')) matchCategory = true;
                    if (cat.includes('procesoare') && categorieText.includes('procesor')) matchCategory = true;
                    if (cat.includes('ram') && categorieText.includes('ram')) matchCategory = true;
                    if (cat.includes('stocare') && categorieText.includes('stocare')) matchCategory = true;
                    if (cat.includes('bază') && categorieText.includes('bază')) matchCategory = true;
                    if (cat.includes('carcasă') && (categorieText.includes('carcasă') || titluText.includes('carcasă'))) matchCategory = true;
                    if (cat.includes('sursă') && (categorieText.includes('sursă') || titluText.includes('sursă'))) matchCategory = true;
                });

                // Verificare producător
                let matchManufacturer = selectedManufacturers.length === 0;
                selectedManufacturers.forEach(man => {
                    if (titluText.includes(man)) matchManufacturer = true;
                });

                // Aplicare afișare
                if (matchPrice && matchCategory && matchManufacturer) {
                    prod.style.display = 'block';
                } else {
                    prod.style.display = 'none';
                }
            });
        });
    }

    // --- 4. ORDONARE PRODUSE ---
    const selectOrdonare = document.querySelector('.custom-select');
    const gridProduse = document.querySelector('.grid-produse');

    if (selectOrdonare && gridProduse) {
        const produseInitiale = Array.from(gridProduse.children);

        selectOrdonare.addEventListener('change', (e) => {
            const optiuneSelectata = e.target.value;
            let produseArray = Array.from(gridProduse.children);

            if (optiuneSelectata === 'Preț: Crescător') {
                produseArray.sort((a, b) => {
                    const pretA = parseInt(a.querySelector('.pret').innerText.replace(/\s/g, '').replace('MDL', ''));
                    const pretB = parseInt(b.querySelector('.pret').innerText.replace(/\s/g, '').replace('MDL', ''));
                    return pretA - pretB;
                });
            } else if (optiuneSelectata === 'Preț: Descrescător') {
                produseArray.sort((a, b) => {
                    const pretA = parseInt(a.querySelector('.pret').innerText.replace(/\s/g, '').replace('MDL', ''));
                    const pretB = parseInt(b.querySelector('.pret').innerText.replace(/\s/g, '').replace('MDL', ''));
                    return pretB - pretA;
                });
            } else {
                produseArray = [...produseInitiale];
            }

            gridProduse.innerHTML = '';
            produseArray.forEach(prod => gridProduse.appendChild(prod));
        });
    }

    // --- 5. BUTOANE ADAUGĂ ÎN COȘ ---
    const btnsAdauga = document.querySelectorAll('.btn-adauga, .buton-cumpara-mare');
    btnsAdauga.forEach(btn => {
        // Excludem butonul de filtre și butonul de contact
        if (!btn.closest('.sidebar-filtre') && !btn.closest('.contact-form')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Produsul a fost adăugat în coș!');
            });
        }
    });

// --- 6. FORMULAR CONTACT (VALIDARE SARCINĂ SUPLIMENTARĂ) ---
    const formularContact = document.getElementById('formular-contact');
    const containerEroare = document.getElementById('mesaj-eroare');

    if (formularContact) {
        formularContact.addEventListener('submit', (e) => {
            const nume = document.getElementById('nume').value.trim();
            const email = document.getElementById('email').value.trim();
            const mesaj = document.getElementById('mesaj').value.trim();
            
            let erori = [];

            // 1. Verificăm dacă sunt completate
            if (nume === '' || email === '' || mesaj === '') {
                erori.push('Toate câmpurile sunt obligatorii.');
            }

            // 2. Verificăm lungimea numelui
            if (nume.length > 0 && nume.length < 3) {
                erori.push('Numele trebuie să aibă cel puțin 3 caractere.');
            }

            // 3. Verificăm formatul de email cu un Regex simplu
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.length > 0 && !regexEmail.test(email)) {
                erori.push('Te rog să introduci o adresă de email validă.');
            }

            // Dacă avem erori, oprim trimiterea formularului spre server
            if (erori.length > 0) {
                e.preventDefault(); // Oprește trimiterea către PHP
                containerEroare.innerHTML = erori.join('<br>');
                containerEroare.style.display = 'block';
            } else {
                // Dacă nu sunt erori, formularul își continuă drumul firesc spre procesare_contact.php
                containerEroare.style.display = 'none';
            }
        });
    }


// Baza de date locală a produselor
const produseDB = [
    { id: 'rtx4060', titlu: 'ASUS Dual GeForce RTX 4060 OC 8GB', pret: '7 600 MDL', img: 'Images/asus.jpg' },
    { id: 'rtx4070', titlu: 'GIGABYTE GeForce RTX 4070 SUPER', pret: '13 500 MDL', img: 'Images/rtx4070.png' },
    { id: 'ryzen7', titlu: 'AMD Ryzen 7 7800X3D', pret: '8 900 MDL', img: 'Images/amdryzen.png' }
    // Adaugă aici restul produselor tale
];

// Live Search (Dropdown în timp ce scrii)
const searchInput = document.querySelector('.bara-cautare input');
const searchContainer = document.querySelector('.bara-cautare');

if (searchInput && searchContainer) {
    let dropdown = document.createElement('div');
    dropdown.className = 'rezultate-cautare';
    searchContainer.appendChild(dropdown);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        dropdown.innerHTML = '';

        if (query.length > 0) {
            const filtered = produseDB.filter(p => p.titlu.toLowerCase().includes(query));
            if (filtered.length > 0) {
                dropdown.style.display = 'flex';
                filtered.forEach(prod => {
                    dropdown.innerHTML += `
                        <a href="produs.html?id=${prod.id}" class="rezultat-item">
                            <img src="${prod.img}" alt="${prod.titlu}">
                            <div>
                                <div style="font-weight: bold; font-size: 14px;">${prod.titlu}</div>
                                <div style="color: #9c27b0; font-size: 12px;">${prod.pret}</div>
                            </div>
                        </a>
                    `;
                });
            } else {
                dropdown.style.display = 'none';
            }
        } else {
            dropdown.style.display = 'none';
        }
    });

    // Ascunde dropdown-ul la click în afară
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) dropdown.style.display = 'none';
    });
}

// Populează dinamic pagina produs.html
if (window.location.pathname.includes('produs.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const produsId = urlParams.get('id'); // Citește ?id=... din link
    
    if (produsId) {
        const produs = produseDB.find(p => p.id === produsId);
        if (produs) {
            // Înlocuiește datele standard cu cele ale produsului accesat
            const titluEl = document.querySelector('.info-detaliata h1');
            const pretEl = document.querySelector('.pret-mare');
            const imgEl = document.querySelector('.galerie-imagini img');
            
            if(titluEl) titluEl.innerText = produs.titlu;
            if(pretEl) pretEl.innerText = produs.pret;
            if(imgEl) imgEl.src = produs.img;
        }
    }
}