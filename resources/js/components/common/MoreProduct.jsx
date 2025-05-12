
import React from 'react'
import ProductCard from '../home/ShopItem'
import { useI18n } from '../../providers/i18n'

export default function MoreProduct({data,getData}) {
    const i18n=useI18n();
  return (
    
    <div>
      <h1 className='xl:text-[32px] md:text-[28px] sm:text-2xl text-xl font-bold'>{i18n.t('Related Products')}</h1>
        <div className='products'>
            {data.map((item, idx)=>(
                <ProductCard item={item} key={idx} getData={getData}/>
            ))}
        </div>
    </div>
  )
}
