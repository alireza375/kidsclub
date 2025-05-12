import React from 'react'
import { StylesBorder } from '../../styles/styles'

export default function ExploreItem({ data }) {
    return (
        <div style={StylesBorder("60E188", 6, 4)}>
            <div className='rounded-md bg-white '>
                <img src={data?.image} alt={data?.id | ''} className='w-[100%] h-[250px] rounded-md object-cover' />
            </div>
        </div>
    )
}
