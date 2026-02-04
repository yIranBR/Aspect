#!/bin/bash
# Script para rebuild completo limpando todos os caches DENTRO DO DOCKER
# Use quando houver problemas de cache no frontend ou backend

set -e

echo "🗑️  Limpando cache do webpack/react DENTRO do container..."
docker compose exec frontend rm -rf /app/node_modules/.cache /app/build /app/.eslintcache 2>/dev/null || true

echo "🗑️  Limpando cache do TypeScript DENTRO do backend..."
docker compose exec api find /app/src -name "*.js" -o -name "*.js.map" | xargs rm -f 2>/dev/null || true

echo "🧹 Parando containers e removendo volumes..."
docker compose down -v

echo "🔨 Reconstruindo imagens sem cache..."
docker compose build --no-cache

echo "🚀 Iniciando containers..."
docker compose up -d

echo "⏳ Aguardando serviços iniciarem (20s)..."
sleep 20

echo "📊 Status dos containers:"
docker compose ps

echo ""
echo "✅ Rebuild completo concluído!"
echo ""
echo "📝 Agora você precisa recriar os usuários:"
echo ""
echo "# Admin:"
echo "curl -X POST http://localhost:9101/api/auth/register \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\":\"admin@aspect.com\",\"password\":\"admin123\",\"name\":\"Admin User\",\"role\":\"admin\"}'"
echo ""
echo "# Paciente:"
echo "curl -X POST http://localhost:9101/api/auth/register \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\":\"user@aspect.com\",\"password\":\"user123\",\"name\":\"Usuário Comum\",\"role\":\"patient\"}'"
echo ""
echo "🌐 Acesse: http://localhost:9102"
