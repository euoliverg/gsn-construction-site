# Painel Administrativo — GSN Construction

Painel de chat para os funcionários responderem os visitantes do site
(gsnconstructionllc.com) em tempo real, com tradução automática
(cliente em inglês ↔ você em português).

Este é um projeto separado do site principal, pensado para ser hospedado
sozinho (ex: `admin.gsnconstructionllc.com` ou uma URL própria tipo
`gsn-admin.vercel.app`).

## Pré-requisito: o mesmo Firebase do site principal

Este painel **precisa apontar para o mesmo projeto Firebase** usado pelo
site principal (mesmas conversas, mesmos usuários/funcionários). Ele não
funciona sozinho sem isso.

1. Copie `.env.example` para `.env.local`.
2. Preencha com os mesmos valores de Firebase usados no site principal
   (Project settings > General > Your apps, no console do Firebase).
3. Rode localmente:

```bash
npm install
npm run dev
```

4. Acesse a URL mostrada pelo Vite, faça login com o email/senha do
   funcionário (criado em Authentication > Users no console do Firebase).

## Publicar em produção

```bash
npm run build
```

Isso gera a pasta `dist/` — suba ela em qualquer hospedagem de site
estático (Vercel, Netlify, Cloudflare Pages, etc.). Lembre-se de
configurar as mesmas variáveis de ambiente (`VITE_FIREBASE_...`) nas
configurações do provedor de hospedagem, não só no `.env.local`.

### Deploy rápido na Vercel

```bash
npm install -g vercel
vercel
```

Na Vercel, adicione as variáveis de ambiente em **Project Settings →
Environment Variables** antes do deploy de produção.

## Segurança

- O painel só é acessível para usuários criados manualmente em
  **Authentication > Users** no Firebase — não existe cadastro público.
- As regras do Firestore (`firestore.rules`, já publicadas junto com o
  site principal) garantem que só esses usuários autenticados (não
  anônimos) conseguem ver todas as conversas.
- Recomenda-se restringir o acesso à URL deste painel (não divulgá-la
  publicamente) mesmo com o login habilitado.
