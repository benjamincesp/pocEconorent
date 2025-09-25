#!/bin/bash

# Script para configurar Gmail webhook con URL de Heroku
# Dominio preconfigurado: econorent-poc-2fa710d743c9.herokuapp.com

HEROKU_APP_NAME="econorent-poc-2fa710d743c9"
WEBHOOK_URL="https://$HEROKU_APP_NAME.herokuapp.com/api/email/gmail-webhook"

echo "🚀 Configurando Gmail webhook para: $WEBHOOK_URL"

# Verificar que gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI no está instalado"
    echo "Instálalo desde: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "📧 Creando topic de Pub/Sub..."
gcloud pubsub topics create gmail-notifications

echo "🔄 Eliminando suscripción existente (si existe)..."
gcloud pubsub subscriptions delete gmail-push-subscription --quiet

echo "✅ Creando nueva suscripción con webhook URL..."
gcloud pubsub subscriptions create gmail-push-subscription \
  --topic=gmail-notifications \
  --push-endpoint="$WEBHOOK_URL"

echo "🎉 ¡Configuración completa!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Configura Gmail Watch con la API"
echo "2. Prueba el endpoint: curl $WEBHOOK_URL/../test"
echo ""
echo "🔗 Webhook URL configurada: $WEBHOOK_URL"