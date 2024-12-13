import React, {FC, useState, useEffect} from "react";
import AnimalCard from "./AnimalCard";
import {Box, Text, Button} from "@chakra-ui/react"
import { mintAnimalTokenContract, saleAnimalTokenContract, web3 } from "../contracts";

interface SaleAnimalCardProps{
    animalType:string;
    animalPrice:string;
    animalTokenId: string;
    account:string;
    getOnSaleAnimalTokens: () => Promise<void>;
}

const SaleAnimalCard:FC<SaleAnimalCardProps> =({animalType,animalPrice,animalTokenId, account,getOnSaleAnimalTokens}) =>{
    const [isBuyable, setIsBuyable] = useState<boolean>(false);

    const getAnimalTokenOwner = async () => {
        try{
            const response = await mintAnimalTokenContract.methods.ownerOf(animalTokenId).call();
            
            console.log(response)
            console.log(account);
            setIsBuyable(response.toLocaleLowerCase() === account.toLocaleLowerCase())
        } catch(err){
            console.log(err);
        }   
    } 

    const onClickBuy = async () =>{
        try{
            if(!account) return;
            const response = await saleAnimalTokenContract.methods.purchaseAnimalToken(animalTokenId).send({from: account, value:animalPrice});

            if(response.status){
                getOnSaleAnimalTokens();
            }
        } catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
      
        getAnimalTokenOwner();
    }, [])
    

    return(
        <Box textAlign ="center" w={100}>
            <AnimalCard animalType={animalType} />
            <Box>
                <Text d="inline-block">
                    {web3.utils.fromWei(animalPrice)} Matic
                </Text>
                <Button size="sm" colorScheme="green" m={2} disabled={isBuyable} onClick={onClickBuy}>Buy</Button>
            </Box>
        </Box>
    )
}

export default SaleAnimalCard