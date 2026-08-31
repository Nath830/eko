# Eko

**Voir l'application : https://nath830.github.io/eko/**

Prototype de démonstration d'une messagerie unifiée doublée d'un assistant :
Gmail, WhatsApp, Slack, LinkedIn, Instagram et Teams réunis au même endroit.

Le prototype doit **paraître pleinement fonctionnel sans l'être**. Aucun serveur,
aucune API, aucune authentification, aucun appel à un modèle d'IA : toutes les
données et toutes les réponses « IA » sont écrites à la main dans `/src/data/`.
Les générations s'affichent après un délai simulé de 600 à 1200 ms suivi d'une
apparition progressive — sans cette latence, l'effet ne fonctionne pas.

Le site se republie tout seul à chaque envoi sur `main`.

## Lancer le prototype

```bash
npm install     # une seule fois
npm run dev     # puis ouvrir http://localhost:5173
```

## Les fichiers de contenu

| Fichier | Contenu |
| --- | --- |
| `src/data/conversations.ts` | Les 15 conversations et leurs ~170 messages |
| `src/data/contacts.ts` | Les 7 contacts et leur résumé Eko |
| `src/data/dossiers.ts` | Les points complets sur un sujet, rédigés par Eko |
| `src/data/summaries.ts` | Le résumé transversal d'un contact |
| `src/data/replies.ts` | Les brouillons de réponse, deux séries par conversation |
| `src/data/alerts.ts` | Alertes, déclenchements et séquences de démonstration |
| `src/data/naturalQueries.ts` | Les questions en langage naturel reconnues |
| `src/data/briefs.ts` | Les récaps de l'assistant : priorités, derniers messages, point du jour |
| `src/data/calendar.ts` | Événements Google simulés et rendez-vous détectés |
| `src/data/notes.ts` | Notes libres et notes liées |
| `src/data/labels.ts` | Étiquettes automatiques et manuelles |
| `src/config/platforms.tsx` | Les 6 plateformes : nom, couleur, logo, ton, vocaux |
| `src/config/navigation.tsx` | Les espaces du rail de navigation |
| `src/index.css` | Le thème |

Ajouter une plateforme = une entrée dans `platforms.tsx`.
Ajouter un espace = une entrée dans `navigation.tsx` + une route dans `App.tsx`.

## Conduire une démonstration

1. **Réception** — la liste unifiée ; chaque ligne porte un aperçu rédigé par Eko.
2. **Julien Meyer sur WhatsApp** — le vocal de 1 min 40 avec sa transcription,
   la proposition de rendez-vous et les créneaux libres.
3. **« où en est le projet Vertex ? »** — Eko rédige le dossier complet en
   recousant Gmail, WhatsApp, LinkedIn, Slack et Instagram.
4. **Les brouillons** sous la barre de saisie, et « Régénérer ».
5. **La recherche** — tapez « la discussion où on parlait du budget du projet
   Vertex » ou « qui attend une réponse de moi ? ».
6. **L'assistant** — « quelles sont mes priorités pour le reste de la journée ? »,
   « fais-moi un récap », « mes alertes », « préviens-moi si… », « mets un rdv
   avec Julien jeudi 14h ». Alertes et debrief se passent entièrement ici.
7. **Le déclencheur** — dans les Réglages, les boutons de séquence font arriver
   un message correspondant à une alerte, avec notification. C'est le moment fort.
8. **Contacts → Julien Meyer** — « Où en est-on avec Julien ? » : le résumé
   transversal, avec la source de chaque élément.
9. **Calendrier** — « Connecter Google Calendar », puis accepter la proposition.
10. **Réglages** — « Réinitialiser la démo » entre deux présentations.

## Conventions

- Tout contenu produit par Eko est marqué visuellement : violet, pastille
  « Eko », étincelle. L'utilisateur doit toujours savoir ce qui vient de l'IA.
- Aucun bouton n'est inerte : ce qui sort du périmètre affiche une notification.
- Les horodatages sont relatifs à l'instant présent : la démo paraît toujours
  actuelle.
- L'état est local et en mémoire ; recharger la page repart de zéro.
