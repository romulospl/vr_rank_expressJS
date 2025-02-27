
FROM nginx:latest

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/cert.pem /etc/nginx/cert.pem
COPY ./nginx/key.pem /etc/nginx/key.pem

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
