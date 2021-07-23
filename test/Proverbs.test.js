const Proverbs = artifacts.require('./Proverbs.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Proverbs', (accounts) => {
  let contract

  before(async () => {
    contract = await Proverbs.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('minting', async () => {

    it('creates a new token', async () => {
      const result = await contract.mint('davi', 'salmo23', 'OSenhoreomeupastor')
      // // SUCCESS
      // assert.equal(totalSupply, 1)
      // const event = result.logs[0].args
      // assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      // assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      // assert.equal(event.to, accounts[0], 'to is correct')

      // FAILURE: cannot mint same color twice
      // await contract.mint('#EC058E').should.be.rejected;
    })
  })

  describe('indexing', async () => {
    it('lists proverbs', async () => {
      // Mint 3 more tokens
      await contract.mint('a', 'b', 'c')
      await contract.mint('d', 'e', 'f')
      await contract.mint('g', 'h', 'i')
      const totalSupply = await contract.totalSupply()

      let prov
      let result = []

      for (var i = 1; i <= totalSupply; i++) {
        prov = await contract.postagens(i - 1)
        result.push(prov)
      }
      console.log(result)
      // let expected = ['#EC058E', '#5386E4', '#FFFFFF', '#000000']
      // assert.equal(result.join(','), expected.join(','))
    })
  })

})
