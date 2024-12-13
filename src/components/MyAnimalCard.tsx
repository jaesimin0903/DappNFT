import React , {FC, useState, ChangeEvent} from "react";
import {Box, Text, InputGroup, Input, InputRightAddon, Button} from "@chakra-ui/react"
import AnimalCard from "./AnimalCard";
import { saleAnimalTokenContract, web3 } from "../contracts";

export interface IMyanimalCard{
    animalTokenId : string;
    animalType : string;
    animalPrice : string;
}

interface MyAnimalCardProps extends IMyanimalCard {
    saleStatus:boolean;
    account:string;
}

const MyAnimalCard: FC<MyAnimalCardProps> = ({animalTokenId, animalType, animalPrice, saleStatus, account}) =>{
    const [sellPrice, setSellPrice] = useState<string>("");
    const [myAnimalPrice, setMyAnimalPrice] = useState<string>(animalPrice)

    const onChangeSellPrice = (e: ChangeEvent<HTMLInputElement>) =>{
        setSellPrice(e.target.value);
    }

    const onClickSell = async () =>{
        try{
            if(!account || !saleStatus) return;

            const response = await saleAnimalTokenContract.methods
            .setForSaleAnimalToken(animalTokenId, web3.utils.toWei(sellPrice, "ether"))
            .send({from:account});

            if(response.status) {
                setMyAnimalPrice(web3.utils.toWei(sellPrice, "ether"));
                console.log(response)
            }
        }catch(err){
            console.log(err);
        }
    }

    return(
        <Box textAlign="center" w={150}>
            <AnimalCard animalType={animalType} /><Box  mt={2}>
                {animalPrice === "0" ? (
                <>
                    <InputGroup>
                        <Input type='number' value={sellPrice} onChange={onChangeSellPrice}/>
                        <InputRightAddon children="Matic" />
                    </InputGroup>
                    <Button size="sm" colorScheme="green" mt={2} onClick={onClickSell}>
                        Sell
                    </Button>
                </>) : <Text d="inline-block">{web3.utils.fromWei(myAnimalPrice)} Matic</Text> }
            </Box>
        </Box>
    )
}

export default MyAnimalCard;