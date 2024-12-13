import React , {FC, useState, useEffect} from "react";
import {Grid} from "@chakra-ui/react"
import { IMyanimalCard } from "../components/MyAnimalCard";
import { mintAnimalTokenContract, saleAnimalTokenContract } from "../contracts";
import SaleAnimalCard from "../components/SaleAnimalCard";


interface SaleAnimalProps {
    account:string;
}

const SaleAnimal:FC<SaleAnimalProps> = ({account}) =>{
    const [saleAnimalCard, setSaleAnimalCard] = useState<IMyanimalCard[]>()

    const getOnSaleAnimalTokens = async () =>{
        try{
            const getOnSaleAnimalTokenArrayLength = await saleAnimalTokenContract.methods.getOnSaleAnimalTokenArrayLength().call();

            const tempOnSaleArray : IMyanimalCard[] = [];

            for(let i = 0;i<parseInt(getOnSaleAnimalTokenArrayLength, 10); i++){
                const animalTokenId = await saleAnimalTokenContract.methods.onSaleAnimalTokenArray(i).call();

                const animalType = await mintAnimalTokenContract.methods.animalTypes(animalTokenId).call();

                const animalPrice = await saleAnimalTokenContract.methods.animalTokenPrices(animalTokenId).call();

                tempOnSaleArray.push({animalTokenId, animalType, animalPrice})
            }

            setSaleAnimalCard(tempOnSaleArray);
        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
      getOnSaleAnimalTokens();
    }, [])
    
  
    

    return(
        <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={8}>
                {saleAnimalCard && saleAnimalCard.map((v,i) => {
                    return <SaleAnimalCard key={i} animalType={v.animalType} animalPrice={v.animalPrice} animalTokenId={v.animalTokenId} account={account} getOnSaleAnimalTokens={getOnSaleAnimalTokens}/>
                })}
        </Grid>
    );
}

export default SaleAnimal