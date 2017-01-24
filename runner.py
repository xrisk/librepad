from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.route("/", methods=['POST', 'PUT'])
def run():
    f = subprocess.run(["python"], input=request.form["code"], stdout=subprocess.PIPE, encoding="utf-8", stderr=subprocess.STDOUT)
    return (f.stdout, {'Access-Control-Allow-Origin': '*'})

if __name__ == "__main__":
    app.run()
