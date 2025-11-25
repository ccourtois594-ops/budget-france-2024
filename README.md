# 🇫🇷 ÉcoBudget France 2024

Visualisation interactive et pédagogique du Budget de l'État Français 2024. Ce projet utilise un diagramme de Sankey à 5 niveaux pour tracer les flux financiers, des recettes jusqu'au détail précis des dépenses, assisté par une IA (Gemini) pour répondre aux questions des utilisateurs.

![Aperçu de l'application](https://via.placeholder.com/800x400?text=EcoBudget+Preview)

## ✨ Fonctionnalités

- **Diagramme Sankey Interactif** : 
  - 5 Niveaux de profondeur : Recettes → Budget Central → Missions → Nature → Détail.
  - Zoom & Panoramique intégrés.
  - Tooltips détaillés.
- **Assistant IA** : Chatbot intégré alimenté par **Google Gemini 2.5** pour expliquer les chiffres et contextes budgétaires.
- **Données Réelles** : Basé sur les chiffres du Projet de Loi de Finances (PLF) 2024.
- **Interface Moderne** : React, Tailwind CSS, Recharts, Lucide Icons.

## 🛠️ Prérequis

- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- Une clé API Google Gemini (AI Studio)

## 🚀 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/ccourtois594-ops/budget-france-2024.git
   cd ecobudget-france-2024
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   
   Créez un fichier `.env` à la racine du projet pour stocker votre clé API Gemini :
   
   ```bash
   # .env
   API_KEY=votre_clé_api_google_ici
   ```

   > ⚠️ **Important** : Ne committez jamais votre fichier `.env` sur GitHub.

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`.

## 📦 Déploiement sur Serveur

Pour mettre l'application en production sur un serveur (Nginx, Apache, Vercel, Netlify...) :

1. **Construire l'application**
   ```bash
   npm run build
   ```
   Cette commande va générer un dossier `dist/` contenant les fichiers statiques optimisés (HTML, CSS, JS).

2. **Servir les fichiers**
   
   Copiez le contenu du dossier `dist/` sur votre serveur web.
   
   *Exemple de configuration Nginx basique :*
   ```nginx
   server {
       listen 80;
       server_name mon-budget.fr;
       root /var/www/ecobudget/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## 📂 Structure du Projet

- `/components` : Composants React (Graphique Sankey, Chat Interface).
- `/data` : Données statiques du budget (`budget2024.ts`).
- `/services` : Logique d'appel à l'API Gemini.
- `/types` : Définitions TypeScript.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une *Issue* ou une *Pull Request* pour améliorer la précision des données budgétaires ou les fonctionnalités.

## 📄 Licence

MIT
