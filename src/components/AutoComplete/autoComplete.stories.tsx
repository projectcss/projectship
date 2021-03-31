import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import AutoComplete ,{DataSourceType} from './autoComplete'
interface LakerPlayerProps {
    value: string;
    number: number;
}

interface GithubUserProps {
    value: string;
    login: string;
    url: string;
    avatar_url: string;
}
const SimpleComplete = () => {
    const lakers = ['bradley', 'pope', 'caruso', 'cook', 'cousins',
    'james', 'AD', 'green', 'howard', 'kuzma', 'McGee', 'rando']

    const lakersWithNumber = [
        {value: 'bradley', number: 11},
        {value: 'pope', number: 1},
        {value: 'caruso', number: 4},
        {value: 'cook', number: 2},
        {value: 'cousins', number: 15},
        {value: 'james', number: 23},
        {value: 'AD', number: 3},
        {value: 'green', number: 14},
        {value: 'howard', number: 39},
        {value: 'kuzma', number: 0},
    ]
    // const fetchSuggestions = (value: string) => {
    //     return lakers.filter((item) => {
    //         return item.includes(value);
    //     })
    // }

    const fetchSuggestions = (query: string) => {
        return fetch(`https://api.github.com/search/users?q=${query}`)
                .then(res => res.json())
                .then(({items})=>{
                    return items?items.map((item:any)=>({ value: item.login, ...item})):[]
                })
    }

    const renderOption = (item: DataSourceType) => {
        const newItem = item as DataSourceType<GithubUserProps>
        return (
            <>
                <p>{newItem.value}</p>
            </>
        )
    }
    return (
        <AutoComplete
            fetchSuggestions={fetchSuggestions}
            onSelect={action('selected')}
            renderOption={renderOption}
        />
    )
}

storiesOf("AutoComplete Component", module)
.add("defaultComplete", SimpleComplete)