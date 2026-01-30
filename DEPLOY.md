# Deploy: Git + GitHub + Vercel + Supabase

Guia para colocar o projeto **Rotina do Sono** online e permitir edições pelo GitHub, Vercel e Supabase.

---

## Sincronizar com o GitHub (rotinadosonoapp/rotinadosono)

Repositório: **https://github.com/rotinadosonoapp/rotinadosono.git**

1. **Instale o Git** (se ainda não tiver): https://git-scm.com/download/win — depois feche e abra o terminal.
2. Na pasta do projeto, execute:
   ```powershell
   .\scripts\sync-github.ps1
   ```
   Ou manualmente:
   ```powershell
   git init
   git remote add origin https://github.com/rotinadosonoapp/rotinadosono.git
   git add .
   git commit -m "Sync: Rotina do Sono"
   git branch -M main
   git push -u origin main
   ```
   Se pedir login, use um [Personal Access Token](https://github.com/settings/tokens) ou `gh auth login` (GitHub CLI).

---

## Deploy automático (só Vercel, sem Git)

Para colocar o site no ar **sem usar Git/GitHub**:

1. **Uma vez:** faça login na Vercel (abre o navegador):
   ```powershell
   npm run deploy:login
   ```
2. **Sempre que quiser publicar:**
   ```powershell
   npm run deploy
   ```
   Ou use o script: `.\scripts\deploy.ps1`

O projeto já está configurado com **Supabase** (`src/lib/supabase.ts`). Quando criar um projeto em [supabase.com](https://supabase.com), preencha o `.env` com a URL e a chave (veja `.env.example`).

---

## 1. Instalar o Git (se ainda não tiver)

1. Baixe: **https://git-scm.com/download/win**
2. Instale (pode deixar as opções padrão).
3. **Feche e abra de novo** o terminal do Cursor.
4. Confirme: `git --version`

---

## 2. Criar repositório no GitHub

1. Acesse **https://github.com** e faça login.
2. Clique em **+** → **New repository**.
3. Nome sugerido: `rotina-do-sono`.
4. Deixe **público**, **não** marque “Add a README”.
5. Clique em **Create repository**.
6. Anote a URL do repositório (ex.: `https://github.com/SEU_USUARIO/rotina-do-sono.git`).

---

## 3. Sincronizar o projeto com Git e GitHub

No terminal, na pasta do projeto (`C:\Users\cgb\Desktop\ROTINA DO SONO`):

```powershell
# Inicializar Git (se ainda não tiver)
git init

# Adicionar remote do GitHub (troque pela SUA URL)
git remote add origin https://github.com/SEU_USUARIO/rotina-do-sono.git

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "Primeiro commit: site Rotina do Sono"

# Enviar para o GitHub (branch main)
git branch -M main
git push -u origin main
```

Se o GitHub pedir login, use **GitHub CLI** ou **token de acesso** em vez da senha.

---

## 4. Colocar o site online na Vercel

1. Acesse **https://vercel.com** e faça login (pode usar “Continue with GitHub”).
2. Clique em **Add New…** → **Project**.
3. Importe o repositório **rotina-do-sono** (conecte o GitHub se pedir).
4. A Vercel detecta **Vite** automaticamente. Clique em **Deploy**.
5. Em alguns minutos o site fica no ar em um link tipo:  
   `https://rotina-do-sono-xxx.vercel.app`

**Alterações online:**  
Sempre que você der `git push` no repositório, a Vercel faz um novo deploy automático.

---

## 5. Configurar Supabase (banco de dados / backend)

1. Acesse **https://supabase.com** e crie uma conta.
2. **New project** → escolha organização, nome do projeto e senha do banco.
3. Após criar, vá em **Project Settings** (ícone de engrenagem) → **API**.
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** (key) → `VITE_SUPABASE_ANON_KEY`

**No seu PC (desenvolvimento):**

1. Na pasta do projeto, copie o exemplo de variáveis:
   - Copie `.env.example` para `.env`
2. Abra `.env` e preencha:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

**Na Vercel (site no ar):**

1. No dashboard da Vercel, abra o projeto **rotina-do-sono**.
2. **Settings** → **Environment Variables**.
3. Adicione:
   - `VITE_SUPABASE_URL` = URL do projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` = chave anon public
4. Salve e faça um **Redeploy** do projeto para aplicar.

---

## 6. Fluxo de trabalho: editar e atualizar online

1. **Editar no PC:** altere os arquivos, depois:
   ```powershell
   git add .
   git commit -m "Descrição da alteração"
   git push
   ```
2. A **Vercel** faz o deploy sozinha e o site atualiza em 1–2 minutos.
3. **Editar no GitHub:** no repositório, abra um arquivo → **Edit** (lápis) → edite → **Commit changes**. A Vercel também faz deploy dessas mudanças.

---

## Resumo rápido

| Onde           | Para quê                          |
|----------------|-----------------------------------|
| **Git**        | Controle de versão no seu PC      |
| **GitHub**     | Código na nuvem e deploy automático |
| **Vercel**     | Site no ar (frontend)             |
| **Supabase**   | Banco de dados / API (quando usar)|

Arquivos importantes já configurados no projeto:

- `vercel.json` – deploy e rotas do SPA na Vercel  
- `.env.example` – modelo das variáveis do Supabase  
- `.gitignore` – evita enviar `.env` e `node_modules` para o GitHub  

Se quiser, na próxima etapa podemos adicionar no código o uso do Supabase (por exemplo: formulários salvando no banco).
