import os
import redis
from flask import Flask

# Create a Flask app and configure Redis connection
app = Flask(__name__)
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
def hello():
    # Increment the "hits" key in Redis and return the count
    count = cache.incr("hits")
    return f"Hello from Compose Watch! I have been seen {count} time(s).\n"