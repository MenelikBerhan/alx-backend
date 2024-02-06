#!/usr/bin/env python3
"""Basic Babel setup
"""
from flask import Flask, render_template, request
from flask_babel import Babel


class Config():
    """Config class for app."""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """Selects best matching language for each request"""
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """Home page view"""
    return render_template('3-index.html')


if __name__ == "__main__":
    """ Run web app """
    app.run(host='0.0.0.0', port=5000)
