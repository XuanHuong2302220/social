import React from 'react'
import { TabProps } from '@/types'

const Tabs = () => {
  return (
    <div role="tablist" className="tabs tabs-lifted">
        <input 
            onClick={()=> console.log('tab1')} 
            type="radio" 
            name="my_tabs_2" 
            role="tab" 
            className="tab" 
            aria-label="Tab 1" 
            defaultChecked
        />
        <div 
            role="tabpanel" 
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
            Tab content 1
        </div>

    </div>
  )
}

export default Tabs