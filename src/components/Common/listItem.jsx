import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from './listItem.module.css';

export default function ListItem({ item, topic }) {
    const [isCondition, setIsCondition] = useState(false);
    const [imageContainerCss, setImageConatinerCss] = useState('');
    const [itemContainerCss, setItemConatinerCss] = useState('');
    const [titleConatinerCss, setTitleConatiaerCss] = useState('');
    const [descContainerCss, setDescContainerCss] = useState('');
    const [descCss, setDescCss] = useState('');
    const [titleCss, setTitleCss] = useState('');
    const [textContainerCss, setTextContainerCss] = useState('');
    const [conditionContainerCss, setConditionContainerCss] = useState('')
    const [conditionsCss, setConditionsCss]= useState('')
    const [imageCss, setImageCss] = useState('');
    useEffect(() => {
        if (topic !== 'job') {
            setItemConatinerCss(style.community_listItem_container);
            setImageConatinerCss(style.other_image_container);
            setTitleConatiaerCss(style.titleContainer);
            setDescContainerCss(style.descContaier);
            setDescCss(style.desc);
            setTitleCss(style.title);
            setTextContainerCss(style.textConatiner);
            // setConditionContainerCss()
        } else if (topic == 'job') {
            console.log('Hello job');
            setImageConatinerCss(style.job_image_container);
            setItemConatinerCss(style.jobListItemConatiner);
            setTitleConatiaerCss(style.jobTitleConatiner);
            setDescContainerCss(style.jobDescContaier);

            setDescCss(style.jobDesc);
            setTitleCss(style.jobTitle);
            setTextContainerCss(style.jobTextConatiner);

            setConditionContainerCss(style.jobConditionContainer);
            setConditionsCss(style.jobConditions)
            setImageCss(style.jobImage);
        }
    }, [topic]);

    useEffect(() => {
        if (topic == 'job') {
            setIsCondition(true);
        } else if (topic == 'house') {
            setIsCondition(true);
        } else {
            setIsCondition(false);
        }
    }, [topic]);

    return (
        <div className={itemContainerCss}>
            <div className={imageCss}>
                <img className={imageContainerCss} src={item.images[0]} />
            </div>
            <div className={textContainerCss}>
                <div className={titleConatinerCss}>
                    <Link className={titleCss} to={`/${topic}/${item.id}`}>
                        {item.title}
                    </Link>
                </div>
                {isCondition && (
                    <div className={conditionContainerCss}>
                        {item.conditions.map((condition) => (
                            <p key={condition.id} className={conditionsCss}>{condition.value}</p>
                        ))}
                    </div>
                )}

                <div className={descContainerCss}>
                    <p className={descCss}>{item.description}</p>
                </div>
                {topic !== 'job' && (
                    <div className="w-full border-2 border-dotted mb-3"></div>
                )}

                <div className="font-light text-xs p-1">
                    <span>{item.location.si} 시 </span>
                    <span>{item.location.gu} 구 </span>
                    <span>{item.location.dong} 동 </span>
                </div>
            </div>
        </div>
    );
}
