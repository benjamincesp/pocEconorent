# 🚀 Instrucciones de Despliegue en Heroku

## Paso a Paso para Configurar Gmail Webhook

### 1. Desplegar en Heroku
```bash
# Crear app en Heroku (cambia "tu-app-name" por el nombre que quieras)
heroku create tu-app-name

# Configurar variables de entorno
heroku config:set HEROKU_APP_URL=https://tu-app-name.herokuapp.com

# Desplegar
git add .
git commit -m "Deploy Gmail webhook microservice"
git push heroku main
```

### 2. Verificar que funciona
```bash
# Probar el endpoint base
curl https://tu-app-name.herokuapp.com/

# Probar el endpoint de test
curl https://tu-app-name.herokuapp.com/api/email/test
```

### 3. Configurar Google Cloud Pub/Sub
```bash
# Ejecutar el script con el nombre de tu app
./setup-gmail-webhook.sh tu-app-name
```

**O manualmente:**
```bash
# Crear topic
gcloud pubsub topics create gmail-notifications

# Crear suscripción con tu URL de Heroku
gcloud pubsub subscriptions create gmail-push-subscription \
  --topic=gmail-notifications \
  --push-endpoint=https://TU-APP-NAME.herokuapp.com/api/email/gmail-webhook
```

### 4. Configurar Credenciales de Google
```bash
# Subir credenciales como variable de entorno (contenido del JSON completo)
heroku config:set GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account","project_id":"..."}'
```

### 5. Activar Gmail Watch
```bash
# Obtener access token y ejecutar
curl -X POST \
  "https://gmail.googleapis.com/gmail/v1/users/me/watch" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topicName": "projects/TU_PROJECT_ID/topics/gmail-notifications",
    "labelIds": ["INBOX"]
  }'
```

### 6. ¡Listo!
Ahora cuando llegue un email a `bnavarretemena@gmail.com`:
1. Gmail enviará notificación a Pub/Sub
2. Pub/Sub hace POST a tu webhook en Heroku
3. Tu servicio procesa y logea el email en Firestore

### URLs importantes después del deploy:
- **Webhook**: `https://tu-app-name.herokuapp.com/api/email/gmail-webhook`
- **Ver logs**: `https://tu-app-name.herokuapp.com/api/email/logs`
- **Test**: `https://tu-app-name.herokuapp.com/api/email/test`