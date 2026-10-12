import os
import redis
from flask import Flask, render_template

# Create a Flask app and configure Redis connection
# By default flask looks for static: change name to folder name
app = Flask(__name__, static_folder="css-styles")
# Create a Redis client and store in cache variable
cache = redis.Redis(
    # os.getenv() gets an environment variable
    # The variable in () is where the the Redis is stored
  host=os.getenv("REDIS_HOST", "redis"),
  # which port Redis is running on, default is 6379
  # use int() because by default os.getenv() returns a string
  port=int(os.getenv("REDIS_PORT","6379")),
)

@app.route("/")
def loginpage():
    return render_template('logindesktop.html')