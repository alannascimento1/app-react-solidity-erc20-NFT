pragma solidity  >=0.4.22 <0.9.0;

contract Bc1Token {
   // Informações sobre o token 
    string public name =  "Bc1 Token";
    string public symbol =  "BC1T"; 
    string public standard =  "BC1T Token v1.0";   
    // identifica o número total de tokens criados  
    uint256 public totalSupply;

   // Evento de transferencia confirma quando uma transferencia será realizada;
   // É salvo em um log que a tx foi realizada
    event Transfer(
        address indexed _from,
        address indexed  _to, 
        uint256 _value);

    // Evento que Aprova o usuário a Gastar tokens na função Approve
    // É salvo em um log que a tx foi realizada
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    
    // Mapeamento que relaciona conta e saldo 
    mapping(address => uint) public balanceOf;
    // Faz o mapeamento de permissões de terceiros que possuem a permissão de negociar os tokens de uma conta
    mapping(address => mapping(address => uint)) public allowance;

    constructor(uint256 _initialSupply) public {
        // Inicializa o saldo de quem chamou o contrato e a quantidade de tokens pertencente ao contrato
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    //função de transferencia;
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Limita a realização da transferência, apenas se que chamou a função possuir saldo suficiente
        require(balanceOf[msg.sender] >= _value);
        // Realiza a transação
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        // Emite o evento de transferencia
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    // Permite que terceiros utilizem os tokens do usuario que chamou a função
    function approve(address _spender, uint256 _value) public returns (bool success){
        // Delimita a quantidade que pode ser gasto
        allowance[msg.sender][_spender] = _value;
        // Emite o evento de approve
        emit Approval(msg.sender,_spender, _value);        
        return true;
    }

    // Transferencia
    function transferFrom(address _from, address _to, uint _value) public returns (bool success){
        // Valida se o 'DE' tem saldo suficiente
        require(_value <= balanceOf[_from]);
        // Verfica se o 'DE' possui permissão para gastar a quantia desejada
        require(_value <= allowance[_from][msg.sender]);

        // Realiza a transferencia entre as contas
        balanceOf[_from]-=  _value;
        balanceOf[_to]+= _value;

        // Diminui o saldo que a conta 'DE' ainda pode gastar
        allowance[_from][msg.sender] -= _value;
        
        // Emite o evento de transferencia
        emit Transfer(_from, _to, _value);        
        return true;
    }
}
