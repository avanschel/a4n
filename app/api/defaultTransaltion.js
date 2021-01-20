const loginScreen = [
    {
        "lang_id": "fr",
        "screen_id": "login-screen",
        "text_id": "username-placeholder",
        "text_title": "Entrez votre identifiant / champ requis"
    },
    {
        "lang_id": "fr",
        "screen_id": "login-screen",
        "text_id": "password-placeholder",
        "text_title": "Entrez votre mot de passe / champ requis"
    },
    {
        "lang_id": "fr",
        "screen_id": "login-screen",
        "text_id": "server-placeholder",
        "text_title": "Entrez l'url du serveur / champ requis"
    },
    {
        "lang_id": "fr",
        "screen_id": "login-screen",
        "text_id": "btn-label",
        "text_title": "Connexion"
    },
]
const configScreen = [
    {
        "lang_id": "fr",
        "screen_id": "config-screen",
        "text_id": "server",
        "text_title": "Serveur"
    },
    {
        "lang_id": "fr",
        "screen_id": "config-screen",
        "text_id": "user",
        "text_title": "Utilisateur"
    },
    {
        "lang_id": "fr",
        "screen_id": "config-screen",
        "text_id": "device-id",
        "text_title": "Id de l'appareil"
    },
    {
        "lang_id": "fr",
        "screen_id": "config-screen",
        "text_id": "device-name",
        "text_title": "Nom de l'appareil"
    },
    {
        "lang_id": "fr",
        "screen_id": "config-screen",
        "text_id": "application-version",
        "text_title": "Version de l'application"
    }];
const chooseTableScreen = [
    {
        "lang_id": "fr",
        "screen_id": "choose-table-screen",
        "text_id": "no-data",
        "text_title": "Aucune table, cliquez ici pour raffraichir la liste"
    },
    {
        "lang_id": "fr",
        "screen_id": "choose-table-screen",
        "text_id": "element",
        "text_title": "element"
    },
    {
        "lang_id": "fr",
        "screen_id": "choose-table-screen",
        "text_id": "elements",
        "text_title": "elements"
    },
    {
        "lang_id": "fr",
        "screen_id": "choose-table-screen",
        "text_id": "choose-table",
        "text_title": "CHOIX DE LA TABLE"
    }
]
const dataScreen = [
    {
        "lang_id": "fr",
        "screen_id": "data-screen",
        "text_id": "loading-message",
        "text_title": "Récuperation des tables"
    },
    {
        "lang_id": "fr",
        "screen_id": "data-screen",
        "text_id": "please-wait",
        "text_title": "Veuillez patienter"
    },
    {
        "lang_id": "fr",
        "screen_id": "data-screen",
        "text_id": "choose-table",
        "text_title": "CHOIX DE LA TABLE"
    }
]
const importScreen = [
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "import",
        "text_title": "Import"
    },
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "export",
        "text_title": "Export"
    },
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "import-data",
        "text_title": "IMPORT DATA"
    },
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "export-data",
        "text_title": "EXPORT DATA"
    },
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "confirming",
        "text_title": "Merci de confirmer"
    },
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "error-title",
        "text_title": "Erreur de connection"
    },
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "error-content",
        "text_title": "Pas de connection internet"
    },
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "ok",
        "text_title": "Ok"
    },
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "cancel",
        "text_title": "Annuler"
    },
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "export-warning",
        "text_title": "En cliquant sur export, les données actuelles sur l'appareil seront effacées"
    },
    {
        "lang_id": "fr",
        "screen_id": "import-screen",
        "text_id": "import-warning",
        "text_title": "En cliquant sur import, les données actuelles sur l'appareil seront effacées"
    }

];
const generalScreen = [
    {
        "lang_id": "fr",
        "screen_id": "general-screen",
        "text_id": "db-init",
        "text_title": "Initialisation db"
    },
    {
        "lang_id": "fr",
        "screen_id": "general-screen",
        "text_id": "wait",
        "text_title": "Veuillez patienter"
    }
]
export const defaultTranslation = loginScreen.concat(configScreen).concat(chooseTableScreen).concat(dataScreen).concat(importScreen).concat(generalScreen);