import defaultUserImg from '../../assets/user.png'

export default function PartnerUserChat({content, avatar, displayName}){
    return(
        <div>
            <div>
                <img src = {avatar || defaultUserImg
                }/>
                <span>{displayName}</span>
            </div>

            <div>
                {content}
            </div>

        </div>
    ) ;
}