const Repository = require('../repositories/transaction-repository')
const RepositoryCard = require('../repositories/card-repository')
const RepositoryUser = require('../repositories/user-repository')
const Validation = require('../bin/helpers/validation')
const ctrlBase = require('../bin/base/controller-base')
const variables = require('../bin/configuration/variables')
const pagarme = require('pagarme')
const Crypto = require('react-native-crypto-js')
const moment = require('moment')

const _repo = new Repository()
const _repoCard = new RepositoryCard()
const _repoUser = new RepositoryUser()

function transactionController () {}

transactionController.prototype.post = async (req, res) => {
  const objtoencrypt = JSON.stringify({
    card_number: '4111111111111111',
    card_expiration_date: '0922',
    card_holder_name: 'Danilo',
    card_cvv: '322'
  })
  const cardHash = Crypto.AES.encrypt(
    objtoencrypt,
    'hdfudhuidfhudhudah9d8s8f9d8a98as9d8s9d89as'
  ).toString()
  console.log(cardHash)

  try {
    const _validationContract = new Validation()
    _validationContract.isRequired(req.body.cpf, 'Your cpf')
    const data = req.body
    const encryptionKey = variables.Pagarme.pagarmeKey
    const client = await pagarme.client.connect({ api_key: encryptionKey })
    if (data.card_id) {
      const card = await _repoCard.getById(data.card_id)
      const pagarmeTransaction = await client.transactions.create({
        amount: 6000,
        payment_method: 'credit_card',
        card_id: card.card_id,
        customer: {
          name: card.name,
          external_id: '#3333',
          email: card.email,
          type: 'individual',
          country: 'br',
          phone_numbers: [`+${card.phone}`],
          documents: [{ type: 'cpf', number: card.cpf }]
        },
        billing: {
          name: card.name,
          address: {
            country: 'br',
            state: card.state,
            city: card.city,
            neighborhood: card.neighborhood,
            street: card.street,
            street_number: card.street_number,
            zipcode: card.zipcode
          }
        },
        items: [
          {
            id: '1',
            title: 'Teste 1',
            unit_price: data.value ? data.value : 30,
            quantity: 1,
            tangible: true
          }
        ],
        metadata: { idProduto: '1' }
      })
      const transaction = {
        status: pagarmeTransaction.status,
        authorization_code: pagarmeTransaction.authorization_code,
        risk_level: pagarmeTransaction.risk_level,
        card: card._id,
        userId: req.userLogged.user._id,
        acquirer_id: pagarmeTransaction.acquirer_id
      }
      const transactionCreated = await _repo.create(transaction)
      const datav = new Date(moment().add(30, 'days')._d.toISOString())
      await _repoUser.updatePayment(datav, req.userLogged.user._id)
      res.status(200).send(transactionCreated)
    } else {
      const bytes = Crypto.AES.decrypt(
        data.card_hash,
        'hdfudhuidfhudhudah9d8s8f9d8a98as9d8s9d89as'
      )
      const decryptedData = JSON.parse(bytes.toString(Crypto.enc.Utf8))
      const cardToHash = {
        card_number: decryptedData.card_number,
        card_holder_name: decryptedData.card_holder_name,
        card_cvv: decryptedData.card_cvv,
        card_expiration_date: decryptedData.card_expiration_date
      }
      const cardHash = await client.security.encrypt(cardToHash)
      const pagarmeTransaction = await client.transactions.create({
        amount: 6000,
        payment_method: 'credit_card',
        card_hash: cardHash,
        customer: {
          name: data.name,
          external_id: '#3311',
          email: data.email,
          type: 'individual',
          country: 'br',
          phone_numbers: [`+${data.phone}`],
          documents: [
            {
              type: 'cpf',
              number: data.cpf
            }
          ]
        },
        billing: {
          name: data.name,
          address: {
            country: 'br',
            state: data.state,
            city: data.city,
            neighborhood: data.neighborhood,
            street: data.street,
            street_number: data.street_number,
            zipcode: data.zipcode
          }
        },
        items: [
          {
            id: '1',
            title: 'Parcela mensal do aplicativo do dev doido',
            unit_price: data.value ? data.value : 30,
            quantity: 1,
            tangible: true
          }
        ],
        metadata: { idProduto: '1' }
      })
      const cardAux = pagarmeTransaction.card
      const card = {
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street,
        street_number: data.street_number,
        name: cardAux.holder_name,
        cpf: data.cpf,
        phone: data.phone,
        email: data.email,
        zipcode: data.zipcode,
        card_id: cardAux.id,
        userId: req.userLogged.user._id,
        brand: cardAux.brand,
        holder_name: cardAux.holder_name,
        cardNumber: `${cardAux.first_digits}******${cardAux.last_digits}`
      }
      await _repoCard.create(card)
      const transaction = {
        status: pagarmeTransaction.status,
        authorization_code: pagarmeTransaction.authorization_code,
        risk_level: pagarmeTransaction.risk_level,
        card: card._id,
        userId: req.userLogged.user._id,
        acquirer_id: pagarmeTransaction.acquirer_id
      }
      const transactionCreated = await _repo.create(transaction)
      const datav = new Date(moment().add(30, 'days')._d.toISOString())
      await _repoUser.updatePayment(datav, req.userLogged.user._id)
      res.status(200).send(transactionCreated)
    }
  } catch (e) {
    let error = ''
    if (e.response && e.response.errors) {
      error = e.response.errors
    } else {
      error = e.toString()
    }
    res.status(500).send({ message: 'Internal server error', error }) // ,erro:e.response.errors[0] });
  }
}

transactionController.prototype.get = async (req, res) => {
  ctrlBase.getMyAll(_repo, req, res)
}
transactionController.prototype.delete = async (req, res) => {
  ctrlBase.delete(_repo, req, res)
}

module.exports = transactionController
