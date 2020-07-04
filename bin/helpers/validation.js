class ValidationContract {
  constructor () {
    this._errors = []
  }

  isNotArrayOrEmpty (value, message) {
    if (!value && value.length === 0) {
      this._errors.push({ message: message })
    }
  }

  isTrue (value, message) {
    if (value) {
      this._errors.push({ message: message })
    }
  }

  isRequired (value, message) {
    if (!value || value.length <= 0) {
      this._errors.push({ message: message })
    }
  }

  isEmail (value, message) {
    const reg = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    if (!reg.test(value)) {
      this._errors.push({ message: message })
    }
  }

  errors () {
    return this._errors
  }

  isValid () {
    return this._errors.length === 0
  }
}

module.exports = ValidationContract
