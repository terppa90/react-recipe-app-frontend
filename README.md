# Reseptisovellus

Tämä on moderni fullstack-reseptisovellus, jossa käyttäjät voivat:

- Rekisteröityä ja kirjautua sisään
- Luoda, muokata ja poistaa reseptejä
- Hakea reseptejä reaaliaikaisella hakutoiminnolla
- Kommentoida ja arvostella reseptejä
- Käyttää Markdown-muotoilua ainesosien ja valmistusohjeiden syöttämisessä
- nähdä _suositeltuja reseptejä_ jokaisen reseptin sivun alalaidassa
- Käyttää tummaa/vaaleaa-tilaa

Live-demo (Netlify): https://react-recipe-app-2025.netlify.app/

backend (Render): https://react-recipe-app-backend.onrender.com

---

## 🛠️ Teknologiat

### Frontend

- React (Vite)
- React Router DOM
- Tailwind CSS
- shadcn/ui
- Axios
- Framer Motion
- @uiw/react-md-editor (Markdown-editori)
- React Context (autentikointi ja istunnon hallinta)

### Backend

- Node.js
- Express
- MongoDB & Mongoose
- JWT-autentikaatio (httpOnly-cookie)
- bcrypt
- dotenv
- CORS

---

## 📁 Projektin rakenne

```
├── backend/                 # Node + Express backend
│   ├── controllers/         # Logiikka: auth, reseptit, arvostelut
│   ├── middleware/          # JWT-autentikaatio (authMiddleware.js)
│   ├── models/              # Mongoose-mallit (User, Recipe)
│   ├── routes/              # API-reitit (authRoutes.js, recipeRoutes.js)
│   └── index.js            # Sovelluksen pääpiste
│
├── src/                     # React frontend
│   ├── components/          # Yksittäiset UI-komponentit
│   │   └── ui/              # Yleiset UI-elementit (Button, LoaderOverlay, jne.)
│   ├── context/             # AuthContext (kirjautuminen, JWT-hallinta)
│   ├── hooks/               # Custom hookit (esim. useDarkMode)
│   ├── pages/               # Sivut (Home, Login, Register, RecipeDetails, EditRecipe, CreateRecipe)
│   ├── assets/              # Staattiset kuvat ja ikonit
│   ├── App.jsx              # Sovelluksen reititys ja tumma/vaalea-tilan logiikka
│   └── main.jsx             # Reactin entry point
│
├── public/                  # Julkiset resurssit
├── .env                     # Ympäristömuuttujat
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Käynnistys

1. **Kloonaa projekti**

```bash
git clone https://github.com/terppa90/react-recipe-app-frontend
cd react-recipe-app-frontend

git clone https://github.com/terppa90/react-recipe-app-backend
cd react-recipe-app-backend
```

2. **Asenna riippuvuudet**

```bash
cd frontend
npm install
cd backend
npm install
```

3. **Luo .env tiedosto backend-kansioon**

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. **Käynnistä palvelin**

```bash
cd backend
node index.js / npm start
```

5. **Käynnistä frontend**

```bash
cd frontend
npm run dev
```

---

## Autentikaatio

Kirjautuminen käyttää JWT-autentikaatiota.

Token tallennetaan httpOnly-cookieen (ei pääsyä JavaScriptille).

Suojatut reitit (esim. reseptin muokkaus/poisto) on toteutettu authMiddleware.js:llä.

Frontend tarkistaa kirjautumistilan AuthContext-komponentissa.

## 🧑‍💻 Osaamisen näyttö

Tämä projekti on suunniteltu erityisesti portfoliokäyttöön ja rekrytointia varten. Siinä demonstroidaan:

- Fullstack-osaamista (Node + React + MongoDB)
- Autentikointi ja suojatut reitit
- Markdown-editorin integrointi
- Moderni UI Tailwindilla ja animaatioilla
- Responsiivisuus ja saavutettavuus
- Suositellut reseptit ja interaktiiviset komponentit

---
