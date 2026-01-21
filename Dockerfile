# Dockerfile para build e serve do frontend com Nginx
FROM node:20-alpine AS build

WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm ci

# Copia o resto do projeto e faz o build
COPY . .
RUN npm run build

# Runtime com Nginx
FROM nginx:alpine

# Copiar arquivos buildados para o nginx
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
