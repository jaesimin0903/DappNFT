// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MintAnimalToken.sol";

contract SaleAnimalToken {
    MintAnimalToken public mintAnimalTokenAddress;
    //디플로이 주소값을 담는다.

    constructor (address _mintAnimalTokenAddress) {
        mintAnimalTokenAddress = MintAnimalToken(_mintAnimalTokenAddress);
    }

    mapping(uint256 => uint256) public animalTokenPrices;
    //가격관리 맵핑

    uint256[] public onSaleAnimalTokenArray;
    //FE 에서 사용할 배열. 판매중이 토큰 확인용

    function setForSaleAnimalToken(uint256 _animalTokenId, uint256 _price) public {
        //판매 등록 함수

        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);

        require(animalTokenOwner == msg.sender, "Caller is not animal token owner");
        //함수 실행 사람이 토큰의 주인이 맞는지
        require(_price > 0 , "Price is zero or lower");

        require(animalTokenPrices[_animalTokenId] == 0, "This animal token is already on sale.");

        require(mintAnimalTokenAddress.isApprovedForAll(animalTokenOwner, address(this)), "Animal token owner did not approve token.");
        //스마트컨트랙트 판매권한 여부를 확인
        
        animalTokenPrices[_animalTokenId] = _price;

        onSaleAnimalTokenArray.push(_animalTokenId);
    }
    
    function purchaseAnimalToken(uint256 _animalTokenId) public payable {
        //payble 을 붙여야 matic 이 왔다갔다하는 함수를 실행할 수 있다.

        uint256 price = animalTokenPrices[_animalTokenId];
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);

        require(price > 0, "Animal Token not sale.");
        require(price <= msg.value, "Caller sent lower than price.");
        //함수를 실행할때 보내는 MATIC 의 양이 같거나 큰지 확인
        require(animalTokenOwner != msg.sender, "Caller is animal Token owner");

        payable(animalTokenOwner).transfer(msg.value);
        //가격만큼의 양이 돈의 주인으로 보내진다.

        mintAnimalTokenAddress.safeTransferFrom(animalTokenOwner, msg.sender, _animalTokenId);

        animalTokenPrices[_animalTokenId] = 0;

        for(uint256 i = 0; i<onSaleAnimalTokenArray.length;i++){
            if(animalTokenPrices[onSaleAnimalTokenArray[i]] == 0){
                onSaleAnimalTokenArray[i] = onSaleAnimalTokenArray[onSaleAnimalTokenArray.length -1];
                onSaleAnimalTokenArray.pop();
                //맨뒤랑 바꿔서 맨뒤 삭제
            }
        }
        
        
    }
    //읽기 전용 FE 함수
    //판매중인 리스트 확인용
    function getOnSaleAnimalTokenArrayLength() view public returns (uint256){
            return onSaleAnimalTokenArray.length;
    }

    function getAnimalTokenPrice(uint256 _animalTokenId) view public returns (uint256) {
        return animalTokenPrices[_animalTokenId];
    }
}