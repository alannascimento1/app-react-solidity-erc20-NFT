pragma solidity 0.5.0;

import "./ERC721Full.sol";

contract Proverbs is ERC721Full {
 
    struct postagem {
        string author;
        string title;
        string proverb;
    }
    postagem[] public postagens;

    mapping (uint256 => postagem) post;

    constructor() ERC721Full("proverbs", "Proverbs") public {
    }

    function mint(string memory _author, string memory  _title, string memory _proverb) public {

        uint256 tokenId = id(_proverb);
        require(!_exists(tokenId));
        postagens.push(postagem(_author, _title, _proverb));
        post[tokenId] = postagem(_author, _title, _proverb);        
        _mint(msg.sender, tokenId);
    }

    // Retorna o endereço de quem add o proverbio
    function ownerOfPub(string memory proverb) public view returns(address) {
        return ownerOf(id(proverb));
    } 

    // retorna o titulo do token
    function titleOf(string memory proverb) public view returns (string memory) {
        // Gera o id do proverbio
        uint256 tokenId = id(proverb);
        // Verifica se ele existe
        require(_exists(tokenId));
        // Busca no mapeamento
        postagem memory postX = postagens[tokenId];
        // Retorna o titulo
        return postX.title;
    }

    // Gera o id
    function id(string memory proverb) pure internal returns(uint256) {
        uint256 r = two(keccak256(abi.encode(proverb)));
        return r;
    }    

    // Converte to uint256
    function two(bytes32 inBytes) pure public returns (uint256 outUint) {
      return uint256(inBytes);
    }
}
