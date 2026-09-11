# Rapport — la porte (connexion, inscription, mot de passe oublié)

**Dépôt :** `AliRhouma/wael-academy-v2` · branche `main`
**Commits :** `9c132c1` (les trois écrans) puis `b49164d` (mise à l'échelle)
**En ligne :** <https://wael-academy-v2.vercel.app/connexion>
**Date :** 11 septembre 2026

---

## 1. Ce qui a été ajouté

Trois écrans publics, **hors de toute coquille** (pas de rail, pas de barre du
haut), qui mènent à l'espace élève :

| Route | Écran |
|---|---|
| `/connexion` | Se connecter — numéro **ou** e-mail + mot de passe |
| `/inscription` | Créer un compte — nom, numéro, niveau, matière optionnelle, mot de passe |
| `/mot-de-passe-oublie` | Réinitialiser — numéro, puis code SMS + nouveau mot de passe |

Tout est dans **`src/features/auth/`** (6 fichiers, rien ailleurs) :

```
auth.ts                  la logique et les règles  ← LE SEUL fichier à remplacer
AuthFrame.tsx            le décor commun (fond, en-tête, carte) + AuthHead
fields.tsx               champs, libellés, bouton, messages d'erreur
LoginPage.tsx            /connexion
RegisterPage.tsx         /inscription
ForgotPasswordPage.tsx   /mot-de-passe-oublie (les deux étapes)
```

---

## 2. Le flux est celui de la production

Le flux n'a pas été inventé : il a été relevé pas à pas sur
**student.waelacademy.com**, écran par écran, champ par champ, y compris les
textes d'erreur. Ce que la maquette faisait deviner, le site l'a tranché.

### Connexion
- Un seul champ d'identifiant : il accepte **le numéro ou l'e-mail** (en prod
  l'`aria-label` dit « البريد الإلكتروني أو رقم الهاتف »). C'est pourquoi le
  libellé dit « رقم الهاتف ولّا الإيميل » et non « البريد الإلكتروني » comme sur
  la maquette Figma.
- Œil de révélation du mot de passe, **à gauche** (fin de ligne en RTL) —
  comme la maquette, comme la prod.
- Liens : « نسيت كلمة السر؟ » et « ما عندكش كونط؟ أعمل كونط ».

### Inscription
- Champs, dans l'ordre : `الاسم الكامل` · `رقم الهاتف (مثال 20123456)` ·
  `اختار المستوى…` · **`المادة الاختيارية` — affichée uniquement quand le
  niveau choisi en propose une** · `كلمة السر`.
- Les niveaux viennent de `src/data/seed/years.json` (20 entrées, en arabe).
  La prod affiche la même liste en français.
- La matière optionnelle est filtrée sur `subjects.json` →
  `category === "optionnelle"` pour l'année choisie. Changer de niveau remet
  ce champ à zéro (comme la prod).
- Validation reprise telle quelle : « اختار المستوى متاعك. » si le niveau
  manque.
- Succès ⇒ le compte est créé **et la personne est connectée dans la foulée**,
  exactement comme en prod (`register` puis `login`).

### Mot de passe oublié
Deux étapes dans le même écran, comme en prod :

1. **Numéro** → « ابعث الكود ».
   Erreurs reprises mot pour mot : « أكتب نومرو تليفونك. » (moins de 6
   caractères), « الرقم هذا ما عندوش حساب. » (404 côté API).
2. **Code + nouveau mot de passe** → « سجّل كلمة السر الجديدة ».
   - champ code à 6 chiffres, `_ _ _ _ _ _`, chiffres uniquement ;
   - bouton actif seulement si code ≥ 4 **et** mot de passe ≥ 8 (règle de la prod) ;
   - « أرجع ابعث الكود (Ns) » — compte à rebours de **60 s**, la valeur que
     renvoie l'API (`retryAfterS`) ;
   - « ما وصلنيش الكود » ouvre l'encart
     « اطلب من الإدارة كلمة سر جديدة » : nom + prénom → « ابعث الطلب » →
     « وصل طلبك للإدارة — بش يتصلو بيك. »
   - Succès ⇒ connecté directement (la prod fait pareil).

---

## 3. Le design vient du fichier Figma « Log In »

Mesuré sur l'export SVG (1440 × 1425), pas approximé :

| Élément | Dans la maquette | Dans le code |
|---|---|---|
| Fond | blanc + rampe `#0491A5 → #8AFF6B` à 20 %, quadrillage 80px | `bg-v2-mint-grid` (le même fond que l'accueil) |
| Carte | 1200 × 1052, coins 16, blanche, plate | idem, **à la moitié de l'échelle** (voir §4) |
| Champs | 1097 × 84, coins 16, trait `#172E5B` à 50 % | idem, halvés |
| Bouton | 790 × 81, `#8AFF6B`, texte navy, centré (72 % de la largeur) | idem, halvé |
| Titres | « مرحبا بيك… » dans la rampe de marque, « تسجيل دخول » en navy | `text-v2-grad` / `text-v2-ink` |

Les **quatre gribouillis d'angle** (f(x), globe, équerre, livre) et **le trait
de plume du designer** entre le lien « mot de passe oublié » et le bouton ont
été extraits des chemins de l'export et enregistrés dans
`svg icons/doodles/auth-*.svg`. Ils sont peints **à travers un masque CSS**,
pas posés en image : l'encre vient donc du jeton `--v2-ink` et suit le thème.

Aucune couleur en dur : tout passe par `src/styles/v2.css`.

---

## 4. Pourquoi l'échelle est divisée par deux (commit `b49164d`)

Le cadre Figma est **dessiné zoomé** : une carte de 1200 de large, des champs
de 84 de haut, un titre de 68. Reproduit au pixel, l'écran sortait environ
deux fois plus gros que toutes les autres surfaces du produit à 100 % de zoom.

Les **proportions du cadre sont conservées**, l'**échelle est divisée par
deux** : carte 600, champs et bouton 48, titre ~34, et les rythmes verticaux
(50 / 89 / 72 / 46 / 34) réduits d'autant. L'en-tête reprend la colonne et le
lockup du site public, donc la porte et l'accueil portent le même chapeau.
Conséquence : l'inscription est redevenue **une seule colonne**, comme le
cadre — à cette échelle ses cinq champs tiennent dans une hauteur de page
normale.

---

## 5. Ce qui n'est PAS réel — et comment le brancher

`auth.ts` **remplace l'API**, rien d'autre ne la touche. Les trois écrans
n'appellent que ses fonctions.

```ts
signIn(identifier, password)                     → { ok, user } | { ok: false, error }
register({ fullName, phone, levelId, optionalSubjectId?, password })
sendResetCode(phone)                             → { ok, message } | { ok: false, error }
resetPassword(phone, code, password)
```

Aujourd'hui elles s'appuient sur `src/data/seed/users.json`, gardent en
mémoire les comptes créés pendant la session, et **affichent le code au lieu
de l'envoyer** :

- se connecter : **29340118 / wael1234**
- code de réinitialisation : **123456** (toujours le même, affiché à l'écran
  dans un encadré en pointillés)

Un compte créé pendant la session est connecté **sous son propre nom** et
tombe dans un espace vide — c'est volontaire, c'est là qu'on voit tous les
états vides.

**Pour brancher la vraie API :** remplacer le corps de ces quatre fonctions
par les appels réseau (elles peuvent devenir `async`, les écrans les
attendent déjà dans un handler), garder les mêmes formes de retour, et
supprimer `DEMO_ACCOUNT` / `DEMO_CODE` ainsi que les encadrés `<DemoHint>` des
trois pages. Les endpoints de la prod sont
`auth.login`, `auth.register`, `auth.passwordForgot`, `auth.passwordReset`,
`auth.passwordAssist`.

---

## 6. Le reste du branchement

- **`useAuth`** gagne `signInAs(user)` : on assied **la personne reconnue**, et
  non plus l'élève de démo (c'est ce qui fait que l'inscription salue le bon
  prénom). `setRole` n'a pas bougé.
- **« خروج »** (rail et menu profil) revient désormais sur `/connexion` et non
  sur l'accueil — la boucle est fermée.
- **Le site public** : `SIGN_IN` → `/connexion`, `SIGN_UP` → `/inscription`.
  Au passage, les boutons « اختر الآن » des offres étaient construits en
  `` `${SIGN_UP}/offres` `` et seraient devenus `/inscription/offres` ; ils
  utilisent maintenant une constante `OFFERS` distincte.
- **Le son** : chaque geste a son cue (`connect` à la connexion, `error` au
  refus, `send` pour l'envoi du code, `success` au changement de mot de passe,
  `toggle-on/off` pour l'œil…). `AuthFrame` monte `mountSound()` lui-même,
  parce que ces écrans sont hors de `V2Layout` et que la liaison
  `data-uisfx` vit sur le document. Tout est consigné dans
  [`docs/sound-effects.md`](sound-effects.md) §3 et §5.

---

## 7. Vérifié

- `npx tsc -b` · `npm run build` · `npm run check:sounds` — les trois passent.
- Parcours joués dans un vrai navigateur : mauvais mot de passe → message
  rouge ; bon mot de passe → `/student-v2` ; inscription complète → compte créé,
  connecté, prénom correct ; réinitialisation numéro → code → connecté.
- 1440 px et 390 px : pas de débordement horizontal, cibles tactiles à 48 px.
- Les trois routes répondent 200 en production (les réécritures SPA de
  `vercel.json` étaient déjà en place).

---

## 8. Ce qui reste ouvert

- Pas de « se souvenir de moi », pas de session persistante : l'état se
  réinitialise au rafraîchissement, comme partout dans le prototype.
- Pas de vérification de numéro à l'inscription (la prod n'en demande pas non
  plus à cette étape).
- La demande « ما وصلنيش الكود » n'est envoyée nulle part — elle affiche sa
  confirmation et s'arrête là.
- Les règles de mot de passe se limitent à 8 caractères minimum, comme la prod.
