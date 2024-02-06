#!/usr/bin/env python3
"""Basic Babel setup
"""
from flask import Flask
from flask_babel import Babel

app = Flask(__name__)

babel = Babel(app)


class Config():
    """Config class for app."""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)


if __name__ == "__main__":
    """ Run web app """
    app.run(host='0.0.0.0', port=5000)
