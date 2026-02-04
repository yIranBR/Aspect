#!/bin/sh
# Gera certificado auto-assinado válido por 10 anos
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/key.pem \
  -out /etc/nginx/ssl/cert.pem \
  -subj "/C=BR/ST=SP/L=SaoPaulo/O=Aspect/CN=api-aspecto.irancardoso.live"
