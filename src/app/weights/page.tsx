
import WeightListing from "@/components/WeightListing";
import { PrismaClient, Weight } from "@prisma/client";
import React from "react";


const Page: React.FC = async () => {
    
    const prisma = new PrismaClient()
    const weights = await prisma.weight.findMany()

    return (
    <>
    
    <h1>Hello there</h1>
    <p>{weights[0].amountInKg}</p>
    </>
  );
};

export default Page;
