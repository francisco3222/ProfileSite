const express = require("express");
const passport = require("passport");
const helmet = require("helmet");
const compression = require("compression");
const session = require("express-session");
const path = require("path");

const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));

// Session middleware (required for passport.session)
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(helmet());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.redirect('/home');
});
// Routes
const routes = [
    require("./Routes/MainRouter"),
];

routes.forEach(route => app.use(route));

app.use((req, res, next) => {
    res.redirect('/home');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    const viewEngine = req.app.get('view engine');
    if (viewEngine) {
        try {
            return res.status(500).render('error', { error: err });
        } catch (renderErr) {
            console.error('View render failed:', renderErr);
            // fall through to other responses
        }
    }
    if (req.accepts('html')) {
        return res.status(500).send(`<h1>Server Error</h1><pre>${(err.stack || err.toString()).replace(/</g,'&lt;')}</pre>`);
    }
    if (req.accepts('json')) {
        return res.status(500).json({ error: err.message || 'Server Error' });
    }
    return res.status(500).type('txt').send(err.message || 'Server Error');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
