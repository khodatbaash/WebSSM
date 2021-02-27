#import a Flask module
from flask import Flask, render_template

#creating a Flask web server app from the Flask module
#__name__ means this current file
app = Flask(__name__)

#represent the default page "/"
@app.route("/")
#when the user goes to the default page of my website, then the function bellow gets activated
def home():
    #render template method from flask framework looks for a template (HTML file) then renders that
    return render_template("home.html")


#open terminal and run #py main.py
#important part is that it says running on 127.0.0.1 which means on this computer
#in your browser go to the address: 127.0.0.1:5000

#now let's add more routes
@app.route("/about")
def about():
    return render_template("about.html")

#when you run your python script, python assigns the name "__main__" to the script when exeuted
if __name__ == "__main__":
    #allows possible python errors to appear on the web page
    app.run(debug=True)
