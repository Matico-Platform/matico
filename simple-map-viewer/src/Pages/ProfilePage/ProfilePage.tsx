import React from 'react'
import {useProfile} from "../../Hooks/useProfile"
import {Redirect} from 'react-router'

interface ProfilePageProps{

}

export const ProfilePage: React.FC<ProfilePageProps> = ({})=>{
    const {profile,loading} = useProfile();

    if(!profile && !loading){
        return <Redirect to="/login"/>
    }

    return (
        <h1>Hi {profile?.username}</h1>
    )
}