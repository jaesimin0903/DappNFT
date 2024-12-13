import React, {FC} from "react";
import { AspectRatio,Image, Text } from '@chakra-ui/react'

interface AnimalCardProps {
    animalType: string;
}

const AnimalCard : FC<AnimalCardProps> = ({animalType}) =>{
    return (<>
        <Image w={100} h={100}  src={`images/${animalType}.png`} alt="AnimalCard" />
        
    </>)
    
        
}

export default AnimalCard;