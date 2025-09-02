# Presence Tracker

Presence Tracker est une application web simple qui permet aux membres d'une équipe de déclarer leurs présences pour la semaine et de voir qui d'autre est présent chaque jour. L'application utilise l'authentification Google Workspace (SSO) et stocke toutes les données directement dans un Google Sheet, sans nécessiter de backend dédié.

## Fonctionnalités

*   **Authentification Sécurisée** : Connexion obligatoire via Google Workspace (OAuth 2.0).
*   **Gestion des Présences** : Chaque utilisateur peut marquer sa présence ou son absence pour chaque jour de la semaine.
*   **Vue Hebdomadaire** : Un sélecteur de semaine permet de naviguer facilement dans le temps.
*   **Récapitulatif d'Équipe** : Une vue "Qui est là ?" affiche la liste des personnes présentes pour chaque jour de la semaine sélectionnée.
*   **Sauvegarde Automatique** : Les données sont lues et écrites en temps réel dans un Google Sheet.

## Stack Technique

*   **Framework** : React (avec Vite)
*   **Langage** : TypeScript
*   **Style** : Tailwind CSS
*   **Composants UI** : shadcn/ui
*   **Routing** : TanStack Router
*   **API** : Google Sheets API v4

---

## Configuration

Pour faire fonctionner ce projet en local, vous devez configurer un projet sur la Google Cloud Platform et créer un Google Sheet pour stocker les données.

### 1. Configuration du Google Sheet

1.  **Créez un nouveau Google Sheet** : [sheets.new](https://sheets.new).
2.  **Nommez le fichier** `PresenceTracker`.
3.  **Nommez le premier onglet** (en bas) `Presences`.
4.  **Configurez les colonnes** dans la première ligne, dans cet ordre exact :
    *   `A1`: `WeekNumber`
    *   `B1`: `Date`
    *   `C1`: `UserEmail`
    *   `D1`: `Presence`
5.  **Récupérez l'ID du Sheet** : Dans l'URL de votre sheet (`https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit`), copiez la longue chaîne de caractères. Vous en aurez besoin pour les variables d'environnement.

### 2. Configuration du Projet Google Cloud

1.  **Accédez à la Google Cloud Console** : [console.cloud.google.com](https://console.cloud.google.com).
2.  **Créez un nouveau projet** ou sélectionnez-en un existant.
3.  **Activez l'API Google Sheets** :
    *   Dans le menu de navigation, allez à `APIs & Services > Library`.
    *   Recherchez "Google Sheets API" et activez-la.
4.  **Configurez l'écran de consentement OAuth** :
    *   Allez à `APIs & Services > OAuth consent screen`.
    *   Choisissez `Internal` si tous vos utilisateurs font partie de votre organisation Google Workspace, sinon choisissez `External`.
    *   Remplissez les informations requises (nom de l'application, email de support).
    *   Ajoutez les scopes `.../auth/userinfo.email` et `.../auth/userinfo.profile`. Assurez-vous que le scope `.../auth/spreadsheets` est également disponible si vous rencontrez des problèmes de permissions plus tard.
5.  **Créez un ID Client OAuth 2.0** :
    *   Allez à `APIs & Services > Credentials`.
    *   Cliquez sur `+ CREATE CREDENTIALS` et choisissez `OAuth client ID`.
    *   Sélectionnez `Web application` comme type d'application.
    *   Donnez-lui un nom (ex: "Presence Tracker Client").
    *   Dans `Authorized JavaScript origins`, ajoutez l'URL de votre environnement de développement (ex: `http://localhost:5173`).
    *   Dans `Authorized redirect URIs`, ajoutez également cette URL.
    *   Cliquez sur `Create`. Une fenêtre apparaîtra avec votre **Client ID**. Copiez-le.

6.  **Créez une Clé d'API (pour la lecture)** :
    *   Toujours dans `APIs & Services > Credentials`, cliquez sur `+ CREATE CREDENTIALS` et choisissez `API key`.
    *   Copiez la clé qui est générée. Il est recommandé de restreindre cette clé pour qu'elle ne puisse être utilisée que pour l'API Google Sheets et depuis votre URL d'application, mais pour un test rapide, ce n'est pas obligatoire.

### 3. Variables d'Environnement

1.  À la racine du projet, copiez le fichier `.env.example` et renommez la copie en `.env`.
    ```bash
    cp .env.example .env
    ```
2.  Ouvrez le fichier `.env` et remplissez les variables avec les informations que vous avez récupérées :
    ```
    VITE_GOOGLE_CLIENT_ID="VOTRE_CLIENT_ID_GOOGLE_ICI"
    VITE_GOOGLE_SHEET_ID="VOTRE_ID_DE_GOOGLE_SHEET_ICI"
    VITE_GOOGLE_API_KEY="VOTRE_CLE_API_GOOGLE_ICI"
    ```

---

## Lancement en Local

Une fois la configuration terminée, vous pouvez lancer le projet.

1.  **Installez les dépendances** :
    ```bash
    npm install
    ```
2.  **Lancez le serveur de développement** :
    ```bash
    npm run dev
    ```

L'application devrait maintenant être accessible à l'adresse `http://localhost:5173` (ou un autre port si celui-ci est déjà utilisé).
