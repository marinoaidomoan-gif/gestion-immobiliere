# 🏠 Système de Gestion Immobilière

![Version](https://img.shields.io/badge/version-1.0-blue)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

## 📋 Description

Application web de gestion immobilière permettant de gérer :
- **Propriétaires et locataires** (Personnes)
- **Biens immobiliers** (Appartements, maisons, etc.)
- **Contrats de location**

L'application fonctionne entièrement dans le navigateur et se connecte directement à vos fichiers `.txt` existants.

## 🚀 Accéder à l'application

👉 **[Cliquez ici pour utiliser l'application](https://marinoaidomoan-gif.github.io/gestion-immobiliere/)** 👈

## ✨ Fonctionnalités

### Personnes
- ➕ Ajouter un propriétaire ou locataire
- 👥 Lister toutes les personnes
- 🔍 Rechercher par ID (P001, L002...)
- 🗑️ Supprimer une personne

### Biens Immobiliers
- ➕ Ajouter un bien (B001, B002...)
- 🏠 Lister tous les biens
- 🔍 Rechercher un bien par ID
- 🗑️ Supprimer un bien

### Contrats de Location
- ➕ Ajouter un contrat (C001, C002...)
- 📄 Lister tous les contrats
- 🔍 Rechercher un contrat par ID
- 🗑️ Supprimer un contrat

## 📖 Comment utiliser

1. **Ouvrir l'application** : [https://marinoaidomoan-gif.github.io/gestion-immobiliere/](https://marinoaidomoan-gif.github.io/gestion-immobiliere/)
2. **Choisir le dossier** contenant vos fichiers :
   - `personne.txt`
   - `BienImmobiliers.txt`
   - `ContratLocation.txt`
3. **Cliquer sur "Actualiser"** pour charger les données
4. **Utiliser le menu** pour gérer vos données

## 📁 Format des fichiers

L'application utilise exactement le même format que votre programme C++ :

### personne.txt
---Personne---
P001 Dupont Jean 0612345678 P

---Personne---
L001 Martin Marie 0698765432 L

text

### BienImmobiliers.txt
---Bien Immobilier---
B001 12 rue de Paris Paris Appartement 75.5 3 850 P001

text

### ContratLocation.txt
Contrat de Location

ID Contrat: C001
ID Bien: B001
ID Locataire: L001
Date Debut: 01/01/2024
Date Fin: 31/12/2024
Loyer Mensuel: 850
Caution: 850

text

## 🔧 Formats des ID

| Type | Format | Exemple |
|------|--------|---------|
| Propriétaire | P + 3 chiffres | P001 |
| Locataire | L + 3 chiffres | L001 |
| Bien | B + 3 chiffres | B001 |
| Contrat | C + 3 chiffres | C001 |

## 💻 Technologies utilisées

- **HTML5** - Structure
- **CSS3** - Design et animations
- **JavaScript** - Logique métier
- **File System Access API** - Lecture/écriture des fichiers

## ✅ Avantages

- 🔓 **Gratuit** - Hébergé sur GitHub Pages
- 🌍 **Accessible** - De n'importe où, n'importe quand
- 🔒 **Sécurisé** - Vos fichiers restent sur votre ordinateur
- 📱 **Responsive** - Fonctionne sur ordinateur, tablette et mobile
- 💾 **Sauvegarde** - Modifie directement vos fichiers .txt

## 📱 Compatibilité

| Navigateur | Compatibilité |
|------------|---------------|
| Chrome / Edge | ✅ Parfait |
| Firefox | ✅ Bon |
| Safari | ⚠️ Limitations |

## 👨‍💻 Auteur

**Marino** - Projet de gestion immobilière

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

⭐ **N'hésitez pas à mettre une étoile si ce projet vous est utile !**

L'application utilise exactement le même format que votre programme C++ :
