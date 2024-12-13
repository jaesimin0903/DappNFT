import React , {FC, useState, useEffect} from "react";
import AnimalCard from "../components/AnimalCard";
import { mintAnimalTokenContract, saleAnimalTokenAddress, saleAnimalTokenContract } from "../contracts";
import {Grid, Box , Button, Text, Flex} from '@chakra-ui/react'
import MyAnimalCard, { IMyanimalCard } from "../components/MyAnimalCard";
interface MyAnimalProps {
    account : string;
}

const MyAnimal : FC<MyAnimalProps> = ({account}) =>{
    const [AnimalCardArray, setAnimalCardArray] = useState<IMyanimalCard[]>();
    const [SaleStatus, setSaleStatus] = useState<boolean>(false);

    const getAnimalTokens = async() => {
        try{
            
            const balanceLength = await mintAnimalTokenContract.methods
            .balanceOf(account)
            .call();

            if(balanceLength =="0") return ;

            const tempAnimalCardArray: IMyanimalCard[] = [];

            const response = await mintAnimalTokenContract.methods.getAnimalTokens(account).call();
            console.log(response)

            response.map((v: IMyanimalCard) => {
                tempAnimalCardArray.push({animalTokenId : v.animalTokenId, animalType : v.animalType, animalPrice : v.animalPrice})
            })
            
            setAnimalCardArray(tempAnimalCardArray);
        }catch(err){
            console.log(err);
        }
    };

    const getIsApprovedForAll = async () =>{
        try{
            const response = await mintAnimalTokenContract.methods
            .isApprovedForAll(account, saleAnimalTokenAddress)
            .call();
            if(response){
                setSaleStatus(response);
            }
            console.log(response);
        }catch(err){
            console.log(err)
        }
    }

    const onClickApproveToggle = async () =>{
        try{
            if(!account) return;

            const response = await mintAnimalTokenContract.methods
            .setApprovalForAll(saleAnimalTokenAddress, !SaleStatus)
            .send({from:account});

            if(response.status){
                setSaleStatus(!SaleStatus);
            }
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        if(!account) return;
        getAnimalTokens();
        getIsApprovedForAll();
    }, [account])
    
    useEffect(() => {
        console.log(AnimalCardArray)
    }, [AnimalCardArray])

    return(
        <>
        <Flex alignItems="center">
            <Text display="inline-block">
                Sale Status : {SaleStatus ? "True" : "False"}
            </Text>
            <Button size="xs" ml={2} colorScheme={SaleStatus ? "red" : "blue"} onClick={onClickApproveToggle}>
                {SaleStatus ? "Cancel" : "Approve"}
            </Button>
        </Flex>
        <Grid templateColumns ="repeat(4,1fr)" gap={8} mt={2}>
            {
                AnimalCardArray && AnimalCardArray.map((v,i) =>{
                    return <MyAnimalCard key={i} animalTokenId={v.animalTokenId} animalType={v.animalType} animalPrice={v.animalPrice} saleStatus={SaleStatus} account={account}/>;
                }
            )}
        </Grid>
        </>
    );
}

export default MyAnimal