# ÉTAPE 1 : Le Builder
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# ON FORCE LE CHEMIN DE SORTIE ICI
RUN npx ng build --output-path=dist

# ÉTAPE 2 : Le Serveur
FROM nginx:alpine

# On vide le dossier par défaut
RUN rm -rf /usr/share/nginx/html/*

# Maintenant, le dossier s'appelle forcément /app/dist/browser
# (Angular 17+ ajoute toujours /browser à l'output-path)
COPY --from=builder /app/dist/browser /usr/share/nginx/html

# On ajoute ta config Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]