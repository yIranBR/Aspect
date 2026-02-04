#!/bin/bash
# Script para rebuild rápido APENAS DENTRO DO DOCKER (mantém dados do banco)
# Use quando mudar código e precisar aplicar mudanças

set -e

echo "🗑️  Limpando cache do webpack/react DENTRO do container..."
docker compose exec frontend rm -rf /app/node_modules/.cache /app/build /app/.eslintcache 2>/dev/null || true

echo "🔄 Parando containers..."
docker compose down

echo "🔨 Reconstruindo frontend sem cache..."
docker compose build --no-cache frontend

echo "🚀 Iniciando containers..."
docker compose up -d

echo "⏳ Aguardando compilação (15s)..."
sleep 15

echo "📊 Status dos containers:"
docker compose ps

echo ""
echo "✅ Rebuild rápido concluído!"
echo "🌐 Acesse: http://localhost:9102"
echo ""
echo "💡 Para ver logs do frontend: docker compose logs frontend --tail=30 -f"
