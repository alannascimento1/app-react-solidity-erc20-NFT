import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Color from '../abis/Color.json'
import Proverbs from '../abis/Proverbs.json'
import BC1Token from '../abis/Bc1Token.json'
import BC1TokenSale from '../abis/Bc1TokenSale.json'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  
  handleDropdownChange(e) {
    this.setState({ selectValue: e.target.value });
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    
    const networkData = Proverbs.networks[networkId]
    if(networkData) {
      const abi = Proverbs.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      let proverbs = []
      // Load Proverbs
      for (var i = 1; i <= totalSupply; i++) {
        const prov = await contract.methods.postagens(i - 1).call()
        console.log(prov)
        this.setState({
          proverbs: [...this.state.proverbs, prov]
        })
      }
      // proverbs = []
    } else {    
      window.alert('Smart contract not deployed to detected network.')
    }
    
    const networkDataBc1 = BC1Token.networks[networkId]
    const networkDataBc1Sale = BC1TokenSale.networks[networkId]  
    if(networkDataBc1 && networkDataBc1Sale) {
      const abiBc1Sale = BC1TokenSale.abi
      const addressBc1Sale = networkDataBc1Sale.address
      const contractBc1Sale = new web3.eth.Contract(abiBc1Sale, addressBc1Sale)
      this.setState({ contractBc1Sale })

      const tokenP = await contractBc1Sale.methods.tokenPrice().call()
      let tokenPrice
      this.setState({ 
        tokenPrice: tokenP.toNumber()
      })
      const tokenPriceInEth = web3.utils.fromWei(parseInt(this.state.tokenPrice).toString(),'ether')
      this.setState({ 
        tokenPriceInEth: tokenPriceInEth
      })
      const abiBc1 = BC1Token.abi
      const addressBc1 = networkDataBc1.address
      const contractBc1 = new web3.eth.Contract(abiBc1, addressBc1)
      this.setState({ contractBc1 })

      const tokenS = await contractBc1Sale.methods.tokenSold().call()
      
      this.setState({ 
        tokenSold: tokenS 
      })

      const balanceV = await contractBc1.methods.balanceOf(this.state.account).call()      
      this.setState({ 
        balance: balanceV
      })
    } else {    
      window.alert('Smart contract not deployed to detected network.')
    }
        
  }

  mint = (author, title, proverb) => {
    this.state.contract.methods.mint(author, title, proverb).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        proverbs: [...this.state.proverbs, proverb]
      })
    })
  }

  buyTokens = () => {
    this.state.contractBc1Sale.methods.buyTokens(parseInt(this.state.numberOfTokens.value)).send({ from: this.state.account, value: parseInt(this.state.numberOfTokens.value) * parseInt(this.state.tokenPrice), gas: 100000 })
  }   

  mudar = () => {
    if(this.state.selecionado.state.selected.value == 'ERC-20'){
      const val = 0     
      this.setState({ 
        padrao: val
      })
    } else {
      const val = 1     
      this.setState({ 
        padrao: val
      })
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      padrao: 0,
      account: '',
      contract: null,
      contractBc1: null,
      contractBc1Sale: null,
      totalSupply: 0,
      messagem: '',
      totalSupplySale: 750000,
      tokenPrice: 0,
      tokenPriceInEth: 0,
      tokenSold: 0,
      proverbio: '',
      balance: 0,
      selecionado: 0,
      totalTokens: 0,
      numberOfTokens: 0,
      proverbs: []
    }
  }

  render() {
    return (
      
      <div>
        
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
            >
              {(this.state.padrao == 0)?(<h3>Proverbs Token</h3>):(<h3>BC1 Token</h3>)}
            </a>

            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="text-white"><b>Endereço da Conta:</b> <span id="account">{this.state.account}</span></small>
              </li>
            </ul>          
            <Dropdown options={['ERC-20', 'ERC-721']} ref={(input_drop) => { this.state.selecionado = input_drop }} onChange={this.mudar} placeholder="Selecione uma opção" />;              
           
          </nav>
          {this.state.padrao == 0? (
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                <br></br>
                  <h1>Proverbs Token</h1>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const author = this.author.value
                    const title = this.title.value
                    const proverbi = this.proverb.value
                    this.mint(author, title, proverbi)
                  }}>
                    <input
                      type='text'
                      className='form-control mb-1'
                      placeholder='Autor'
                      ref={(input_author) => { this.author = input_author }}
                    />
                    <input
                      type='text'
                      className='form-control mb-1'
                      placeholder='Titulo'
                      ref={(input_titulo) => { this.title = input_titulo }}
                    />              
                  <input
                      type='text'
                      className='form-control mb-1'
                      placeholder='Escreva aqui seu proverbio'
                      ref={(input_proverbio) => { this.proverb = input_proverbio}}
                    />
                    <input style={{backgroundColor: '#343a40', color: 'white'}}
                      type='submit'
                      className='btn btn-block btn-primary'
                      value='MINT'
                    />
                  </form>
                </div>
              </main>
            </div>
            
            <hr/>
            <div className="row text-center">
              { this.state.proverbs.map((proverb, key) => {
                return(
                  <div key={key} className="col-md-6 mb-3">
                    <div style={{backgroundColor: '#343a40', color: 'white'}} >{proverb.author}</div>
                    <div style={{backgroundColor: '#c3bca8'}}><b>Título: </b>{proverb.title}</div>
                    <div style={{backgroundColor: '#c3bca8'}}><b>Provérbio: </b>{proverb.proverb}</div>
                  </div>
                )
              })}
            </div>
          </div>):(
          <div>
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                <br></br>
                  <h1>BC1 Token</h1>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const quantidade = this.quantidade
                    this.buyTokens(quantidade)
                  }}>
                    <input
                      type='text'
                      className='form-control mb-1'
                      placeholder='Quantos BC1T você deseja?'
                      ref={(input_quantidade) => { this.state.numberOfTokens = input_quantidade }}
                    />
                    <br></br>
                    <input style={{backgroundColor: '#343a40', color: 'white'}}
                      type='submit'
                      className='btn btn-block btn-primary'
                      value='COMPRAR BC1T'
                    />
                  </form>
                  <br></br>
                  <div>
                    <p><b> O preço de um BC1T é : </b>{this.state.tokenPriceInEth.toString()} ETH</p>
                    
                    <p><b>Atualmente você possui: </b>{this.state.balance.toString()} BC1T</p>
                    
                    <p> <b>Você comprou</b> {this.state.tokenSold.toString()} BC1T de {this.state.totalSupplySale.toString()}</p>
                    
                  </div>
                </div>
              </main>
            </div>
          </div>            
          </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
