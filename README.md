🍽️ Reaproveita App

Aplicativo Android desenvolvido em React Native para gerenciamento inteligente de alimentos, com foco em redução de desperdício, organização de estoque doméstico e planejamento de refeições.

O projeto integra leitura de códigos de barras, consumo da API do Open Food Facts e backend completo com Supabase, incluindo autenticação, banco de dados em tempo real, Edge Functions e CRON jobs.

🚀 Funcionalidades

✅ Cadastro e login de usuários

✅ Leitura de código de barras via câmera

✅ Consulta automática à API do Open Food Facts

✅ Cadastro manual de itens

✅ Controle de estoque de alimentos

✅ Planejamento de refeições

✅ Criação de listas de compras

✅ Notificações push (lembretes e alertas de validade)

✅ Edge Functions no Supabase

✅ Tarefas agendadas com CRON jobs

🛠️ Tecnologias Utilizadas
Frontend

React Native

TypeScript

Expo 

Backend

Supabase (Auth, Database, Storage)

Supabase Edge Functions

CRON Jobs (Supabase Scheduler ou serviço externo)

APIs externas

Open Food Facts API

⚙️ Instalação

Clone o repositório:

git clone https://github.com/Marjorie-Pereira/reaproveita-kitchen-smart
cd reaproveita-kitchen-smart

Instale as dependências:

npm install
# ou
yarn install

▶️ Executando o Projeto
Android
npx react-native run-android


ou, caso use Expo:

npx expo start

🌐 Integrações

Supabase para autenticação, banco de dados e funções serverless

API Open Food Facts para busca de informações nutricionais

📦 Funcionalidades do Backend (Supabase)

Edge Functions para processamento em segundo plano

CRON Jobs para tarefas automáticas (ex: verificação de vencimentos e envio de notificações)

📲 Notificações Push

O app envia lembretes automáticos para:

Alimentos próximos do vencimento

Utilizando Expo Notifications

## Logo License
Food by Arif Subekti from <a href="https://thenounproject.com/browse/icons/term/food/" target="_blank" title="Food Icons">Noun Project</a> (CC BY 3.0)
