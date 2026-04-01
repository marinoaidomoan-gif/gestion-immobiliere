// Variables globales
let dossierHandle = null;
let personnes = [];
let biens = [];
let contrats = [];

// ============ GESTION DES FICHIERS ============
async function ouvrirDossier() {
    try {
        dossierHandle = await window.showDirectoryPicker();
        afficherMessage("✅ Dossier sélectionné avec succès!", "success");
        await actualiserTout();
    } catch (err) {
        afficherMessage("❌ Erreur: " + err.message, "error");
    }
}

async function lireFichier(nom) {
    if (!dossierHandle) return null;
    try {
        const fichierHandle = await dossierHandle.getFileHandle(nom);
        const fichier = await fichierHandle.getFile();
        return await fichier.text();
    } catch (err) {
        return null;
    }
}

async function ecrireFichier(nom, contenu) {
    if (!dossierHandle) return false;
    try {
        const fichierHandle = await dossierHandle.getFileHandle(nom, { create: true });
        const writable = await fichierHandle.createWritable();
        await writable.write(contenu);
        await writable.close();
        return true;
    } catch (err) {
        console.error("Erreur écriture:", err);
        return false;
    }
}

// ============ LECTURE DES DONNÉES ============
async function lirePersonnes() {
    const contenu = await lireFichier('personne.txt');
    if (!contenu) return [];
    
    const liste = [];
    const lignes = contenu.split('\n');
    
    for (let i = 0; i < lignes.length; i++) {
        if (lignes[i].includes('---Personne---')) {
            i++;
            if (i < lignes.length && lignes[i].trim()) {
                const parties = lignes[i].split('\t');
                if (parties.length >= 5) {
                    liste.push({
                        id: parties[0],
                        nom: parties[1],
                        prenom: parties[2],
                        telephone: parties[3],
                        type: parties[4] === 'P' ? 'Propriétaire' : 'Locataire'
                    });
                }
            }
        }
    }
    return liste;
}

async function lireBiens() {
    const contenu = await lireFichier('BienImmobiliers.txt');
    if (!contenu) return [];
    
    const liste = [];
    const lignes = contenu.split('\n');
    
    for (let i = 0; i < lignes.length; i++) {
        if (lignes[i].includes('---Bien Immobilier---')) {
            i++;
            if (i < lignes.length && lignes[i].trim()) {
                const parties = lignes[i].split('\t');
                if (parties.length >= 8) {
                    liste.push({
                        idBien: parties[0],
                        adresse: parties[1],
                        ville: parties[2],
                        type: parties[3],
                        surface: parseFloat(parties[4]),
                        nbPieces: parseInt(parties[5]),
                        prixLocation: parseFloat(parties[6]),
                        idPro: parties[7]
                    });
                }
            }
        }
    }
    return liste;
}

async function lireContrats() {
    const contenu = await lireFichier('ContratLocation.txt');
    if (!contenu) return [];
    
    const liste = [];
    const lignes = contenu.split('\n');
    let contrat = {};
    
    for (let i = 0; i < lignes.length; i++) {
        const ligne = lignes[i].trim();
        if (ligne.includes('ID Contrat:')) {
            contrat.idConLo = ligne.split(':')[1].trim();
        } else if (ligne.includes('ID Bien:')) {
            contrat.idBien = ligne.split(':')[1].trim();
        } else if (ligne.includes('ID Locataire:')) {
            contrat.idLoc = ligne.split(':')[1].trim();
        } else if (ligne.includes('Date Debut:')) {
            contrat.dateDeb = ligne.split(':')[1].trim();
        } else if (ligne.includes('Date Fin:')) {
            contrat.dateFin = ligne.split(':')[1].trim();
        } else if (ligne.includes('Loyer Mensuel:')) {
            contrat.loyerMensuel = parseFloat(ligne.split(':')[1].trim());
            liste.push({...contrat});
            contrat = {};
        }
    }
    return liste;
}

// ============ ÉCRITURE DES DONNÉES ============
async function ecrirePersonnes() {
    let contenu = "";
    for (const p of personnes) {
        const typeCode = p.type === 'Propriétaire' ? 'P' : 'L';
        contenu += "---Personne---\n";
        contenu += `${p.id}\t${p.nom}\t${p.prenom}\t${p.telephone}\t${typeCode}\n\n`;
    }
    return await ecrireFichier('personne.txt', contenu);
}

async function ecrireBiens() {
    let contenu = "";
    for (const b of biens) {
        contenu += "---Bien Immobilier---\n";
        contenu += `${b.idBien}\t${b.adresse}\t${b.ville}\t${b.type}\t${b.surface}\t${b.nbPieces}\t${b.prixLocation}\t${b.idPro}\n\n`;
    }
    return await ecrireFichier('BienImmobiliers.txt', contenu);
}

async function ecrireContrats() {
    let contenu = "";
    for (const c of contrats) {
        contenu += "Contrat de Location\n";
        contenu += "-------------------\n";
        contenu += `ID Contrat: ${c.idConLo}\n`;
        contenu += `ID Bien: ${c.idBien}\n`;
        contenu += `ID Locataire: ${c.idLoc}\n`;
        contenu += `Date Debut: ${c.dateDeb}\n`;
        contenu += `Date Fin: ${c.dateFin}\n`;
        contenu += `Loyer Mensuel: ${c.loyerMensuel}\n`;
        contenu += `Caution: ${c.caution}\n\n`;
    }
    return await ecrireFichier('ContratLocation.txt', contenu);
}

// ============ ACTUALISATION ============
async function actualiserTout() {
    if (!dossierHandle) {
        afficherMessage("Sélectionne d'abord un dossier avec 'Choisir dossier'", "error");
        return;
    }
    
    personnes = await lirePersonnes();
    biens = await lireBiens();
    contrats = await lireContrats();
    
    afficherMessage(`✅ Chargé: ${personnes.length} personnes, ${biens.length} biens, ${contrats.length} contrats`, "success");
    afficherResultat(`📁 Données chargées depuis le dossier!\n\n👥 Personnes: ${personnes.length}\n🏠 Biens: ${biens.length}\n📄 Contrats: ${contrats.length}`);
}

async function sauvegarderTout() {
    if (!dossierHandle) {
        afficherMessage("Sélectionne d'abord un dossier!", "error");
        return;
    }
    
    const ok1 = await ecrirePersonnes();
    const ok2 = await ecrireBiens();
    const ok3 = await ecrireContrats();
    
    if (ok1 && ok2 && ok3) {
        afficherMessage("✅ Toutes les données sauvegardées dans les fichiers!", "success");
        afficherResultat("💾 Sauvegarde effectuée avec succès!");
    } else {
        afficherMessage("❌ Erreur lors de la sauvegarde", "error");
    }
}

// ============ FONCTIONS MÉTIER ============
function ajouterPersonne(id, nom, prenom, tel, type) {
    if (personnes.find(p => p.id === id)) {
        return { success: false, msg: `❌ L'ID ${id} existe déjà!` };
    }
    personnes.push({ id, nom, prenom, telephone: tel, type });
    sauvegarderTout();
    return { success: true, msg: `✅ Personne ${id} ajoutée avec succès!` };
}

function ajouterBien(id, adresse, ville, type, surface, pieces, prix, idPro) {
    if (biens.find(b => b.idBien === id)) {
        return { success: false, msg: `❌ L'ID bien ${id} existe déjà!` };
    }
    if (!personnes.find(p => p.id === idPro && p.type === 'Propriétaire')) {
        return { success: false, msg: `❌ Propriétaire ${idPro} introuvable!` };
    }
    biens.push({ idBien: id, adresse, ville, type, surface: parseFloat(surface), 
                nbPieces: parseInt(pieces), prixLocation: parseFloat(prix), idPro });
    sauvegarderTout();
    return { success: true, msg: `✅ Bien ${id} ajouté avec succès!` };
}

function ajouterContrat(id, idBien, idLoc, dateDeb, dateFin, loyer, caution) {
    if (contrats.find(c => c.idConLo === id)) {
        return { success: false, msg: `❌ L'ID contrat ${id} existe déjà!` };
    }
    if (!biens.find(b => b.idBien === idBien)) {
        return { success: false, msg: `❌ Bien ${idBien} introuvable!` };
    }
    if (!personnes.find(p => p.id === idLoc && p.type === 'Locataire')) {
        return { success: false, msg: `❌ Locataire ${idLoc} introuvable!` };
    }
    contrats.push({ idConLo: id, idBien, idLoc, dateDeb, dateFin, 
                   loyerMensuel: parseFloat(loyer), caution: parseFloat(caution) });
    sauvegarderTout();
    return { success: true, msg: `✅ Contrat ${id} ajouté avec succès!` };
}

function supprimerPersonne(id) {
    const index = personnes.findIndex(p => p.id === id);
    if (index === -1) return { success: false, msg: `❌ Personne ${id} introuvable!` };
    personnes.splice(index, 1);
    sauvegarderTout();
    return { success: true, msg: `✅ Personne ${id} supprimée!` };
}

function supprimerBien(id) {
    const index = biens.findIndex(b => b.idBien === id);
    if (index === -1) return { success: false, msg: `❌ Bien ${id} introuvable!` };
    biens.splice(index, 1);
    sauvegarderTout();
    return { success: true, msg: `✅ Bien ${id} supprimé!` };
}

function supprimerContrat(id) {
    const index = contrats.findIndex(c => c.idConLo === id);
    if (index === -1) return { success: false, msg: `❌ Contrat ${id} introuvable!` };
    contrats.splice(index, 1);
    sauvegarderTout();
    return { success: true, msg: `✅ Contrat ${id} supprimé!` };
}

// ============ AFFICHAGE ============
function showSection(section) {
    const content = document.getElementById('dynamicContent');
    
    const forms = {
        personne: `
            <div class="form-section">
                <h3>➕ Ajouter une Personne</h3>
                <div class="form-group"><label>Type:</label><select id="type"><option value="P">Propriétaire</option><option value="L">Locataire</option></select></div>
                <div class="form-group"><label>Numéro (3 chiffres):</label><input type="text" id="numero" maxlength="3" placeholder="001"></div>
                <div class="form-group"><label>Nom:</label><input type="text" id="nom" placeholder="Dupont"></div>
                <div class="form-group"><label>Prénom:</label><input type="text" id="prenom" placeholder="Jean"></div>
                <div class="form-group"><label>Téléphone:</label><input type="text" id="tel" placeholder="0612345678"></div>
                <button onclick="execAjoutPersonne()">✅ Enregistrer</button>
            </div>
        `,
        bien: `
            <div class="form-section">
                <h3>🏠 Ajouter un Bien</h3>
                <div class="form-group"><label>ID (Bxxx):</label><input type="text" id="idBien" placeholder="B001"></div>
                <div class="form-group"><label>Adresse:</label><input type="text" id="adresse" placeholder="12 rue de Paris"></div>
                <div class="form-group"><label>Ville:</label><input type="text" id="ville" placeholder="Paris"></div>
                <div class="form-group"><label>Type:</label><input type="text" id="typeBien" placeholder="Appartement"></div>
                <div class="form-group"><label>Surface (m²):</label><input type="number" id="surface" step="0.01"></div>
                <div class="form-group"><label>Pièces:</label><input type="number" id="pieces"></div>
                <div class="form-group"><label>Prix Location (€):</label><input type="number" id="prix" step="0.01"></div>
                <div class="form-group"><label>ID Propriétaire (Pxxx):</label><input type="text" id="idPro" placeholder="P001"></div>
                <button onclick="execAjoutBien()">✅ Enregistrer</button>
            </div>
        `,
        contrat: `
            <div class="form-section">
                <h3>📄 Ajouter un Contrat</h3>
                <div class="form-group"><label>ID (Cxxx):</label><input type="text" id="idContrat" placeholder="C001"></div>
                <div class="form-group"><label>ID Bien:</label><input type="text" id="idBienContrat" placeholder="B001"></div>
                <div class="form-group"><label>ID Locataire:</label><input type="text" id="idLocContrat" placeholder="L001"></div>
                <div class="form-group"><label>Date Début:</label><input type="text" id="dateDeb" placeholder="01/01/2024"></div>
                <div class="form-group"><label>Date Fin:</label><input type="text" id="dateFin" placeholder="31/12/2024"></div>
                <div class="form-group"><label>Loyer (€):</label><input type="number" id="loyer" step="0.01"></div>
                <div class="form-group"><label>Caution (€):</label><input type="number" id="caution" step="0.01"></div>
                <button onclick="execAjoutContrat()">✅ Enregistrer</button>
            </div>
        `,
        search_personne: `
            <div class="form-section">
                <h3>🔍 Rechercher une Personne</h3>
                <div class="form-group"><label>ID:</label><input type="text" id="searchId" placeholder="P001"></div>
                <button onclick="rechercherPersonne()">🔍 Rechercher</button>
            </div>
        `,
        delete_personne: `
            <div class="form-section">
                <h3>🗑️ Supprimer une Personne</h3>
                <div class="form-group"><label>ID:</label><input type="text" id="deleteId" placeholder="P001"></div>
                <button class="btn-danger" onclick="execSupprimerPersonne()">🗑️ Supprimer</button>
            </div>
        `
    };
    
    if (forms[section]) {
        content.innerHTML = forms[section];
    } else if (section === 'list_personnes') {
        let html = '<h3>👥 Liste des Personnes</h3>';
        if (personnes.length === 0) html += '<p>Aucune personne enregistrée.</p>';
        else {
            html += '<div class="table-container"><table><thead><tr><th>ID</th><th>Nom</th><th>Prénom</th><th>Téléphone</th><th>Type</th></tr></thead><tbody>';
            personnes.forEach(p => {
                html += `<tr><td>${p.id}</td><td>${p.nom}</td><td>${p.prenom}</td><td>${p.telephone}</td><td>${p.type}</td></tr>`;
            });
            html += '</tbody></table></div>';
        }
        content.innerHTML = html;
    } else if (section === 'list_biens') {
        let html = '<h3>🏠 Liste des Biens</h3>';
        if (biens.length === 0) html += '<p>Aucun bien enregistré.</p>';
        else {
            html += '<div class="table-container"><table><thead><tr><th>ID</th><th>Adresse</th><th>Ville</th><th>Surface</th><th>Pièces</th><th>Prix</th><th>Propriétaire</th></tr></thead><tbody>';
            biens.forEach(b => {
                html += `<tr><td>${b.idBien}</td><td>${b.adresse}</td><td>${b.ville}</td><td>${b.surface}m²</td><td>${b.nbPieces}</td><td>${b.prixLocation}€</td><td>${b.idPro}</td></tr>`;
            });
            html += '</tbody></table></div>';
        }
        content.innerHTML = html;
    } else if (section === 'list_contrats') {
        let html = '<h3>📄 Liste des Contrats</h3>';
        if (contrats.length === 0) html += '<p>Aucun contrat enregistré.</p>';
        else {
            html += '<div class="table-container"><table><thead><tr><th>ID Contrat</th><th>ID Bien</th><th>ID Locataire</th><th>Début</th><th>Fin</th><th>Loyer</th></tr></thead><tbody>';
            contrats.forEach(c => {
                html += `<tr><td>${c.idConLo}</td><td>${c.idBien}</td><td>${c.idLoc}</td><td>${c.dateDeb}</td><td>${c.dateFin}</td><td>${c.loyerMensuel}€</td></tr>`;
            });
            html += '</tbody></table></div>';
        }
        content.innerHTML = html;
    }
}

// ============ EXÉCUTEURS ============
function execAjoutPersonne() {
    const type = document.getElementById('type').value;
    const numero = document.getElementById('numero').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const tel = document.getElementById('tel').value;
    const id = type + numero.padStart(3, '0');
    
    const resultat = ajouterPersonne(id, nom, prenom, tel, type === 'P' ? 'Propriétaire' : 'Locataire');
    afficherResultat(resultat.msg);
    afficherMessage(resultat.msg, resultat.success ? 'success' : 'error');
}

function execAjoutBien() {
    const id = document.getElementById('idBien').value;
    const adresse = document.getElementById('adresse').value;
    const ville = document.getElementById('ville').value;
    const type = document.getElementById('typeBien').value;
    const surface = document.getElementById('surface').value;
    const pieces = document.getElementById('pieces').value;
    const prix = document.getElementById('prix').value;
    const idPro = document.getElementById('idPro').value;
    
    const resultat = ajouterBien(id, adresse, ville, type, surface, pieces, prix, idPro);
    afficherResultat(resultat.msg);
    afficherMessage(resultat.msg, resultat.success ? 'success' : 'error');
}

function execAjoutContrat() {
    const id = document.getElementById('idContrat').value;
    const idBien = document.getElementById('idBienContrat').value;
    const idLoc = document.getElementById('idLocContrat').value;
    const dateDeb = document.getElementById('dateDeb').value;
    const dateFin = document.getElementById('dateFin').value;
    const loyer = document.getElementById('loyer').value;
    const caution = document.getElementById('caution').value;
    
    const resultat = ajouterContrat(id, idBien, idLoc, dateDeb, dateFin, loyer, caution);
    afficherResultat(resultat.msg);
    afficherMessage(resultat.msg, resultat.success ? 'success' : 'error');
}

function rechercherPersonne() {
    const id = document.getElementById('searchId').value;
    const p = personnes.find(p => p.id === id);
    if (p) {
        afficherResultat(`🔍 PERSONNE TROUVÉE\n━━━━━━━━━━━━━━━━━━━━\nID: ${p.id}\nNom: ${p.nom}\nPrénom: ${p.prenom}\nTéléphone: ${p.telephone}\nType: ${p.type}`);
    } else {
        afficherResultat(`❌ Personne avec l'ID "${id}" introuvable!`);
    }
}

function execSupprimerPersonne() {
    const id = document.getElementById('deleteId').value;
    const resultat = supprimerPersonne(id);
    afficherResultat(resultat.msg);
    afficherMessage(resultat.msg, resultat.success ? 'success' : 'error');
}

function afficherMessage(msg, type) {
    const status = document.getElementById('status');
    status.className = `status ${type}`;
    status.innerHTML = msg;
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 3000);
}

function afficherResultat(msg) {
    document.getElementById('resultat').innerHTML = msg.replace(/\n/g, '<br>');
}