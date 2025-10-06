const express = require("express");
const passport = require("passport");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();


app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false
}));

app.get('/set-language/:lang', (req, res) => {
    const lang = req.params.lang && req.params.lang.toLowerCase();
    if (!['pt', 'en'].includes(lang)) {
        return res.status(400).send('Idioma inválido');
    }
    res.cookie('lang', lang, { maxAge: 31536000000, httpOnly: true, sameSite: 'lax' });
    res.redirect(req.get('Referer') || '/home'); // redireciona para a página anterior ou home
});

app.use(cookieParser());

app.use((req, res, next) => {
    let langCookie = req.cookies.lang;
    if (langCookie !== 'pt' && langCookie !== 'en') {
        langCookie = 'pt'; // default
    }
    res.locals.currentLang = langCookie;
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.redirect('/home');
});

const routes = [
    require("./Routes/MainRouter"),
];

routes.forEach(route => app.use(route));

// Error handling middleware simples para evitar erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).send('Erro Interno do Servidor');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
