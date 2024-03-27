import style from './ConfirmPage.module.css';
import { Link, useLocation } from 'react-router-dom';
import { ConfirmButton } from './common/Buttons';
import { buttonData } from './constans/constans';

export const ConfirmPage = () => {
    const location = useLocation();
    return (
        <>
            <div className={style.confirmBox}>
                {location.state.info}
            </div>
            <div>
                <Link to={`${location.state.link}`}>
                    <ConfirmButton value={buttonData.backButton} />
                </Link>
            </div>
        </>
    )
}
