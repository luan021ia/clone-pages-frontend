# Dockerfile para servir frontend estático com Nginx
FROM nginx:alpine

# Copiar arquivos buildados para o nginx
COPY dist/ /usr/share/nginx/html/

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
