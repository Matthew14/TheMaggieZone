

import { Weight } from '@prisma/client';
import { FC } from 'react'

interface WeightOverviewProps {
    weight: Weight;
}

const PostOverview: FC<WeightOverviewProps> = ({ weight }) => {
    console.log('herere')
  return <h2>{weight.amountInKg}</h2>
}

export default PostOverview