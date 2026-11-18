# Déployer le portfolio sur Vercel avec Groq

## 1. Obtenir une clé API Groq

1. Allez sur [console.groq.com](https://console.groq.com/)
2. Créez un compte et vérifiez les conditions d’utilisation et limites de l’offre actuelle
3. Cliquez sur "API Keys" dans le menu
4. Cliquez "Create API Key"
5. Donnez-lui un nom (ex: "Portfolio Chatbot")
6. Copiez la clé (elle commence par `gsk_...`)

La disponibilité, les quotas et les conditions tarifaires de l’API peuvent évoluer.

## 2. Envoyer les modifications sur GitHub

Depuis le dossier du projet :

```powershell
git add .
git commit -m "Switch to Groq API (free) for chatbot"
git push origin main
```

Le dépôt GitHub : `chatbouriissam/portfolio-chatbot`

## 3. Déployer sur Vercel

1. Connectez-vous sur [vercel.com](https://vercel.com/) avec GitHub
2. Cliquez **Add New → Project**
3. Importez `chatbouriissam/portfolio-chatbot`
4. Gardez les paramètres Next.js détectés automatiquement
5. **AVANT de déployer**, ajoutez la variable d'environnement :
   - Cliquez "Environment Variables"
   - Name: `GROQ_API_KEY`
   - Value: [collez votre clé Groq]
   - Cochez: **Production**, **Preview**, **Development**
6. Cliquez **Deploy**

## 4. Vérification

- Ouvrez votre URL Vercel (ex: `portfolio-chatbot.vercel.app`)
- Testez les questions suggérées et des questions RH en français et en anglais.
- Sans `GROQ_API_KEY`, le chatbot répond aux questions courantes à partir des informations du portfolio. La clé active les réponses IA conversationnelles et les questions ouvertes.

## Dépannage

**Le chatbot répond de façon courte aux questions courantes, mais ne suit pas bien les questions ouvertes**
- Vérifiez que `GROQ_API_KEY` est bien ajoutée dans Vercel → Settings → Environment Variables
- Redéployez : Deployments → trois points → Redeploy

**Le chatbot ne répond pas**
- Consultez les logs : Vercel → Deployments → Functions → Logs
- Vérifiez que votre clé Groq est valide sur console.groq.com
- Les questions connues utilisent une réponse de secours locale si l'API est indisponible ; vérifiez que le dernier déploiement contient le correctif.

**"Limite de messages atteinte"**
- C'est normal, c'est une protection par IP (20 messages toutes les 10 minutes)
- Les RH peuvent utiliser le site normalement

## Avantages de Groq

✅ **Offre gratuite disponible** (selon les limites Groq en vigueur)
✅ **Très rapide** (réponses quasi instantanées)
✅ **Qualité professionnelle** avec GPT-OSS 120B
✅ **Réponses en streaming** pour une expérience de chat fluide

## Notes de sécurité

- Ne mettez JAMAIS votre clé API dans le code ou sur GitHub
- Ajoutez-la uniquement dans les variables d'environnement de Vercel
- Le fichier `.env.local` est ignoré par Git (dans `.gitignore`)
