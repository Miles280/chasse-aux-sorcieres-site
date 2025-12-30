## 🏰 Chasse aux Sorcières — Site Web

Frontend officiel du projet, développé avec **Angular 18**.
Il permet de présenter l’univers du jeu, ses règles, son lore et (à terme) un espace utilisateur interactif.

---

### 🖥️ Développement local

```bash
npm install
ng serve
```

Le site est alors accessible en mode développement.

---

### 🌍 Production

* Le site est buildé et servi via **Nginx**
* Hébergé dans un conteneur Docker
* Accessible à l’adresse officielle :

👉 **[https://chasse-aux-sorcieres.fr](https://chasse-aux-sorcieres.fr)**

---

### 🏗️ Build & Optimisation

Le build est optimisé grâce à un fichier `.dockerignore` afin de :

* limiter la consommation mémoire
* éviter la saturation de la RAM du VPS lors des déploiements
