#TP Cordova Hmin303

## Auteurs
Carmona Anthony & Pyz Maxime

## Installation
```bash
cordova install
cordova run android
```

## Fonctionnalités

 - Ajouter un évênement (les champs disponibles sont : date, temps, titre, description, localisation, photo)
 - Rechercher un évênement.
 - Déclenchement d'une notification.
 - Regarder le descriptif d'un évênement.
 - Commencer une acitivité sportive.
 - Activité sportive:  Un chronomètre ainsi qu'un calcul de distance parcouru, et de vitesse moyenne.
 - Création d'un service background pour l'activité sportive pour mettre en veille le portable et continuer de faire avancer le chronomètre.

## Elements techniques
 - Utilisation d'un framework css pour l'affichage : materialize-css
 - Utilisation d'un plugin pour les notifications : https://github.com/katzer/cordova-plugin-local-notifications
 - Utilisation d'un plugin pour le service background : https://github.com/katzer/cordova-plugin-background-mode
