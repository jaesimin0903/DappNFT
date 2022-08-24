// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "./SaleAnimalToken.sol";

contract MintAnimalToken is ERC721Enumerable {
    constructor() ERC721("h662Animals", "HAS"){}

    SaleAnimalToken public saleAnimalToken;

    mapping(uint256 => uint256) public animalTypes;
    // animalTokenID 입력하면 animalType 이 나오게 맵핑

    struct AnimalTokenData {
        uint256 animalTokenId;
        uint256 animalType;
        uint256 animalPrice;
    }

    function mintAnimalToken() public {
        uint256 animalTokenId = totalSupply() + 1;
        //nft 에 유일한 값을 부여

        //랜덤한 값을 생성
        //Keccak 알고리즘을 사용하기 위해 byte 값이 필요
        //abi.encodePacked 에 세가지 수를 사용하여 겹치지 않는 수 생성
        //5로 나눈 나머지에 1을 더하여 animal type 이 1~5 사이의 값이 생성되도록 함
        uint256 animalType = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, animalTokenId))) % 5 + 1;

        animalTypes[animalTokenId] = animalType;
        //mapping

        _mint(msg.sender, animalTokenId); // 명령어를 실행하는 사람, 토큰 ID 를 민팅
    }

    function getAnimalTokens(address _animalTokenOwner) view public returns (AnimalTokenData[] memory) {
        uint256 balanceLength = balanceOf(_animalTokenOwner);

        require(balanceLength != 0, "Owner did not have token.");

        AnimalTokenData[] memory animalTokenData = new AnimalTokenData[](balanceLength);
        
        for(uint256 i = 0;i<balanceLength;i++){
            uint256 animalTokenId = tokenOfOwnerByIndex(_animalTokenOwner,i);
            uint256 animalType = animalTypes[animalTokenId];
            uint256 animalPrice = saleAnimalToken.getAnimalTokenPrice(animalTokenId);

            animalTokenData[i] = AnimalTokenData(animalTokenId, animalType, animalPrice);
        }

        return animalTokenData;
    }
    
    function setSaleAnimalToken(address _saleAnimalToken) public {
        saleAnimalToken = SaleAnimalToken(_saleAnimalToken);
    }
}