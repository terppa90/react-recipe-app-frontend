# Reseptisovellus

Tämä on moderni fullstack-reseptisovellus, jossa käyttäjät voivat:

- Rekisteröityä ja kirjautua sisään
- Luoda, muokata ja poistaa reseptejä
- Hakea reseptejä reaaliaikaisella hakutoiminnolla
- Kommentoida ja arvostella reseptejä
- Käyttää Markdown-muotoilua ainesosien ja valmistusohjeiden syöttämisessä
- Käyttää tummaa/vaaleaa-tilaa

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
- Lucide React (ikonit)
- React Context (autentikointi ja istunnon hallinta)

### Backend

- Node.js
- Express
- MongoDB & Mongoose
- express-session
- bcrypt
- dotenv
- CORS

---

## 📁 Projektin rakenne

```
.
├── backend/          # Node + Express backend
│   ├── controllers/  # Rekisteröinti, kirjautuminen, reseptit jne.
│   ├── models/       # Mongoose-skeemat (User, Recipe)
│   ├── routes/       # API-reitit (auth, recipes)
│   └── index.js      # Sovelluksen päätiedosto
├── src/              # React frontend
│   ├── components/   # UI-komponentit
│   ├── context/      # AuthContext
│   ├── pages/        # Sivut (Home, Login, Register, RecipeDetails jne.)
│   └── App.jsx       # Reititys ja layout
├── public/
├── .env              # Ympäristömuuttujat
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Käynnistys

1. **Kloonaa projekti**

```bash
git clone https://github.com/kayttajasi/reseptisovellus.git
cd reseptisovellus
```

2. **Asenna riippuvuudet**

```bash
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
node index.js
```

5. **Käynnistä frontend**

```bash
cd ..
npm run dev
```

---

## 🧑‍💻 Osaamisen näyttö

Tämä projekti on suunniteltu erityisesti portfoliokäyttöön ja rekrytointia varten. Siinä demonstroidaan:

- Fullstack-osaamista (Node + React + MongoDB)
- Autentikointi ja suojatut reitit
- Markdown-editorin integrointi
- Moderni UI Tailwindilla ja animaatioilla
- Responsiivisuus ja saavutettavuus

---
