class Responser {
  constructor(code, message, data = null, error = null) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  respond(res) {
    res.status(this.code).json({ message: this.message, data: this.data, error: this.error });
  }
}

module.exports = Responser;
