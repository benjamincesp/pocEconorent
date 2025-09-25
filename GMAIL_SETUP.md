# Gmail Webhook Setup Instructions

## 1. Configurar Google Cloud Project

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las APIs necesarias:
   - Gmail API
   - Cloud Pub/Sub API

## 2. Configurar Credenciales

1. Ve a "Credentials" en la consola
2. Crea credenciales de "Service Account"
3. Descarga el archivo JSON de credenciales
4. Configura la variable de entorno:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"
   ```

## 3. Desplegar en Heroku PRIMERO

```bash
# Crear app en Heroku
heroku create tu-app-name

# Desplegar
git push heroku main

# Tu URL será: https://tu-app-name.herokuapp.com
```

## 4. Crear Topic de Pub/Sub CON TU URL DE HEROKU

```bash
# Crear el topic
gcloud pubsub topics create gmail-notifications

# Crear la suscripción push CON TU URL REAL DE HEROKU
gcloud pubsub subscriptions create gmail-push-subscription \
  --topic=gmail-notifications \
  --push-endpoint=https://TU-APP-NAME.herokuapp.com/api/email/gmail-webhook
```

## 5. Si ya tienes la suscripción, actualízala:

```bash
# Eliminar la suscripción existente
gcloud pubsub subscriptions delete gmail-push-subscription

# Crear nueva con la URL correcta de Heroku
gcloud pubsub subscriptions create gmail-push-subscription \
  --topic=gmail-notifications \
  --push-endpoint=https://TU-APP-NAME.herokuapp.com/api/email/gmail-webhook
```

## 4. Configurar Gmail Watch

Ejecuta este comando para configurar Gmail watch:

```bash
curl -X POST \
  "https://gmail.googleapis.com/gmail/v1/users/me/watch" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topicName": "projects/YOUR_PROJECT_ID/topics/gmail-notifications",
    "labelIds": ["INBOX"]
  }'
```

## 5. Endpoints Disponibles

- `POST /api/email/gmail-webhook` - Webhook para Gmail
- `GET /api/email/logs` - Ver logs de emails
- `GET /api/email/test` - Test del endpoint

## 6. Testing

Para probar que el webhook funciona:
```bash
curl https://your-heroku-app.herokuapp.com/api/email/test
```

## 7. Configurar Heroku

Agregar variables de entorno en Heroku:
```bash
heroku config:set GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account",...}'
```

El servicio automáticamente procesará y logeará todos los emails que lleguen a bnavarretemena@gmail.com.