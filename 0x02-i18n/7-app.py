#!/usr/bin/env python3
"""Basic Babel setup
"""
from flask import Flask, g, render_template, request
from flask_babel import Babel
from pytz import exceptions, timezone


class Config():
    """Config class for app."""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user():
    """Returns a user dict or None based on the `login_as` parameter in url"""
    user_id = request.args.get('login_as')
    if user_id:
        return users.get(int(user_id))
    return None


@app.before_request
def before_request():
    """Sets user as a global based on request url."""
    curr_user = get_user()
    g.user = curr_user


@babel.localeselector
def get_locale():
    """Selects best matching language for each request."""
    lang = request.args.get('locale')   # from from URL parameters
    if lang in app.config['LANGUAGES']:
        return lang
    if g.user is not None:              # from user settings
        lang = g.user.get('locale')
    if lang in app.config['LANGUAGES']:
        return lang
    # from request header
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_locale():
    """Selects timezone for each request."""
    time_zone = request.args.get('timezone')    # from from URL parameters
    try:
        timezone(time_zone)
        return time_zone
    except exceptions.UnknownTimeZoneError:
        pass
    if g.user is not None:
        time_zone = g.user.get('timezone')    # from user settings
        try:
            timezone(time_zone)
            return time_zone
        except exceptions.UnknownTimeZoneError:
            pass
    return None     # will use BABEL_DEFAULT_TIMEZONE


@app.route('/')
def index():
    """Home page view"""
    return render_template('7-index.html')


if __name__ == "__main__":
    """ Run web app """
    app.run(host='0.0.0.0', port=5000)
