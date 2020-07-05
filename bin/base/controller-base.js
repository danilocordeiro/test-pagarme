exports.post = async (repository, validationContract, req, res) => {
  try {
    const data = req.body
    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: 'Some invalid data are send',
          validation: validationContract.errors()
        })
        .end()

      return;
    }

    const result = await repository.create(data, req)
    res.status(201).send(result)
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error', error: e })
  }
}

exports.put = async (repository, validationContract, req, res) => {
  try {
    const data = req.body
    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: 'Some invalid data are send',
          validation: validationContract.errors()
        })
        .end()
      return;
    }

    const result = await repository.update(
      req.params.id,
      data,
      req.userLogged.user
    )
    res.status(201).send(result)
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error', error: e })
  }
}

exports.get = async (repository, req, res) => {
  try {
    const result = await repository.getAll()
    res.status(200).send(result)
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error', error: e })
  }
}

exports.getMyAll = async (repository, req, res) => {
  try {
    const result = await repository.getMyAll(req.userLogged.user)
    res.status(200).send(result)
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error', error: e })
  }
}

exports.delete = async (repository, req, res) => {
  try {
    const { id } = req.params
    if (id) {
      const result = await repository.delete(id, req.userLogged)
      if (result !== 'Invalid operation') {
        res.status(200).send({ message: 'Successfully deleted' })
      } else {
        res.status(401).send({ message: 'Invalid operation - Unauthorized' })
      }
    } else {
      res.status(400).send({ message: 'Missing param id' })
    }
  } catch (e) {
    res.status(500).send({ message: 'Internal Server Error', error: e })
  }
}
