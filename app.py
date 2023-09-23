import flask
import os

app = flask.Flask(__name__)
app.config.from_pyfile(os.path.join(os.getcwd(), "config.py"))

@app.route('/')
def home():
    return flask.render_template('index.html', name="jim", objects=sample)

@app.route('/example')
def example_flowchart():
    return flask.render_template('flowchart.html', objects=sample)

sample = [
  {"id": 1, "parent": None, "text": 'You can always find professional homework help online for Python.'},
  {"id": 2, "parent": 1, "text": 'Experts provide Python homework help at an affordable price.'},
  {"id": 3, "parent": 2, "text": 'Quality solutions without plagiarism are delivered on time.'},
  {"id": 4, "parent": 3, "text": 'Helpers have degrees and extensive experience in online homework assistance.'},
  {"id": 5, "parent": None, "text": 'Python is a Recommended Programming Language for Beginners.'},
  {"id": 6, "parent": 5, "text": 'Python is a simple and popular language in the IT world.'},
  {"id": 7, "parent": 6, "text": 'Python ranks fourth in popularity among programming languages.'},
  {"id": 8, "parent": 7, "text": 'Python\'s conciseness allows for shorter code compared to other languages.'},
  {"id": 9, "parent": 7, "text": 'Python is multi-platform and runs on different operating systems.'},
  {"id": 10, "parent": 7, "text": 'Python\'s standard library includes tools for various tasks.'},
  {"id": 11, "parent": 7, "text": 'Python can be used to create a wide range of programs.'},
  {"id": 12, "parent": 7, "text": 'Python is available for free.'},
  {"id": 13, "parent": None, "text": 'Python is Suitable for Web Development.'},
  {"id": 14, "parent": 13, "text": 'Python is considered the most convenient language for web development.'},
  {"id": 15, "parent": 13, "text": 'Ready-made solutions in Python increase project speed and stability.'},
  {"id": 16, "parent": None, "text": 'Python is Reliable.'},
  {"id": 17, "parent": 16, "text": 'Python is trusted for critical systems, including in banking and finance.'},
  {"id": 18, "parent": 17, "text": 'Python\'s concise code reduces the likelihood of errors and eases debugging.'}
]

sampleString = """
{"objects": [
  {"id": 1, "parent": "None", "text": "You can find a professional homework help service online for Python homework."},
  {"id": 2, "parent": 1, "text": "Specialized websites offer experts who can provide Python homework help online."},
  {"id": 3, "parent": 1, "text": "Website helpers provide services at a low price for students at school, college, or university."},
  {"id": 4, "parent": 2, "text": "Professionals deliver quality solutions without plagiarism and meet established deadlines."},
  {"id": 5, "parent": 4, "text": "Students can choose the deadline that suits them best, ranging from 5 hours to 5 days."},
  {"id": 6, "parent": 2, "text": "Helpers have degrees and graduated from higher education institutions."},
  {"id": 7, "parent": 6, "text": "Samples of helpers' work for other students are available for reference."},
  {"id": 8, "parent": 6, "text": "Helpers have extensive experience in helping students with homework online."},
  {"id": 9, "parent": "None", "text": "Python is a popular programming language for those pursuing careers in IT."},
  {"id": 10, "parent": 9, "text": "Python is one of the simplest programming languages and ranks fourth in popularity."},
  {"id": 11, "parent": 10, "text": "Python's conciseness allows for shorter code compared to other languages."},
  {"id": 12, "parent": 10, "text": "Python is multi-platform and runs on different operating systems without changes."},
  {"id": 13, "parent": 10, "text": "Python's standard library contains tools for various tasks."},
  {"id": 14, "parent": 13, "text": "Python can be used for small scripts or complex systems and is free to use."},
  {"id": 15, "parent": 9, "text": "Python is favored by web developers for its convenience."},
  {"id": 16, "parent": 15, "text": "Applications with ready-made solutions in Python speed up web development."},
  {"id": 17, "parent": 15, "text": "Python is reliable and used by organizations like Bank of America and the SEC."},
  {"id": 18, "parent": 17, "text": "Python's simplicity makes it less prone to problems and easy to debug."},
  {"id": 19, "parent": 17, "text": "Python is used in scaling solutions for online services like YouTube and Dropbox."},
  {"id": 20, "parent": 9, "text": "Python is used in Data Science and analytics, with more job opportunities than the R language."}
]}
"""

if __name__ == '__main__':
    app.run()