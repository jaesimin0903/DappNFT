import React , {FC, useState} from 'react';
import {Button, Box, Text, Flex} from '@chakra-ui/react';
import { mintAnimalTokenContract } from '../contracts';
import AnimalCard from '../components/AnimalCard';

interface MainProps {
    account :string;
}

const Main : FC<MainProps> = ({account}) => {
    const [NewAnimalType, setNewAnimalType] = useState<string>("")

    const onClickMint = async () =>{
        try{
            if(!account) return;

            const response = await mintAnimalTokenContract.methods
                                    .mintAnimalToken()
                                    .send({from: account});

            console.log(response);
            if(response.status){
                const balanceLength = await mintAnimalTokenContract.methods
                                    .balanceOf(account)
                                    .call();

                const animalTokenId = await mintAnimalTokenContract.methods
                .tokenOfOwnerByIndex(account, parseInt(balanceLength.length, 10) -1)
                .call();

                const animalType = await mintAnimalTokenContract.methods
                .animalTypes(animalTokenId)
                .call();

                setNewAnimalType(animalType);
                console.log(NewAnimalType);
            }
        }catch(err){
            console.log(err);
        }
    }

    return <Flex w="full" h= "100vh" justifyContent="center" alignItems="center" direction="column">
        <Box>
            {NewAnimalType ? <AnimalCard animalType={NewAnimalType} /> : <Text>Let's mint Animal Card!</Text>}
        </Box>
        <Box>
            <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}>Mint</Button>
        </Box>
    </Flex>
}
export default Main;