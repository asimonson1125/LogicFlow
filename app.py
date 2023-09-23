import flask
import os

app = flask.Flask(__name__)
app.config.from_pyfile(os.path.join(os.getcwd(), "config.py"))

@app.route('/')
def get_in():
    return flask.render_template('index.html', name="jim")

if __name__ == '__main__':
    app.run()