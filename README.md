# TruePass — MVP V1

> **One Link. Trusted Identity.**
> Plateforme Next.js + Supabase qui génère un **TrustLink** public par utilisateur.

## Parcours

Accueil → Inscription → Connexion → Dashboard → Profil / Compétences / Expériences / Diplômes / Projets → TrustLink partageable

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** (Postgres + Auth + Storage)
- **Tailwind CSS** (palette navy + gold)
- **Vercel** pour le déploiement

## Lancer en local

```bash
cp .env.example .env.local
# édite .env.local avec tes clés Supabase

npm install
npm run dev
```

Crées d'abord les tables (voir plus bas) puis ouvre http://localhost:3000

## 1) Base de données Supabase

1. Crée un projet sur https://supabase.com (région proche de tes utilisateurs)
2. Va dans **SQL Editor** → colle le contenu de `supabase/schema.sql` → **Run**
3. Le script crée :
   - les 5 tables (`profiles`, `skills`, `experiences`, `education`, `projects`)
   - un **trigger** qui génère automatiquement le `profiles` à chaque inscription
   - les **policies RLS** : lecture publique, écriture restreinte au propriétaire
   - les buckets Storage `avatars` et `project-images`

## 2) Auth Supabase

3. **Authentication → Providers** → Email activé (par défaut)
4. **Authentication → URL Configuration** :
   - `Site URL` = `http://localhost:3000` en dev, `https://truepass.app` en prod
   - ajoute `http://localhost:3000/auth/callback` dans *Redirect URLs*

## 3) Variables d'environnement

Tu trouves URL + anon key dans **Project Settings → API** :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=truepass.app
```

## 4) Déployer sur Vercel

```bash
# ou via l'interface Vercel : importe le repo GitHub
npm i -g vercel
vercel
```

Ajoute les 3 variables d'environnement ci-dessus dans les *Project Settings → Environment Variables* de Vercel.

## Notes de conception

- **Naming** : j'ai choisi **TruePass** pour la marque et **TrustLink** pour le lien public.
  Tu trouveras aussi `TrustOne` / `TrueLink` dans le cahier des charges : un simple
  `grep -r "Truepass" .` puis `sed` permet de tout renommer en une commande.
- **Username unique** : validé côté client (`lib/username.ts`) et garanti par l'index
  UNIQUE en base + le trigger de génération initiale.
- **CV en PDF** : MVP sans backend ; bouton "Télécharger le CV" déclenche `window.print()`.
  Utilise une feuille `@media print` (déjà configurée dans `app/globals.css`).
- **Contacter** : bouton `mailto:` (pas de service externe au MVP).

## Structure

```
app/
  page.tsx                  Accueil
  login/  signup/           Auth
  reset-password/
  auth/callback/  auth/logout/   Routes serveur Supabase
  dashboard/                Espace connecté
    profile/  skills/  experiences/  education/  projects/
  [username]/               Page publique (TrustLink)
lib/
  supabase/  client.ts  server.ts
  username.ts  types.ts
supabase/schema.sql         Schéma + RLS + Storage
```
